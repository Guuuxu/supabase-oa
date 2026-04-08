/**
 * 爱签 OpenAPI 通用客户端：FormData + bizData + RSA 签名（与 create-signing 逻辑一致）。
 * 环境变量：ASIGN_PRIVATE_KEY / ASIGN_APP_ID / ASIGN_BASE_URL / ASIGN_SIGN_* 等同 create-signing。
 * ASIGN_BIZDATA_DEEP_SORT_KEYS：默认 1，对 bizData 嵌套对象递归按 key 排序再 JSON.stringify，缓解 addSigner 等 100016；若 create 异常可设 0。
 */
import md5 from "https://esm.sh/md5@2.3.0";
import { decodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

/** 仅本地临时兜底，勿提交私钥；优先 ASIGN_PRIVATE_KEY */
export const ASIGN_PRIVATE_KEY_FALLBACK =
  "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCeoodWSIfw7nNiieByJbmDVWWicJSd+6qaDhiXzECuxpmYTSdKXRBuF8h892TG86MrifOq2ftK+BWK0CcwA9u0TEFufsjEMS8LS/JhPUBQ7GRrq1JEuosryG/s+adFW4Iyt9b0PNnt68VsR8159hTKf8z1VH3iGLDrZ+6pZXXrdyS7E+TPxlUSqc/PbTWh5zoH2UEELzKrBtfAMz9OZVyLiDyLtlv6tNikluWiIbRI9xbP7WQTCMIC/7s0RiP0Y0XstJJ7S4PlB0GbhKeGHr7RW7iL0BqKN0017IvIPz4TiH/vjrQ17jZs8DWqtPevm67QKfdninacb7HUhH5PH1nBAgMBAAECggEAaOzvv25yHDZcM40m29l//xJ5CxyT8HsJuKQiOCVtkyzhYw+FMXak62znu2CXU9DK2H2CojtUL54wAYT0ppmmtHbLwJ4zhTFTAJHXW+H7rIrvURgcbkFE1EzbW082CHYihBF9KEcnjmsoRhqoGkdeMSKfGpYsPWQ/gTVZcsodWQSGsAHgyDK7haNHIjG0gL8jRGqFuqLQpJBUQ9qCuRJUkqeWwMtnZKJHXF15jYJrfLnpqhDvCBp/IU9+At3aTAql4RWwl0e6k8FFtno6/gTQnuyDXVDouf7FCt2kbfzDrtjeev4TwX63a1M+fZvsK5LqJKIiIq8tR1Zf9ESQxTbPUQKBgQDNd0jPV8J1nCFrvsDj8fI4MhbSEdHJYlqTT4h9nZrEw7782+fSyvVc6PQLjK+Z5TFnWX5rO3h4ahkybp/uB8dIGyAs1pnggt2LGYWY3ySlreE9xMV+D9IMwhiwupAOkbMxvmwOCALVgnoaK7z6dD03e26EtiVX9EekQsGENGzdLwKBgQDFpqCtI2zCeca0BP+e5Uylx5lRLNoGkWbVyjpqQ+JZAkZw8B5tT7ktE76AuY2kL7kUkXdaBR94OtGz9tUqdL3nBja5DLP9UYKAlBd5eRQ7pyswJHG8eEW+orn+LsXUd5/7IpSW07yZn0EcXW8Jlu+wVd1OhYsa+wDqDHqXNXbcDwKBgCcOp86SVirZNRkwN6adFXhNPT1Nmd14TtN16PJIBWWl+CZE/zp4zk+NEOcpJTBR+yQ0RO3JbkslkAigMtKis+UnEuSzHqko90g738OBl4vPE+QUBZ7DDyDRvLPLoxrB45hvJEc+iptfpCpZaiEJ+6ESW53qqgqgKwY0kmi5NoCNAoGAfsD+eCqovAt2p8ow2Ij637Iim9FkvSOQTHjVf4KrbSOtYw5KpRWkjskDue/Fa08DpbIoVX3Fkcg+5efdCs41Xyw3+fKwlzsnsyfF6iwBEsSBSO2GVzTWnYwkNWNvkXNqEJc7rYJ6iBZ+nh85b2/xpSdbttijvhjMnEyGbeRmpncCgYBddcdByOYjQ+bquEdsnEBU67kvdfCw1kF+j+Mfhuq5tfL9KR9+bL7/7y1Cp924DWIt0VFdNBueEsI0SmG0eKx+VHd6aEOhTZqpWY+N3urDTl3/vV5Ywsl0pyYnPVZyvAgcI4D6JWh/V2t+zXS1yd4d/jxQu/JArmBUhgThv78L8g==";

/** 爱签业务成功：常见为 0；不少接口返回 100000 + msg「成功」；部分环境为 10000 */
export function isAsignBizSuccessCode(code: unknown): boolean {
  if (code === 0 || code === "0") return true;
  if (code === 10000 || code === "10000") return true;
  if (code === 100000 || code === "100000") return true;
  return false;
}

/** 部分接口（如 addSigner）在失败时仍返回 code 0，需结合 msg 判断 */
export function isAsignBizFailureMessage(msg: unknown): boolean {
  if (msg === null || msg === undefined) return false;
  const s = String(msg);
  return /参数异常|签名不匹配|不匹配|失败|错误|无效|不存在|未通过|请仔细核对/.test(s);
}

/** 综合 code + msg 判断业务是否成功（用于 HTTP 200 但业务失败的情况） */
export function isAsignBizSuccessResponse(asign: Record<string, unknown>): boolean {
  if (!asign || typeof asign !== "object") return false;
  if (isAsignBizFailureMessage(asign.msg)) return false;
  return isAsignBizSuccessCode(asign.code);
}

/**
 * v2/user/addStranger：HTTP 200 但 code 非 0 时仍可能需继续流程（如 100021 用户已存在）。
 * 须与 callAsignFormPost 中 path 含 addStranger 时的放行逻辑一致。
 */
export function isAsignAddStrangerBenignResponse(asign: Record<string, unknown>): boolean {
  if (!asign || typeof asign !== "object") return false;
  if (isAsignBizSuccessResponse(asign)) return true;

  const codeStr = String(asign.code ?? "");
  /** 爱签开放平台：100021 用户已存在；31100/31105 等兼容 */
  const benignCodes = ["100021", "31100", "31105"];
  if (benignCodes.includes(codeStr)) return true;

  const msg = String(asign.msg ?? "");
  if (
    /已存在|已认证|已实名|实名认证|重复添加|已是正式用户|无需.*添加|用户已注册|不能重复|请勿重复/.test(msg)
  ) {
    return true;
  }
  if (/already\s+(registered|verified|authenticated|exists)/i.test(msg)) {
    return true;
  }
  return false;
}

function base64ToBytes(base64: string): Uint8Array {
  const normalized = normalizeBase64(base64.trim());
  return decodeBase64(normalized);
}

function normalizeBase64(input: string) {
  let normalized = input.trim().replace(/\s+/g, "");
  normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = normalized.length % 4;
  if (padLen > 0) normalized += "=".repeat(4 - padLen);
  return normalized;
}

export function sortAndFilterObject(
  input: Record<string, unknown>,
  opts?: { keepEmptyStringKeys?: string[] },
) {
  const keepEmpty = new Set(opts?.keepEmptyStringKeys ?? []);
  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(input)) {
    const value = input[key];
    if (value === null || value === undefined) continue;
    if (value === "" && !keepEmpty.has(key)) continue;
    filtered[key] = value;
  }
  const sortedKeys = Object.keys(filtered).sort();
  const sorted: Record<string, unknown> = {};
  for (const key of sortedKeys) sorted[key] = filtered[key];
  return sorted;
}

