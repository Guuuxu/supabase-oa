-- ==========================================
-- 1. 先插入缺失的角色（人事专员、人事主管、人事经理）
-- ==========================================
-- 人事专员 role_id = '11111111-1111-1111-1111-111111111111'
INSERT INTO roles (id, name, description)
VALUES ('11111111-1111-1111-1111-111111111111', '人事专员', '负责基础员工管理')
ON CONFLICT (id) DO NOTHING;

-- 人事主管 role_id = '22222222-2222-2222-2222-222222222222'
INSERT INTO roles (id, name, description)
VALUES ('22222222-2222-2222-2222-222222222222', '人事主管', '负责员工管理审批')
ON CONFLICT (id) DO NOTHING;

-- 人事经理 role_id = '33333333-3333-3333-3333-333333333333'
INSERT INTO roles (id, name, description)
VALUES ('33333333-3333-3333-3333-333333333333', '人事经理', '负责全面员工管理')
ON CONFLICT (id) DO NOTHING;

-- 修复员工创建权限问题
-- 为人事专员、人事主管、人事经理添加员工管理相关权限

-- 人事专员权限（基础权限）
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '11111111-1111-1111-1111-111111111111'::uuid,
  id
FROM permissions
WHERE code IN (
  'employee_view',      -- 员工查看
  'employee_create',    -- 员工创建
  'employee_edit',      -- 员工编辑
  'employee_manage'     -- 员工录入
)
ON CONFLICT DO NOTHING;

-- 人事主管权限（增加删除和状态管理）
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '22222222-2222-2222-2222-222222222222'::uuid,
  id
FROM permissions
WHERE code IN (
  'employee_view',              -- 员工查看
  'employee_create',            -- 员工创建
  'employee_edit',              -- 员工编辑
  'employee_manage',            -- 员工录入
  'employee_delete',            -- 员工删除
  'employee_status_manage',     -- 员工状态管理
  'employee_import'             -- 员工批量导入
)
ON CONFLICT DO NOTHING;

-- 人事经理权限（全部员工权限）
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '33333333-3333-3333-3333-333333333333'::uuid,
  id
FROM permissions
WHERE code IN (
  'employee_view',              -- 员工查看
  'employee_create',            -- 员工创建
  'employee_edit',              -- 员工编辑
  'employee_manage',            -- 员工录入
  'employee_delete',            -- 员工删除
  'employee_status_manage',     -- 员工状态管理
  'employee_import'             -- 员工批量导入
)
ON CONFLICT DO NOTHING;

-- 为人事角色添加公司查看权限（员工创建需要选择公司）
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  role_id,
  id
FROM permissions, (
  SELECT '11111111-1111-1111-1111-111111111111'::uuid as role_id
  UNION ALL
  SELECT '22222222-2222-2222-2222-222222222222'::uuid
  UNION ALL
  SELECT '33333333-3333-3333-3333-333333333333'::uuid
) roles
WHERE code = 'company_view'
ON CONFLICT DO NOTHING;

-- 为人事角色添加文书相关权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  role_id,
  id
FROM permissions, (
  SELECT '11111111-1111-1111-1111-111111111111'::uuid as role_id
  UNION ALL
  SELECT '22222222-2222-2222-2222-222222222222'::uuid
  UNION ALL
  SELECT '33333333-3333-3333-3333-333333333333'::uuid
) roles
WHERE code IN (
  'document_view',      -- 文书查看
  'document_initiate',  -- 文书发起
  'template_view'       -- 文书模板查看
)
ON CONFLICT DO NOTHING;

-- 为人事主管和经理添加文书管理权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  role_id,
  id
FROM permissions, (
  SELECT '22222222-2222-2222-2222-222222222222'::uuid as role_id
  UNION ALL
  SELECT '33333333-3333-3333-3333-333333333333'::uuid
) roles
WHERE code IN (
  'document_manage',    -- 文书管理
  'template_create',    -- 文书模板创建
  'template_edit',      -- 文书模板编辑
  'template_delete'     -- 文书模板删除
)
ON CONFLICT DO NOTHING;

-- 为所有人事角色添加看板和通知权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  role_id,
  id
FROM permissions, (
  SELECT '11111111-1111-1111-1111-111111111111'::uuid as role_id
  UNION ALL
  SELECT '22222222-2222-2222-2222-222222222222'::uuid
  UNION ALL
  SELECT '33333333-3333-3333-3333-333333333333'::uuid
) roles
WHERE code IN (
  'dashboard_view',         -- 看板
  'notification_view',      -- 通知查看
  'notification_manage'     -- 通知管理
)
ON CONFLICT DO NOTHING;