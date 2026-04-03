-- 确保 uuid-ossp 扩展存在（提供 uuid_generate_v4 函数）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建薪酬签署类型枚举
CREATE TYPE salary_signature_type AS ENUM ('salary_slip', 'attendance_record');

-- 创建薪酬签署状态枚举
CREATE TYPE salary_signature_status AS ENUM ('pending', 'sent', 'signed', 'rejected');

-- 创建薪酬签署表
CREATE TABLE salary_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type salary_signature_type NOT NULL,
  reference_id UUID NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  status salary_signature_status NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX idx_salary_signatures_company ON salary_signatures(company_id);
CREATE INDEX idx_salary_signatures_employee ON salary_signatures(employee_id);
CREATE INDEX idx_salary_signatures_status ON salary_signatures(status);
CREATE INDEX idx_salary_signatures_year_month ON salary_signatures(year, month);

-- 添加注释
COMMENT ON TABLE salary_signatures IS '薪酬签署记录表';
COMMENT ON COLUMN salary_signatures.type IS '签署类型：salary_slip工资条、attendance_record考勤确认表';
COMMENT ON COLUMN salary_signatures.reference_id IS '关联的工资记录或考勤记录ID';
COMMENT ON COLUMN salary_signatures.status IS '签署状态：pending待签署、sent已发送、signed已签署、rejected已拒签';

-- 启用RLS
ALTER TABLE salary_signatures ENABLE ROW LEVEL SECURITY;

-- RLS策略：超级管理员和有权限的用户可以查看
CREATE POLICY "salary_signatures_select_policy" ON salary_signatures
  FOR SELECT
  USING (
    is_super_admin(uid()) OR 
    can_access_company_data(uid(), company_id)
  );

-- RLS策略：超级管理员和有权限的用户可以插入
CREATE POLICY "salary_signatures_insert_policy" ON salary_signatures
  FOR INSERT
  WITH CHECK (
    is_super_admin(uid()) OR 
    can_access_company_data(uid(), company_id)
  );

-- RLS策略：超级管理员和有权限的用户可以更新
CREATE POLICY "salary_signatures_update_policy" ON salary_signatures
  FOR UPDATE
  USING (
    is_super_admin(uid()) OR 
    can_access_company_data(uid(), company_id)
  );

-- RLS策略：超级管理员可以删除
CREATE POLICY "salary_signatures_delete_policy" ON salary_signatures
  FOR DELETE
  USING (is_super_admin(uid()));