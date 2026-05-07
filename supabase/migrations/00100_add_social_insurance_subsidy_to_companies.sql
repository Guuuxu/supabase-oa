-- 公司表增加社保补贴（元），可选
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS social_insurance_subsidy DECIMAL(15, 2);

COMMENT ON COLUMN companies.social_insurance_subsidy IS '社保补贴（元），可为空';
