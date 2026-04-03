-- 1. 先处理重复的联系电话，为重复的记录添加后缀
-- 保留第一条记录，其他记录的电话号码添加后缀
WITH ranked_companies AS (
  SELECT 
    id,
    contact_phone,
    ROW_NUMBER() OVER (PARTITION BY contact_phone ORDER BY created_at) as rn
  FROM companies
  WHERE contact_phone IS NOT NULL AND contact_phone != ''
)
UPDATE companies c
SET contact_phone = c.contact_phone || '-' || (rc.rn - 1)
FROM ranked_companies rc
WHERE c.id = rc.id AND rc.rn > 1;

-- 2. 添加公司名称唯一约束
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'companies_name_unique'
  ) THEN
    ALTER TABLE companies ADD CONSTRAINT companies_name_unique UNIQUE (name);
  END IF;
END $$;

-- 3. 添加联系电话唯一约束
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'companies_contact_phone_unique'
  ) THEN
    ALTER TABLE companies ADD CONSTRAINT companies_contact_phone_unique UNIQUE (contact_phone);
  END IF;
END $$;

-- 4. 更新现有的NULL值为默认值
UPDATE companies 
SET 
  contact_person = COALESCE(contact_person, '未填写'),
  contact_phone = COALESCE(contact_phone, '未填写'),
  address = COALESCE(address, '未填写'),
  service_start_date = COALESCE(service_start_date, CURRENT_DATE),
  service_end_date = COALESCE(service_end_date, CURRENT_DATE + INTERVAL '1 year'),
  payday_date = COALESCE(payday_date, 1)
WHERE 
  contact_person IS NULL 
  OR contact_phone IS NULL 
  OR address IS NULL 
  OR service_start_date IS NULL 
  OR service_end_date IS NULL
  OR payday_date IS NULL;

-- 5. 设置字段为NOT NULL
ALTER TABLE companies 
ALTER COLUMN contact_person SET NOT NULL,
ALTER COLUMN contact_phone SET NOT NULL,
ALTER COLUMN address SET NOT NULL,
ALTER COLUMN service_start_date SET NOT NULL,
ALTER COLUMN service_end_date SET NOT NULL,
ALTER COLUMN payday_date SET NOT NULL;

-- 6. 添加注释
COMMENT ON CONSTRAINT companies_name_unique ON companies IS '公司名称唯一约束';
COMMENT ON CONSTRAINT companies_contact_phone_unique ON companies IS '联系电话唯一约束';