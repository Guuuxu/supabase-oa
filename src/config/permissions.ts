/**
 * 权限分组配置
 * 用于在角色权限管理页面按模块展示权限
 */

export interface PermissionGroup {
  key: string;
  name: string;
  description: string;
  permissions: string[]; // permission codes
}

/**
 * 系统权限分组配置
 * 按照功能模块对权限进行分组
 */
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: 'dashboard',
    name: '看板',
    description: '数据看板和统计功能',
    permissions: [
      'dashboard_view',
      'statistics_view',
      'report_view',
      'report_export'
    ]
  },
  {
    key: 'customer',
    name: '客户管理',
    description: '客户信息管理功能',
    permissions: [
      'customer_view',
      'customer_create',
      'customer_edit',
      'customer_delete',
      'customer_export',
      'customer_seal_view'
    ]
  },
  {
    key: 'company',
    name: '公司管理',
    description: '公司信息管理功能',
    permissions: [
      'company_view',
      'company_create',
      'company_edit',
      'company_delete',
      'company_export',
      'company_transfer',
      'company_transfer_history_view'
    ]
  },
  {
    key: 'employee',
    name: '员工管理',
    description: '员工信息和状态管理',
    permissions: [
      'employee_view',
      'employee_create',
      'employee_edit',
      'employee_delete',
      'employee_export',
      'employee_import',
      'employee_status_view',
      'employee_status_edit'
    ]
  },
  {
    key: 'template',
    name: '文书模板',
    description: '文书模板管理功能',
    permissions: [
      'template_view',
      'template_create',
      'template_edit',
      'template_delete',
      'template_enable'
    ]
  },
  {
    key: 'signing',
    name: '文书签署',
    description: '文书签署流程管理',
    permissions: [
      'signing_view',
      'signing_initiate',
      'signing_revoke',
      'signing_delete',
      'signing_export',
      'signing_download',
      'signing_statistics'
    ]
  },
  {
    key: 'document_archive',
    name: '文书档案',
    description: '已签署文书档案管理',
    permissions: [
      'signed_document_view',
      'signed_document_download',
      'document_history_view',
      'document_history_export'
    ]
  },
  {
    key: 'salary_structure',
    name: '工资结构',
    description: '工资结构模板管理',
    permissions: [
      'salary_template_view',
      'salary_template_create',
      'salary_template_edit',
      'salary_template_delete'
    ]
  },
  {
    key: 'salary_record',
    name: '工资表管理',
    description: '工资表上传和管理',
    permissions: [
      'salary_record_view',
      'salary_record_upload',
      'salary_record_edit',
      'salary_record_delete',
      'salary_record_export',
      'salary_split'
    ]
  },
  {
    key: 'salary_item',
    name: '工资条管理',
    description: '工资条查看和导出',
    permissions: [
      'salary_item_view',
      'salary_item_export'
    ]
  },
  {
    key: 'salary_signing',
    name: '薪酬签署',
    description: '工资条和考勤签署管理',
    permissions: [
      'salary_signing_view',
      'salary_signing_initiate',
      'salary_signing_revoke',
      'salary_signing_delete'
    ]
  },
  {
    key: 'salary_archive',
    name: '薪酬档案',
    description: '薪酬档案下载管理',
    permissions: [
      'salary_archive_view',
      'salary_archive_download'
    ]
  },
  {
    key: 'attendance',
    name: '考勤管理',
    description: '考勤记录和签署管理',
    permissions: [
      'attendance_view',
      'attendance_upload',
      'attendance_edit',
      'attendance_delete',
      'attendance_export',
      'attendance_signing_view',
      'attendance_signing_initiate',
      'attendance_signing_revoke',
      'attendance_signing_delete'
    ]
  },
  {
    key: 'batch_operation',
    name: '批量操作',
    description: '批量操作功能权限',
    permissions: [
      'batch_download',
      'batch_revoke',
      'batch_delete'
    ]
  },
  {
    key: 'sms',
    name: '短信通知',
    description: '短信发送功能',
    permissions: [
      'sms_send',
      'sms_batch_send'
    ]
  },
  {
    key: 'user',
    name: '用户管理',
    description: '系统用户管理功能',
    permissions: [
      'user_view',
      'user_create',
      'user_edit',
      'user_delete',
      'user_role_assign'
    ]
  },
  {
    key: 'role',
    name: '角色权限',
    description: '角色和权限管理',
    permissions: [
      'role_view',
      'role_create',
      'role_edit',
      'role_delete',
      'role_permission_config'
    ]
  },
  {
    key: 'notification',
    name: '通知中心',
    description: '系统通知管理',
    permissions: [
      'notification_view',
      'notification_send',
      'notification_delete'
    ]
  },
  {
    key: 'audit',
    name: '操作日志',
    description: '系统操作日志查看',
    permissions: [
      'audit_log_view',
      'audit_log_export'
    ]
  },
  {
    key: 'system_config',
    name: '系统配置',
    description: '系统配置管理',
    permissions: [
      'system_config_view',
      'system_config_edit',
      'esign_config_view',
      'esign_config_edit',
      'reminder_config_view',
      'reminder_config_edit'
    ]
  },
  {
    key: 'tools',
    name: '工具箱',
    description: '系统工具功能',
    permissions: [
      'ai_assistant_use',
      'recruitment_query_view',
      'recruitment_query_export',
      'identity_verification_manage',
      'identity_verification_view'
    ]
  },
  {
    key: 'subordinate',
    name: '下属管理',
    description: '下属员工管理',
    permissions: [
      'subordinate_view',
      'subordinate_manage'
    ]
  }
];

