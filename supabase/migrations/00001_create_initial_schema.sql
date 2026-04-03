-- 创建用户角色枚举
CREATE TYPE user_role AS ENUM ('super_admin', 'manager', 'employee');

-- 创建员工状态枚举
CREATE TYPE employee_status AS ENUM ('active', 'on_leave', 'vacation', 'standby', 'business_trip', 'resigned');

-- 创建文书分类枚举
CREATE TYPE document_category AS ENUM (
  'onboarding',      -- 入职管理
  'employment',      -- 在职管理
  'resignation',     -- 离职管理
  'compensation',    -- 薪酬管理
  'certificate'      -- 证明开具
);

-- 创建签署状态枚举
CREATE TYPE signing_status AS ENUM ('pending', 'employee_signed', 'company_signed', 'completed', 'rejected');

-- 创建通知类型枚举
CREATE TYPE notification_type AS ENUM ('contract_expiry', 'document_signing', 'employee_onboarding', 'system');

-- 创建用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'employee',
  company_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建公司表
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  contact_person TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建员工表
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  employee_number TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  position TEXT,
  department TEXT,
  status employee_status NOT NULL DEFAULT 'active',
  hire_date DATE,
  contract_start_date DATE,
  contract_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, employee_number)
);

-- 创建文书模板表
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category document_category NOT NULL,
  content TEXT,
  requires_company_signature BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建签署记录表
CREATE TABLE signing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  template_ids UUID[] NOT NULL,
  status signing_status NOT NULL DEFAULT 'pending',
  employee_signed_at TIMESTAMPTZ,
  company_signed_at TIMESTAMPTZ,
  third_party_signing_id TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建权限表
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建角色表
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  is_system_role BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建角色权限关联表
CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 创建用户角色关联表
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- 创建通知表
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建提醒配置表
CREATE TABLE reminder_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  contract_expiry_days INTEGER DEFAULT 30,
  enable_sms BOOLEAN DEFAULT TRUE,
  enable_in_app BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加外键约束
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_company 
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- 创建索引
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_contract_end ON employees(contract_end_date);
CREATE INDEX idx_document_templates_company ON document_templates(company_id);
CREATE INDEX idx_document_templates_category ON document_templates(category);
CREATE INDEX idx_signing_records_company ON signing_records(company_id);
CREATE INDEX idx_signing_records_employee ON signing_records(employee_id);
CREATE INDEX idx_signing_records_status ON signing_records(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- 插入系统权限
INSERT INTO permissions (code, name, description) VALUES
  ('company_manage', '公司录入', '管理公司信息'),
  ('employee_manage', '员工录入', '管理员工信息'),
  ('employee_status_manage', '员工状态管理', '修改员工状态'),
  ('document_initiate', '文书发起', '发起文书签署'),
  ('system_config', '系统配置', '系统配置管理'),
  ('role_assign', '角色分配', '分配用户角色'),
  ('user_manage', '用户管理', '管理系统用户'),
  ('template_manage', '文书模板增加', '管理文书模板'),
  ('document_manage', '文书管理', '管理文书记录'),
  ('dashboard_view', '看板', '查看数据看板'),
  ('subordinate_manage', '下属管理', '管理下属员工');

-- 创建辅助函数：检查是否为超级管理员
CREATE OR REPLACE FUNCTION is_super_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = uid AND role = 'super_admin'
  );
$$;

-- 创建辅助函数：检查是否为管理员（超级管理员或主管）
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = uid AND role IN ('super_admin', 'manager')
  );
$$;

-- 创建触发器函数：新用户注册后同步到profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
  extracted_username TEXT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- 从email中提取用户名（去掉@miaoda.com）
  extracted_username := REPLACE(NEW.email, '@miaoda.com', '');
  
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    extracted_username,
    CASE WHEN user_count = 0 THEN 'super_admin'::user_role ELSE 'employee'::user_role END
  );
  
  RETURN NEW;
END;
$$;

-- 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 为各表添加更新时间触发器
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON document_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_signing_records_updated_at BEFORE UPDATE ON signing_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reminder_configs_updated_at BEFORE UPDATE ON reminder_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 启用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE signing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_configs ENABLE ROW LEVEL SECURITY;

-- Profiles策略
CREATE POLICY "超级管理员可以查看所有用户" ON profiles
  FOR SELECT TO authenticated USING (is_super_admin(auth.uid()));

CREATE POLICY "用户可以查看自己的资料" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "超级管理员可以更新所有用户" ON profiles
  FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));

CREATE POLICY "用户可以更新自己的资料（除角色外）" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Companies策略
CREATE POLICY "管理员可以查看所有公司" ON companies
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "员工可以查看自己所属公司" ON companies
  FOR SELECT TO authenticated USING (
    id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "超级管理员可以管理公司" ON companies
  FOR ALL TO authenticated USING (is_super_admin(auth.uid()));

-- Employees策略
CREATE POLICY "管理员可以查看所有员工" ON employees
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "员工可以查看同公司员工" ON employees
  FOR SELECT TO authenticated USING (
    company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "管理员可以管理员工" ON employees
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Document Templates策略
CREATE POLICY "所有认证用户可以查看文书模板" ON document_templates
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "管理员可以管理文书模板" ON document_templates
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Signing Records策略
CREATE POLICY "管理员可以查看所有签署记录" ON signing_records
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "员工可以查看相关签署记录" ON signing_records
  FOR SELECT TO authenticated USING (
    employee_id IN (SELECT id FROM employees WHERE company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    ))
  );

CREATE POLICY "管理员可以管理签署记录" ON signing_records
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Permissions策略
CREATE POLICY "所有认证用户可以查看权限" ON permissions
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "超级管理员可以管理权限" ON permissions
  FOR ALL TO authenticated USING (is_super_admin(auth.uid()));

-- Roles策略
CREATE POLICY "所有认证用户可以查看角色" ON roles
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "超级管理员可以管理角色" ON roles
  FOR ALL TO authenticated USING (is_super_admin(auth.uid()));

-- Role Permissions策略
CREATE POLICY "所有认证用户可以查看角色权限" ON role_permissions
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "超级管理员可以管理角色权限" ON role_permissions
  FOR ALL TO authenticated USING (is_super_admin(auth.uid()));

-- User Roles策略
CREATE POLICY "所有认证用户可以查看用户角色" ON user_roles
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "超级管理员可以管理用户角色" ON user_roles
  FOR ALL TO authenticated USING (is_super_admin(auth.uid()));

-- Notifications策略
CREATE POLICY "用户可以查看自己的通知" ON notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以更新自己的通知" ON notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "管理员可以创建通知" ON notifications
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

-- Reminder Configs策略
CREATE POLICY "所有认证用户可以查看提醒配置" ON reminder_configs
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "超级管理员可以管理提醒配置" ON reminder_configs
  FOR ALL TO authenticated USING (is_super_admin(auth.uid()));