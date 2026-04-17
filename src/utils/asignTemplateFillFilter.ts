/**
 * 按爱签 getTemplateData 解析出的控件 key，过滤 createContract 的 fillData，
 * 避免传入模板中不存在的参数名（如多余的「当前日期」）导致业务失败。
 */

/** 模板里「日期」类文本/日期控件 dataKey：走 fillData，不要求 addSigner 时间戳位 */
function looksLikeTemplateDateDataKey(key: string): boolean {
  const k = key.trim();
  if (!k) return false;
  if (
    /^(个人|乙方|甲方|员工|员工姓名|公司名称|身份证号|手机号|邮箱|地址|部门|岗位|联系人|联系电话|法定代表人|统一社会信用代码|统一信用代码|公司地址|证件类型|性别|出生日期|入职日期|合同开始日期|合同结束日期|参保时间)$/.test(
      k,
    )
  ) {
    return false;
  }
  return /日期|签约|生效|签订|签署时间|年月日|time|date/i.test(k);
}

/**
 * 在过滤后的 fillData 上，为模板中存在、但 core 未声明的「日期类」dataKey 补当日值（与文档：日期走 fillData）。
 * signKeys 中的签署区关键字（如「个人」）不因名称含「人」被误补；已由 looksLikeTemplateDateDataKey 排除。
 */
export function enrichFillDataWithTemplateDateKeys(
  fullFill: Record<string, string>,
  templateFillKeys: string[],
  signKeys: string[],
  alreadyFiltered: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = { ...alreadyFiltered };
  const signSet = new Set(signKeys.map((s) => s.trim()).filter(Boolean));
  const preferredDate =
    fullFill['当前日期'] ||
    fullFill['日期'] ||
    fullFill['日期文本'] ||
    '';

  for (const raw of templateFillKeys) {
    const k = String(raw).trim();
    if (!k) {
      continue;
    }
    const existing = out[k];
    if (existing !== undefined && String(existing).trim() !== '') {
      continue;
    }
    if (signSet.has(k) && !looksLikeTemplateDateDataKey(k)) {
      continue;
    }
    if (!looksLikeTemplateDateDataKey(k)) {
      continue;
    }
    out[k] = preferredDate || new Date().toISOString().slice(0, 10);
  }
  return out;
}

export function filterAsignFillDataByTemplateDataKeys(
  fillData: Record<string, string>,
  templateDataKeys: string[],
): Record<string, string> {
  const normalized = new Set<string>();
  for (const raw of templateDataKeys) {
    const t = String(raw).trim();
    if (!t) continue;
    normalized.add(t);
    const inner = t.startsWith('{{') && t.endsWith('}}') ? t.slice(2, -2).trim() : t;
    if (inner) {
      normalized.add(inner);
      normalized.add(`{{${inner}}}`);
    }
  }
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fillData)) {
    const keyTrim = String(k).trim();
    const bare =
      keyTrim.startsWith('{{') && keyTrim.endsWith('}}') ? keyTrim.slice(2, -2).trim() : keyTrim;
    if (normalized.has(keyTrim) || normalized.has(bare) || normalized.has(`{{${bare}}}`)) {
      out[keyTrim] = v;
    }
  }
  return out;
}
