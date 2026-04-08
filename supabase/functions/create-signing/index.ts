// @ts-nocheck
/**
 * 爱签相关环境变量（Deno.env，本地写在 supabase/functions/.env）：
 * - ASIGN_PRIVATE_KEY / ASIGN_APP_ID / ASIGN_BASE_URL
 * - ASIGN_NOTIFY_URL / ASIGN_CALLBACK_URL / ASIGN_REDIRECT_URL（公网 HTTPS；createContract 的 bizData）
 * - ASIGN_SIGN_HASH：SHA256（默认）或 SHA1 → 见 _shared/asign-client.ts
 * - ASIGN_SIGN_PLAINTEXT_MODE：kv_sorted（默认）或 bizdata_only 等
 * - contractFileStorage 模式需 SUPABASE_SERVICE_ROLE_KEY（仅用下载暂存 PDF，不参与爱签）
 *
 * 自建 Supabase：Edge 默认 CPU 极低（约 50ms/100ms 量级），大 PDF 勿用 JSON 内嵌 base64，
 * 请走前端 upload + contractFileStorage；或调整 edge-runtime 的 cpuTimeSoftLimitMs / cpuTimeHardLimitMs。
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  callAsignFormPost,
  isAsignAddStrangerBenignResponse,
  type AsignContractFile,
} from "../_shared/asign-client.ts";
import { corsHeaders } from "../_shared/cors.ts";

/**
 * 爱签 v2/user/addStranger：与 addSigner 同一 account；userType 以开放平台为准：1 企业、2 个人。
 */
type CreateSigningStranger = {
  account: string;
  /** 1 企业 2 个人 */
  userType: number;
  name?: string;
  idCard?: string;
  mobile?: string;
  companyName?: string;
  creditCode?: string;
};

type CreateSigningBody = {
  user_id?: string;
  document_id?: string;

  /** 创建合同前依次调用 v2/user/addStranger；成功后再 createContract */
  strangers?: CreateSigningStranger[];

  contractNo: string;
  contractName: string;
  validityTime?: number;
  autoContinue?: number;
  readSeconds?: number;
  redirectUrl?: string;
  refuseOn?: number;
  notifyUrl?: string;
  callbackUrl?: string;
  needAgree?: number;
  signOrder?: number;

  /** 优先：请求体极小，PDF 由 service_role 从 Storage 下载为 bytes，避免 JSON 内嵌 base64 触发 Edge CPU hard limit */
  contractFileStorage?: {
    bucket: string;
    path: string;
    filename: string;
    contentType?: string;
  };
  contractFiles?: AsignContractFile[];
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** 若爱签 data 内返回与请求不同的 contractNo，addSigner 必须用返回值，否则会参数异常 */
function extractEffectiveContractNo(asignApiBody: unknown, requestedContractNo: string): string {
  if (!asignApiBody || typeof asignApiBody !== "object") {
    return requestedContractNo;
  }
  const tryRead = (obj: Record<string, unknown>): string | null => {
    for (const key of ["contractNo", "contract_no", "contractNO"]) {
      const v = obj[key];
      if (typeof v === "string" && v.trim()) {
        return v.trim();
      }
    }
    return null;
  };
  const root = asignApiBody as Record<string, unknown>;
  let hit = tryRead(root);
  if (hit) {
    return hit;
  }
  const data = root.data;
  if (data && typeof data === "object") {
    hit = tryRead(data as Record<string, unknown>);
    if (hit) {
      return hit;
    }
  }
  return requestedContractNo;
}

/**
 * 与爱签 Node 官方示例一致：filterEmpty（去掉 null/undefined/''）再按 key 字典序排序后 JSON.stringify。
 */
function normalizeAsignPayload(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;
  const root = data as Record<string, unknown>;
  const inner = root.asign;
  if (inner && typeof inner === "object") {
    return inner as Record<string, unknown>;
  }
  return root;
}

/** 与 asign-client 中 callAsignFormPost + isAsignAddStrangerBenignResponse 一致（双层校验） */
function isAddStrangerBizOk(data: unknown): boolean {
  const asign = normalizeAsignPayload(data);
  if (!asign) return false;
  return isAsignAddStrangerBenignResponse(asign);
}

function strangerToBizData(s: CreateSigningStranger): Record<string, unknown> {
  const account = (s.account ?? "").trim();
  const userType = Number(s.userType);
  const row: Record<string, unknown> = { account, userType };
  if (userType === 1) {
    const cn = (s.companyName ?? "").trim();
    if (cn) row.companyName = cn;
    const cc = (s.creditCode ?? "").trim();
    if (cc) row.creditCode = cc;
  }
  const name = s.name;
  if (name && String(name).trim()) {
    row.name = String(name).trim();
  }
  const idc = (s.idCard ?? "").trim();
  if (idc) {
    row.idCard = idc;
  }
  const mobile = (s.mobile ?? "").trim();
  if (mobile) {
    row.mobile = mobile;
  }
  return row;
}

function bizDataRecordLikeNodeDemo(body: CreateSigningBody): Record<string, unknown> {
  const raw: Record<string, unknown> = {
    validityTime: body.validityTime ?? 30,
    autoContinue: body.autoContinue ?? 0,
    readSeconds: body.readSeconds ?? 2,
    redirectUrl: body.redirectUrl ?? Deno.env.get("ASIGN_REDIRECT_URL") ?? "",
    refuseOn: body.refuseOn ?? 0,
    contractNo: body.contractNo,
    notifyUrl: body.notifyUrl ?? Deno.env.get("ASIGN_NOTIFY_URL") ?? "",
    callbackUrl: body.callbackUrl ?? Deno.env.get("ASIGN_CALLBACK_URL") ?? "",
    contractName: body.contractName,
    needAgree: body.needAgree ?? 0,
    signOrder: body.signOrder ?? 1,
  };
  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(raw)) {
    const v = raw[key];
    if (v !== null && v !== undefined && v !== "") {
      filtered[key] = v;
    }
  }
  const sortedKeys = Object.keys(filtered).sort();
  const sorted: Record<string, unknown> = {};
  for (const k of sortedKeys) sorted[k] = filtered[k];
  return sorted;
}

