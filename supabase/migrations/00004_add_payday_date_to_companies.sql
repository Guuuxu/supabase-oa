-- 为公司表添加发薪日期字段
ALTER TABLE companies
ADD COLUMN payday_date DATE;

COMMENT ON COLUMN companies.payday_date IS '发薪日期';