export function filterObjectKeepOrder(
  input: Record<string, unknown>,
  opts?: { keepEmptyStringKeys?: string[] },
) {
  const keepEmpty = new Set(opts?.keepEmptyStringKeys ?? []);
  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(input)) {
    const value = input[key];
    if (value === null || value === undefined) continue;
    if (value === "" && !keepEmpty.has(key)) continue;
    filtered[key] = value;
  }
  return filtered;
}

type BizDataOrder = "sorted" | "unsorted";
function getAsignBizDataOrder(): BizDataOrder {
  const raw = (Deno.env.get("ASIGN_BIZDATA_ORDER") ?? "sorted").trim().toLowerCase();
  if (raw === "unsorted" || raw === "unsort") return "unsorted";
  return "sorted";
}

export type RsaHashName = "SHA-256" | "SHA-1";

export type AsignSignPlaintextMode =
  | "kv_sorted"
  | "bizdata_only"
  | "app_biz_only"
  | "app_biz_content_only"
  | "app_biz_content_only_urlencode"
  | "app_biz_md5_concat"
  | "official_concat";

function getAsignSignHash(): RsaHashName {
  const raw = (Deno.env.get("ASIGN_SIGN_HASH") ?? "sha1").trim().toUpperCase();
  if (raw === "SHA1" || raw === "SHA-1") return "SHA-1";
  return "SHA-256";
}

