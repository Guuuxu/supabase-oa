/**
 * 爱签 user/getUser 用户状态（与开放平台文档一致）
 * - verified (100000)：已完成实名认证
 * - not_exists (100025)：用户不存在，未添加
 * - stranger (100082)：用户已存在，为陌生用户（爱签 msg 可能为「用户未认证」）
 */
export type AsignUserQueryStatus = 'verified' | 'not_exists' | 'stranger' | 'unknown';

export const ASIGN_USER_STATUS_LABELS: Record<AsignUserQueryStatus, string> = {
  verified: '已完成实名认证',
  not_exists: '用户不存在，未添加',
  stranger: '用户已存在，为陌生用户',
  unknown: '未知状态',
};

/** 个人用户 account：ASIGN + 身份证号（与签署流程一致） */
export function buildAsignPersonalAccount(idCard: string): string {
  const id = String(idCard ?? '').trim().replace(/\s/g, '').toUpperCase();
  return id ? `ASIGN${id}` : '';
}

export function normalizeAsignUserStatusCode(code: unknown): AsignUserQueryStatus {
  const codeStr = String(code ?? '').trim();
  if (codeStr === '100000') return 'verified';
  if (codeStr === '100025') return 'not_exists';
  if (codeStr === '100082') return 'stranger';
  return 'unknown';
}
