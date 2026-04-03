-- 删除旧函数
DROP FUNCTION IF EXISTS public.generate_sign_token();
DROP FUNCTION IF EXISTS public.update_sign_token(uuid);
DROP FUNCTION IF EXISTS public.batch_update_sign_tokens(uuid[]);

-- 重新创建generate_sign_token函数，确保使用正确的schema
CREATE OR REPLACE FUNCTION public.generate_sign_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 使用pgcrypto扩展的gen_random_bytes函数
  RETURN encode(public.gen_random_bytes(32), 'hex');
END;
$$;

-- 重新创建update_sign_token函数
CREATE OR REPLACE FUNCTION public.update_sign_token(signature_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_token TEXT;
BEGIN
  -- 生成新token
  new_token := public.generate_sign_token();
  
  -- 更新签署记录
  UPDATE salary_signatures
  SET 
    sign_token = new_token,
    sign_token_expires_at = NOW() + INTERVAL '30 days',
    updated_at = NOW()
  WHERE id = signature_id;
  
  RETURN new_token;
END;
$$;

-- 重新创建batch_update_sign_tokens函数
CREATE OR REPLACE FUNCTION public.batch_update_sign_tokens(signature_ids UUID[])
RETURNS TABLE(id UUID, token TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sig_id UUID;
  new_token TEXT;
BEGIN
  FOREACH sig_id IN ARRAY signature_ids
  LOOP
    -- 生成新token
    new_token := public.generate_sign_token();
    
    -- 更新签署记录
    UPDATE salary_signatures
    SET 
      sign_token = new_token,
      sign_token_expires_at = NOW() + INTERVAL '30 days',
      updated_at = NOW()
    WHERE salary_signatures.id = sig_id;
    
    -- 返回结果
    id := sig_id;
    token := new_token;
    RETURN NEXT;
  END LOOP;
END;
$$;