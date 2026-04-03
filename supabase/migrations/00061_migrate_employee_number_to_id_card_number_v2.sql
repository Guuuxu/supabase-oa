-- 步骤1: 将employee_number中的身份证号码迁移到id_card_number字段
-- 只迁移看起来像身份证号的数据（15位或18位数字）
UPDATE employees
SET id_card_number = employee_number
WHERE id_card_number IS NULL
  AND employee_number IS NOT NULL
  AND (LENGTH(employee_number) = 15 OR LENGTH(employee_number) = 18)
  AND employee_number ~ '^[0-9]+$';

-- 步骤2: 使用临时表生成新的员工编号
WITH numbered_employees AS (
  SELECT 
    id,
    company_id,
    'EMP' || LPAD(ROW_NUMBER() OVER (PARTITION BY company_id ORDER BY created_at)::TEXT, 4, '0') as new_number
  FROM employees
  WHERE id_card_number IS NOT NULL
    AND employee_number ~ '^[0-9]+$'
    AND (LENGTH(employee_number) = 15 OR LENGTH(employee_number) = 18)
)
UPDATE employees e
SET employee_number = ne.new_number
FROM numbered_employees ne
WHERE e.id = ne.id;