async function loadContractFilesFromStorage(
  ref: NonNullable<CreateSigningBody["contractFileStorage"]>,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<AsignContractFile[]> {
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: blob, error } = await admin.storage.from(ref.bucket).download(ref.path);
  if (error) {
    throw new Error(error.message);
  }
  const ab = await blob.arrayBuffer();
  const bytes = new Uint8Array(ab);
  return [
    {
      filename: ref.filename,
      contentType: ref.contentType ?? "application/pdf",
      bytes,
    },
  ];
}

async function callAsignCreateContract(body: CreateSigningBody) {
  const bizDataInput = {
    validityTime: body.validityTime ?? 30,
    autoContinue: body.autoContinue ?? 0,
    readSeconds: body.readSeconds ?? 2,
    redirectUrl: body.redirectUrl ?? Deno.env.get("ASIGN_REDIRECT_URL") ?? "",
    refuseOn: body.refuseOn ?? 0,
    contractNo: body.contractNo,
    notifyUrl: body.notifyUrl ?? Deno.env.get("ASIGN_NOTIFY_URL") ?? "",
    callbackUrl: body.callbackUrl ?? Deno.env.get("ASIGN_CALLBACK_URL") ?? "",
    contractName: body.contractName,
    needAgree: body.needAgree ?? 0,
    signOrder: body.signOrder ?? 1,
  } as const;

  return callAsignFormPost({
    path: "contract/createContract",
    bizDataInput: { ...bizDataInput },
    keepEmptyStringKeys: ["redirectUrl", "notifyUrl", "callbackUrl"],
    strictBizDataOverride: bizDataRecordLikeNodeDemo(body),
    contractFiles: body.contractFiles,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return json({ error: "缺少 SUPABASE_URL / SUPABASE_ANON_KEY 环境变量" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    const bodyText = await req.text();
    let body: CreateSigningBody;
    try {
      body = JSON.parse(bodyText) as CreateSigningBody;
    } catch (parseErr) {
      const detail = parseErr instanceof Error ? parseErr.message : String(parseErr);
      return json({ ok: false, error: "请求体不是合法 JSON", detail }, 400);
    }
    if (!body?.contractNo || !body?.contractName) {
      return json({ error: "缺少 contractNo / contractName" }, 400);
    }

    const hasStorage = Boolean(body.contractFileStorage);
    const hasEmbedded = Boolean(body.contractFiles?.length);
    if (!hasStorage && !hasEmbedded) {
      return json({ error: "缺少合同 PDF：请传 contractFileStorage 或 contractFiles" }, 400);
    }
    if (hasStorage && hasEmbedded) {
      return json({ error: "请勿同时传 contractFileStorage 与 contractFiles" }, 400);
    }

    let contractFiles: AsignContractFile[] | undefined;
    const storageRef = body.contractFileStorage;

    if (storageRef) {
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
      if (!serviceRoleKey) {
        return json(
          {
            ok: false,
            error:
              "已使用 contractFileStorage，但未配置 SUPABASE_SERVICE_ROLE_KEY（请在 Functions 容器中注入与项目一致的 service_role key）",
          },
          200,
        );
      }
      try {
        contractFiles = await loadContractFilesFromStorage(storageRef, supabaseUrl, serviceRoleKey);
      } catch (e) {
        const detail = e instanceof Error ? e.message : String(e);
        return json({ ok: false, error: "从 Storage 读取 PDF 失败", detail }, 200);
      }
    } else {
      contractFiles = body.contractFiles;
    }

    const bodyForAsign: CreateSigningBody = { ...body, contractFiles };

    const strangersRaw = Array.isArray(body.strangers) ? body.strangers : [];
    const seenStrangerAccounts = new Set<string>();
    for (const s of strangersRaw) {
      const bizData = strangerToBizData(s);
      const acc = String(bizData.account ?? "").trim();
      if (!acc || seenStrangerAccounts.has(acc)) continue;
      seenStrangerAccounts.add(acc);
      const addRes = await callAsignFormPost({
        path: "v2/user/addStranger",
        bizDataInput: bizData,
      });
      if (!addRes.ok || !isAddStrangerBizOk(addRes.data)) {
        return json(
          {
            ok: false,
            error: "爱签 addStranger 调用失败",
            status: addRes.status,
            detail: addRes.data,
            debug: addRes.debug,
            failedStrangerAccount: acc,
          },
          200,
        );
      }
    }

    const asignResult = await callAsignCreateContract(bodyForAsign);
    if (!asignResult.ok) {
      const debug = asignResult.debug;
      let hint: string | undefined;
      if (debug?.missingPrivateKey) {
        hint =
          "未配置 ASIGN_PRIVATE_KEY（或本地未注入 secrets），未生成签名。请在 Supabase 设置 secrets 或检查 _shared/asign-client.ts 中 ASIGN_PRIVATE_KEY_FALLBACK（仅本地调试用）。";
      } else if (debug?.phase === "before_asign_fetch") {
        hint = debug.note;
      }
      return json(
        {
          ok: false,
          error: "爱签 createContract 调用失败",
          ...(hint && { hint }),
          status: asignResult.status,
          detail: asignResult.data,
          debug,
        },
        200,
      );
    }

    let signingInsert: unknown = null;
    if (body.user_id && body.document_id) {
      const { data, error } = await supabase.from("signings").insert([
        {
          user_id: body.user_id,
          document_id: body.document_id,
          status: "pending",
        },
      ]).select();

      if (error) {
        signingInsert = { ok: false, error };
      } else {
        signingInsert = { ok: true, data };
      }
    }

    const effectiveContractNo = extractEffectiveContractNo(asignResult.data, body.contractNo);

    if (asignResult.ok && storageRef) {
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
      if (serviceRoleKey) {
        const admin = createClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { error: rmErr } = await admin.storage.from(storageRef.bucket).remove([storageRef.path]);
        if (rmErr) {
          console.warn("create-signing: 删除暂存 PDF 失败", rmErr.message);
        }
      }
    }

    return json({
      asign: asignResult.data,
      signing: signingInsert,
      effectiveContractNo,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return json({
      ok: false,
      error: "create-signing 运行异常",
      detail: message,
    }, 200);
  }
});
