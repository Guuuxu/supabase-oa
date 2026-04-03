-- 创建预设角色并配置权限

-- 创建预设角色（如果不存在）
DO $$
DECLARE
  v_super_admin_id uuid;
  v_manager_id uuid;
  v_employee_id uuid;
BEGIN
  -- 创建或获取超级管理员角色
  INSERT INTO roles (name, description, is_system_role)
  VALUES ('超级管理员', '系统最高权限角色，拥有所有功能权限', true)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_super_admin_id;
  
  IF v_super_admin_id IS NULL THEN
    SELECT id INTO v_super_admin_id FROM roles WHERE name = '超级管理员' AND is_system_role = true;
  END IF;
  
  -- 创建或获取主管角色
  INSERT INTO roles (name, description, is_system_role)
  VALUES ('主管', '业务主管角色，拥有大部分业务功能权限', true)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_manager_id;
  
  IF v_manager_id IS NULL THEN
    SELECT id INTO v_manager_id FROM roles WHERE name = '主管' AND is_system_role = true;
  END IF;
  
  -- 创建或获取员工角色
  INSERT INTO roles (name, description, is_system_role)
  VALUES ('员工', '普通员工角色，只有基本查看权限', true)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_employee_id;
  
  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM roles WHERE name = '员工' AND is_system_role = true;
  END IF;
  
  -- 删除旧的权限配置
  DELETE FROM role_permissions WHERE role_id IN (v_super_admin_id, v_manager_id, v_employee_id);
  
  -- 为超级管理员分配所有权限
  INSERT INTO role_permissions (role_id, permission_id)
  SELECT v_super_admin_id, id FROM permissions;
  
  -- 为主管分配权限
  INSERT INTO role_permissions (role_id, permission_id)
  SELECT v_manager_id, id FROM permissions
  WHERE code IN (
    'dashboard_view', 'statistics_view', 'report_view', 'report_export',
    'customer_view', 'customer_create', 'customer_edit', 'customer_export', 'customer_seal_view',
    'company_view', 'company_create', 'company_edit', 'company_export', 'company_transfer_history_view',
    'employee_view', 'employee_create', 'employee_edit', 'employee_delete', 'employee_export', 'employee_import', 'employee_status_view', 'employee_status_edit',
    'template_view', 'template_create', 'template_edit', 'template_enable',
    'signing_view', 'signing_initiate', 'signing_revoke', 'signing_delete', 'signing_export', 'signing_download', 'signing_statistics',
    'signed_document_view', 'signed_document_download', 'document_history_view', 'document_history_export',
    'salary_template_view', 'salary_template_create', 'salary_template_edit',
    'salary_record_view', 'salary_record_upload', 'salary_record_edit', 'salary_record_delete', 'salary_record_export', 'salary_split',
    'salary_item_view', 'salary_item_export',
    'salary_signing_view', 'salary_signing_initiate', 'salary_signing_revoke', 'salary_signing_delete',
    'salary_archive_view', 'salary_archive_download',
    'attendance_view', 'attendance_upload', 'attendance_edit', 'attendance_delete', 'attendance_export',
    'attendance_signing_view', 'attendance_signing_initiate', 'attendance_signing_revoke', 'attendance_signing_delete',
    'batch_download', 'batch_revoke', 'batch_delete',
    'sms_send', 'sms_batch_send',
    'notification_view', 'notification_send',
    'audit_log_view', 'audit_log_export',
    'ai_assistant_use', 'recruitment_query_view', 'recruitment_query_export',
    'subordinate_view', 'subordinate_manage'
  );
  
  -- 为员工分配权限
  INSERT INTO role_permissions (role_id, permission_id)
  SELECT v_employee_id, id FROM permissions
  WHERE code IN ('dashboard_view', 'notification_view', 'ai_assistant_use');
  
END $$;