// @ts-nocheck
/**
 * 调用爱签 contract/withdraw 撤销合同。
 * POST + JWT，JSON body:
 * - signing_record_id?: string  可选，传则先校验当前用户可读该记录，并自动取 third_party_contract_no
 * - contract_no?: string        可选，未传 signing_record_id 时必填
 * - withdraw_reason?: string    可选，最长 50 字（爱签侧约束）
 * - is_notice_sign_user?: boolean 可选，是否短信通知签署用户，默认 false
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAsignFormPost, isAsignBizSuccessResponse } from "../_shared/asign-client.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOG = "[WITHDRAW_ASIGN_CONTRACT]";
const FN_VERSION = "2026-04-29-withdraw-v1";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim();
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json({ ok: false, error: "缺少 SUPABASE_URL / SUPABASE_ANON_KEY / SERVICE_ROLE_KEY", version: FN_VERSION }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const userSb = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: authErr } = await admin.auth.getUser(token);
  if (authErr || !userData?.user) {
    return json({ ok: false, error: "会话无效或已过期", version: FN_VERSION }, 401);
  }
  const callerId = userData.user.id;

  const { data: isSuper, error: superErr } = await admin.rpc("is_super_admin", { uid: callerId });
  if (superErr) return json({ ok: false, error: "权限校验失败", version: FN_VERSION }, 500);
  const { data: canRevoke, error: permErr } = await admin.rpc("has_permission", {
    user_id: callerId,
    permission_code: "signing_revoke",
  });
  if (permErr) return json({ ok: false, error: "权限校验失败", version: FN_VERSION }, 500);
  if (!isSuper && !canRevoke) {
    return json({ ok: false, error: "无签署撤回权限", version: FN_VERSION }, 403);
  }

  let body: {
    signing_record_id?: string;
    contract_no?: string;
    withdraw_reason?: string;
    is_notice_sign_user?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const signingRecordId = String(body.signing_record_id ?? "").trim();
  let contractNo = String(body.contract_no ?? "").trim();
  if (signingRecordId) {
    const { data: row, error: rowErr } = await userSb
      .from("signing_records")
      .select("id, third_party_contract_no")
      .eq("id", signingRecordId)
      .maybeSingle();
    if (rowErr || !row) {
      return json({ ok: false, error: "签署记录不存在或无权查看", version: FN_VERSION }, 403);
    }
    const cno = String(row.third_party_contract_no ?? "").trim();
    if (!contractNo) {
      contractNo = cno;
    }
  }

  if (!contractNo) {
    return json({ ok: false, error: "缺少 contract_no（或对应记录无爱签合同号）", version: FN_VERSION }, 400);
  }

  const withdrawReason = String(body.withdraw_reason ?? "").trim().slice(0, 50);
  const notice = body.is_notice_sign_user === true;
  const bizDataInput: Record<string, unknown> = {
    contractNo,
    isNoticeSignUser: notice,
  };
  if (withdrawReason) {
    bizDataInput.withdrawReason = withdrawReason;
  }

  const apiRes = await callAsignFormPost({
    path: "contract/withdraw",
    bizDataInput,
  });

  if (!apiRes.ok) {
    console.warn(LOG, "contract/withdraw 调用失败", { detail: apiRes.data, debug: apiRes.debug });
    return json(
      {
        ok: false,
        error: "爱签 contract/withdraw 调用失败",
        version: FN_VERSION,
        detail: apiRes.data,
        debug: apiRes.debug,
      },
      200,
    );
  }

  const root = apiRes.data as Record<string, unknown>;
  const asign = (root?.asign ?? root) as Record<string, unknown>;
  if (!isAsignBizSuccessResponse(asign)) {
    return json(
      {
        ok: false,
        error: String(asign.msg ?? "爱签返回业务失败"),
        version: FN_VERSION,
        detail: apiRes.data,
      },
      200,
    );
  }

  return json({
    ok: true,
    version: FN_VERSION,
    contract_no: contractNo,
    data: apiRes.data,
  });
});

