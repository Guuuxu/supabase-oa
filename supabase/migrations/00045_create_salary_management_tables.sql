-- 创建工资结构模板表
CREATE TABLE IF NOT EXISTS salary_structure_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL, -- 工资结构字段定义，例如：[{"name": "基本工资", "code": "base_salary", "type": "number"}, ...]
  is_default BOOLEAN DEFAULT false, -- 是否为默认模板
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE salary_structure_templates IS '工资结构模板表';
COMMENT ON COLUMN salary_structure_templates.fields IS '工资结构字段定义JSON';

-- 创建工资记录表（每月的工资表）
CREATE TABLE IF NOT EXISTS salary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  template_id UUID REFERENCES salary_structure_templates(id) ON DELETE SET NULL,
  year INTEGER NOT NULL, -- 年份
  month INTEGER NOT NULL, -- 月份
  file_name TEXT, -- 上传的文件名
  file_url TEXT, -- 上传的文件URL
  total_amount DECIMAL(15, 2), -- 总金额
  employee_count INTEGER, -- 员工数量
  status TEXT DEFAULT 'pending', -- 状态：pending（待处理）、processed（已处理）、sent（已发送）
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, year, month)
);

COMMENT ON TABLE salary_records IS '工资记录表';

-- 创建工资条明细表
CREATE TABLE IF NOT EXISTS salary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salary_record_id UUID NOT NULL REFERENCES salary_records(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  employee_number TEXT, -- 身份证号码
  data JSONB NOT NULL, -- 工资明细数据，例如：{"base_salary": 5000, "bonus": 1000, ...}
  total_amount DECIMAL(15, 2) NOT NULL, -- 实发工资
  is_sent BOOLEAN DEFAULT false, -- 是否已发送给员工
  sent_at TIMESTAMPTZ, -- 发送时间
  is_viewed BOOLEAN DEFAULT false, -- 员工是否已查看
  viewed_at TIMESTAMPTZ, -- 查看时间
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE salary_items IS '工资条明细表';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_salary_structure_templates_company ON salary_structure_templates(company_id);
CREATE INDEX IF NOT EXISTS idx_salary_records_company ON salary_records(company_id);
CREATE INDEX IF NOT EXISTS idx_salary_records_year_month ON salary_records(year, month);
CREATE INDEX IF NOT EXISTS idx_salary_items_record ON salary_items(salary_record_id);
CREATE INDEX IF NOT EXISTS idx_salary_items_employee ON salary_items(employee_id);

-- 添加RLS策略
ALTER TABLE salary_structure_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_items ENABLE ROW LEVEL SECURITY;

-- 工资结构模板策略
CREATE POLICY "用户可以查看所属公司的工资结构模板" ON salary_structure_templates
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "用户可以创建工资结构模板" ON salary_structure_templates
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "用户可以更新工资结构模板" ON salary_structure_templates
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "用户可以删除工资结构模板" ON salary_structure_templates
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM auth.users WHERE id = auth.uid()
    )
  );

-- 工资记录策略
CREATE POLICY "用户可以查看所属公司的工资记录" ON salary_records
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "用户可以创建工资记录" ON salary_records
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "用户可以更新工资记录" ON salary_records
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "用户可以删除工资记录" ON salary_records
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM auth.users WHERE id = auth.uid()
    )
  );

-- 工资条明细策略
CREATE POLICY "用户可以查看所属公司的工资条" ON salary_items
  FOR SELECT USING (
    salary_record_id IN (
      SELECT id FROM salary_records WHERE company_id IN (
        SELECT company_id FROM auth.users WHERE id = auth.uid()
      )
    )
    OR employee_id IN (
      SELECT id FROM employees WHERE id IN (
        SELECT employee_id FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "用户可以创建工资条" ON salary_items
  FOR INSERT WITH CHECK (
    salary_record_id IN (
      SELECT id FROM salary_records WHERE company_id IN (
        SELECT company_id FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "用户可以更新工资条" ON salary_items
  FOR UPDATE USING (
    salary_record_id IN (
      SELECT id FROM salary_records WHERE company_id IN (
        SELECT company_id FROM auth.users WHERE id = auth.uid()
      )
    )
  );