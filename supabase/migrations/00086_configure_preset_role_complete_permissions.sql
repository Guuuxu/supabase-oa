-- 配置预设角色的完整权限
-- 为超级管理员、主管、员工三个预设角色配置详细权限
-- 给系统角色创建唯一索引（name + is_system_role）
CREATE UNIQUE INDEX IF NOT EXISTS idx_roles_name_system_role ON roles(name, is_system_role)
WHERE is_system_role = true;
-- ==================== 0. 创建预设角色（如果不存在） ====================
INSERT INTO roles (name, description, is_system_role) VALUES
('超级管理员', '系统最高权限角色，拥有所有功能权限', true),
('主管', '业务主管角色，拥有大部分业务功能权限', true),
('员工', '普通员工角色，只有基本查看权限', true)
ON CONFLICT (name, is_system_role) WHERE is_system_role = true DO UPDATE SET
  description = EXCLUDED.description;

-- ==================== 1. 超级管理员角色权限配置 ====================
-- 超级管理员拥有所有权限

-- 先删除超级管理员的旧权限配置
DELETE FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE name = '超级管理员' AND is_system_role = true);

-- 为超级管理员分配所有权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = '超级管理员' AND is_system_role = true),
  id
FROM permissions
ON CONFLICT DO NOTHING;

-- ==================== 2. 主管角色权限配置 ====================
-- 主管拥有大部分业务权限，但不包括系统配置和用户角色管理

-- 先删除主管的旧权限配置
DELETE FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE name = '主管' AND is_system_role = true);

-- 为主管分配权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = '主管' AND is_system_role = true),
  id
FROM permissions
WHERE code IN (
  -- 看板
  'dashboard_view',
  'statistics_view',
  'report_view',
  'report_export',
  
  -- 客户管理
  'customer_view',
  'customer_create',
  'customer_edit',
  'customer_export',
  'customer_seal_view',
  
  -- 公司管理
  'company_view',
  'company_create',
  'company_edit',
  'company_export',
  'company_transfer_history_view',
  
  -- 员工管理
  'employee_view',
  'employee_create',
  'employee_edit',
  'employee_delete',
  'employee_export',
  'employee_import',
  'employee_status_view',
  'employee_status_edit',
  
  -- 文书模板
  'template_view',
  'template_create',
  'template_edit',
  'template_enable',
  
  -- 文书签署
  'signing_view',
  'signing_initiate',
  'signing_revoke',
  'signing_delete',
  'signing_export',
  'signing_download',
  'signing_statistics',
  
  -- 文书档案
  'signed_document_view',
  'signed_document_download',
  'document_history_view',
  'document_history_export',
  
  -- 工资结构
  'salary_template_view',
  'salary_template_create',
  'salary_template_edit',
  
  -- 工资表管理
  'salary_record_view',
  'salary_record_upload',
  'salary_record_edit',
  'salary_record_delete',
  'salary_record_export',
  'salary_split',
  
  -- 工资条管理
  'salary_item_view',
  'salary_item_export',
  
  -- 薪酬签署
  'salary_signing_view',
  'salary_signing_initiate',
  'salary_signing_revoke',
  'salary_signing_delete',
  
  -- 薪酬档案
  'salary_archive_view',
  'salary_archive_download',
  
  -- 考勤管理
  'attendance_view',
  'attendance_upload',
  'attendance_edit',
  'attendance_delete',
  'attendance_export',
  'attendance_signing_view',
  'attendance_signing_initiate',
  'attendance_signing_revoke',
  'attendance_signing_delete',
  
  -- 批量操作
  'batch_download',
  'batch_revoke',
  'batch_delete',
  
  -- 短信通知
  'sms_send',
  'sms_batch_send',
  
  -- 通知中心
  'notification_view',
  'notification_send',
  
  -- 操作日志
  'audit_log_view',
  'audit_log_export',
  
  -- 工具箱
  'ai_assistant_use',
  'recruitment_query_view',
  'recruitment_query_export',
  
  -- 下属管理
  'subordinate_view',
  'subordinate_manage'
)
ON CONFLICT DO NOTHING;

-- ==================== 3. 员工角色权限配置 ====================
-- 员工只有基本的查看权限

-- 先删除员工的旧权限配置
DELETE FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE name = '员工' AND is_system_role = true);

-- 为员工分配权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = '员工' AND is_system_role = true),
  id
FROM permissions
WHERE code IN (
  -- 看板
  'dashboard_view',
  
  -- 通知中心
  'notification_view',
  
  -- 工具箱
  'ai_assistant_use'
)
ON CONFLICT DO NOTHING;

-- 添加注释
COMMENT ON TABLE role_permissions IS '角色权限关联表，存储角色和权限的多对多关系';
