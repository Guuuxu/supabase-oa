// @ts-nocheck
/**
 * 爱签 v2/user/modifyStranger：陌生用户更新信息（唯一标识 code 不可改）。
 * POST + JWT body: { account?, id_card?, user_type?, name?, mobile? }
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAsignFormPost } from "../_shared/asign-client.ts";
import {
  buildPersonalModifyStrangerBizData,
  parseAsignModifyUserResponse,
} from "../_shared/asign-user.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOG = "[MODIFY_ASIGN_STRANGER]";
const FN_VERSION = "2026-06-02-modify-asign-stranger-v1";

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

  let body: {
    account?: string;
    id_card?: string;
    user_type?: number;
    name?: string;
    mobile?: string;
  };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const idCardRaw = String(body.id_card ?? "").trim().replace(/\s/g, "").toUpperCase();
  const accountRaw = String(body.account ?? "").trim();
  const account = accountRaw || (idCardRaw ? `ASIGN${idCardRaw}` : "");
  const name = String(body.name ?? "").trim();
  const mobile = String(body.mobile ?? "").trim();

  if (!account) {
    return json({ ok: false, error: "缺少 account 或 id_card", version: FN_VERSION }, 400);
  }

  const bizDataInput = buildPersonalModifyStrangerBizData({
    account,
    userType: 2,
    name: name || undefined,
    mobile: mobile || undefined,
    idCard: idCardRaw || undefined,
  });

  const modifyPath = (Deno.env.get("ASIGN_USER_MODIFY_STRANGER_PATH") ?? "v2/user/modifyStranger")
    .trim()
    .replace(/^\/+/, "");

  console.log(LOG, "请求参数", JSON.stringify({ account, path: modifyPath, bizDataInput }));

  const apiRes = await callAsignFormPost({
    path: modifyPath,
    bizDataInput,
  });

  const parsed = parseAsignModifyUserResponse(apiRes.data);
  console.log(LOG, "响应解析", JSON.stringify(parsed));

  if (!apiRes.ok || !parsed.ok) {
    console.warn(LOG, "modifyStranger 失败", {
      httpOk: apiRes.ok,
      asign_code: parsed.code,
      asign_msg: parsed.msg,
      detail: apiRes.data,
      debug: apiRes.debug,
    });
    return json(
      {
        ok: false,
        error: "爱签 modifyStranger 业务失败",
        version: FN_VERSION,
        asign_code: parsed.code,
        asign_msg: parsed.msg,
        asign_data: parsed.data,
        detail: apiRes.data,
        debug: apiRes.debug,
      },
      200,
    );
  }

  return json({
    ok: true,
    version: FN_VERSION,
    account,
    asign_code: parsed.code,
    asign_msg: parsed.msg,
    asign_data: parsed.data,
    data: apiRes.data,
  });
});
