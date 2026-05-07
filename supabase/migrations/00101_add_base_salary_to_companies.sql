-- 公司表增加基本薪资（元），可选
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS base_salary DECIMAL(15, 2);

COMMENT ON COLUMN companies.base_salary IS '基本薪资（元），可为空';
