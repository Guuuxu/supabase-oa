
-- 创建操作类型枚举
CREATE TYPE operation_type AS ENUM (
  'login',              -- 登录
  'logout',             -- 登出
  'company_create',     -- 创建公司
  'company_update',     -- 更新公司
  'company_delete',     -- 删除公司
  'company_transfer',   -- 流转公司
  'employee_create',    -- 创建员工
  'employee_update',    -- 更新员工
  'employee_delete',    -- 删除员工
  'employee_import',    -- 导入员工
  'template_create',    -- 创建文书模板
  'template_update',    -- 更新文书模板
  'template_delete',    -- 删除文书模板
  'signing_initiate',   -- 发起签署
  'signing_employee',   -- 员工签署
  'signing_company',    -- 公司签署
  'user_create',        -- 创建用户
  'user_update',        -- 更新用户
  'user_delete',        -- 删除用户
  'role_create',        -- 创建角色
  'role_update',        -- 更新角色
  'role_delete',        -- 删除角色
  'permission_assign',  -- 分配权限
  'config_update',      -- 更新配置
  'notification_send'   -- 发送通知
);

-- 创建操作日志表
CREATE TABLE operation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  operation_type operation_type NOT NULL,
  operation_detail text NOT NULL,
  target_type text,
  target_id uuid,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX idx_operation_logs_user_id ON operation_logs(user_id);
CREATE INDEX idx_operation_logs_operation_type ON operation_logs(operation_type);
CREATE INDEX idx_operation_logs_created_at ON operation_logs(created_at DESC);
CREATE INDEX idx_operation_logs_target ON operation_logs(target_type, target_id);

-- 添加注释
COMMENT ON TABLE operation_logs IS '操作日志表';
COMMENT ON COLUMN operation_logs.user_id IS '操作用户ID';
COMMENT ON COLUMN operation_logs.operation_type IS '操作类型';
COMMENT ON COLUMN operation_logs.operation_detail IS '操作详情';
COMMENT ON COLUMN operation_logs.target_type IS '目标对象类型（如company、employee等）';
COMMENT ON COLUMN operation_logs.target_id IS '目标对象ID';
COMMENT ON COLUMN operation_logs.ip_address IS 'IP地址';
COMMENT ON COLUMN operation_logs.user_agent IS '用户代理';
COMMENT ON COLUMN operation_logs.created_at IS '操作时间';

-- RLS策略
ALTER TABLE operation_logs ENABLE ROW LEVEL SECURITY;

-- 超级管理员可以查看所有日志
CREATE POLICY "超级管理员可以查看所有操作日志"
ON operation_logs
FOR SELECT
TO authenticated
USING (is_super_admin(uid()));

-- 用户可以查看自己和下级的操作日志
CREATE POLICY "用户可以查看自己和下级的操作日志"
ON operation_logs
FOR SELECT
TO authenticated
USING (
  has_permission(uid(), 'system_config_view') AND
  user_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
);

-- 所有认证用户都可以插入日志（系统自动记录）
CREATE POLICY "认证用户可以创建操作日志"
ON operation_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = uid());
