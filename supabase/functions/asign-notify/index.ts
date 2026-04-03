/**
 * 爱签异步通知（notifyUrl）回调入口。
 *
 * 验签规则（与「合同签署完成后回调通知」文档一致）：
 * - 参与签名的字段为除 `sign`、`remark` 外的键值（remark 为拒签原因时不参与签名）。
 * - 业务字段须按键名排序后组成 JSON 字符串（对齐 Fastjson MapSortField）。
 * - 使用爱签平台 RSA 公钥验签（默认 SHA-256，可通过 ASIGN_NOTIFY_VERIFY_HASH=SHA-1 切换）。
 *
 * 环境变量：
 * - ASIGN_PLATFORM_PUBLIC_KEY：爱签平台公钥（PEM 或 Base64 DER SPKI，必填方可开启验签）
 * - ASIGN_NOTIFY_VERIFY_HASH：可选 SHA-256 | SHA-1
 * - SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY：更新 signing_records
 *
 * 成功须返回纯文本 success（HTTP 200）。
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const DEBUG = "[ASIGN_NOTIFY]";

/** 不参与签名的字段名（大小写敏感按文档；额外兼容常见变体） */
const EXCLUDED_SIGN_KEYS = new Set([
  "sign",
  "Sign",
  "remark",
]);

