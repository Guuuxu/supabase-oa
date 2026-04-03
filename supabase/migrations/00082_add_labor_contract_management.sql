-- 1. 修改employees表，增加劳动合同签订次数字段
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS contract_count INTEGER DEFAULT 0;

COMMENT ON COLUMN employees.contract_count IS '劳动合同签订次数';

-- 2. 创建劳动合同历史记录表
CREATE TABLE IF NOT EXISTS labor_contract_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  contract_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  contract_type TEXT NOT NULL DEFAULT '固定期限',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE labor_contract_history IS '劳动合同历史记录表';
COMMENT ON COLUMN labor_contract_history.contract_number IS '第几次合同';
COMMENT ON COLUMN labor_contract_history.start_date IS '合同开始日期';
COMMENT ON COLUMN labor_contract_history.end_date IS '合同结束日期（无固定期限时为空）';
COMMENT ON COLUMN labor_contract_history.contract_type IS '合同类型：固定期限、无固定期限';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_labor_contract_history_employee ON labor_contract_history(employee_id);
CREATE INDEX IF NOT EXISTS idx_labor_contract_history_company ON labor_contract_history(company_id);

-- 3. 创建员工文书签署记录表
CREATE TABLE IF NOT EXISTS employee_document_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  template_category TEXT,
  signed_at TIMESTAMPTZ,
  signed_year INTEGER,
  file_url TEXT,
  signing_record_id UUID REFERENCES signing_records(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE employee_document_records IS '员工文书签署记录表';
COMMENT ON COLUMN employee_document_records.document_type IS '文书类型：劳动合同、保密协议、员工手册等';
COMMENT ON COLUMN employee_document_records.document_name IS '文书名称';
COMMENT ON COLUMN employee_document_records.template_category IS '文书模板大类：入职管理、在职管理、离职管理等';
COMMENT ON COLUMN employee_document_records.signed_at IS '签署时间';
COMMENT ON COLUMN employee_document_records.signed_year IS '签署年份（用于筛选）';
COMMENT ON COLUMN employee_document_records.signing_record_id IS '关联的签署记录ID';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_employee_document_records_employee ON employee_document_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_document_records_company ON employee_document_records(company_id);
CREATE INDEX IF NOT EXISTS idx_employee_document_records_type ON employee_document_records(document_type);
CREATE INDEX IF NOT EXISTS idx_employee_document_records_year ON employee_document_records(signed_year);

-- 4. 启用RLS
ALTER TABLE labor_contract_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_document_records ENABLE ROW LEVEL SECURITY;

-- 5. 创建RLS策略
-- labor_contract_history表策略
CREATE POLICY "允许认证用户查看劳动合同历史" ON labor_contract_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "允许认证用户插入劳动合同历史" ON labor_contract_history
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "允许认证用户更新劳动合同历史" ON labor_contract_history
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "允许认证用户删除劳动合同历史" ON labor_contract_history
  FOR DELETE TO authenticated USING (true);

-- employee_document_records表策略
CREATE POLICY "允许认证用户查看员工文书记录" ON employee_document_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "允许认证用户插入员工文书记录" ON employee_document_records
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "允许认证用户更新员工文书记录" ON employee_document_records
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "允许认证用户删除员工文书记录" ON employee_document_records
  FOR DELETE TO authenticated USING (true);