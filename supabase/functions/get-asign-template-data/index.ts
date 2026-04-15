// @ts-nocheck
/**
 * 爱签 template/getTemplateData：按模板编号拉取已同步模板控件信息（含 dataKey / 签署位 key 等，以爱签返回为准）。
 * POST + JWT，JSON body:
 * - template_ident: string  模板编号（必填），请求爱签时映射为 bizData.templateIdent
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAsignFormPost, isAsignBizSuccessResponse } from "../_shared/asign-client.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOG = "[GET_ASIGN_TEMPLATE_DATA]";
const FN_VERSION = "2026-04-15-get-template-data-v1";

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
  const { data: canCreate, error: permErr } = await admin.rpc("has_permission", {
    user_id: callerId,
    permission_code: "template_create",
  });
  if (permErr) return json({ ok: false, error: "权限校验失败", version: FN_VERSION }, 500);
  if (!isSuper && !canCreate) {
    return json({ ok: false, error: "无文书模板管理权限", version: FN_VERSION }, 403);
  }

  let body: { template_ident?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const templateIdent = String(body.template_ident ?? "").trim();
  if (!templateIdent) {
    return json({ ok: false, error: "缺少 template_ident（爱签模板编号）", version: FN_VERSION }, 400);
  }

  const apiRes = await callAsignFormPost({
    path: "template/getTemplateData",
    bizDataInput: { templateIdent },
  });

  if (!apiRes.ok) {
    console.warn(LOG, "getTemplateData 调用失败", { detail: apiRes.data, debug: apiRes.debug });
    return json(
      {
        ok: false,
        error: "爱签 template/getTemplateData 调用失败",
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
    template_ident: templateIdent,
    data: apiRes.data,
  });
});
