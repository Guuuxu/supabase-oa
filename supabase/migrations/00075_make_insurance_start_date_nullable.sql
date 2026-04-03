-- 将employees表的insurance_start_date字段改为可空
ALTER TABLE employees ALTER COLUMN insurance_start_date DROP NOT NULL;
