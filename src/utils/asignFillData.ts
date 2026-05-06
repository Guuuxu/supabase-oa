/**
 * 爱签 createContract「templates[].fillData」：key 须与控制台模板控件 dataKey 完全一致。
 * 修改填充字段时只改本文件即可；与 SigningsPage 的 replacePlaceholders 占位符语义尽量对齐。
 * 薪酬工资条签署：fillData ≈ buildAsignFillDataForContract(员工/公司) + buildSalarySigningPeriodFillData + 工资条 data + 考勤片段（见 SalarySignaturesPage）。
 *
 * 「甲方」「个人」与爱签模板签署位 signKey、以及文书里常见称谓一致：
 * - 甲方：单位（公司）名称，用于甲方抬头/落款类控件
 * - 个人：员工姓名，与签署策略里乙方/个人 signKey 对应
 * - 乙方：与「个人」同义，部分合同模板 dataKey 写作乙方
 */

import type { AttendanceRecord } from '@/types/types';

export type AsignContractFillCompany = {
  name: string;
  code: string;
  address: string;
  contact_person: string;
  contact_phone: string;
  legal_representative: string;
  payday_date: string | number;
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

export type AsignAttendanceFillSource = Pick<
  AttendanceRecord,
  'month' | 'work_days' | 'absent_days' | 'late_times' | 'leave_days' | 'overtime_hours' | 'remarks'
>;

export type BuildAsignFillDataOptions = {
  /**
   * 为 true 时去掉值为空字符串的键（减轻爱签侧解析压力；若模板要求「键必须存在」请保持 false）
   */
  omitEmptyStringValues?: boolean;
  /**
   * 员工考勤表（attendance_records）一条记录，与考勤 Excel / 控制台 dataKey 对齐
   */
  attendanceRecord?: AsignAttendanceFillSource | null;
};

function formatAttendanceFieldValue(n: unknown): string {
  if (n === null || n === undefined) {
    return '';
  }
  if (typeof n === 'number') {
    if (!Number.isFinite(n)) {
      return '';
    }
    return String(n);
  }
  return String(n).trim();
}

/**
 * 从「员工考勤表」一条记录生成 fillData 片段（含 `{{键}}` 变体，与 buildSalaryExtraFillData 一致）。
 */
export function buildAsignFillDataFromAttendanceRecord(
  record: AsignAttendanceFillSource | null | undefined,
): Record<string, string> {
  if (!record) {
    return {};
  }
  const out: Record<string, string> = {};
  const add = (key: string, value: string) => {
    out[key] = value;
    out[`{{${key}}}`] = value;
  };

  const month = (record.month || '').trim();
  const workDays = formatAttendanceFieldValue(record.work_days);
  const absentDays = formatAttendanceFieldValue(record.absent_days);
  const lateTimes = formatAttendanceFieldValue(record.late_times);
  const leaveDays = formatAttendanceFieldValue(record.leave_days);
  const overtimeHours = formatAttendanceFieldValue(record.overtime_hours);
  const remarks = (record.remarks ?? '').trim();

  add('月份', month);
  add('考勤月份', month);
  add('出勤天数', workDays);
  /** 与 SalarySignaturesPage.buildSalaryExtraFillData 中 ['出勤','出勤天数'] 对齐；爱签模板 dataKey 常写作「出勤」 */
  add('出勤', workDays);
  add('缺勤天数', absentDays);
  add('迟到次数', lateTimes);
  add('请假天数', leaveDays);
  add('加班小时', overtimeHours);
  add('加班', overtimeHours);
  add('备注', remarks);

  /** 与工资条页 buildSalaryExtraFillData 的 aliasPairs 中「缺勤/迟到/请假」等写法对齐（考勤表仅有汇总字段） */
  add('缺勤', absentDays);
  add('迟到', lateTimes);
  add('请假', leaveDays);

  add('work_days', workDays);
  add('absent_days', absentDays);
  add('late_times', lateTimes);
  add('leave_days', leaveDays);
  add('overtime_hours', overtimeHours);
  add('remarks', remarks);

  return out;
}

/**
 * 工资条/薪酬签署所选「核算年月」写入 fillData，便于模板用独立控件绑定「工资期间」等。
 * 若控件 dataKey 与下列键不一致，请在爱签控制台改成同名，或在工资条 aliasPairs 中增加映射。
 */
export function buildSalarySigningPeriodFillData(year: number, month: number): Record<string, string> {
  const y = Math.floor(Number(year)) || 0;
  const mRaw = Math.floor(Number(month)) || 1;
  const m = Math.min(12, Math.max(1, mRaw));
  const yyyy = String(y);
  const mm = String(m).padStart(2, '0');
  const ym = y > 0 ? `${yyyy}-${mm}` : '';
  const out: Record<string, string> = {};
  const put = (key: string, value: string) => {
    out[key] = value;
    out[`{{${key}}}`] = value;
  };
  if (y > 0) {
    put('工资年份', yyyy);
    put('工资月份', String(m));
    put('工资月', String(m));
    put('核算月份', ym);
    put('工资年月', ym);
    put('工资期间', `${y}年${m}月`);
    put('薪酬月份', ym);
    put('year', yyyy);
    put('month', mm);
    put('salary_year', yyyy);
    put('salary_month', mm);
  }
  return out;
}

/**
 * 在多条考勤记录中选一条用于合同填充：优先与合同开始日同月（YYYY-MM），否则取列表首条（调用方宜已按月份倒序）。
 */
export function pickAttendanceRecordForContractFill(
  rows: AttendanceRecord[],
  contractStartDate?: string,
): AttendanceRecord | null {
  if (!rows.length) {
    return null;
  }
  const start = (contractStartDate || '').trim().slice(0, 7);
  if (start.length === 7 && start[4] === '-') {
    const hit = rows.find((r) => (r.month || '').trim() === start);
    if (hit) {
      return hit;
    }
  }
  return rows[0];
}

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
  const hireDate = (employeeData.hire_date || '').trim();
  const hireDateObj = new Date(hireDate);
  const hireDateValid = !Number.isNaN(hireDateObj.getTime());
  const hireDateYear = hireDateValid ? String(hireDateObj.getFullYear()) : '';
  const hireDateMonth = hireDateValid ? String(hireDateObj.getMonth() + 1) : '';
  const hireDateDay = hireDateValid ? String(hireDateObj.getDate()) : '';
  const hireDateCn =
    hireDateYear && hireDateMonth && hireDateDay
      ? `${hireDateYear}年${hireDateMonth}月${hireDateDay}日`
      : '';
  const contractStartDate = (employeeData.contract_start_date || '').trim();
  const contractStartDateObj = new Date(contractStartDate);
  const contractStartDateValid = !Number.isNaN(contractStartDateObj.getTime());
  const contractStartDateYear = contractStartDateValid ? String(contractStartDateObj.getFullYear()) : '';
  const contractStartDateMonth = contractStartDateValid ? String(contractStartDateObj.getMonth() + 1) : '';
  const contractStartDateDay = contractStartDateValid ? String(contractStartDateObj.getDate()) : '';
  const contractEndDate = (employeeData.contract_end_date || '').trim();
  const contractEndDateObj = new Date(contractEndDate);
  const contractEndDateValid = !Number.isNaN(contractEndDateObj.getTime());
  const contractEndDateYear = contractEndDateValid ? String(contractEndDateObj.getFullYear()) : '';
  const contractEndDateMonth = contractEndDateValid ? String(contractEndDateObj.getMonth() + 1) : '';
  const contractEndDateDay = contractEndDateValid ? String(contractEndDateObj.getDate()) : '';
  const contractEndDateCn =
    contractEndDateYear && contractEndDateMonth && contractEndDateDay
      ? `${contractEndDateYear}年${contractEndDateMonth}月${contractEndDateDay}日`
      : '';
  
  const paydayDate = (companyData.payday_date || '');

  const core: Record<string, string> = {
    /** 与 SigningsPage 里甲方 signKey「甲方」对应，供模板文本域 dataKey 使用 */
    甲方: companyName,
    /** 与乙方/个人签署位 signKey 对应（主签位优先「乙方」时仍以姓名填充） */
    个人: employeeName,
    /** 劳动/协议类模板常见「乙方」dataKey */
    乙方: employeeName,
    员工姓名: employeeName,
    员工: employeeName,
    姓名: employeeName,
    性别:  (employeeData.gender || '').trim(),
    身份证号: (employeeData.id_card || '').trim(),
    手机号: (employeeData.phone || '').trim(),
    邮箱: (employeeData.email || '').trim(),
    部门: (employeeData.department || '').trim(),
    岗位: (employeeData.position || '').trim(),
    入职日期: (employeeData.hire_date || '').trim(),
    合同开始日期: (employeeData.contract_start_date || '').trim(),
    合同开始年份: contractStartDateYear,
    合同开始月份: contractStartDateMonth,
    合同开始日: contractStartDateDay,
    合同结束日期: (employeeData.contract_end_date || '').trim(),
    合同结束年份: contractEndDateYear,
    合同结束月份: contractEndDateMonth,
    合同结束日: contractEndDateDay,
    地址: (employeeData.address || '').trim(),
    证件类型: (employeeData.id_card_type || '').trim(),
    出生日期: (employeeData.birth_date || '').trim(),
    参保时间: (employeeData.insurance_start_date || '').trim(),
    家庭住址: employeeData.address || '',
    公司名称: companyName,
    统一信用代码: (companyData.code || '').trim(),
    /** 与爱签/工商常用表述一致，便于 dataKey 用「统一社会信用代码」的模板 */
    统一社会信用代码: (companyData.code || '').trim(),
    公司地址: (companyData.address || '').trim(),
    联系人: (companyData.contact_person || '').trim(),
    联系电话: (companyData.contact_phone || '').trim(),
    法定代表人: (companyData.legal_representative || '').trim(),
    发薪日: String(paydayDate),
    日期: currentDateIso,
    日期文本: currentDateCn,
    当前日期: currentDateIso,
    /** 与控制台常见 dataKey 对齐，避免仅模板里有「签署日期」等键时 fillData 对不上 */
    签署日期: currentDateIso,
    签订日期: currentDateIso,
    生效日期: currentDateIso,
    签约日期: currentDateIso,
    文书日期: currentDateIso,
    入职年份: hireDateYear,
    入职月份: hireDateMonth,
    入职日: hireDateDay,
    入职日期文本: hireDateCn,
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

  const attendanceFill = buildAsignFillDataFromAttendanceRecord(options?.attendanceRecord ?? null);
  for (const [k, v] of Object.entries(attendanceFill)) {
    put(k, v);
  }

  return out;
}
