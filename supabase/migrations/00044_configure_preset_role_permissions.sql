-- 为预设角色配置权限

-- 1. 人事经理：拥有除系统配置外的所有权限
DO $$
DECLARE
  hr_manager_role_id UUID;
BEGIN
  -- 获取人事经理角色ID
  SELECT id INTO hr_manager_role_id FROM roles WHERE name = '人事经理' LIMIT 1;
  
  IF hr_manager_role_id IS NOT NULL THEN
    -- 删除现有权限
    DELETE FROM role_permissions WHERE role_id = hr_manager_role_id;
    
    -- 添加权限（除了系统配置相关）
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT hr_manager_role_id, id FROM permissions 
    WHERE code NOT IN (
      'system_config', 'system_config_edit', 'system_config_view',
      'esign_config', 'reminder_config',
      'role_create', 'role_delete', 'role_edit'
    );
  END IF;
END $$;

-- 2. 人事主管：拥有员工管理、文书管理、下属管理权限
DO $$
DECLARE
  hr_supervisor_role_id UUID;
BEGIN
  SELECT id INTO hr_supervisor_role_id FROM roles WHERE name = '人事主管' LIMIT 1;
  
  IF hr_supervisor_role_id IS NOT NULL THEN
    DELETE FROM role_permissions WHERE role_id = hr_supervisor_role_id;
    
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT hr_supervisor_role_id, id FROM permissions 
    WHERE code IN (
      -- 员工管理
      'employee_view', 'employee_create', 'employee_edit', 'employee_delete',
      'employee_manage', 'employee_status_manage', 'employee_import',
      -- 文书管理
      'template_view', 'document_view', 'document_initiate', 'document_manage',
      'signing_status_view', 'signed_file_download',
      -- 下属管理
      'subordinate_manage',
      -- 通知
      'notification_view', 'notification_send',
      -- 看板
      'dashboard_view',
      -- 数据统计
      'statistics_view', 'report_export'
    );
  END IF;
END $$;

-- 3. 人事专员：拥有基础的员工和文书查看、操作权限
DO $$
DECLARE
  hr_specialist_role_id UUID;
BEGIN
  SELECT id INTO hr_specialist_role_id FROM roles WHERE name = '人事专员' LIMIT 1;
  
  IF hr_specialist_role_id IS NOT NULL THEN
    DELETE FROM role_permissions WHERE role_id = hr_specialist_role_id;
    
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT hr_specialist_role_id, id FROM permissions 
    WHERE code IN (
      -- 员工管理（查看和创建）
      'employee_view', 'employee_create', 'employee_manage',
      -- 文书管理（查看和发起）
      'template_view', 'document_view', 'document_initiate',
      'signing_status_view', 'signed_file_download',
      -- 通知
      'notification_view',
      -- 看板
      'dashboard_view'
    );
  END IF;
END $$;

-- 4. 系统管理员：拥有所有系统配置和管理权限
DO $$
DECLARE
  sys_admin_role_id UUID;
BEGIN
  SELECT id INTO sys_admin_role_id FROM roles WHERE name = '系统管理员' LIMIT 1;
  
  IF sys_admin_role_id IS NOT NULL THEN
    DELETE FROM role_permissions WHERE role_id = sys_admin_role_id;
    
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT sys_admin_role_id, id FROM permissions 
    WHERE code IN (
      -- 系统配置
      'system_config', 'system_config_edit', 'system_config_view',
      'esign_config', 'reminder_config',
      -- 角色权限
      'role_view', 'role_create', 'role_edit', 'role_delete',
      'role_permission_manage', 'role_assign',
      -- 用户管理
      'user_view', 'user_create', 'user_edit', 'user_delete', 'user_manage',
      -- 公司管理
      'company_view', 'company_create', 'company_edit', 'company_delete',
      'company_manage', 'company_service_status_manage',
      -- 操作日志
      'audit_log_view', 'audit_log_export',
      -- 通知管理
      'notification_view', 'notification_send', 'notification_manage',
      -- 看板
      'dashboard_view',
      -- 数据统计
      'statistics_view', 'report_export'
    );
  END IF;
END $$;

-- 5. 财务专员：拥有查看权限和报表导出
DO $$
DECLARE
  finance_role_id UUID;
BEGIN
  SELECT id INTO finance_role_id FROM roles WHERE name = '财务专员' LIMIT 1;
  
  IF finance_role_id IS NOT NULL THEN
    DELETE FROM role_permissions WHERE role_id = finance_role_id;
    
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT finance_role_id, id FROM permissions 
    WHERE code IN (
      -- 查看权限
      'employee_view', 'company_view',
      'document_view', 'signing_status_view',
      -- 数据统计
      'dashboard_view', 'statistics_view', 'report_export',
      -- 通知
      'notification_view'
    );
  END IF;
END $$;