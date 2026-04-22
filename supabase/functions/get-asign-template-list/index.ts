// @ts-nocheck
/**
 * 爱签 template/list：按模板编号查询模板，并返回模板预览地址（url/syncUrl）。
 * POST + JWT，JSON body:
 * - template_ident: string  模板编号（必填），请求爱签时映射为 bizData.templateIdent
 * - page?: number           页码，默认 1
 * - rows?: number           每页数量，默认 10
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAsignFormPost, isAsignBizSuccessResponse } from "../_shared/asign-client.ts";
import { corsHeaders } from "../_shared/cors.ts";

const FN_VERSION = "2026-04-17-get-template-list-v1";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const pickFirstString = (v: unknown): string | undefined => {
  if (typeof v === "string" && v.trim()) {
    return v.trim();
  }
  return undefined;
};

const pickTemplateIdent = (row: Record<string, unknown>): string | undefined =>
  pickFirstString(row.templateIdent) ??
  pickFirstString(row.templateident) ??
  pickFirstString(row.template_ident) ??
  pickFirstString(row.templateId) ??
  pickFirstString(row.templateid);

const extractListRows = (raw: unknown): Record<string, unknown>[] => {
  if (!raw || typeof raw !== "object") {
    return [];
  }
  const root = raw as Record<string, unknown>;
  const wrap = root.asign && typeof root.asign === "object"
    ? (root.asign as Record<string, unknown>)
    : root;
  const data = wrap.data && typeof wrap.data === "object"
    ? (wrap.data as Record<string, unknown>)
    : null;
  const list = data?.list;
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => item as Record<string, unknown>);
};

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
  const { data: canInitiateSigning, error: signPermErr } = await admin.rpc("has_permission", {
    user_id: callerId,
    permission_code: "signing_initiate",
  });
  if (permErr || signPermErr) return json({ ok: false, error: "权限校验失败", version: FN_VERSION }, 500);
  if (!isSuper && !canCreate && !canInitiateSigning) {
    return json(
      { ok: false, error: "无权限：需要「发起签署」或「文书模板管理」权限之一", version: FN_VERSION },
      403,
    );
  }

  let body: { template_ident?: string; page?: number; rows?: number };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const templateIdent = String(body.template_ident ?? "").trim();
  if (!templateIdent) {
    return json({ ok: false, error: "缺少 template_ident（爱签模板编号）", version: FN_VERSION }, 400);
  }
  const page = Math.max(1, Number(body.page) || 1);
  const rows = Math.min(100, Math.max(1, Number(body.rows) || 10));
  const listPath = (Deno.env.get("ASIGN_TEMPLATE_LIST_PATH") ?? "template/list").trim().replace(/^\/+/, "");

  const apiRes = await callAsignFormPost({
    path: listPath,
    bizDataInput: {
      page,
      rows,
      templateIdent,
    },
  });

  if (!apiRes.ok) {
    return json(
      {
        ok: false,
        error: "爱签 template/list 调用失败",
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

  const rowsData = extractListRows(apiRes.data);
  const matchedRow =
    rowsData.find((row) => (pickTemplateIdent(row) || "") === templateIdent) ??
    rowsData[0] ??
    null;
  const previewUrl = matchedRow ? pickFirstString(matchedRow.url) : undefined;
  const syncPreviewUrl = matchedRow
    ? (pickFirstString(matchedRow.syncUrl) ?? pickFirstString(matchedRow.sync_url))
    : undefined;

  return json({
    ok: true,
    version: FN_VERSION,
    template_ident: templateIdent,
    preview_url: previewUrl,
    sync_preview_url: syncPreviewUrl,
    row: matchedRow,
    data: apiRes.data,
  });
});
