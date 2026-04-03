-- 为employees表添加address字段
ALTER TABLE employees ADD COLUMN IF NOT EXISTS address TEXT;

-- 添加注释
COMMENT ON COLUMN employees.address IS '员工住址';