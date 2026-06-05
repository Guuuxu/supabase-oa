// @ts-nocheck
/**
 * 爱签 user/getUser：按 account / idCard 查询用户信息（员工编辑后同步爱签状态用）。
 * POST + JWT body: { account?: string; id_card?: string }
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAsignFormPost } from "../_shared/asign-client.ts";
import {
  buildPersonalGetUserBizData,
  parseAsignGetUserStatus,
} from "../_shared/asign-user.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOG = "[GET_ASIGN_USER]";
const FN_VERSION = "2026-06-02-get-asign-user-v2";

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
  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (!supabaseUrl || !serviceKey) {
    return json({ ok: false, error: "缺少 SUPABASE_URL / SERVICE_ROLE_KEY", version: FN_VERSION }, 500);
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return json({ ok: false, error: "未登录", version: FN_VERSION }, 401);

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: userData, error: authErr } = await admin.auth.getUser(token);
  if (authErr || !userData?.user) {
    return json({ ok: false, error: "会话无效或已过期", version: FN_VERSION }, 401);
  }

  const callerId = userData.user.id;
  const { data: isSuper, error: superErr } = await admin.rpc("is_super_admin", { uid: callerId });
  if (superErr) return json({ ok: false, error: "权限校验失败", version: FN_VERSION }, 500);

  const { data: canEdit, error: editPermErr } = await admin.rpc("has_permission", {
    user_id: callerId,
    permission_code: "employee_edit",
  });
  const { data: canManage, error: managePermErr } = await admin.rpc("has_permission", {
    user_id: callerId,
    permission_code: "employee_manage",
  });
  if (editPermErr || managePermErr) {
    return json({ ok: false, error: "权限校验失败", version: FN_VERSION }, 500);
  }
  if (!isSuper && !canEdit && !canManage) {
    return json({ ok: false, error: "无权限：需要员工编辑权限", version: FN_VERSION }, 403);
  }

  let body: { account?: string; id_card?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const idCardRaw = String(body.id_card ?? "").trim().replace(/\s/g, "").toUpperCase();
  const accountRaw = String(body.account ?? "").trim();
  const account = accountRaw || (idCardRaw ? `ASIGN${idCardRaw}` : "");

  if (!account) {
    return json({ ok: false, error: "缺少 account 或 id_card", version: FN_VERSION }, 400);
  }

  const bizDataInput = buildPersonalGetUserBizData({
    account,
    idCard: idCardRaw,
  });

  const getUserPath = (Deno.env.get("ASIGN_USER_GET_PATH") ?? "user/getUser").trim().replace(/^\/+/, "");

  console.log(LOG, "查询参数", JSON.stringify({ account, path: getUserPath, bizDataInput }));

  const apiRes = await callAsignFormPost({
    path: getUserPath,
    bizDataInput,
  });

  const parsed = parseAsignGetUserStatus(apiRes.data);
  const isQueryableStatus =
    parsed.status === "verified" ||
    parsed.status === "not_exists" ||
    parsed.status === "stranger";

  if (!apiRes.ok && !isQueryableStatus) {
    console.warn(LOG, "getUser 调用失败", { detail: apiRes.data, debug: apiRes.debug });
    return json(
      {
        ok: false,
        error: "爱签 user/getUser 调用失败",
        version: FN_VERSION,
        detail: apiRes.data,
        debug: apiRes.debug,
      },
      200,
    );
  }
  console.log(LOG, "状态解析", JSON.stringify(parsed));

  return json({
    ok: true,
    version: FN_VERSION,
    account,
    status: parsed.status,
    asign_code: parsed.code,
    asign_msg: parsed.msg,
    user_data: parsed.userData,
    data: apiRes.data,
  });
});
