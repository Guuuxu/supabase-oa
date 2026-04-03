-- 删除员工表中的工号字段
ALTER TABLE employees DROP COLUMN IF EXISTS employee_number;

-- 删除工号的唯一约束（如果存在）
-- 注意：约束可能已经随着列的删除而自动删除，这里是为了确保
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'employees_employee_number_key'
  ) THEN
    ALTER TABLE employees DROP CONSTRAINT employees_employee_number_key;
  END IF;
END $$;