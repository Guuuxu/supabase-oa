// @ts-nocheck
/**
 * 爱签 v2/user/modifyUserName：已认证用户更新姓名、手机号、银行卡（需重新认证）。
 * POST + JWT body: { account?, id_card?, name, mobile?, bank_card?, identify_type? }
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAsignFormPost } from "../_shared/asign-client.ts";
import {
  buildPersonalModifyUserBizData,
  parseAsignModifyUserResponse,
} from "../_shared/asign-user.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOG = "[MODIFY_ASIGN_USER]";
const FN_VERSION = "2026-06-02-modify-asign-user-v1";

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
    name?: string;
    mobile?: string;
    bank_card?: string;
    identify_type?: number;
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
  const bankCard = String(body.bank_card ?? "").trim();

  if (!account) {
    return json({ ok: false, error: "缺少 account 或 id_card", version: FN_VERSION }, 400);
  }
  if (!name) {
    return json({ ok: false, error: "缺少 name", version: FN_VERSION }, 400);
  }

  let identifyType: 2 | 3;
  const identifyTypeRaw = Number(body.identify_type);
  if (identifyTypeRaw === 2 || identifyTypeRaw === 3) {
    identifyType = identifyTypeRaw;
  } else if (bankCard) {
    identifyType = 3;
  } else {
    identifyType = 2;
  }

  if (identifyType === 2 && !mobile) {
    return json({ ok: false, error: "identifyType=2 时需提供 mobile", version: FN_VERSION }, 400);
  }
  if (identifyType === 3 && !bankCard) {
    return json({ ok: false, error: "identifyType=3 时需提供 bank_card", version: FN_VERSION }, 400);
  }

  const bizDataInput = buildPersonalModifyUserBizData({
    account,
    name,
    identifyType,
    mobile: identifyType === 2 ? mobile : undefined,
    bankCard: identifyType === 3 ? bankCard : undefined,
  });

  const modifyPath = (Deno.env.get("ASIGN_USER_MODIFY_PATH") ?? "v2/user/modifyUserName")
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
    console.warn(LOG, "modifyUserName 失败", {
      httpOk: apiRes.ok,
      asign_code: parsed.code,
      asign_msg: parsed.msg,
      detail: apiRes.data,
      debug: apiRes.debug,
    });
    return json(
      {
        ok: false,
        error: "爱签 modifyUserName 业务失败",
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
