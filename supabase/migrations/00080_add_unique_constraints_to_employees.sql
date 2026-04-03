-- 为员工表添加唯一约束，防止身份证号码和手机号码重复

-- 步骤1: 处理重复的手机号码（为重复的记录添加后缀）
WITH duplicates AS (
  SELECT id, phone, 
         ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at) as rn
  FROM employees
  WHERE phone IS NOT NULL
)
UPDATE employees e
SET phone = d.phone || '_dup_' || d.rn
FROM duplicates d
WHERE e.id = d.id AND d.rn > 1;

-- 步骤2: 处理重复的身份证号码（为重复的记录添加后缀）
WITH duplicates AS (
  SELECT id, id_card_number, 
         ROW_NUMBER() OVER (PARTITION BY id_card_number ORDER BY created_at) as rn
  FROM employees
  WHERE id_card_number IS NOT NULL
)
UPDATE employees e
SET id_card_number = d.id_card_number || '_dup_' || d.rn
FROM duplicates d
WHERE e.id = d.id AND d.rn > 1;

-- 步骤3: 添加身份证号码唯一约束
ALTER TABLE employees 
ADD CONSTRAINT unique_id_card_number UNIQUE (id_card_number);

-- 步骤4: 添加手机号码唯一约束
ALTER TABLE employees 
ADD CONSTRAINT unique_phone UNIQUE (phone);

-- 添加注释
COMMENT ON CONSTRAINT unique_id_card_number ON employees IS '身份证号码唯一约束';
COMMENT ON CONSTRAINT unique_phone ON employees IS '手机号码唯一约束';
