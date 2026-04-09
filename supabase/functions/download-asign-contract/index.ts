// @ts-nocheck
/**
 * 主动调用爱签 contract/downloadContract 拉取 PDF，写入 signed-documents，
 * 并同步 signing_records.signed_file_url 与 signed_documents（与同 contractNo 的档案记录一致）。
 * 与 asign-notify 回调互不影响，可同时使用。
 *
 * 请求：POST + JWT，JSON body: { signing_record_id?: string, contract_no?: string, force?: 0|1 }
 * - 传 signing_record_id 时从库解析 third_party_contract_no（须当前用户可读该记录）
 * - downloadFileType 固定为 1（PDF）
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAsignDownloadContract } from "../_shared/asign-client.ts";
import { uploadPdfBytesAndAttachToSigningRecords } from "../_shared/signed-file-persist.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOG = "[DOWNLOAD_ASIGN_CONTRACT]";
const FN_VERSION = "2026-04-08-download-v5";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type AsignDownloadResult = Awaited<ReturnType<typeof callAsignDownloadContract>>;

/** 爱签或前置网关短时 502/503 等：单条点击间隔大不易触发，批量背靠背容易中；可重试 */
function isRetryableAsignGatewayFailure(dl: AsignDownloadResult): boolean {
  if (dl.ok) return false;
  const st = dl.status;
  if (st === 502 || st === 503 || st === 504 || st === 429) return true;
  const data = dl.data;
  if (data && typeof data === "object") {
    const rec = data as Record<string, unknown>;
    const msg = String(rec.msg ?? "");
    const preview = String(rec.preview ?? "").toLowerCase();
    if (msg === "非 PDF 且非 JSON") {
      if (
        preview.includes("502") ||
        preview.includes("bad gateway") ||
        preview.includes("503") ||
        preview.includes("504")
      ) {
        return true;
      }
    }
  }
  return false;
}

