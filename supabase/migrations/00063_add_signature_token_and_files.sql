-- 为薪酬签署表添加签署token和文件字段
ALTER TABLE salary_signatures
ADD COLUMN IF NOT EXISTS sign_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS sign_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS original_file_url TEXT,
ADD COLUMN IF NOT EXISTS signed_file_url TEXT,
ADD COLUMN IF NOT EXISTS signature_data TEXT,
ADD COLUMN IF NOT EXISTS reject_reason TEXT;

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_salary_signatures_sign_token ON salary_signatures(sign_token);

-- 添加注释
COMMENT ON COLUMN salary_signatures.sign_token IS '签署token，用于生成签署链接';
COMMENT ON COLUMN salary_signatures.sign_token_expires_at IS '签署token过期时间';
COMMENT ON COLUMN salary_signatures.original_file_url IS '原始文件URL（工资条或考勤表PDF）';
COMMENT ON COLUMN salary_signatures.signed_file_url IS '签署后的文件URL';
COMMENT ON COLUMN salary_signatures.signature_data IS '签名数据（JSON格式，包含签名图片等）';
COMMENT ON COLUMN salary_signatures.reject_reason IS '拒签原因';

-- 创建生成签署token的函数
CREATE OR REPLACE FUNCTION generate_sign_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- 创建更新签署token的函数
CREATE OR REPLACE FUNCTION update_sign_token(signature_id UUID)
RETURNS TEXT AS $$
DECLARE
  new_token TEXT;
BEGIN
  new_token := generate_sign_token();
  
  UPDATE salary_signatures
  SET 
    sign_token = new_token,
    sign_token_expires_at = NOW() + INTERVAL '30 days',
    updated_at = NOW()
  WHERE id = signature_id;
  
  RETURN new_token;
END;
$$ LANGUAGE plpgsql;

-- 创建批量生成签署token的函数
CREATE OR REPLACE FUNCTION batch_generate_sign_tokens(signature_ids UUID[])
RETURNS TABLE(id UUID, sign_token TEXT) AS $$
BEGIN
  RETURN QUERY
  UPDATE salary_signatures
  SET 
    sign_token = generate_sign_token(),
    sign_token_expires_at = NOW() + INTERVAL '30 days',
    status = 'sent',
    sent_at = NOW(),
    updated_at = NOW()
  WHERE salary_signatures.id = ANY(signature_ids)
  RETURNING salary_signatures.id, salary_signatures.sign_token;
END;
$$ LANGUAGE plpgsql;

-- 创建公开访问签署记录的RLS策略（通过token）
CREATE POLICY "salary_signatures_public_access_by_token" ON salary_signatures
  FOR SELECT
  USING (
    sign_token IS NOT NULL AND 
    sign_token_expires_at > NOW()
  );