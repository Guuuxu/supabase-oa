/**
 * 从爱签 template/getTemplateData 返回体中尽力提取「可能用于 fillData / 签署位」的 key 提示。
 * 爱签各环境字段名可能略有差异，故做浅层遍历 + 常见字段名收集。
 */
export type AsignTemplateControlHints = {
  /** 常见于文本域、表格等，对应 createContract templates[].fillData 的 key */
  fillDataKeys: string[];
  /** 常见于签署区，对应 addSigner signStrategyList 的 signKey */
  signKeys: string[];
};

function addString(set: Set<string>, v: unknown) {
  if (typeof v !== 'string') return;
  const t = v.trim();
  if (t) set.add(t);
}

function walk(node: unknown, depth: number, fillSet: Set<string>, signSet: Set<string>) {
  if (depth > 28 || node === null || node === undefined) return;
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return;
  if (Array.isArray(node)) {
    for (const item of node) walk(item, depth + 1, fillSet, signSet);
    return;
  }
  if (typeof node !== 'object') return;
  const o = node as Record<string, unknown>;
  addString(fillSet, o.dataKey);
  addString(fillSet, o.fieldKey);
  addString(fillSet, o.paramName);
  addString(fillSet, o.formKey);
  addString(signSet, o.signKey);
  addString(signSet, o.signerKey);
  addString(signSet, o.keyword);
  for (const v of Object.values(o)) walk(v, depth + 1, fillSet, signSet);
}

export function extractAsignTemplateControlHints(root: unknown): AsignTemplateControlHints {
  const fillSet = new Set<string>();
  const signSet = new Set<string>();
  walk(root, 0, fillSet, signSet);
  return {
    fillDataKeys: Array.from(fillSet).sort(),
    signKeys: Array.from(signSet).sort(),
  };
}
