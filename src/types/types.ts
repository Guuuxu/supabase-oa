export type UserRole = 'super_admin' | 'manager' | 'employee';
export type EmployeeStatus = 'active' | 'on_leave' | 'vacation' | 'standby' | 'business_trip' | 'resigned';
export type DocumentCategory = 'onboarding' | 'employment' | 'resignation' | 'compensation' | 'certificate';
// UI专用：包含通用模板分类
export type DocumentCategoryWithUniversal = DocumentCategory | 'universal';
export type SigningStatus = 'pending' | 'employee_signed' | 'company_signed' | 'completed' | 'rejected' | 'withdrawn';
export type SigningMode = 'electronic' | 'offline';
export type NotificationType = 'contract_expiry' | 'document_signing' | 'employee_onboarding' | 'system';

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  role_id?: string; // 自定义角色ID，关联到roles表
  role_name?: string; // 自定义角色名称（从roles表join获取）
  company_id?: string;
  manager_id?: string; // 直属上级ID
  is_active: boolean; // 用户是否激活，false表示暂停
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  credit_no?: string; // 统一社会信用代码
  legal_person?: string; // 法定代表人
  contact_person?: string;
  contact_phone?: string;
  address?: string;
  service_start_date?: string;
  service_end_date?: string;
  service_status: string; // 服务状态：服务中、已到期、已暂停
  industry?: string; // 所属行业
  region?: string; // 所在地域
  employee_scale?: string; // 员工规模
  payday_date?: number | null;
  created_by: string; // 创建者ID
  owner_id: string; // 当前所有者ID
  created_at: string;
  updated_at: string;
  // 统计字段（前端计算）
  active_employees_count?: number;
  signed_employees_count?: number;
  signature_count?: number; // 签章次数
  resigned_employees_count?: number;
}

// 公司流转历史
export interface CompanyTransfer {
  id: string;
  company_id: string;
  company_name: string;
  company_code: string;
  from_user_id: string;
  from_username: string;
  from_full_name?: string;
  to_user_id: string;
  to_username: string;
  to_full_name?: string;
  transferred_by: string;
  transferred_by_username: string;
  transferred_by_full_name?: string;
  reason?: string;
  created_at: string;
}

