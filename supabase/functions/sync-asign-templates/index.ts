// @ts-nocheck
/**
 * 调用爱签 template/list，将模板写入 document_templates（含 asign_template_ident）。
 * POST + JWT，JSON body:
 * - company_id: string | null（null=通用模板，仅超管；有值须能访问该公司且有 template_create）
 * - category: 可选，默认 employment
 * - rows_per_page: 可选，默认 50
 * - max_pages: 可选，默认 20（最多拉取页数，防止死循环）
 * - template_ident: 可选，对应官方 bizData「templateIdent」，只拉指定模板编号
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  callAsignFormPost,
  isAsignBizSuccessResponse,
} from "../_shared/asign-client.ts";
import { corsHeaders } from "../_shared/cors.ts";

const LOG = "[SYNC_ASIGN_TEMPLATES]";
const FN_VERSION = "2026-04-13-sync-v1";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function tryParseJsonObject(maybe: unknown): Record<string, unknown> | null {
  if (maybe && typeof maybe === "object" && !Array.isArray(maybe)) {
    return maybe as Record<string, unknown>;
  }
  if (typeof maybe === "string") {
    const s = maybe.trim();
    if (!s.startsWith("{") && !s.startsWith("[")) return null;
    try {
      const p = JSON.parse(s) as unknown;
      if (p && typeof p === "object" && !Array.isArray(p)) return p as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  return null;
}

/** 从分页 data 里找「对象数组」：兼容 records / rows / list 及嵌套一层 */
function extractTemplateRows(payload: unknown): Record<string, unknown>[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  const wrap = root.asign && typeof root.asign === "object" ? (root.asign as Record<string, unknown>) : root;
  let dataLayer: Record<string, unknown> | unknown[] | null = wrap.data ?? wrap;
  const parsed = tryParseJsonObject(dataLayer);
  if (parsed) {
    dataLayer = parsed;
  }

  if (Array.isArray(dataLayer)) {
    return dataLayer.filter((x) => x && typeof x === "object") as Record<string, unknown>[];
  }

  if (!dataLayer || typeof dataLayer !== "object") return [];

  const dl = dataLayer as Record<string, unknown>;
  const keys = ["records", "rows", "list", "templates", "templateList", "data", "content"];
  for (const k of keys) {
    const v = dl[k];
    if (Array.isArray(v)) {
      return v.filter((x) => x && typeof x === "object") as Record<string, unknown>[];
    }
  }

  /** 嵌套：如 data.data.records */
  for (const v of Object.values(dl)) {
    const inner = tryParseJsonObject(v);
    if (!inner) continue;
    for (const k of keys) {
      const arr = inner[k];
      if (Array.isArray(arr) && arr.length > 0 && arr[0] && typeof arr[0] === "object") {
        return arr.filter((x) => x && typeof x === "object") as Record<string, unknown>[];
      }
    }
  }

  /** 最后一招：任意第一个「非空对象数组」 */
  for (const v of Object.values(dl)) {
    if (!Array.isArray(v) || v.length === 0) continue;
    const first = v[0];
    if (first && typeof first === "object" && !Array.isArray(first)) {
      return v.filter((x) => x && typeof x === "object") as Record<string, unknown>[];
    }
  }

  return [];
}

function pickIdent(row: Record<string, unknown>): string {
  /**
   * 爱签控制台「模板编号」多为 TN… 长串；接口字段在不同版本可能是 templateId / templateCode / templateIdent 等。
   */
  const keys = [
    "templateIdent",
    "template_ident",
    "templateId",
    "template_id",
    "templateCode",
    "template_code",
    "templateNumber",
    "template_number",
    "templateNo",
    "template_no",
    "ident",
    "number",
    "no",
    "id",
  ];
  for (const k of keys) {
    const v = row[k];
    if (v !== null && v !== undefined && String(v).trim() !== "") {
      return String(v).trim();
    }
  }
  return "";
}

function pickName(row: Record<string, unknown>): string {
  const keys = ["templateName", "template_name", "name", "title"];
  for (const k of keys) {
    const v = row[k];
    if (v !== null && v !== undefined && String(v).trim() !== "") {
      return String(v).trim();
    }
  }
  return "";
}

