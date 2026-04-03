
-- 为signing_records表添加表单数据字段
ALTER TABLE signing_records
ADD COLUMN IF NOT EXISTS employee_form_data JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS company_form_data JSONB DEFAULT NULL;

COMMENT ON COLUMN signing_records.employee_form_data IS '员工表单数据（JSON格式）：姓名、身份证、手机、邮箱、部门、岗位、入职日期、合同期限等';
COMMENT ON COLUMN signing_records.company_form_data IS '公司表单数据（JSON格式）：公司名称、统一信用代码、地址、联系人、联系电话、法定代表人等';