export interface Employee {
  id: string;
  company_id: string;
  name: string;
  id_card_type?: string;
  id_card_number?: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  department?: string;
  position?: string;
  household_address?: string;
  address?: string;
  insurance_start_date?: string;
  status: EmployeeStatus;
  hire_date?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  contract_count?: number; // 劳动合同签订次数
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface DocumentTemplate {
  id: string;
  company_id: string;
  name: string;
  category: DocumentCategory;
  content?: string;
  requires_company_signature: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface SigningRecord {
  id: string;
  company_id: string;
  employee_id: string;
  template_ids: string[];
  status: SigningStatus;
  signing_mode: SigningMode;
  employee_signed_at?: string;
  company_signed_at?: string;
  third_party_signing_id?: string;
  third_party_contract_no?: string;
  third_party_contract_name?: string;
  signed_file_url?: string;
  uploaded_at?: string;
  uploaded_by?: string;
  notes?: string;
  created_by?: string;
  employee_form_data?: {
    name?: string;
    id_card?: string;
    phone?: string;
    email?: string;
    department?: string;
    position?: string;
    hire_date?: string;
    contract_start_date?: string;
    contract_end_date?: string;
    address?: string;
  };
  company_form_data?: {
    name?: string;
    code?: string;
    address?: string;
    contact_person?: string;
    contact_phone?: string;
    legal_representative?: string;
  };
  created_at: string;
  updated_at: string;
  company?: Company;
  employee?: Employee;
  templates?: DocumentTemplate[];
}

export interface SignedDocument {
  id: string;
  signing_record_id: string;
  template_id: string;
  template_name: string;
  file_url?: string;
  file_size?: number;
  signed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  company_id?: string;
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export interface UserRoleAssignment {
  user_id: string;
  role_id: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  type: NotificationType;
  title: string;
  content?: string;
  is_read: boolean;
  related_id?: string;
  created_at: string;
}

export interface ReminderConfig {
  id: string;
  company_id: string;
  contract_expiry_days: number;
  renewal_notice_days: number;
  enable_sms: boolean;
  enable_in_app: boolean;
  created_at: string;
  updated_at: string;
}

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  onboarding: '入职管理',
  employment: '在职管理',
  resignation: '离职管理',
  compensation: '薪酬管理',
  certificate: '证明开具'
};

// UI专用：包含通用模板分类的标签
export const DOCUMENT_CATEGORY_LABELS_WITH_UNIVERSAL: Record<DocumentCategoryWithUniversal, string> = {
  ...DOCUMENT_CATEGORY_LABELS,
  universal: '通用模板'
};

export const DOCUMENT_TEMPLATE_NAMES: Record<DocumentCategory, string[]> = {
  onboarding: ['入职信息登记表', '劳动合同', '岗位职责', '员工手册', '规章制度', '保密协议', '竞业禁止协议', '培训协议'],
  employment: ['劳动合同续签', '劳动合同变更协议', '岗位调整', '薪酬调整', '职级调整', '限期返岗通知书', '记过确认通知书', '请假条'],
  resignation: ['离职申请', '离职交接确认表', '解除劳动合同协议', '离职证明', '保密协议确认书', '竞业协议确认书'],
  compensation: ['考勤确认', '绩效考核确认', '工资条确认'],
  certificate: ['收入证明', '离职证明', '在职证明']
};

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: '在职',
  on_leave: '请假',
  vacation: '休假',
  standby: '待岗',
  business_trip: '出差',
  resigned: '离职'
};

export const SIGNING_STATUS_LABELS: Record<SigningStatus, string> = {
  pending: '待签署',
  employee_signed: '员工已签署',
  company_signed: '公司已签署',
  completed: '已完成',
  rejected: '已拒绝',
  withdrawn: '已撤回'
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: '超级管理员',
  manager: '主管',
  employee: '员工'
};

// 操作日志类型
export type OperationType = 
  | 'login'
  | 'logout'
  | 'company_create'
  | 'company_update'
  | 'company_delete'
  | 'company_transfer'
  | 'employee_create'
  | 'employee_update'
  | 'employee_delete'
  | 'employee_import'
  | 'template_create'
  | 'template_update'
  | 'template_delete'
  | 'signing_initiate'
  | 'signing_employee'
  | 'signing_company'
  | 'user_create'
  | 'user_update'
  | 'user_delete'
  | 'role_create'
  | 'role_update'
  | 'role_delete'
  | 'permission_assign'
  | 'config_update'
  | 'notification_send';

export interface OperationLog {
  id: string;
  user_id: string;
  user_name?: string; // 从profiles表join获取
  operation_type: OperationType;
  operation_detail: string;
  target_type?: string;
  target_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  login: '登录',
  logout: '登出',
  company_create: '创建公司',
  company_update: '更新公司',
  company_delete: '删除公司',
  company_transfer: '流转公司',
  employee_create: '创建员工',
  employee_update: '更新员工',
  employee_delete: '删除员工',
  employee_import: '导入员工',
  template_create: '创建文书模板',
  template_update: '更新文书模板',
  template_delete: '删除文书模板',
  signing_initiate: '发起签署',
  signing_employee: '员工签署',
  signing_company: '公司签署',
  user_create: '创建用户',
  user_update: '更新用户',
  user_delete: '删除用户',
  role_create: '创建角色',
  role_update: '更新角色',
  role_delete: '删除角色',
  permission_assign: '分配权限',
  config_update: '更新配置',
  notification_send: '发送通知'
};

// 企业招聘数据类型
export interface RecruitmentOverview {
  titleKw: string; // 职位关键词
  titleType: string; // 职位类型
  city: string; // 城市分布
  src: string; // 招聘来源
  titleLevel: string; // 职位级别
  avgSal: string; // 平均薪资
  titleCnt: number; // 职位数量
  titleModifyDate: string; // 职位更新时间
  cityCnt: number; // 城市数量
}

export interface EducationItem {
  key: string;
  value: number;
}

export interface SalaryItem {
  key: string;
  value: number;
}

export interface YearsItem {
  key: string;
  value: number;
}

export interface RecruitmentStatistics {
  avgSalStr: string; // 平均薪资字符串
  bkEducation: string; // 本科学历占比
  educationList: EducationItem[]; // 学历分布列表
  priProvince: string; // 主要省份
  companyName: string; // 企业名称
  zpnumberList?: Array<{ key: string; value: number }>; // 招聘数量时间序列
  salaryList: SalaryItem[]; // 薪资区间分布
  btw3and5Years: string; // 3-5年工作经验占比
  recruitPosition?: Array<{ key: string; value: number }>; // 招聘职位列表
  avgSal: number; // 平均薪资数值
  yearsList: YearsItem[]; // 工作年限分布
  zpnumber: number; // 总招聘数量
  ssNumHisList?: Array<{ key: string; value: number }>; // 年度招聘数量统计
}

// 薪酬管理相关类型
export interface SalaryStructureField {
  name: string; // 字段名称，例如：基本工资
  code: string; // 字段代码，例如：base_salary
  type: 'number' | 'text'; // 字段类型
  required?: boolean; // 是否必填
  order?: number; // 显示顺序
}

export interface SalaryStructureTemplate {
  id: string;
  company_id: string | null; // NULL表示通用模板
  name: string;
  description?: string;
  fields: SalaryStructureField[]; // 工资结构字段定义
  is_default: boolean;
  is_universal: boolean; // 是否为通用模板
  pdf_template_config?: {
    title?: string;
    show_company_logo?: boolean;
    show_company_name?: boolean;
    show_period?: boolean;
    header_color?: string;
    font_size?: number;
    show_signature_area?: boolean;
    signature_label?: string;
    footer_text?: string;
  }; // PDF模板配置
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SalaryRecord {
  id: string;
  company_id: string;
  template_id?: string;
  year: number;
  month: number;
  file_name?: string;
  file_url?: string;
  total_amount?: number;
  employee_count?: number;
  status: 'pending' | 'processed' | 'sent';
  pdf_generated?: boolean; // PDF是否已生成
  pdf_generation_error?: string; // PDF生成错误信息
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  // 关联数据
  template?: SalaryStructureTemplate;
  company_name?: string;
}

export interface SalaryItem {
  id: string;
  salary_record_id: string;
  employee_id: string;
  employee_name: string;
  data: Record<string, number | string>; // 工资明细数据
  total_amount: number;
  pdf_url?: string; // 工资条PDF文件URL
  is_sent: boolean;
  sent_at?: string;
  is_viewed: boolean;
  viewed_at?: string;
  created_at: string;
  updated_at: string;
  // 关联数据
  salary_record?: SalaryRecord;
}

// 考勤记录
export interface AttendanceRecord {
  id: string;
  company_id: string;
  employee_id: string;
  month: string; // YYYY-MM格式
  work_days: number; // 出勤天数
  absent_days: number; // 缺勤天数
  late_times: number; // 迟到次数
  leave_days: number; // 请假天数
  overtime_hours: number; // 加班小时数
  remarks?: string; // 备注
  pdf_url?: string; // 考勤确认表PDF文件URL
  created_at: string;
  created_by?: string;
  updated_at: string;
  // 关联数据
  employee?: Employee;
  company?: Company;
  employee_name?: string; // 员工姓名
}

// 薪酬签署类型
export type SalarySignatureType = 'salary_slip' | 'attendance_record';

// 薪酬签署状态
export type SalarySignatureStatus = 'pending' | 'sent' | 'signed' | 'rejected' | 'revoked';

// 薪酬签署状态标签
export const SALARY_SIGNATURE_STATUS_LABELS: Record<SalarySignatureStatus, string> = {
  pending: '待签署',
  sent: '已发送',
  signed: '已签署',
  rejected: '已拒签',
  revoked: '已撤回'
};

// 薪酬签署类型标签
export const SALARY_SIGNATURE_TYPE_LABELS: Record<SalarySignatureType, string> = {
  salary_slip: '工资条',
  attendance_record: '考勤确认表'
};

// 薪酬签署记录
export interface SalarySignature {
  id: string;
  company_id: string;
  employee_id: string;
  type: SalarySignatureType;
  reference_id: string; // 关联的工资记录或考勤记录ID
  year: number;
  month: number;
  status: SalarySignatureStatus;
  sent_at?: string;
  signed_at?: string;
  signature_url?: string;
  sign_token?: string; // 签署token
  sign_token_expires_at?: string; // token过期时间
  original_file_url?: string; // 原始文件URL
  signed_file_url?: string; // 签署后的文件URL
  signature_data?: string; // 签名数据（JSON格式）
  reject_reason?: string; // 拒签原因
  created_at: string;
  updated_at: string;
  // 关联数据
  employee?: Employee;
  company?: Company;
}

// 考勤签署状态
export type AttendanceSignatureStatus = 'pending' | 'sent' | 'signed' | 'rejected' | 'revoked';

// 考勤签署状态标签
export const ATTENDANCE_SIGNATURE_STATUS_LABELS: Record<AttendanceSignatureStatus, string> = {
  pending: '待签署',
  sent: '已发送',
  signed: '已签署',
  rejected: '已拒签',
  revoked: '已撤回'
};

// 考勤签署记录
export interface AttendanceSignature {
  id: string;
  company_id: string;
  employee_id: string;
  attendance_record_id: string;
  year: number;
  month: number;
  status: AttendanceSignatureStatus;
  sent_at?: string;
  signed_at?: string;
  sign_token?: string;
  sign_token_expires_at?: string;
  signature_data?: string;
  reject_reason?: string;
  created_at: string;
  updated_at: string;
  // 关联数据
  employee?: Employee;
  company?: Company;
}

// 劳动合同历史记录
export interface LaborContractHistory {
  id: string;
  employee_id: string;
  company_id: string;
  contract_number: number; // 第几次合同
  start_date: string;
  end_date?: string; // 无固定期限时为空
  contract_type: string; // 固定期限、无固定期限
  notes?: string;
  created_at: string;
  updated_at: string;
  // 关联数据
  employee?: Employee;
  company?: Company;
}

// 员工文书签署记录
export interface EmployeeDocumentRecord {
  id: string;
  employee_id: string;
  company_id: string;
  document_type: string; // 文书类型
  document_name: string; // 文书名称
  template_category?: string; // 文书模板大类
  signed_at?: string; // 签署时间
  signed_year?: number; // 签署年份
  expiry_time?: string; // 到期时间（可以是日期或文本）
  file_url?: string; // 文件URL
  signing_record_id?: string; // 关联的签署记录ID
  created_at: string;
  updated_at: string;
  // 关联数据
  employee?: Employee;
  company?: Company;
}