/**
 * 侧边栏可见性：数据库中仍存在的旧码 / 与分组主码并行的其它命名（如 00001 的 *_manage、00084 的 salary_structure_*、
 * 00073 的 attendance_sign_manage、RLS 曾用的 signed_file_download）。按 PERMISSION_GROUPS 的 key 合并进 alternates。
 */
export const SIDEBAR_LEGACY_CODES_BY_GROUP: Partial<Record<string, string[]>> = {
  dashboard: [],
  customer: [],
  company: ['company_manage'],
  employee: [
    'employee_manage',
    'employee_status_manage',
    'subordinate_view',
    'subordinate_manage',
  ],
  template: ['template_manage'],
  /** 流程：旧码仅用于「文书签署」菜单，不应用来放行档案/历史（否则只勾「文书发起」会出现档案下载） */
  signing: ['document_view', 'document_initiate', 'document_manage'],
  /**
   * 档案/历史：仅认可「档案类」旧码；document_initiate / document_view 只看签署列表，不等同于可下载已签文件或看历史
   */
  document_archive: ['signed_file_download', 'document_manage'],
  salary_structure: [
    'salary_structure_view',
    'salary_structure_create',
    'salary_structure_edit',
    'salary_structure_delete',
    'document_view',
  ],
  salary_record: ['document_view', 'salary_record_manage'],
  salary_item: ['document_view', 'salary_record_manage'],
  salary_signing: ['document_view'],
  salary_archive: ['signed_file_download', 'document_view'],
  attendance: ['document_view', 'attendance_sign_manage'],
  batch_operation: [],
  sms: [],
  user: ['user_manage'],
  role: ['role_permission_manage', 'role_assign'],
  notification: ['notification_manage'],
  audit: ['system_config_view'],
  system_config: ['system_config'],
  tools: [],
  subordinate: [],
};

function uniqStrings(list: string[]): string[] {
  return [...new Set(list)];
}

/**
 * 侧边栏菜单与 PERMISSION_GROUPS 对齐，并合并同组内其它标准码 + SIDEBAR_LEGACY_CODES_BY_GROUP + 单项附加码。
 */
export function sidebarCodesFromPermissionGroup(
  groupKey: string,
  primary: string,
  itemExtra: string[] = []
): { permission: string; permissionAlternates: string[] } {
  const g = PERMISSION_GROUPS.find((x) => x.key === groupKey);
  const fromGroup = g ? g.permissions.filter((c) => c !== primary) : [];
  const legacy = SIDEBAR_LEGACY_CODES_BY_GROUP[groupKey] ?? [];
  const permissionAlternates = uniqStrings([...fromGroup, ...legacy, ...itemExtra]);
  return { permission: primary, permissionAlternates };
}

/**
 * 权限代码到名称的映射
 */
