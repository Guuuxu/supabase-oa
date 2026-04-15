// @ts-nocheck
/**
 * 调用爱签 template/open，返回在线模板制作链接。
 * POST + JWT，JSON body:
 * - template_ident?: string  模板编号（可选，传则打开指定模板，不传则新建）
 * - redirect_url?: string    完成后跳转地址（可选）
 * - notify_url?: string      异步回调（可选）
 * - hidden_basic?: number    是否隐藏基础控件（0/1，可选）
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAsignFormPost, isAsignBizSuccessResponse } from "../_shared/asign-client.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOG = "[OPEN_ASIGN_TEMPLATE]";
const FN_VERSION = "2026-04-14-open-v1";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function findFirstHttpUrl(node: unknown, depth = 0): string | null {
  if (depth > 12 || node === null || node === undefined) return null;
  if (typeof node === "string") {
    const s = node.trim();
    if (/^https?:\/\//i.test(s)) return s;
    return null;
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = findFirstHttpUrl(item, depth + 1);
      if (hit) return hit;
    }
    return null;
  }
  if (typeof node === "object") {
    const o = node as Record<string, unknown>;
    for (const k of ["url", "openUrl", "open_url", "redirectUrl", "redirect_url", "data"]) {
      if (k in o) {
        const hit = findFirstHttpUrl(o[k], depth + 1);
        if (hit) return hit;
      }
    }
    for (const v of Object.values(o)) {
      const hit = findFirstHttpUrl(v, depth + 1);
      if (hit) return hit;
    }
  }
  return null;
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
    return json({ ok: false, error: "无文书模板创建权限", version: FN_VERSION }, 403);
  }

  let body: {
    template_ident?: string;
    redirect_url?: string;
    notify_url?: string;
    hidden_basic?: number;
  };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const bizDataInput: Record<string, unknown> = {};
  const templateIdent = String(body.template_ident ?? "").trim();
  if (templateIdent) bizDataInput.templateIdent = templateIdent;
  const redirectUrl = String(body.redirect_url ?? "").trim();
  if (redirectUrl) bizDataInput.redirectUrl = redirectUrl;
  const notifyUrl = String(body.notify_url ?? "").trim();
  if (notifyUrl) bizDataInput.notifyUrl = notifyUrl;
  if (body.hidden_basic === 0 || body.hidden_basic === 1) {
    bizDataInput.hiddenBasic = body.hidden_basic;
  }

  const apiRes = await callAsignFormPost({
    path: "template/open",
    bizDataInput,
    keepEmptyStringKeys: ["redirectUrl", "notifyUrl"],
  });

  if (!apiRes.ok) {
    console.warn(LOG, "template/open 调用失败", { detail: apiRes.data, debug: apiRes.debug });
    return json(
      {
        ok: false,
        error: "爱签 template/open 调用失败",
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

  const openUrl = findFirstHttpUrl(apiRes.data);
  return json({
    ok: true,
    version: FN_VERSION,
    open_url: openUrl,
    data: apiRes.data,
  });
});
