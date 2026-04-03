-- 临时禁用触发器
ALTER TABLE employees DISABLE TRIGGER employees_audit_trigger;

-- 为现有空值设置默认值
UPDATE employees SET gender = '未知' WHERE gender IS NULL OR gender = '';
UPDATE employees SET birth_date = '1990-01-01' WHERE birth_date IS NULL;
UPDATE employees SET id_card_type = '身份证' WHERE id_card_type IS NULL OR id_card_type = '';
UPDATE employees SET household_address = '待补充' WHERE household_address IS NULL OR household_address = '';
UPDATE employees SET insurance_start_date = COALESCE(hire_date, '2020-01-01') WHERE insurance_start_date IS NULL;
UPDATE employees SET contract_end_date = COALESCE(DATE(contract_start_date) + INTERVAL '3 years', '2025-12-31') WHERE contract_end_date IS NULL;

-- 重新启用触发器
ALTER TABLE employees ENABLE TRIGGER employees_audit_trigger;

-- 设置字段为NOT NULL
ALTER TABLE employees
ALTER COLUMN gender SET NOT NULL,
ALTER COLUMN birth_date SET NOT NULL,
ALTER COLUMN id_card_type SET NOT NULL,
ALTER COLUMN household_address SET NOT NULL,
ALTER COLUMN insurance_start_date SET NOT NULL,
ALTER COLUMN contract_end_date SET NOT NULL;