async function callAsignDownloadWithRetry(params: {
  contractNo: string;
  force: number;
  downloadFileType: number;
}): Promise<AsignDownloadResult> {
  const wavesRaw = (Deno.env.get("ASIGN_DOWNLOAD_GATEWAY_RETRY_WAVES") ?? "4").trim();
  const delayRaw = (Deno.env.get("ASIGN_DOWNLOAD_GATEWAY_RETRY_DELAY_MS") ?? "900").trim();
  const maxWaves = Math.max(1, parseInt(wavesRaw, 10) || 4);
  const baseDelayMs = Math.max(0, parseInt(delayRaw, 10) || 900);

  let last: AsignDownloadResult | null = null;
  for (let wave = 0; wave < maxWaves; wave++) {
    if (wave > 0) {
      const waitMs = baseDelayMs * wave;
      console.log(LOG, "爱签下载网关重试", { version: FN_VERSION, wave, waitMs, contractNo: params.contractNo });
      await sleep(waitMs);
    }
    last = await callAsignDownloadContract(params);
    if (last.ok) return last;
    if (!isRetryableAsignGatewayFailure(last)) return last;
    console.warn(LOG, "爱签下载可重试失败，将重试", {
      version: FN_VERSION,
      wave: wave + 1,
      maxWaves,
      status: last.status,
    });
  }
  return last ?? { ok: false, status: 500, data: { msg: "download gateway retry exhausted" } };
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "METHOD_NOT_ALLOWED" }, 405);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const supabaseAdminUrl = (Deno.env.get("SUPABASE_ADMIN_URL") ?? Deno.env.get("SUPABASE_URL") ?? "").trim();
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim();
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();

  if (!supabaseUrl || !supabaseAdminUrl || !supabaseAnonKey || !serviceKey) {
    return jsonResponse({ error: "缺少 SUPABASE_URL / ANON_KEY / SERVICE_ROLE_KEY" }, 500);
  }

  const userSb = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: authHeader ? { Authorization: authHeader } : {} },
  });

  const { data: { user }, error: userErr } = await userSb.auth.getUser();
  if (userErr || !user) {
    return jsonResponse({ error: "未登录" }, 401);
  }

  let body: { signing_record_id?: string; contract_no?: string; force?: number };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "请求体须为 JSON" }, 400);
  }

  let contractNo = String(body.contract_no ?? "").trim();
  let signingRecordId = String(body.signing_record_id ?? "").trim();
  console.log(LOG, "请求入参", {
    version: FN_VERSION,
    hasAuthHeader: Boolean(authHeader),
    supabaseUrlHost: (() => {
      try {
        return new URL(supabaseUrl).host;
      } catch {
        return supabaseUrl;
      }
    })(),
    supabaseAdminUrlHost: (() => {
      try {
        return new URL(supabaseAdminUrl).host;
      } catch {
        return supabaseAdminUrl;
      }
    })(),
    signingRecordId,
    contractNo,
    force: body.force,
  });

  // 约束：必须在签署完成（status=completed）已入库后才允许补拉 PDF，避免影响签署流程/状态判断
  if (signingRecordId) {
    const { data: row, error: rowErr } = await userSb
      .from("signing_records")
      .select("id, status, third_party_contract_no")
      .eq("id", signingRecordId)
      .maybeSingle();

    if (rowErr || !row) {
      return jsonResponse({ ok: false, error: "签署记录不存在或无权查看", version: FN_VERSION }, 403);
    }
    if (String(row.status ?? "").trim() !== "completed") {
      return jsonResponse(
        { ok: false, error: "签署未完成（未入库）时禁止下载同步，请待状态为 completed 后再操作", version: FN_VERSION },
        200,
      );
    }
    const cno = row.third_party_contract_no;
    if (!cno || !String(cno).trim()) {
      return jsonResponse({ ok: false, error: "该记录没有爱签合同号，无法从爱签下载", version: FN_VERSION }, 400);
    }
    if (!contractNo) {
      contractNo = String(cno).trim();
    }
  }

  if (!contractNo) {
    return jsonResponse({ ok: false, error: "请提供 signing_record_id 或 contract_no", version: FN_VERSION }, 400);
  }

  if (!signingRecordId) {
    // contract_no 模式：要求该合同号关联的所有签署记录均已 completed
    const { data: rows, error: rowsErr } = await userSb
      .from("signing_records")
      .select("id, status")
      .eq("third_party_contract_no", contractNo);
    if (rowsErr) {
      return jsonResponse({ ok: false, error: rowsErr.message, version: FN_VERSION }, 200);
    }
    const list = rows ?? [];
    if (list.length === 0) {
      return jsonResponse({ ok: false, error: "未找到该合同号对应的签署记录", version: FN_VERSION }, 200);
    }
    const notCompleted = list.filter((r: any) => String(r.status ?? "").trim() !== "completed");
    if (notCompleted.length > 0) {
      return jsonResponse(
        { ok: false, error: "存在未完成的签署记录，禁止下载同步，请待全部 completed 后再操作", version: FN_VERSION },
        200,
      );
    }
  }

  const force = body.force === 1 ? 1 : 0;

  console.log(LOG, "开始拉取合同 PDF", contractNo, "force=", force);

  const dl = await callAsignDownloadWithRetry({
    contractNo,
    force,
    downloadFileType: 1,
  });
  console.log(LOG, "downloadContract 调用结果", {
    version: FN_VERSION,
    contractNo,
    ok: dl.ok,
    status: (dl as any).status ?? null,
  });

  if (!dl.ok) {
    let detailPreview = "";
    try {
      detailPreview = JSON.stringify(dl.data).slice(0, 1200);
    } catch {
      detailPreview = String(dl.data).slice(0, 1200);
    }
    console.warn(LOG, "爱签下载失败", {
      status: dl.status,
      detailPreview,
      debug: dl.debug,
    });
    return jsonResponse(
      {
        ok: false,
        error: "爱签合同下载失败",
        version: FN_VERSION,
        status: dl.status,
        detail: dl.data,
        debug: dl.debug,
      },
      200,
    );
  }

  console.log(LOG, "下载返回数据", {
    version: FN_VERSION,
    contractNo,
    byteLength: dl.bytes.byteLength,
    // 仅打印前 8 字节用于识别文件魔数（例如 PDF: 25 50 44 46）
    bytesHead: Array.from(dl.bytes.slice(0, 8)),
  });

  const admin = createClient(supabaseAdminUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const persist = await uploadPdfBytesAndAttachToSigningRecords(admin, dl.bytes, {
    contractNo,
    uploadedBy: user.id,
    fileNamePrefix: "asign-pull",
  });

  if (!persist.ok) {
    console.error(LOG, "落库失败", persist.error);

    // 兜底：若 service_role 在 Storage 上传阶段验签失败，改用当前用户 token 再试一次。
    // 这样可避免环境变量签名不一致导致的阻塞，同时不放宽函数鉴权。
    const isStorageSignatureError =
      typeof persist.error === "string" &&
      persist.error.includes("[stage=storage_upload]") &&
      persist.error.toLowerCase().includes("invalid signature");

    if (isStorageSignatureError) {
      console.warn(LOG, "触发用户态兜底重试（storage invalid signature）");
      const retry = await uploadPdfBytesAndAttachToSigningRecords(userSb as any, dl.bytes, {
        contractNo,
        uploadedBy: user.id,
        fileNamePrefix: "asign-pull",
      });
      if (retry.ok) {
        console.log(LOG, "用户态兜底成功", retry.publicUrl, retry.updatedRecordCount);
        return jsonResponse(
          {
            ok: true,
            version: FN_VERSION,
            publicUrl: retry.publicUrl,
            updatedRecordCount: retry.updatedRecordCount,
            fallback: "user_token_retry",
          },
          200,
        );
      }
      console.error(LOG, "用户态兜底仍失败", retry.error);
      const pdfBase64 = bytesToBase64(dl.bytes);
      return jsonResponse(
        {
          ok: true,
          need_client_upload: true,
          error: retry.error,
          version: FN_VERSION,
          fallback: "user_token_retry_failed",
          contract_no: contractNo,
          signing_record_id: signingRecordId || null,
          pdf_base64: pdfBase64,
          file_name: `asign_${contractNo}_${Date.now()}.pdf`,
          mime_type: "application/pdf",
          byte_length: dl.bytes.byteLength,
        },
        200,
      );
    }

    return jsonResponse({ ok: false, error: persist.error, version: FN_VERSION }, 200);
  }

  console.log(LOG, "已同步档案", persist.publicUrl, "记录数", persist.updatedRecordCount);

  return jsonResponse({
    ok: true,
    version: FN_VERSION,
    publicUrl: persist.publicUrl,
    updatedRecordCount: persist.updatedRecordCount,
  }, 200);
});