function getAsignSignPlaintextMode(): AsignSignPlaintextMode {
  const raw = (Deno.env.get("ASIGN_SIGN_PLAINTEXT_MODE") ?? "app_biz_only").trim().toLowerCase();
  if (raw === "bizdata_only" || raw === "bizdata") return "bizdata_only";
  if (raw === "app_biz_only" || raw === "appbizonly" || raw === "app_biz") return "app_biz_only";
  if (raw === "app_biz_content_only" || raw === "appbizcontentonly") return "app_biz_content_only";
  if (raw === "app_biz_content_only_urlencode" || raw === "appbizcontentonlyurlencode") {
    return "app_biz_content_only_urlencode";
  }
  if (raw === "app_biz_md5_concat" || raw === "appbizmd5concat") return "app_biz_md5_concat";
  if (raw === "official_concat" || raw === "node_demo" || raw === "json_md5_appid_time") {
    return "official_concat";
  }
  return "kv_sorted";
}

function md5Hex(input: string) {
  return md5(input);
}

type SignBase64Encoding = "base64" | "base64url";
function getAsignSignEncoding(): SignBase64Encoding {
  const raw = (Deno.env.get("ASIGN_SIGN_ENCODING") ?? "base64").trim().toLowerCase();
  if (raw === "base64url" || raw === "base64-url" || raw === "urlsafe") return "base64url";
  return "base64";
}

function toBase64Url(b64: string) {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/** 同一 isolate 内复用 CryptoKey，避免每个签名校验 attempt 都 importKey（Edge CPU 敏感） */
let rsaPrivateKeyCache: {
  material: string;
  hash: RsaHashName;
  key: CryptoKey;
} | null = null;

async function getCachedRsaPrivateKey(
  privateKeyMaterial: string,
  hash: RsaHashName,
): Promise<CryptoKey> {
  const trimmed = privateKeyMaterial.trim();
  if (
    rsaPrivateKeyCache &&
    rsaPrivateKeyCache.hash === hash &&
    rsaPrivateKeyCache.material === trimmed
  ) {
    return rsaPrivateKeyCache.key;
  }
  const key = await importPrivateKeyForRsa(trimmed, hash);
  rsaPrivateKeyCache = { material: trimmed, hash, key };
  return key;
}

async function importPrivateKeyForRsa(
  privateKeyMaterial: string,
  hash: RsaHashName,
): Promise<CryptoKey> {
  const trimmed = privateKeyMaterial.trim();
  let derBytes: Uint8Array;
  if (trimmed.includes("BEGIN")) {
    const b64 = trimmed
      .replace(/-----BEGIN[\w\s-]+-----/g, "")
      .replace(/-----END[\w\s-]+-----/g, "")
      .replace(/\s/g, "");
    try {
      derBytes = base64ToBytes(normalizeBase64(b64));
    } catch {
      throw new Error("ASIGN 私钥 PEM 内容不是合法 base64，请检查 ASIGN_PRIVATE_KEY");
    }
  } else {
    try {
      derBytes = base64ToBytes(normalizeBase64(trimmed));
    } catch {
      throw new Error("ASIGN 私钥不是合法 base64，请检查 ASIGN_PRIVATE_KEY / ASIGN_PRIVATE_KEY_FALLBACK");
    }
  }
  return await crypto.subtle.importKey(
    "pkcs8",
    derBytes.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash },
    false,
    ["sign"],
  );
}

