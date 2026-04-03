-- 在companies表中添加统一社会信用代码和法定代表人字段

-- 添加统一社会信用代码字段
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS credit_no VARCHAR(255);

-- 添加法定代表人字段
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS legal_person VARCHAR(255);

-- 添加字段注释
COMMENT ON COLUMN companies.credit_no IS '统一社会信用代码';
COMMENT ON COLUMN companies.legal_person IS '法定代表人';

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_companies_credit_no ON companies(credit_no);
