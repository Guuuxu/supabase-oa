// @ts-nocheck
/**
 * 爱签 notifyUrl 异步通知入口（须公网 HTTPS，配置见 .env.example 的 ASIGN_NOTIFY_URL）。
 * 收到通知后：从回调体中解析 contractNo + PDF（base64 或可下载 URL）→ 上传至 signed-documents →
 * 回填 signing_records.signed_file_url 与同批次 third_party_contract_no 下的 signed_documents。
 *
 * 成功须返回纯文本 success（部分平台约定）；爱签可能重试失败回调。
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import {
  applyExternalSignedFileUrlToSigningRecords,
  uploadPdfBytesAndAttachToSigningRecords,
} from "../_shared/signed-file-persist.ts";

const LOG = "[ASIGN_NOTIFY]";

function textResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
}

async function parseNotifyPayload(req: Request): Promise<unknown> {
  const raw = await req.text();
  const ct = (req.headers.get("content-type") || "").toLowerCase();
  if (!raw.trim()) return {};

  if (ct.includes("application/json")) {
    try {
      return JSON.parse(raw);
    } catch {
      return { raw };
    }
  }

  if (ct.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(raw);
    const biz = params.get("bizData") || params.get("bizdata") || params.get("data");
    if (biz) {
      try {
        return JSON.parse(biz);
      } catch {
        return { bizDataRaw: biz };
      }
    }
    return Object.fromEntries(params.entries());
  }

  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}

function extractContractNo(payload: unknown): string | null {
  const candidates: string[] = [];
  const visit = (o: unknown) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) {
      for (const x of o) visit(x);
      return;
    }
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      const kl = k.toLowerCase();
      if (
        (kl === "contractno" || kl === "contract_no" || kl === "contractnumber") &&
        typeof v === "string" &&
        v.trim()
      ) {
        candidates.push(v.trim());
      } else if (v && typeof v === "object") {
        visit(v);
      }
    }
  };
  visit(payload);
  if (candidates.length === 0) return null;
  return candidates[0];
}

function extractStatusSignal(payload: unknown): { contractStatus: string; callbackType: string; rawStatus: string } {
  let contractStatus = "";
  let callbackType = "";
  let rawStatus = "";
  const visit = (o: unknown) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) {
      for (const x of o) visit(x);
      return;
    }
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      const kl = k.toLowerCase();
      if (typeof v === "string" || typeof v === "number") {
        const sv = String(v).trim();
        if (!contractStatus && (kl === "contractstatus" || kl === "contract_status")) {
          contractStatus = sv;
        } else if (!callbackType && (kl === "callbacktype" || kl === "callback_type")) {
          callbackType = sv;
        } else if (!rawStatus && kl === "status") {
          rawStatus = sv;
        }
      } else if (v && typeof v === "object") {
        visit(v);
      }
    }
  };
  visit(payload);
  return { contractStatus, callbackType, rawStatus };
}

function mapToSigningStatus(payload: unknown): "completed" | "employee_signed" | "rejected" | null {
  const { contractStatus, callbackType, rawStatus } = extractStatusSignal(payload);
  const cs = contractStatus.toUpperCase();
  const cb = callbackType.toUpperCase();
  const rs = rawStatus.trim();

  if (rs === "2") return "completed";
  if (rs === "4" || rs === "-3") return "rejected";

  if (cs.includes("COMPLETE") || cb.includes("COMPLETE")) return "completed";
  if (cs.includes("REJECT") || cs.includes("REFUSE") || cb.includes("REJECT") || cb.includes("REFUSE")) {
    return "rejected";
  }
  if (cs.includes("SIGNING") || cb.includes("SUBMIT_SIGN")) return "employee_signed";

  return null;
}

async function updateSigningStatusByContractNo(
  admin: ReturnType<typeof createClient>,
  contractNo: string,
  nextStatus: "completed" | "employee_signed" | "rejected",
) {
  const { data: rows, error: queryErr } = await admin
    .from("signing_records")
    .select("id,status")
    .eq("third_party_contract_no", contractNo);
  if (queryErr) {
    console.error(LOG, "查询签署记录失败:", queryErr.message);
    return;
  }
  const list = (rows ?? []) as Array<{ id: string; status?: string }>;
  if (list.length === 0) {
    console.warn(LOG, "未找到 contractNo 对应记录:", contractNo);
    return;
  }

  const now = new Date().toISOString();
  const ids: string[] = [];
  for (const row of list) {
    const current = String(row.status ?? "").trim();
    // 不覆盖已撤回
    if (current === "withdrawn") continue;
    ids.push(row.id);
  }
  if (ids.length === 0) return;

  const patch: Record<string, unknown> = { status: nextStatus };
  if (nextStatus === "employee_signed") {
    patch.employee_signed_at = now;
  } else if (nextStatus === "completed") {
    patch.company_signed_at = now;
  }

  const { error: updErr } = await admin
    .from("signing_records")
    .update(patch)
    .in("id", ids);
  if (updErr) {
    console.error(LOG, "回写签署状态失败:", updErr.message);
    return;
  }
  console.log(LOG, "回写签署状态成功:", nextStatus, "记录数:", ids.length);
}

function collectUrlStrings(obj: unknown, out: Set<string>) {
  const visit = (o: unknown) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) {
      for (const x of o) visit(x);
      return;
    }
    for (const v of Object.values(o as Record<string, unknown>)) {
      if (typeof v === "string" && /^https?:\/\//i.test(v.trim())) {
        out.add(v.trim());
      } else if (v && typeof v === "object") {
        visit(v);
      }
    }
  };
  visit(obj);
}

function tryDecodeBase64Pdf(s: string): Uint8Array | null {
  const t = s.trim();
  if (t.length < 80) return null;
  const base = t.replace(/^data:application\/pdf;base64,/i, "").replace(/\s/g, "");
  try {
    const bin = atob(base);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const isPdf =
      bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
    if (isPdf) return bytes;
    if (bytes.length > 800) return bytes;
  } catch {
    /* ignore */
  }
  return null;
}

