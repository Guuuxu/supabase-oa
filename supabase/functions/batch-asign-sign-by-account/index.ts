// @ts-nocheck
/**
 * 爱签 v2/contract/batchSignByAccount：向同一用户批量发起签署并发送短信。
 * POST + JWT，JSON body:
 * - account: string（必填）企业/用户 account，与 addSigner 一致
 * - mobile?: string 签约短信通知手机号
 * - is_notice?: number 0|1，默认 1
 * - contract_nos: string[] 待签合同号，单次最多 15 个
 * - validate_type?: number 签署方式，企业常用 1（短信验证码）
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAsignFormPost, isAsignBizSuccessResponse } from "../_shared/asign-client.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOG = "[BATCH_ASIGN_SIGN_BY_ACCOUNT]";
const FN_VERSION = "2026-05-29-batch-sign-v1";
const MAX_CONTRACT_NOS = 15;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parsePositiveInt(raw: unknown, fallback: number): number {
  if (raw === null || raw === undefined || String(raw).trim() === "") return fallback;
  const n = parseInt(String(raw), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return json({ ok: false, error: "METHOD_NOT_ALLOWED", version: FN_VERSION }, 405);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return json({ ok: false, error: "未登录", version: FN_VERSION }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (!supabaseUrl || !serviceKey) {
    return json({ ok: false, error: "缺少 SUPABASE_URL / SERVICE_ROLE_KEY", version: FN_VERSION }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: userData, error: authErr } = await admin.auth.getUser(token);
  if (authErr || !userData?.user) {
    return json({ ok: false, error: "会话无效或已过期", version: FN_VERSION }, 401);
  }

  let body: {
    account?: string;
    mobile?: string;
    is_notice?: number;
    contract_nos?: string[];
    validate_type?: number;
  };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const account = String(body.account ?? "").trim();
  if (!account) {
    return json({ ok: false, error: "缺少 account", version: FN_VERSION }, 400);
  }

  const contractNosRaw = Array.isArray(body.contract_nos) ? body.contract_nos : [];
  const contractNos = Array.from(
    new Set(contractNosRaw.map((n) => String(n ?? "").trim()).filter(Boolean)),
  );
  if (contractNos.length === 0) {
    return json({ ok: false, error: "contract_nos 不能为空", version: FN_VERSION }, 400);
  }
  if (contractNos.length > MAX_CONTRACT_NOS) {
    return json(
      {
        ok: false,
        error: `contract_nos 单次最多 ${MAX_CONTRACT_NOS} 个，请分批调用`,
        version: FN_VERSION,
      },
      400,
    );
  }

  const mobile = String(body.mobile ?? "").trim();
  const isNoticeRaw = body.is_notice;
  const isNotice = isNoticeRaw === 0 ? 0 : 1;
  const defaultValidateType = parsePositiveInt(Deno.env.get("ASIGN_DEFAULT_VALIDATE_TYPE"), 1);
  const validateType =
    body.validate_type !== undefined && body.validate_type !== null
      ? parsePositiveInt(body.validate_type, defaultValidateType)
      : defaultValidateType;

  const bizDataInput: Record<string, unknown> = {
    account,
    isNotice,
    contractNos,
    validateType,
  };
  if (mobile) {
    bizDataInput.mobile = mobile;
  }

  const path =
    (Deno.env.get("ASIGN_BATCH_SIGN_BY_ACCOUNT_PATH") ?? "v2/contract/batchSignByAccount")
      .trim()
      .replace(/^\/+/, "");

  console.log(LOG, "request", JSON.stringify({ account, contractNos, isNotice, validateType }));

  const apiRes = await callAsignFormPost({
    path,
    bizDataInput,
  });

  if (!apiRes.ok) {
    console.warn(LOG, "调用失败", { detail: apiRes.data, debug: apiRes.debug });
    return json(
      {
        ok: false,
        error: "爱签 batchSignByAccount 调用失败",
        version: FN_VERSION,
        detail: apiRes.data,
        debug: apiRes.debug,
      },
      502,
    );
  }

  const asignBody = apiRes.data;
  if (!isAsignBizSuccessResponse(asignBody)) {
    const msg =
      asignBody && typeof asignBody === "object"
        ? String((asignBody as Record<string, unknown>).msg ?? "爱签业务失败")
        : "爱签业务失败";
    console.warn(LOG, "业务失败", asignBody);
    return json(
      {
        ok: false,
        error: msg,
        version: FN_VERSION,
        detail: asignBody,
      },
      400,
    );
  }

  return json({
    ok: true,
    version: FN_VERSION,
    account,
    contract_nos: contractNos,
    asign: asignBody,
  });
});
