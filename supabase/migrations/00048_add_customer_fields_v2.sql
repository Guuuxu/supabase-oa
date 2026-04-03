-- 禁用触发器
ALTER TABLE companies DISABLE TRIGGER companies_audit_trigger;

-- 添加新字段
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT '其他',
ADD COLUMN IF NOT EXISTS region TEXT DEFAULT '湖北省',
ADD COLUMN IF NOT EXISTS employee_scale TEXT DEFAULT '0-50人';

-- 修改service_status字段类型
-- 先添加新的TEXT类型字段
ALTER TABLE companies ADD COLUMN IF NOT EXISTS service_status_text TEXT;

-- 将boolean值转换为文本
UPDATE companies SET service_status_text = CASE 
  WHEN service_status = true THEN '服务中'
  WHEN service_status = false THEN '已到期'
  ELSE '服务中'
END;

-- 删除旧字段
ALTER TABLE companies DROP COLUMN service_status;

-- 重命名新字段
ALTER TABLE companies RENAME COLUMN service_status_text TO service_status;

-- 设置默认值
ALTER TABLE companies ALTER COLUMN service_status SET DEFAULT '服务中';

-- 启用触发器
ALTER TABLE companies ENABLE TRIGGER companies_audit_trigger;

-- 添加注释
COMMENT ON COLUMN companies.service_status IS '服务状态：服务中、已到期、已暂停';
COMMENT ON COLUMN companies.industry IS '所属行业';
COMMENT ON COLUMN companies.region IS '所在地域';
COMMENT ON COLUMN companies.employee_scale IS '员工规模：0-50人、51-200人、201-500人、500人以上';