function pickType(row: Record<string, unknown>): number | null {
  const keys = ["templateType", "template_type", "type", "fileType", "file_type"];
  for (const k of keys) {
    const v = row[k];
    if (v === null || v === undefined || v === "") continue;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (s === "pdf" || s.includes("pdf")) return 2;
      if (s === "word" || s === "doc" || s === "docx" || s.includes("word")) return 1;
      if (s === "html" || s.includes("html")) return 3;
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "METHOD_NOT_ALLOWED", version: FN_VERSION }, 405);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();

  if (!supabaseUrl || !serviceKey) {
    return json({ ok: false, error: "缺少 SUPABASE_URL / SERVICE_ROLE_KEY", version: FN_VERSION }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return json({ ok: false, error: "未登录", version: FN_VERSION }, 401);
  }

  const { data: userData, error: authErr } = await admin.auth.getUser(token);
  if (authErr || !userData?.user) {
    console.warn(LOG, "getUser 失败", authErr);
    return json({ ok: false, error: "会话无效或已过期", version: FN_VERSION }, 401);
  }

  const callerId = userData.user.id;

  let body: {
    company_id?: string | null;
    category?: string;
    rows_per_page?: number;
    max_pages?: number;
    /** 与爱签请求示例一致：templateIdent，可选 */
    template_ident?: string | null;
    /** 为 true 时在响应里带 diagnostic（便于排查「同步 0 条」） */
    debug?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "请求体须为 JSON", version: FN_VERSION }, 400);
  }

  const companyIdRaw = body.company_id;
  const companyId =
    companyIdRaw === undefined || companyIdRaw === null || String(companyIdRaw).trim() === ""
      ? null
      : String(companyIdRaw).trim();

  const { data: isSuper, error: superErr } = await admin.rpc("is_super_admin", { uid: callerId });
  if (superErr) {
    console.error(LOG, "is_super_admin", superErr);
    return json({ ok: false, error: "权限校验失败", version: FN_VERSION }, 500);
  }

  const { data: canCreate, error: permErr } = await admin.rpc("has_permission", {
    user_id: callerId,
    permission_code: "template_create",
  });
  if (permErr) {
    console.error(LOG, "has_permission", permErr);
    return json({ ok: false, error: "权限校验失败", version: FN_VERSION }, 500);
  }

  if (!isSuper && !canCreate) {
    return json({ ok: false, error: "无文书模板创建权限", version: FN_VERSION }, 403);
  }

  if (companyId === null) {
    if (!isSuper) {
      return json({ ok: false, error: "仅超级管理员可将爱签模板同步为通用模板", version: FN_VERSION }, 403);
    }
  } else {
    const { data: canCo, error: coErr } = await admin.rpc("can_access_company_data", {
      user_id: callerId,
      target_company_id: companyId,
    });
    if (coErr) {
      console.error(LOG, "can_access_company_data", coErr);
      return json({ ok: false, error: "公司访问校验失败", version: FN_VERSION }, 500);
    }
    if (!isSuper && !canCo) {
      return json({ ok: false, error: "无权为该主体同步模板", version: FN_VERSION }, 403);
    }
  }

  const category = String(body.category ?? "employment").trim() || "employment";
  const rowsPerPage = Math.min(100, Math.max(1, Number(body.rows_per_page) || 50));
  const maxPages = Math.min(100, Math.max(1, Number(body.max_pages) || 20));
  const wantDebug = body.debug === true;

  const listPath = (Deno.env.get("ASIGN_TEMPLATE_LIST_PATH") ?? "template/list").trim().replace(/^\/+/, "");

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];
  let diagnostic: Record<string, unknown> | undefined;

  const sendCurrentSize = (Deno.env.get("ASIGN_TEMPLATE_LIST_SEND_CURRENT_SIZE") ?? "").trim() === "1";
  /** 官方请求示例仅为 page、rows（+ 可选 templateIdent）；pageNum/pageSize 默认不传，需时设 ASIGN_TEMPLATE_LIST_SEND_PAGENUM_SIZE=1 */
  const sendPageNumSize = (Deno.env.get("ASIGN_TEMPLATE_LIST_SEND_PAGENUM_SIZE") ?? "").trim() === "1";

  const templateIdentFilter = String(body.template_ident ?? "").trim();

  for (let page = 1; page <= maxPages; page += 1) {
    const biz: Record<string, unknown> = { page, rows: rowsPerPage };
    if (templateIdentFilter) {
      biz.templateIdent = templateIdentFilter;
    }
    if (sendPageNumSize) {
      biz.pageNum = page;
      biz.pageSize = rowsPerPage;
    }
    if (sendCurrentSize) {
      biz.current = page;
      biz.size = rowsPerPage;
    }
    const listRes = await callAsignFormPost({
      path: listPath,
      bizDataInput: biz,
    });

    if (!listRes.ok) {
      console.warn(LOG, "template/list 调用失败", { page, detail: listRes.data, debug: listRes.debug });
      return json(
        {
          ok: false,
          error: "爱签 template/list 调用失败",
          version: FN_VERSION,
          page,
          detail: listRes.data,
          debug: listRes.debug,
        },
        200,
      );
    }

    const asignRoot = listRes.data as Record<string, unknown>;
    const asignInner = (asignRoot?.asign ?? asignRoot) as Record<string, unknown>;
    if (!isAsignBizSuccessResponse(asignInner)) {
      console.warn(LOG, "template/list 业务未成功", { page, asignInner });
      return json(
        {
          ok: false,
          error: String(asignInner.msg ?? "爱签返回业务失败"),
          version: FN_VERSION,
          page,
          detail: listRes.data,
        },
        200,
      );
    }

    const rows = extractTemplateRows(listRes.data);
    if (page === 1 && (wantDebug || rows.length === 0)) {
      try {
        const raw = listRes.data as Record<string, unknown>;
        const wrap = raw?.asign && typeof raw.asign === "object" ? (raw.asign as Record<string, unknown>) : raw;
        const d = wrap?.data;
        const dObj = d && typeof d === "object" && !Array.isArray(d) ? (d as Record<string, unknown>) : null;
        const first = rows[0] as Record<string, unknown> | undefined;
        const listRaw = dObj?.list;
        const listLen = Array.isArray(listRaw) ? listRaw.length : -1;
        diagnostic = {
          listPath,
          page1_rowCount: rows.length,
          /** 文档：成功须看 code===100000，勿只靠 msg */
          responseCode: wrap?.code,
          responseMsg: typeof wrap?.msg === "string" ? String(wrap.msg).slice(0, 200) : wrap?.msg,
          dataTotal: dObj?.total,
          dataPageNum: dObj?.pageNum,
          dataPageSize: dObj?.pageSize,
          dataSize: dObj?.size,
          dataListArrayLength: listLen,
          topLevelKeys: raw && typeof raw === "object" ? Object.keys(raw).slice(0, 30) : [],
          dataLayerKeys: dObj ? Object.keys(dObj).slice(0, 30) : typeof d === "string" ? ["data_is_string"] : [],
          firstRowKeys: first && typeof first === "object" ? Object.keys(first).slice(0, 40) : [],
        };
        console.log(LOG, "第 1 页解析诊断", diagnostic);
      } catch (e) {
        diagnostic = { parseError: String(e) };
      }
    }
    if (rows.length === 0) {
      console.log(LOG, "本页无数据，结束分页", { page, listPath });
      break;
    }

    for (const row of rows) {
      const ident = pickIdent(row);
      const name = pickName(row);
      const templateType = pickType(row);

      if (!ident) {
        skipped += 1;
        continue;
      }
      const displayName = name || `爱签模板 ${ident}`;

      let matchQuery = admin
        .from("document_templates")
        .select("id")
        .eq("asign_template_ident", ident)
        .eq("is_active", true);

      if (companyId === null) {
        matchQuery = matchQuery.is("company_id", null);
      } else {
        matchQuery = matchQuery.eq("company_id", companyId);
      }

      const { data: existingRow, error: findErr2 } = await matchQuery.maybeSingle();
      if (findErr2) {
        errors.push(`${ident}: ${findErr2.message}`);
        continue;
      }

      if (existingRow?.id) {
        const { error: upErr } = await admin
          .from("document_templates")
          .update({
            name: displayName,
            asign_template_type: templateType,
            category,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingRow.id);
        if (upErr) {
          errors.push(`${ident}: ${upErr.message}`);
        } else {
          updated += 1;
        }
      } else {
        const { error: insErr } = await admin.from("document_templates").insert({
          company_id: companyId,
          name: displayName,
          category,
          requires_company_signature: true,
          is_active: true,
          asign_template_ident: ident,
          asign_template_type: templateType,
        });
        if (insErr) {
          errors.push(`${ident}: ${insErr.message}`);
        } else {
          inserted += 1;
        }
      }
    }

    if (rows.length < rowsPerPage) {
      break;
    }
  }

  console.log(LOG, "完成", { version: FN_VERSION, inserted, updated, skipped, errorCount: errors.length });

  const totalTouched = inserted + updated + skipped;
  const out: Record<string, unknown> = {
    ok: true,
    version: FN_VERSION,
    inserted,
    updated,
    skipped,
    errors: errors.slice(0, 50),
    has_more_errors: errors.length > 50,
  };
  if (wantDebug || totalTouched === 0) {
    out.diagnostic = diagnostic ?? { note: "无第 1 页诊断数据" };
  }

  return json(out);
});
