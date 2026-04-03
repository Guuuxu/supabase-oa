-- 将employees表的household_address字段改为可空
ALTER TABLE employees ALTER COLUMN household_address DROP NOT NULL;