function successResponse(): Response {
  return new Response("success", {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
}

function failResponse(message: string, status: number): Response {
  return new Response(message, {
    status,
    headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
}

async function parseBody(req: Request): Promise<Record<string, unknown>> {
  const ct = (req.headers.get("content-type") ?? "").toLowerCase();
  if (ct.includes("application/json")) {
    try {
      const j = await req.json();
      return typeof j === "object" && j !== null ? (j as Record<string, unknown>) : { value: j };
    } catch {
      return {};
    }
  }
  if (ct.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const out: Record<string, unknown> = {};
    for (const [k, v] of params.entries()) {
      out[k] = v;
    }
    const bizRaw = out.bizData;
    if (typeof bizRaw === "string") {
      try {
        const parsed = JSON.parse(bizRaw);
        if (typeof parsed === "object" && parsed !== null) {
          out._bizDataParsed = parsed;
        }
      } catch {
        /* 保留原始字符串 */
      }
    }
    return out;
  }
  const text = await req.text();
  if (!text.trim()) return {};
  try {
    const j = JSON.parse(text);
    return typeof j === "object" && j !== null ? (j as Record<string, unknown>) : { value: j };
  } catch {
    return { raw: text };
  }
}

/**
 * 若顶层为 { bizData: "<json>", sign: "..." }，验签正文一般为 bizData 解析后的 Map；
 * 否则使用扁平 body。
 */
function payloadForVerification(body: Record<string, unknown>): Record<string, unknown> {
  const signVal = body.sign ?? body.Sign;
  const biz = body.bizData;
  if (typeof biz === "string" && biz.trim() && typeof signVal === "string" && signVal) {
    try {
      const inner = JSON.parse(biz) as Record<string, unknown>;
      if (inner && typeof inner === "object" && !Array.isArray(inner)) {
        return { ...inner };
      }
    } catch {
      /* 使用整包 body */
    }
  }
  const parsed = body._bizDataParsed;
  if (
    parsed && typeof parsed === "object" && !Array.isArray(parsed) &&
    typeof signVal === "string" && signVal
  ) {
    return { ...(parsed as Record<string, unknown>) };
  }
  return { ...body };
}

/** 与文档一致：按键排序、值统一为字符串后 JSON.stringify（无多余空格） */
function buildSortedSignJson(fields: Record<string, unknown>): string {
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (k.startsWith("_")) continue;
    if (EXCLUDED_SIGN_KEYS.has(k)) continue;
    if (v === null || v === undefined) continue;
    if (typeof v === "object") continue;
    if (typeof v === "string") {
      flat[k] = v;
      continue;
    }
    if (typeof v === "number" || typeof v === "boolean") {
      flat[k] = String(v);
      continue;
    }
    flat[k] = String(v);
  }
  const sortedKeys = Object.keys(flat).sort();
  const ordered: Record<string, string> = {};
  for (const key of sortedKeys) {
    ordered[key] = flat[key];
  }
  return JSON.stringify(ordered);
}

function normalizePublicKeyInput(raw: string): string {
  let s = raw.trim();
  if (s.includes("BEGIN")) {
    s = s.replace(/-----BEGIN PUBLIC KEY-----/gi, "");
    s = s.replace(/-----END PUBLIC KEY-----/gi, "");
    s = s.replace(/\s+/g, "");
  }
  return s;
}

async function importRsaSpkiPublicKey(b64Der: string, hash: "SHA-256" | "SHA-1"): Promise<CryptoKey> {
  const cleaned = normalizePublicKeyInput(b64Der);
  const der = Uint8Array.from(globalThis.atob(cleaned), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "spki",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash },
    false,
    ["verify"],
  );
}

function getNotifyVerifyHash(): "SHA-256" | "SHA-1" {
  const raw = (Deno.env.get("ASIGN_NOTIFY_VERIFY_HASH") ?? "SHA-256").trim().toUpperCase();
  if (raw === "SHA1" || raw === "SHA-1") return "SHA-1";
  return "SHA-256";
}

async function verifyNotifyRsaPkcs1(
  plaintextUtf8: string,
  signB64: string,
  publicKeyMaterial: string,
  hash: "SHA-256" | "SHA-1",
): Promise<boolean> {
  const signClean = signB64.replace(/\s/g, "");
  const sig = Uint8Array.from(globalThis.atob(signClean), (c) => c.charCodeAt(0));
  const data = new TextEncoder().encode(plaintextUtf8);
  const key = await importRsaSpkiPublicKey(publicKeyMaterial, hash);
  return crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, sig, data);
}

async function verifyNotifySignatureOrThrow(
  body: Record<string, unknown>,
  publicKey: string,
): Promise<void> {
  const signRaw = body.sign ?? body.Sign;
  if (typeof signRaw !== "string" || !signRaw.trim()) {
    throw new Error("缺少 sign");
  }
  const signPayload = payloadForVerification(body);
  const planJson = buildSortedSignJson(signPayload);
  const hashPrimary = getNotifyVerifyHash();
  const hashFallback = hashPrimary === "SHA-256" ? "SHA-1" : "SHA-256";

  let ok = await verifyNotifyRsaPkcs1(planJson, signRaw, publicKey, hashPrimary);
  let usedHash = hashPrimary;
  if (!ok) {
    ok = await verifyNotifyRsaPkcs1(planJson, signRaw, publicKey, hashFallback);
    usedHash = hashFallback;
  }

  if (!ok) {
    console.error(`${DEBUG} 验签失败`, { plaintextPreview: planJson.slice(0, 800) });
    throw new Error("验签失败");
  }
  console.log(`${DEBUG} 验签通过`, { algorithm: usedHash, jsonLen: planJson.length });
}

/** 从回调体中尽量解析出合同编号 */
function extractContractNo(body: Record<string, unknown>): string | undefined {
  const effective = payloadForVerification(body);
  const tryRecord = (r: Record<string, unknown>): string | undefined => {
    const direct = r.contractNo ?? r.contract_no;
    if (typeof direct === "string" && direct.trim()) return direct.trim();
    const directId = r.contractId ?? r.contract_id;
    if (typeof directId === "string" && directId.trim()) return directId.trim();
    return undefined;
  };
  const fromEffective = tryRecord(effective);
  if (fromEffective) return fromEffective;
  return tryRecord(body);
}

function asDataRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function extractStatusFields(body: Record<string, unknown>): {
  contractStatus: string;
  callbackType: string;
} {
  const effective = payloadForVerification(body);
  let contractStatus = "";
  let callbackType = "";
  const statusKeys = [
    effective.status,
    effective.contractStatus,
    effective.contract_status,
    body.status,
    body.contractStatus,
    body.contract_status,
    body.signStatus,
  ];
  for (const k of statusKeys) {
    if (typeof k === "string" && k) {
      contractStatus = k;
      break;
    }
    if (typeof k === "number") {
      contractStatus = String(k);
      break;
    }
  }
  const callbackKeys = [
    effective.callbackType,
    effective.callback_type,
    body.callbackType,
    body.callback_type,
    body.eventType,
    body.event_type,
  ];
  for (const k of callbackKeys) {
    if (typeof k === "string" && k) {
      callbackType = k;
      break;
    }
  }
  const nested = asDataRecord(effective.data) ?? asDataRecord(body.data);
  if (nested) {
    if (!contractStatus) {
      const v = nested.contractStatus ?? nested.contract_status ?? nested.status;
      if (typeof v === "string") contractStatus = v;
      if (typeof v === "number") contractStatus = String(v);
    }
    if (!callbackType) {
      const v = nested.callbackType ?? nested.callback_type;
      if (typeof v === "string") callbackType = v;
    }
  }
  return { contractStatus, callbackType };
}

/** 映射到 signing_status */
function mapToSigningStatus(body: Record<string, unknown>): string | null {
  const effective = payloadForVerification(body);
  const actionRaw = effective.action ?? body.action;
  const action = typeof actionRaw === "string" ? actionRaw : "";
  const actionNorm = action.replace(/\s/g, "").toLowerCase();
  if (actionNorm === "signcompleted") return "completed";

  // 先用回调里的「数值状态码」做兜底映射：
  // - status = 2：完成
  // - status = 4 / -3：拒签/失败
  // 爱签回调里有时同时存在 status=4 但 contractStatus 仍是 SIGNING，
  // 这会导致后续逻辑误判为 employee_signed，因此这里优先处理。
  const statusCode = (() => {
    const candidates: unknown[] = [effective.status, body.status];
    for (const k of candidates) {
      if (typeof k === "string" && k.trim()) return k.trim();
      if (typeof k === "number") return String(k);
    }
    return undefined;
  })();

  if (statusCode === "2") return "completed";
  if (statusCode === "4" || statusCode === "-3") return "rejected";

  const { contractStatus, callbackType } = extractStatusFields(body);
  const s = contractStatus.toUpperCase();
  const c = callbackType.toUpperCase();

  if (contractStatus === "2") return "completed";

  if (s.includes("COMPLETE") || c.includes("COMPLETE")) return "completed";
  if (s.includes("REJECT") || s.includes("REFUSE") || c.includes("REJECT") || c.includes("REFUSE")) {
    return "rejected";
  }
  if (s.includes("SIGNING")) return "employee_signed";
  if (c.includes("SUBMIT_SIGN")) return "employee_signed";
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return failResponse("Method Not Allowed", 405);
  }

  const body = await parseBody(req);
  console.log(`${DEBUG} 收到回调`, JSON.stringify(body).slice(0, 4000));

  const publicKey = Deno.env.get("ASIGN_PLATFORM_PUBLIC_KEY")?.trim();
  if (publicKey) {
    try {
      await verifyNotifySignatureOrThrow(body, publicKey);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`${DEBUG} 验签拒绝`, msg);
      return failResponse("invalid signature", 401);
    }
  } else {
    console.warn(`${DEBUG} 未配置 ASIGN_PLATFORM_PUBLIC_KEY，跳过验签（生产环境请配置）`);
  }

  const contractNo = extractContractNo(body);
  const nextStatus = mapToSigningStatus(body);

  console.log(`${DEBUG} 解析`, { contractNo, nextStatus });

  if (!contractNo) {
    console.warn(`${DEBUG} 未解析到 contractNo，不落库`);
    return successResponse();
  }

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    console.error(`${DEBUG} 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY`);
    return failResponse("server misconfigured", 500);
  }

  const supabase = createClient(url, key);

  if (!nextStatus) {
    console.log(`${DEBUG} 无状态映射，跳过更新`, { contractNo });
    return successResponse();
  }

  const { data: rows, error: findError } = await supabase
    .from("signing_records")
    .select("id, status, template_ids")
    .eq("third_party_contract_no", contractNo)
    .limit(5);

  if (findError) {
    console.error(`${DEBUG} 查询签署记录失败`, findError);
    return failResponse("db query error", 500);
  }

  if (!rows || rows.length === 0) {
    console.warn(`${DEBUG} 未找到 third_party_contract_no=${contractNo} 的记录`);
    return successResponse();
  }

  if (rows.length > 1) {
    console.warn(`${DEBUG} 多条记录匹配 contractNo，仅更新第一条`, { count: rows.length });
  }

  const row = rows[0] as any;
  const id = row.id;

  let finalStatus = nextStatus;
  const nowIso = new Date().toISOString();

  // 当回调判断为“员工已签”(employee_signed)时：
  // - 若关联模板 requires_company_signature=false：只需员工签署，则直接置为 completed。
  // - 若 requires_company_signature=true：保留 employee_signed，等待公司签署回调。
  if (nextStatus === "employee_signed") {
    const templateIds: string[] = Array.isArray(row.template_ids) ? row.template_ids : [];
    let requiresCompanySignature = false;

    if (templateIds.length > 0) {
      const { data: docs, error: docsErr } = await supabase
        .from("document_templates")
        .select("id, requires_company_signature")
        .in("id", templateIds);

      if (!docsErr && Array.isArray(docs)) {
        requiresCompanySignature = docs.some((d: any) => d.requires_company_signature === true);
      } else {
        console.warn(`${DEBUG} 读取模板 requires_company_signature 失败，使用默认：需要公司签署`, {
          docsErr,
          templateIdsLen: templateIds.length,
        });
        requiresCompanySignature = true;
      }
    }

    if (!requiresCompanySignature) {
      finalStatus = "completed";
    }

    console.log(`${DEBUG} employee_signed 映射决策`, {
      templateIdsLen: templateIds.length,
      requiresCompanySignature,
      finalStatus,
    });
  }

  // 更新 payload：补充签署时间字段（便于前端展示）
  const updatePayload: any = { status: finalStatus };
  if (nextStatus === "employee_signed") {
    updatePayload.employee_signed_at = nowIso;
  } else if (nextStatus === "completed") {
    updatePayload.company_signed_at = nowIso;
  }

  const { error: updError } = await supabase
    .from("signing_records")
    .update(updatePayload)
    .eq("id", id);

  if (updError) {
    console.error(`${DEBUG} 更新失败`, updError);
    return failResponse("db update error", 500);
  }

  console.log(`${DEBUG} 已更新签署记录`, { id, nextStatus, finalStatus });
  return successResponse();
});
