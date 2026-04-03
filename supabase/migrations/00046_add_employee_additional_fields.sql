-- 添加员工额外字段
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS id_card_type TEXT DEFAULT '身份证',
ADD COLUMN IF NOT EXISTS household_address TEXT,
ADD COLUMN IF NOT EXISTS insurance_start_date DATE;

-- 添加注释
COMMENT ON COLUMN employees.gender IS '性别';
COMMENT ON COLUMN employees.birth_date IS '出生年月日';
COMMENT ON COLUMN employees.id_card_type IS '身份证号码输入类型';
COMMENT ON COLUMN employees.household_address IS '户籍地址';
COMMENT ON COLUMN employees.insurance_start_date IS '五险参保时间';