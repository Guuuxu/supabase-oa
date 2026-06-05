/**
 * 爱签 user/getUser 响应解析（开放平台文档：按 code 判断用户状态）
 * - 100000：已完成实名认证
 * - 100025：用户不存在，未添加
 * - 100082：用户已存在，为陌生用户（msg 可能为「用户未认证」，仍属可继续流程的状态）
 */
export type AsignUserQueryStatus = "verified" | "not_exists" | "stranger" | "unknown";

export function normalizeAsignPayload(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;
  const root = data as Record<string, unknown>;
  const inner = root.asign;
  if (inner && typeof inner === "object") {
    return inner as Record<string, unknown>;
  }
  return root;
}

export function readAsignGetUserRow(data: unknown): Record<string, unknown> | null {
  const asign = normalizeAsignPayload(data);
  if (!asign) return null;
  const payload = asign.data ?? asign.result;
  if (!payload || typeof payload !== "object") return null;
  return payload as Record<string, unknown>;
}

/** 按开放平台「用户状态判断」文档解析 getUser 业务 code */
export function parseAsignGetUserStatus(data: unknown): {
  status: AsignUserQueryStatus;
  code: string | null;
  msg: string | null;
  userData: Record<string, unknown> | null;
} {
  const asign = normalizeAsignPayload(data);
  if (!asign) {
    return { status: "unknown", code: null, msg: null, userData: null };
  }

  const codeStr = String(asign.code ?? "").trim();
  const msg = asign.msg != null ? String(asign.msg) : null;
  const userData = readAsignGetUserRow(data);

  if (codeStr === "100000") {
    return { status: "verified", code: codeStr, msg, userData };
  }
  if (codeStr === "100025") {
    return { status: "not_exists", code: codeStr, msg, userData };
  }
  if (codeStr === "100082") {
    return { status: "stranger", code: codeStr, msg, userData };
  }

  return { status: "unknown", code: codeStr || null, msg, userData };
}

/** 个人用户 getUser 查询参数：account + idCard（与 create-signing 一致） */
export function buildPersonalGetUserBizData(input: {
  account: string;
  idCard: string;
}): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  const acc = String(input.account ?? "").trim();
  if (acc) query.account = acc;
  const idc = String(input.idCard ?? "").trim();
  if (idc) query.idCard = idc;
  return query;
}

/** 爱签 v2/user/modifyUserName 请求参数（已认证用户更新姓名/手机号/银行卡） */
export function buildPersonalModifyUserBizData(input: {
  account: string;
  name: string;
  /** 2=运营商三要素；3=银行卡四要素 */
  identifyType: 2 | 3;
  mobile?: string;
  bankCard?: string;
}): Record<string, unknown> {
  const row: Record<string, unknown> = {
    account: String(input.account ?? "").trim(),
    name: String(input.name ?? "").trim(),
    identifyType: input.identifyType,
  };
  const mobile = String(input.mobile ?? "").trim();
  if (mobile) row.mobile = mobile;
  const bankCard = String(input.bankCard ?? "").trim();
  if (bankCard) row.bankCard = bankCard;
  return row;
}

/** 解析 v2/user/modifyUserName 响应（文档：code=100000 成功，data 为 null/String，勿依赖 msg 匹配） */
export function parseAsignModifyUserResponse(data: unknown): {
  ok: boolean;
  code: string | null;
  msg: string | null;
  data: string | null;
} {
  const asign = normalizeAsignPayload(data);
  if (!asign) {
    return { ok: false, code: null, msg: null, data: null };
  }
  const codeStr = String(asign.code ?? "").trim();
  const msg = asign.msg != null ? String(asign.msg) : null;
  const dataRaw = asign.data;
  let dataStr: string | null = null;
  if (dataRaw === null || dataRaw === undefined) {
    dataStr = null;
  } else if (typeof dataRaw === "string") {
    dataStr = dataRaw;
  } else {
    dataStr = String(dataRaw);
  }
  const ok = codeStr === "100000";
  return { ok, code: codeStr || null, msg, data: dataStr };
}

/** 爱签 v2/user/modifyStranger 请求参数（陌生用户更新信息，唯一标识 code 不可改） */
export function buildPersonalModifyStrangerBizData(input: {
  account: string;
  userType?: 2;
  name?: string;
  mobile?: string;
  idCard?: string;
}): Record<string, unknown> {
  const row: Record<string, unknown> = {
    account: String(input.account ?? "").trim(),
    userType: input.userType ?? 2,
  };
  const name = String(input.name ?? "").trim();
  if (name) row.name = name;
  const mobile = String(input.mobile ?? "").trim();
  if (mobile) row.mobile = mobile;
  const idCard = String(input.idCard ?? "").trim();
  if (idCard) row.idCard = idCard;
  return row;
}

/** 爱签 user/remove 请求参数（删除爱签用户） */
export function buildPersonalRemoveUserBizData(input: { account: string }): Record<string, unknown> {
  return { account: String(input.account ?? "").trim() };
}
