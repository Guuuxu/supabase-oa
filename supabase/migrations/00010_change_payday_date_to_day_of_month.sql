
-- 修改payday_date字段类型为integer，存储每月的发薪日（1-31）
ALTER TABLE companies DROP COLUMN payday_date;
ALTER TABLE companies ADD COLUMN payday_date INTEGER;

-- 添加约束：发薪日必须在1-31之间
ALTER TABLE companies ADD CONSTRAINT payday_date_range CHECK (payday_date >= 1 AND payday_date <= 31);

-- 添加注释
COMMENT ON COLUMN companies.payday_date IS '每月发薪日（1-31），如15表示每月15号发薪';