function extractBase64PdfFromPayload(payload: unknown): Uint8Array | null {
  const visit = (o: unknown): Uint8Array | null => {
    if (!o) return null;
    if (typeof o === "string") {
      return tryDecodeBase64Pdf(o);
    }
    if (typeof o !== "object") return null;
    if (Array.isArray(o)) {
      for (const x of o) {
        const h = visit(x);
        if (h) return h;
      }
      return null;
    }
    for (const v of Object.values(o as Record<string, unknown>)) {
      const h = visit(v as unknown);
      if (h) return h;
    }
    return null;
  };
  return visit(payload);
}

async function fetchPdfFromUrl(url: string): Promise<Uint8Array | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!res.ok) {
      console.warn(LOG, "下载 URL 非成功状态", url, res.status);
      return null;
    }
    const ab = await res.arrayBuffer();
    const bytes = new Uint8Array(ab);
    if (bytes.length > 25 * 1024 * 1024) {
      console.warn(LOG, "文件过大，跳过", url);
      return null;
    }
    const isPdf =
      bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
    if (isPdf) return bytes;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("pdf")) return bytes;
    return null;
  } catch (e) {
    console.warn(LOG, "fetch 失败", url, e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function pickBestExternalPdfUrl(payload: unknown): string | null {
  const urls = new Set<string>();
  collectUrlStrings(payload, urls);
  const list = [...urls];
  if (list.length === 0) return null;
  const score = (u: string) => {
    const l = u.toLowerCase();
    let s = 0;
    if (l.includes(".pdf")) s += 4;
    if (l.includes("download")) s += 2;
    if (l.includes("/file/")) s += 2;
    if (l.includes("contract")) s += 1;
    return s;
  };
  list.sort((a, b) => score(b) - score(a));
  return list[0];
}

async function tryGetPdfBytes(payload: unknown): Promise<Uint8Array | null> {
  const fromB64 = extractBase64PdfFromPayload(payload);
  if (fromB64) return fromB64;

  const urls = new Set<string>();
  collectUrlStrings(payload, urls);
  const sorted = [...urls].sort((a, b) => {
    const score = (u: string) => {
      const l = u.toLowerCase();
      let s = 0;
      if (l.includes(".pdf")) s += 3;
      if (l.includes("download") || l.includes("/file/")) s += 2;
      if (l.includes("contract")) s += 1;
      return s;
    };
    return score(b) - score(a);
  });

  for (const u of sorted) {
    const bytes = await fetchPdfFromUrl(u);
    if (bytes) return bytes;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return textResponse("method not allowed", 405);
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  if (!serviceKey || !supabaseUrl) {
    console.error(LOG, "缺少 SUPABASE_SERVICE_ROLE_KEY / SUPABASE_URL");
    return textResponse("success", 200);
  }

  let payload: unknown;
  try {
    payload = await parseNotifyPayload(req);
  } catch (e) {
    console.warn(LOG, "解析请求体失败", e);
    return textResponse("success", 200);
  }

  const topKeys = payload && typeof payload === "object" && !Array.isArray(payload)
    ? Object.keys(payload as object)
    : [];
  console.log(LOG, "收到回调 topKeys=", topKeys);

  const contractNo = extractContractNo(payload);
  if (!contractNo) {
    console.warn(LOG, "未解析到 contractNo，跳过落库（请对照爱签真实回调字段）");
    return textResponse("success", 200);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 回调的主职责：更新签署状态
  const nextStatus = mapToSigningStatus(payload);
  if (nextStatus) {
    await updateSigningStatusByContractNo(admin, contractNo, nextStatus);
  } else {
    console.log(LOG, "未识别到可映射的签署状态，contractNo=", contractNo);
  }

  const pdfBytes = await tryGetPdfBytes(payload);
  if (pdfBytes) {
    const result = await uploadPdfBytesAndAttachToSigningRecords(admin, pdfBytes, {
      contractNo,
      uploadedBy: null,
      fileNamePrefix: "asign",
    });

    if (!result.ok) {
      console.error(LOG, "落库失败", result.error);
    } else {
      console.log(LOG, "已保存签署文件", result.publicUrl, "更新记录数", result.updatedRecordCount);
    }
    return textResponse("success", 200);
  }

  const fallbackUrl = pickBestExternalPdfUrl(payload);
  if (fallbackUrl) {
    const extRes = await applyExternalSignedFileUrlToSigningRecords(
      admin,
      contractNo,
      fallbackUrl,
      null,
    );
    if (!extRes.ok) {
      console.error(LOG, "外链落库失败", extRes.error);
    } else {
      console.log(
        LOG,
        "已写入外链（未转存 Storage）",
        extRes.publicUrl,
        "更新记录数",
        extRes.updatedRecordCount,
      );
    }
    return textResponse("success", 200);
  }

  console.warn(
    LOG,
    "未找到 PDF 或可用文件 URL，contractNo=",
    contractNo,
    "（请核对爱签回调是否含 base64 / 直链；仅状态变更无文件时无法自动存档）",
  );
  return textResponse("success", 200);
});
