-- 将员工工号字段改为可空
-- 因为工号是可选字段，用户可以不填写
ALTER TABLE employees ALTER COLUMN employee_number DROP NOT NULL;