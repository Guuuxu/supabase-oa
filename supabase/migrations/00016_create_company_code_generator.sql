-- 创建公司编码序列表
CREATE TABLE IF NOT EXISTS company_code_sequences (
  date_key TEXT PRIMARY KEY,  -- 格式: YYYYMMDD
  last_sequence INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_company_code_sequences_date ON company_code_sequences(date_key);

-- 创建原子性生成公司编码的函数
CREATE OR REPLACE FUNCTION generate_company_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_date_key TEXT;
  v_sequence INTEGER;
  v_code TEXT;
BEGIN
  -- 获取当前日期的key (YYYYMMDD格式)
  v_date_key := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  -- 使用SELECT FOR UPDATE锁定行，如果不存在则插入
  -- 这保证了并发安全
  INSERT INTO company_code_sequences (date_key, last_sequence)
  VALUES (v_date_key, 1)
  ON CONFLICT (date_key) 
  DO UPDATE SET 
    last_sequence = company_code_sequences.last_sequence + 1,
    updated_at = NOW()
  RETURNING last_sequence INTO v_sequence;
  
  -- 生成编码: 日期 + 3位序列号
  v_code := v_date_key || LPAD(v_sequence::TEXT, 3, '0');
  
  RETURN v_code;
END;
$$;

-- 添加注释
COMMENT ON TABLE company_code_sequences IS '公司编码序列表，用于生成唯一的公司编码';
COMMENT ON FUNCTION generate_company_code() IS '原子性生成公司编码，格式：YYYYMMDD + 3位序列号';

-- 为companies表的code字段添加唯一约束（如果还没有）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'companies_code_unique'
  ) THEN
    ALTER TABLE companies ADD CONSTRAINT companies_code_unique UNIQUE (code);
  END IF;
END $$;