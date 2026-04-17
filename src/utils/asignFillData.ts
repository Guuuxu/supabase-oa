/**
 * 爱签 createContract「templates[].fillData」：key 须与控制台模板控件 dataKey 完全一致。
 * 修改填充字段时只改本文件即可；与 SigningsPage 的 replacePlaceholders 占位符语义尽量对齐。
 *
 * 「甲方」「个人」与爱签模板签署位 signKey、以及文书里常见称谓一致：
 * - 甲方：单位（公司）名称，用于甲方抬头/落款类控件
 * - 个人：员工姓名，与签署策略里乙方/个人 signKey 对应
 * - 乙方：与「个人」同义，部分合同模板 dataKey 写作乙方
 */

export type AsignContractFillCompany = {
  name: string;
  code: string;
  address: string;
  contact_person: string;
  contact_phone: string;
  legal_representative: string;
};

export type AsignContractFillEmployee = {
  name: string;
  id_card: string;
  phone: string;
  email: string;
  department: string;
  position: string;
  hire_date: string;
  contract_start_date: string;
  contract_end_date: string;
  address: string;
  id_card_type?: string;
  gender?: string;
  birth_date?: string;
  insurance_start_date?: string;
};

export type BuildAsignFillDataOptions = {
  /**
   * 为 true 时去掉值为空字符串的键（减轻爱签侧解析压力；若模板要求「键必须存在」请保持 false）
   */
  omitEmptyStringValues?: boolean;
};

export function buildAsignFillDataForContract(
  employeeData: AsignContractFillEmployee,
  companyData: AsignContractFillCompany,
  options?: BuildAsignFillDataOptions,
): Record<string, string> {
  const omit = options?.omitEmptyStringValues === true;
  const now = new Date();
  const currentDate = now.toLocaleDateString('zh-CN');
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1);
  const d = String(now.getDate());
  const currentDateIso = `${yyyy}-${mm}-${dd}`;
  const currentDateSlash = `${yyyy}/${mm}/${dd}`;
  const currentDateCn = `${yyyy}年${m}月${d}日`;
  const employeeName = (employeeData.name || '').trim();
  const companyName = (companyData.name || '').trim();

  const core: Record<string, string> = {
    /** 与 SigningsPage 里甲方 signKey「甲方」对应，供模板文本域 dataKey 使用 */
    甲方: companyName,
    /** 与乙方/个人签署位 signKey「个人」对应 */
    个人: employeeName,
    /** 劳动/协议类模板常见「乙方」dataKey */
    乙方: employeeName,
    员工姓名: employeeName,
    身份证号: (employeeData.id_card || '').trim(),
    手机号: (employeeData.phone || '').trim(),
    邮箱: (employeeData.email || '').trim(),
    部门: (employeeData.department || '').trim(),
    岗位: (employeeData.position || '').trim(),
    入职日期: (employeeData.hire_date || '').trim(),
    合同开始日期: (employeeData.contract_start_date || '').trim(),
    合同结束日期: (employeeData.contract_end_date || '').trim(),
    地址: (employeeData.address || '').trim(),
    证件类型: (employeeData.id_card_type || '').trim(),
    性别: (employeeData.gender || '').trim(),
    出生日期: (employeeData.birth_date || '').trim(),
    参保时间: (employeeData.insurance_start_date || '').trim(),
    公司名称: companyName,
    统一信用代码: (companyData.code || '').trim(),
    /** 与爱签/工商常用表述一致，便于 dataKey 用「统一社会信用代码」的模板 */
    统一社会信用代码: (companyData.code || '').trim(),
    公司地址: (companyData.address || '').trim(),
    联系人: (companyData.contact_person || '').trim(),
    联系电话: (companyData.contact_phone || '').trim(),
    法定代表人: (companyData.legal_representative || '').trim(),
    日期: currentDateIso,
    日期文本: currentDateCn,
    当前日期: currentDateIso,
    /** 与控制台常见 dataKey 对齐，避免仅模板里有「签署日期」等键时 fillData 对不上 */
    签署日期: currentDateIso,
    签订日期: currentDateIso,
    生效日期: currentDateIso,
    签约日期: currentDateIso,
    文书日期: currentDateIso,
  };

  const out: Record<string, string> = {};
  const put = (key: string, value: string) => {
    if (omit && value === '' && key !== '当前日期') {
      return;
    }
    out[key] = value;
  };

  for (const [k, v] of Object.entries(core)) {
    put(k, v);
    put(`{{${k}}}`, v);
  }

  return out;
}