export const PERMISSION_LABELS: Record<string, string> = {
  // 看板
  'dashboard_view': '看板查看',
  'statistics_view': '统计查看',
  'report_view': '报表查看',
  'report_export': '报表导出',
  
  // 客户管理
  'customer_view': '客户查看',
  'customer_create': '客户新增',
  'customer_edit': '客户编辑',
  'customer_delete': '客户删除',
  'customer_export': '客户导出',
  'customer_seal_view': '客户签章查看',
  
  // 公司管理
  'company_view': '公司查看',
  'company_create': '公司新增',
  'company_edit': '公司编辑',
  'company_delete': '公司删除',
  'company_export': '公司导出',
  'company_transfer': '公司流转',
  'company_transfer_history_view': '公司流转历史查看',
  
  // 员工管理
  'employee_view': '员工查看',
  'employee_create': '员工新增',
  'employee_edit': '员工编辑',
  'employee_delete': '员工删除',
  'employee_export': '员工导出',
  'employee_import': '员工批量导入',
  'employee_status_view': '员工状态查看',
  'employee_status_edit': '员工状态编辑',
  
  // 文书模板
  'template_view': '模板查看',
  'template_create': '模板新增',
  'template_edit': '模板编辑',
  'template_delete': '模板删除',
  'template_enable': '模板启用',
  
  // 文书签署
  'signing_view': '签署查看',
  'signing_initiate': '签署发起',
  'signing_revoke': '签署撤回',
  'signing_delete': '签署删除',
  'signing_export': '签署导出',
  'signing_download': '签署下载',
  'signing_statistics': '签署统计',
  
  // 文书档案
  'signed_document_view': '已签文书查看',
  'signed_document_download': '已签文书下载',
  'document_history_view': '文书历史查看',
  'document_history_export': '文书历史导出',
  
  // 工资结构
  'salary_template_view': '工资结构模板查看',
  'salary_template_create': '工资结构模板新增',
  'salary_template_edit': '工资结构模板编辑',
  'salary_template_delete': '工资结构模板删除',
  
  // 工资表管理
  'salary_record_view': '工资记录查看',
  'salary_record_upload': '工资表上传',
  'salary_record_edit': '工资记录编辑',
  'salary_record_delete': '工资记录删除',
  'salary_record_export': '工资记录导出',
  'salary_split': '工资表拆分',
  
  // 工资条管理
  'salary_item_view': '工资条查看',
  'salary_item_export': '工资条导出',
  
  // 薪酬签署
  'salary_signing_view': '工资条签署查看',
  'salary_signing_initiate': '工资条签署发起',
  'salary_signing_revoke': '工资条签署撤回',
  'salary_signing_delete': '工资条签署删除',
  
  // 薪酬档案
  'salary_archive_view': '薪酬档案查看',
  'salary_archive_download': '薪酬档案下载',
  
  // 考勤管理
  'attendance_view': '考勤查看',
  'attendance_upload': '考勤上传',
  'attendance_edit': '考勤编辑',
  'attendance_delete': '考勤删除',
  'attendance_export': '考勤导出',
  'attendance_signing_view': '考勤签署查看',
  'attendance_signing_initiate': '考勤签署发起',
  'attendance_signing_revoke': '考勤签署撤回',
  'attendance_signing_delete': '考勤签署删除',
  
  // 批量操作
  'batch_download': '批量下载',
  'batch_revoke': '批量撤回',
  'batch_delete': '批量删除',
  
  // 短信通知
  'sms_send': '短信发送',
  'sms_batch_send': '批量短信发送',
  
  // 用户管理
  'user_view': '用户查看',
  'user_create': '用户新增',
  'user_edit': '用户编辑',
  'user_delete': '用户删除',
  'user_role_assign': '用户角色分配',
  
  // 角色权限
  'role_view': '角色查看',
  'role_create': '角色新增',
  'role_edit': '角色编辑',
  'role_delete': '角色删除',
  'role_permission_config': '角色权限配置',
  
  // 通知中心
  'notification_view': '通知查看',
  'notification_send': '通知发送',
  'notification_delete': '通知删除',
  
  // 操作日志
  'audit_log_view': '操作日志查看',
  'audit_log_export': '操作日志导出',
  
  // 系统配置
  'system_config_view': '系统配置查看',
  'system_config_edit': '系统配置编辑',
  'esign_config_view': '电子签配置查看',
  'esign_config_edit': '电子签配置编辑',
  'reminder_config_view': '提醒配置查看',
  'reminder_config_edit': '提醒配置编辑',
  
  // 工具箱
  'ai_assistant_use': 'AI助手使用',
  'recruitment_query_view': '招聘数据查看',
  'recruitment_query_export': '招聘数据导出',
  'identity_verification_manage': '实名认证管理',
  'identity_verification_view': '实名认证查看',
  
  // 下属管理
  'subordinate_view': '下属查看',
  'subordinate_manage': '下属管理'
};

/**
 * 获取权限名称
 */
export function getPermissionLabel(code: string): string {
  return PERMISSION_LABELS[code] || code;
}

/**
 * 根据分组key获取分组信息
 */
export function getPermissionGroup(key: string): PermissionGroup | undefined {
  return PERMISSION_GROUPS.find(g => g.key === key);
}

/**
 * 获取所有权限代码
 */
export function getAllPermissionCodes(): string[] {
  return Object.keys(PERMISSION_LABELS);
}
