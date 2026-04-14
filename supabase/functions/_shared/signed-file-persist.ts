/**
 * 将已签署 PDF 写入 Storage，并回填 signing_records / signed_documents。
 * asign-notify 与本地上传共用同一套「落库」逻辑（本文件仅在 Edge 中使用）。
 */
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const LOG = "[ASIGN_NOTIFY]";

export function sanitizeStorageSegment(s: string): string {
  return s.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

function normalizePublicStorageUrl(rawUrl: string): string {
  const input = String(rawUrl || "").trim();
  if (!input) return input;

  const preferredBase = (Deno.env.get("SUPABASE_PUBLIC_URL") ?? "").trim();
  const adminBase = (Deno.env.get("SUPABASE_ADMIN_URL") ?? "").trim();
  const supabaseBase = (Deno.env.get("SUPABASE_URL") ?? "").trim();
  const notifyUrl = (Deno.env.get("ASIGN_NOTIFY_URL") ?? "").trim();
  const notifyOrigin = (() => {
    if (!notifyUrl) return "";
    try {
      const u = new URL(notifyUrl);
      return `${u.protocol}//${u.host}`;
    } catch {
      return "";
    }
  })();
  const blockedHosts = new Set([
    "kong",
    "kong:8000",
    "localhost",
    "localhost:8000",
    "127.0.0.1",
    "127.0.0.1:8000",
  ]);

  let pathPart = "";
  let inputHost = "";
  try {
    const u = new URL(input);
    inputHost = u.host.toLowerCase();
    pathPart = `${u.pathname}${u.search}`;
  } catch {
    // 非完整 URL，原样返回
    return input;
  }

  const candidates = [preferredBase, notifyOrigin, supabaseBase, adminBase].filter(Boolean);
  for (const base of candidates) {
    try {
      const b = new URL(base);
      const host = b.host.toLowerCase();
      // 跳过内网/本地域名，继续尝试下一个候选。
      if (blockedHosts.has(host)) {
        continue;
      }
      return `${b.protocol}//${b.host}${pathPart}`;
    } catch {
      // ignore invalid base and continue
    }
  }

  // 若原始 URL 已是公网域名，则保留；否则只能原样返回（等待环境变量修复）。
  if (!blockedHosts.has(inputHost)) {
    return input;
  }
  return input;
}

export type PersistSignedPdfResult =
  | { ok: true; publicUrl: string; updatedRecordCount: number }
  | { ok: false; error: string };

/**
 * @param uploadedBy 爱签回调无用户 id 时可传 null
 */
export async function uploadPdfBytesAndAttachToSigningRecords(
  admin: SupabaseClient,
  pdfBytes: Uint8Array,
  opts: {
    contractNo?: string | null;
    signingRecordIds?: string[];
    uploadedBy: string | null;
    fileNamePrefix?: string;
  },
): Promise<PersistSignedPdfResult> {
  let recordIds = opts.signingRecordIds;
  if ((!recordIds || recordIds.length === 0) && opts.contractNo) {
    const cn = String(opts.contractNo).trim();
    if (!cn) {
      return { ok: false, error: "[stage=resolve_contract_no] contractNo 为空" };
    }
    const { data: rows, error } = await admin
      .from("signing_records")
      .select("id")
      .eq("third_party_contract_no", cn);

    if (error) {
      return { ok: false, error: `[stage=query_signing_records] ${error.message}` };
    }
    recordIds = (rows ?? []).map((r: { id: string }) => r.id);
  }

  if (!recordIds || recordIds.length === 0) {
    return { ok: false, error: "[stage=query_signing_records] 未找到匹配的签署记录（请核对 third_party_contract_no）" };
  }

  const prefix = opts.fileNamePrefix ?? "asign";
  const keyPart = opts.contractNo
    ? sanitizeStorageSegment(String(opts.contractNo))
    : sanitizeStorageSegment(recordIds[0].slice(0, 8));
  const path = `signed/${prefix}_${keyPart}_${Date.now()}.pdf`;

  const { error: upErr } = await admin.storage.from("signed-documents").upload(path, pdfBytes, {
    cacheControl: "3600",
    upsert: false,
    contentType: "application/pdf",
  });

  if (upErr) {
    return { ok: false, error: `[stage=storage_upload] ${upErr.message}` };
  }

  const { data: pub } = admin.storage.from("signed-documents").getPublicUrl(path);
  console.log(LOG, "URL规范化入参", {
    rawPublicUrl: pub.publicUrl,
    supabasePublicUrl: (Deno.env.get("SUPABASE_PUBLIC_URL") ?? "").trim(),
    notifyOrigin: (() => {
      const s = (Deno.env.get("ASIGN_NOTIFY_URL") ?? "").trim();
      if (!s) return "";
      try {
        const u = new URL(s);
        return `${u.protocol}//${u.host}`;
      } catch {
        return "";
      }
    })(),
    supabaseUrl: (Deno.env.get("SUPABASE_URL") ?? "").trim(),
    supabaseAdminUrl: (Deno.env.get("SUPABASE_ADMIN_URL") ?? "").trim(),
  });
  const publicUrl = normalizePublicStorageUrl(pub.publicUrl);
  console.log(LOG, "URL规范化结果", { normalizedPublicUrl: publicUrl });
  const now = new Date().toISOString();
  const size = pdfBytes.byteLength;

  const { error: updRecErr } = await admin
    .from("signing_records")
    .update({
      signed_file_url: publicUrl,
      uploaded_at: now,
      uploaded_by: opts.uploadedBy,
      completed_at: now,
    })
    .in("id", recordIds);

  if (updRecErr) {
    return { ok: false, error: `[stage=update_signing_records] ${updRecErr.message}` };
  }

  for (const rid of recordIds) {
    const { error: docError } = await admin
      .from("signed_documents")
      .update({
        file_url: publicUrl,
        file_size: size,
        signed_at: now,
        completed_at: now,
      })
      .eq("signing_record_id", rid);

    if (docError) {
      console.warn(LOG, "更新 signed_documents 失败", rid, docError.message);
    }
  }

  return { ok: true, publicUrl, updatedRecordCount: recordIds.length };
}

/**
 * 爱签若仅返回短期有效的下载直链且 Edge 无法拉取二进制时，可直接把 URL 写入库（链接过期风险由业务自担）。
 */
export async function applyExternalSignedFileUrlToSigningRecords(
  admin: SupabaseClient,
  contractNo: string,
  fileUrl: string,
  uploadedBy: string | null,
): Promise<PersistSignedPdfResult> {
  const cn = String(contractNo).trim();
  if (!cn) {
    return { ok: false, error: "[stage=resolve_contract_no] contractNo 为空" };
  }
  const url = String(fileUrl).trim();
  if (!url || !/^https?:\/\//i.test(url)) {
    return { ok: false, error: "[stage=validate_file_url] fileUrl 非法" };
  }

  const { data: rows, error } = await admin
    .from("signing_records")
    .select("id")
    .eq("third_party_contract_no", cn);

  if (error) {
    return { ok: false, error: `[stage=query_signing_records] ${error.message}` };
  }
  const recordIds = (rows ?? []).map((r: { id: string }) => r.id);
  if (recordIds.length === 0) {
    return { ok: false, error: "[stage=query_signing_records] 未找到匹配的签署记录" };
  }

  const now = new Date().toISOString();
  const { error: updRecErr } = await admin
    .from("signing_records")
    .update({
      signed_file_url: url,
      uploaded_at: now,
      uploaded_by: uploadedBy,
      completed_at: now,
    })
    .in("id", recordIds);

  if (updRecErr) {
    return { ok: false, error: `[stage=update_signing_records] ${updRecErr.message}` };
  }

  for (const rid of recordIds) {
    const { error: docError } = await admin
      .from("signed_documents")
      .update({
        file_url: url,
        signed_at: now,
        completed_at: now,
      })
      .eq("signing_record_id", rid);

    if (docError) {
      console.warn(LOG, "更新 signed_documents(URL) 失败", rid, docError.message);
    }
  }

  return { ok: true, publicUrl: url, updatedRecordCount: recordIds.length };
}

