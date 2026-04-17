/**
 * 从爱签 template/getTemplateData 返回体中尽力提取「可能用于 fillData / 签署位」的 key 提示。
 * 与爱签控制台一致：**签署位与 addSigner 的 signKey 以控件 dataKey 为准**；同时兼容仅返回 signKey / signUser 的旧结构。
 */
export type AsignTemplateControlHints = {
  /** 常见于文本域、表格等，对应 createContract templates[].fillData 的 key */
  fillDataKeys: string[];
  /** 常见于签署区，对应 addSigner signStrategyList 的 signKey */
  signKeys: string[];
  /**
   * 开放平台约定 signType=2 为时间戳/签署日期类签署位。
   * 若返回体未带 signType，本数组可能为空；发起签署时还会用 mergeTemplateDateSignKeysForAddSigner
   * 在 signKeys 中兜底匹配「当前日期」等常见 dataKey（仍须模板里确有该签署位）。
   */
  timestampSignKeys: string[];
};

function addString(set: Set<string>, v: unknown) {
  if (typeof v !== 'string') return;
  const t = v.trim();
  if (t) set.add(t);
}

function parseOptionalInt(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === 'string' && String(raw).trim() !== '') {
    const n = parseInt(String(raw), 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * 爱签模板控件 dataType：不同环境枚举可能略有差异。
 * 含「签署 / 签章 / 日期」等占位时常见带 page、locationX；你方环境示例为 dataType=6。
 */
const ASIGN_SIGN_LIKE_DATA_TYPES = new Set([4, 5, 6]);

function walk(
  node: unknown,
  depth: number,
  fillSet: Set<string>,
  signSet: Set<string>,
  timestampSet: Set<string>,
) {
  if (depth > 28 || node === null || node === undefined) return;
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return;
  if (Array.isArray(node)) {
    for (const item of node) walk(item, depth + 1, fillSet, signSet, timestampSet);
    return;
  }
  if (typeof node !== 'object') return;
  const o = node as Record<string, unknown>;
  addString(fillSet, o.dataKey);
  addString(fillSet, o.fieldKey);
  addString(fillSet, o.paramName);
  addString(fillSet, o.formKey);

  const dataKeyStr = typeof o.dataKey === 'string' ? o.dataKey.trim() : '';
  const hasSignString =
    (typeof o.signUser === 'string' && o.signUser.trim() !== '') ||
    (typeof o.signKey === 'string' && o.signKey.trim() !== '') ||
    (typeof o.signerKey === 'string' && o.signerKey.trim() !== '') ||
    (typeof o.keyword === 'string' && o.keyword.trim() !== '');
  const dt = parseOptionalInt(o.dataType);
  const hasSignLikeDataType = dt !== null && ASIGN_SIGN_LIKE_DATA_TYPES.has(dt);

  /** 兼容：仍收集 signKey/signUser 等，避免个别返回体仅有其一 */
  addString(signSet, o.signKey);
  addString(signSet, o.signUser);
  addString(signSet, o.signerKey);
  addString(signSet, o.keyword);
  /** 与控制台及 addSigner 对齐：签署类控件以 dataKey 为 signKey */
  if (dataKeyStr && (hasSignString || hasSignLikeDataType)) {
    signSet.add(dataKeyStr);
  }

  const st = parseOptionalInt(o.signType);
  if (st === 2) {
    if (dataKeyStr) {
      addString(timestampSet, o.dataKey);
    }
    addString(timestampSet, o.signKey);
    addString(timestampSet, o.signUser);
    addString(timestampSet, o.signerKey);
  }
  for (const v of Object.values(o)) walk(v, depth + 1, fillSet, signSet, timestampSet);
}

/** 个人侧主签署位关键字：按常见模板顺序匹配 */
const PARTY_B_MAIN_SIGN_KEY_CANDIDATES = ['个人', '乙方', '员工', '员工签字', '乙方签字'] as const;

export function pickAsignPartyBMainSignKey(signKeys: string[]): string | null {
  const set = new Set(signKeys.map((s) => s.trim()).filter(Boolean));
  for (const k of PARTY_B_MAIN_SIGN_KEY_CANDIDATES) {
    if (set.has(k)) {
      return k;
    }
  }
  return null;
}

/**
 * 合并「时间戳签署位」与常见日期 dataKey：getTemplateData 常不带 signType=2，但模板仍有「当前日期」等须签的坐标位。
 * 仅加入模板 signKeys 中真实存在的 key，避免 100617。
 */
const KNOWN_DATE_SIGN_DATA_KEYS = [
  '当前日期',
  '签署日期',
  '签约日期',
  '签订日期',
  '生效日期',
  '文书日期',
] as const;

export function mergeTemplateDateSignKeysForAddSigner(params: {
  signKeys: string[];
  mainPartyBSignKey: string;
  timestampSignKeys: string[];
}): string[] {
  const signSet = new Set(params.signKeys.map((s) => s.trim()).filter(Boolean));
  const mainB = params.mainPartyBSignKey.trim();
  const ordered: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string) => {
    const k = raw.trim();
    if (!k || k === mainB || !signSet.has(k) || seen.has(k)) {
      return;
    }
    seen.add(k);
    ordered.push(k);
  };
  for (const k of params.timestampSignKeys) {
    push(k);
  }
  for (const k of KNOWN_DATE_SIGN_DATA_KEYS) {
    push(k);
  }
  return ordered;
}

export function extractAsignTemplateControlHints(root: unknown): AsignTemplateControlHints {
  const fillSet = new Set<string>();
  const signSet = new Set<string>();
  const timestampSet = new Set<string>();
  walk(root, 0, fillSet, signSet, timestampSet);
  return {
    fillDataKeys: Array.from(fillSet).sort(),
    signKeys: Array.from(signSet).sort(),
    timestampSignKeys: Array.from(timestampSet).sort(),
  };
}
