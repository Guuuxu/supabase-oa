-- 添加身份证号码字段到employees表
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS id_card_number TEXT;

-- 添加注释
COMMENT ON COLUMN employees.id_card_number IS '身份证号码';