async function rsaSignBase64(
  signStr: string,
  privateKeyMaterial: string,
  hash: RsaHashName,
): Promise<string> {
  const cryptoKey = await getCachedRsaPrivateKey(privateKeyMaterial, hash);
  const data = new TextEncoder().encode(signStr);
  const signed = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, data);
  const bytes = new Uint8Array(signed);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function generateSignKvSorted(
  params: Record<string, unknown>,
  privateKeyMaterial: string,
  hash: RsaHashName,
): Promise<{ sign: string; signStr: string }> {
  const sortedKeys = Object.keys(params)
    .filter((key) => key !== "sign" && params[key] !== undefined && params[key] !== null)
    .sort();
  const str = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  const sign = await rsaSignBase64(str, privateKeyMaterial, hash);
  return { sign, signStr: str };
}

/**
 * 递归对对象 key 做字典序排序后再序列化，数组保持元素顺序、元素递归处理。
 * addSigner 等含 signStrategyList 嵌套对象时，部分环境验签会对内层 key 排序；仅排顶层易导致 100016「签名不匹配」。
 */
export function deepSortJsonKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepSortJsonKeys(item));
  }
  const obj = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = deepSortJsonKeys(obj[key]);
  }
  return sorted;
}

/** 与爱签 Node 官方示例一致：去掉 null/undefined/'' 再按 key 字典序 */
export function bizDataRecordLikeNodeDemoGeneric(raw: Record<string, unknown>): Record<string, unknown> {
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

export function getAsignBaseUrl() {
  let baseUrl = Deno.env.get("ASIGN_BASE_URL")?.trim();
  if (!baseUrl) {
    baseUrl = "https://prev.asign.cn";
  }
  return baseUrl.replace(/\/+$/, "");
}

export async function buildAsignHeaders(
  bizDataJson: string,
  appId: string,
  timestamp: string,
  overrides?: {
    signHash?: RsaHashName;
    signPlaintextMode?: AsignSignPlaintextMode;
    signEncoding?: SignBase64Encoding;
    headerMode?: "full" | "sign_only";
  },
): Promise<{
  headers: Record<string, string>;
  signStr: string;
  missingPrivateKey?: boolean;
  signHash: RsaHashName;
  signPlaintextMode: AsignSignPlaintextMode;
  privateKeySource: "env" | "fallback" | "none";
}> {
  const envPrivateKey = (Deno.env.get("ASIGN_PRIVATE_KEY") ?? "").trim();
  const fallbackPrivateKey = (ASIGN_PRIVATE_KEY_FALLBACK || "").trim();
  const privateKey = envPrivateKey || fallbackPrivateKey;
  const privateKeySource = envPrivateKey ? "env" : (fallbackPrivateKey ? "fallback" : "none");

  let hash = getAsignSignHash();
  let mode = getAsignSignPlaintextMode();
  if (overrides) {
    if (overrides.signHash) hash = overrides.signHash;
    if (overrides.signPlaintextMode) mode = overrides.signPlaintextMode;
  }

  if (!privateKey) {
    return {
      headers: {},
      signStr: "",
      missingPrivateKey: true,
      signHash: hash,
      signPlaintextMode: mode,
      privateKeySource,
    };
  }

  let signStr = "";
  let sign = "";
  if (mode === "bizdata_only") {
    signStr = bizDataJson;
    sign = await rsaSignBase64(signStr, privateKey, hash);
  } else if (mode === "app_biz_only") {
    signStr = `appId=${appId}&bizData=${bizDataJson}`;
    sign = await rsaSignBase64(signStr, privateKey, hash);
  } else if (mode === "app_biz_content_only") {
    signStr = `appId=${appId}&biz_content=${bizDataJson}`;
    sign = await rsaSignBase64(signStr, privateKey, hash);
  } else if (mode === "app_biz_content_only_urlencode") {
    signStr = `appId=${appId}&biz_content=${encodeURIComponent(bizDataJson)}`;
    sign = await rsaSignBase64(signStr, privateKey, hash);
  } else if (mode === "app_biz_md5_concat") {
    const bizMd5 = md5Hex(bizDataJson);
    signStr = `appId=${appId}&bizData=${bizDataJson}&md5=${bizMd5}&timestamp=${timestamp}`;
    sign = await rsaSignBase64(signStr, privateKey, hash);
  } else if (mode === "official_concat") {
    const bizMd5 = md5Hex(bizDataJson);
    signStr = `${bizDataJson}${bizMd5}${appId}${timestamp}`;
    sign = await rsaSignBase64(signStr, privateKey, hash);
  } else {
    const params: Record<string, unknown> = { bizData: bizDataJson, appId, timestamp };
    const out = await generateSignKvSorted(params, privateKey, hash);
    signStr = out.signStr;
    sign = out.sign;
  }

  const signEncoding: SignBase64Encoding = overrides?.signEncoding ?? getAsignSignEncoding();
  if (signEncoding === "base64url") {
    sign = toBase64Url(sign);
  }

  const headerMode = overrides?.headerMode ?? "full";
  const headers =
    headerMode === "sign_only"
      ? { sign }
      : { sign, appId, timestamp };

  return {
    headers,
    signStr,
    signHash: hash,
    signPlaintextMode: mode,
    privateKeySource,
  };
}

export type AsignContractFile = {
  filename: string;
  contentType?: string;
  /** 与 bytes 二选一；嵌在 JSON 里会急剧增加 Edge CPU（解析 + 解码） */
  base64?: string;
  /** 已从 Storage 等得到的原始字节，优先于 base64 */
  bytes?: Uint8Array;
};

export type CallAsignFormPostArgs = {
  /** 相对路径，如 contract/createContract（不要前导 /） */
  path: string;
  /**
   * 对象根 bizData（多数接口）。与 bizDataInputArray **二选一**。
   */
  bizDataInput?: Record<string, unknown>;
  /**
   * 根为 **JSON 数组** 的 bizData（爱签 `contract/addSigner` 官方示例：`[{ contractNo, account, signStrategyList, signType }, ...]`）。
   * 传此字段时不要传 bizDataInput；strictBizDataOverride 在数组模式下忽略，按元素分别做 Node 式过滤排序。
   */
  bizDataInputArray?: Record<string, unknown>[];
  keepEmptyStringKeys?: string[];
  /** official_concat 尝试用的严格 JSON；不传则用 bizDataRecordLikeNodeDemoGeneric；仅对象根时生效 */
  strictBizDataOverride?: Record<string, unknown>;
  contractFiles?: AsignContractFile[];
};

type AsignAttemptSpec = {
  tag: string;
  timestamp: string;
  signHash: RsaHashName;
  signPlaintextMode: AsignSignPlaintextMode;
  signEncoding?: SignBase64Encoding;
  timestampMode?: "static" | "ms" | "ms_plus_600";
  useOfficialBizJson?: boolean;
  headerMode?: "full" | "sign_only";
};

export async function callAsignFormPost(args: CallAsignFormPostArgs) {
  const pathClean = args.path.replace(/^\/+/, "");
  const url = `${getAsignBaseUrl()}/${pathClean}`;

  const appId = Deno.env.get("ASIGN_APP_ID")?.trim() || "997407968";
  if (!appId) {
    return {
      ok: false as const,
      status: 500,
      data: { code: "LOCAL_MISSING_APP_ID", msg: "缺少环境变量 ASIGN_APP_ID" },
      debug: { url },
    };
  }

  const keepEmpty = args.keepEmptyStringKeys ?? [];
  const bizDataOrder = getAsignBizDataOrder();
  const deepSortRaw = (Deno.env.get("ASIGN_BIZDATA_DEEP_SORT_KEYS") ?? "1").trim();
  const useDeepSort = deepSortRaw !== "0" && deepSortRaw.toLowerCase() !== "false";

  const hasArray = args.bizDataInputArray !== undefined;
  const hasObject = args.bizDataInput !== undefined;
  if (hasArray === hasObject) {
    return {
      ok: false as const,
      status: 500,
      data: {
        code: "LOCAL_INVALID_BIZDATA",
        msg: "callAsignFormPost: 请只传 bizDataInput 或 bizDataInputArray 之一",
      },
      debug: { url },
    };
  }

  let bizDataJson: string;
  let bizDataJsonStrict: string;
  let bizData: unknown;

  if (hasArray) {
    const arr = args.bizDataInputArray!;
    if (!Array.isArray(arr)) {
      return {
        ok: false as const,
        status: 500,
        data: { code: "LOCAL_INVALID_BIZDATA", msg: "bizDataInputArray 须为数组" },
        debug: { url },
      };
    }
    const prepRow = (item: Record<string, unknown>) => {
      return bizDataOrder === "unsorted"
        ? filterObjectKeepOrder({ ...item }, { keepEmptyStringKeys: keepEmpty })
        : sortAndFilterObject({ ...item }, { keepEmptyStringKeys: keepEmpty });
    };
    const bizDataForSign = arr.map((item) => prepRow(item as Record<string, unknown>));
    const bizDataForJson = useDeepSort ? deepSortJsonKeys(bizDataForSign) : bizDataForSign;
    bizDataJson = JSON.stringify(bizDataForJson);
    const strictItems = arr.map((item) =>
      bizDataRecordLikeNodeDemoGeneric({ ...item as Record<string, unknown> })
    );
    const strictForJson = useDeepSort ? deepSortJsonKeys(strictItems) : strictItems;
    bizDataJsonStrict = JSON.stringify(strictForJson);
    bizData = bizDataForJson;
  } else {
    const input = args.bizDataInput!;
    let bizDataForSign: Record<string, unknown>;
    if (bizDataOrder === "unsorted") {
      bizDataForSign = filterObjectKeepOrder({ ...input }, { keepEmptyStringKeys: keepEmpty });
    } else {
      bizDataForSign = sortAndFilterObject({ ...input }, { keepEmptyStringKeys: keepEmpty });
    }
    const bizDataForJson = useDeepSort
      ? (deepSortJsonKeys(bizDataForSign) as Record<string, unknown>)
      : bizDataForSign;
    bizDataJson = JSON.stringify(bizDataForJson);
    const strictBase = args.strictBizDataOverride ?? bizDataRecordLikeNodeDemoGeneric({ ...input });
    const strictForJson = useDeepSort
      ? (deepSortJsonKeys(strictBase) as Record<string, unknown>)
      : strictBase;
    bizDataJsonStrict = JSON.stringify(strictForJson);
    bizData = bizDataForJson;
  }

  const timestampSec = String(Math.floor(Date.now() / 1000));
  const timestampMs = String(Date.now());

  const envHash = getAsignSignHash();
  const envMode = getAsignSignPlaintextMode();
  let otherHash: RsaHashName = "SHA-256";
  if (envHash === "SHA-1") {
    otherHash = "SHA-256";
  } else {
    otherHash = "SHA-1";
  }

  let altMode: AsignSignPlaintextMode = "kv_sorted";
  if (envMode === "kv_sorted") {
    altMode = "app_biz_only";
  } else {
    altMode = "kv_sorted";
  }

  /**
   * 先轻量四式，再爱签 Node 官方式 official_concat（MD5 拼接 + RSA-SHA1）；大 PDF + 多路重试易触 Edge CPU，
   * 可设 ASIGN_MAX_ATTEMPTS_WITH_FILES 提前截断（默认尽量跑满含 official）。
   */
  const attempts: AsignAttemptSpec[] = [
    {
      tag: "primary_sec",
      timestamp: timestampSec,
      timestampMode: "static",
      signHash: envHash,
      signPlaintextMode: envMode,
    },            
    {
      tag: "official_node_sha1_plus600_strictjson_signonly",
      timestamp: "",
      timestampMode: "ms_plus_600",
      signHash: "SHA-1",
      signPlaintextMode: "official_concat",
      useOfficialBizJson: true,
      headerMode: "sign_only",
    },
    // {
    //   tag: "official_node_sha1_ms_strictjson_signonly",
    //   timestamp: "",
    //   timestampMode: "ms",
    //   signHash: "SHA-1",
    //   signPlaintextMode: "official_concat",
    //   useOfficialBizJson: true,
    //   headerMode: "sign_only",
    // },
    {
      tag: "official_node_sha1_plus600_relaxedjson_fullheaders",
      timestamp: "",
      timestampMode: "ms_plus_600",
      signHash: "SHA-1",
      signPlaintextMode: "official_concat",
      useOfficialBizJson: false,
      headerMode: "full",
    },
  ];

  let lastFailure: unknown = null;

  /** 大文件时避免在每次签名校验重试里重复 base64 解码，减轻 Edge worker 内存与 GC 压力 */
  const rawContractFiles = args.contractFiles ?? [];
  const preparedContractFiles = rawContractFiles.map((f) => {
    let part: BlobPart;
    if (f.bytes) {
      part = f.bytes;
    } else if (f.base64) {
      part = base64ToBytes(f.base64);
    } else {
      throw new Error("AsignContractFile 需要 base64 或 bytes");
    }
    return {
      filename: f.filename,
      blob: new Blob([part], {
        type: f.contentType ?? "application/octet-stream",
      }),
    };
  });

  const hasContractFiles = preparedContractFiles.length > 0;
  /** 有附件：默认跑满 attempts；无附件（如 addSigner）默认仅前 4 种，避免 7 路 × fetch 触发 wall clock */
  const maxWithFilesRaw = (Deno.env.get("ASIGN_MAX_ATTEMPTS_WITH_FILES") ?? String(attempts.length)).trim();
  const maxWithFiles = Math.max(1, parseInt(maxWithFilesRaw, 10) || attempts.length);
  const maxNoFilesRaw = (Deno.env.get("ASIGN_MAX_ATTEMPTS_NO_FILES") ?? "4").trim();
  const maxNoFiles = Math.max(1, parseInt(maxNoFilesRaw, 10) || 4);
  const hardCapRaw = (Deno.env.get("ASIGN_MAX_ATTEMPTS") ?? "").trim();
  const hardCapParsed = parseInt(hardCapRaw, 10);
  const hardCap = hardCapRaw && Number.isFinite(hardCapParsed) ? Math.max(1, hardCapParsed) : 0;

  let cap: number;
  if (hardCap > 0) {
    cap = Math.min(attempts.length, hardCap);
  } else if (hasContractFiles) {
    cap = Math.min(attempts.length, maxWithFiles);
  } else {
    cap = Math.min(attempts.length, maxNoFiles);
  }
  const attemptsEffective = attempts.slice(0, cap);

  for (const attempt of attemptsEffective) {
    const effectiveBizJson = attempt.useOfficialBizJson ? bizDataJsonStrict : bizDataJson;

    const tsMode = attempt.timestampMode ?? "static";
    let ts = attempt.timestamp;
    if (tsMode === "ms_plus_600") {
      ts = String(Date.now() + 600 * 1000);
    } else if (tsMode === "ms") {
      ts = String(Date.now());
    }

    const built = await buildAsignHeaders(effectiveBizJson, appId, ts, {
      signHash: attempt.signHash,
      signPlaintextMode: attempt.signPlaintextMode,
      signEncoding: attempt.signEncoding,
      headerMode: attempt.headerMode,
    });

    const headers = built.headers;
    const signStr = built.signStr;
    const missingPrivateKey = built.missingPrivateKey;
    const signHash = built.signHash;
    const signPlaintextMode = built.signPlaintextMode;
    const privateKeySource = built.privateKeySource;

    const form = new FormData();
    form.set("bizData", effectiveBizJson);
    form.set("appId", appId);
    form.set("timestamp", ts);

    for (const f of preparedContractFiles) {
      form.append("contractFiles", f.blob, f.filename);
    }

    // 避免三方接口偶发卡死导致 Edge worker 无响应（前端看到 InvalidWorkerResponse）
    const timeoutMsRaw = (Deno.env.get("ASIGN_FETCH_TIMEOUT_MS") ?? "8000").trim();
    const timeoutMs = Math.max(1500, parseInt(timeoutMsRaw, 10) || 8000);
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response | null = null;
    let text = "";
    let data: unknown = null;
    try {
      res = await fetch(url, { method: "POST", headers, body: form, signal: controller.signal });
      text = await res.text();
      data = text;
      try {
        data = JSON.parse(text);
      } catch {
        /* 保留原始文本 */
      }
    } catch (fetchErr) {
      const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      clearTimeout(timeoutHandle);
      lastFailure = {
        ok: false as const,
        status: 0,
        data: { msg: "ASIGN_FETCH_ERROR", detail: errMsg },
        debug: {
          url,
          headers,
          signStr,
          missingPrivateKey,
          privateKeySource,
          signHash,
          signPlaintextMode,
          attempt: attempt.tag,
          signEncoding: attempt.signEncoding,
          appId,
          timestamp: ts,
          useOfficialBizJson: Boolean(attempt.useOfficialBizJson),
          bizData,
        },
      };
      break;
    } finally {
      clearTimeout(timeoutHandle);
    }

    const parsed: Record<string, unknown> = data as Record<string, unknown>;
    const asign = (parsed?.asign ?? parsed) as Record<string, unknown>;
    const asignCode = asign?.code;
    const isAsignError = !isAsignBizSuccessResponse(asign);
    const addStrangerProceed =
      pathClean.includes("addStranger") && isAsignAddStrangerBenignResponse(asign);

    if (res.ok && (!isAsignError || addStrangerProceed)) {
      return { ok: true as const, status: res.status, data };
    }

    lastFailure = {
      ok: false as const,
      status: res.status,
      data,
      debug: {
        url,
        headers,
        signStr,
        missingPrivateKey,
        privateKeySource,
        signHash,
        signPlaintextMode,
        attempt: attempt.tag,
        signEncoding: attempt.signEncoding,
        asignCode,
        asignMsg: asign?.msg,
        appId,
        timestamp: ts,
        useOfficialBizJson: Boolean(attempt.useOfficialBizJson),
        bizData,
      },
    };

    const isSignatureMismatch = asignCode === 100016 || asignCode === "100016";
    if (!isSignatureMismatch) {
      break;
    }
  }

  return lastFailure ?? { ok: false as const, status: 500, data: { msg: "unknown failure" } };
}
