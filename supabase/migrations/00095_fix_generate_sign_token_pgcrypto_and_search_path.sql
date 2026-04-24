-- generate_sign_token / update_sign_token 依赖 pgcrypto 的 gen_random_bytes。
-- 常见报错：function gen_random_bytes(integer) does not exist (42883)
-- 原因：1) 库未 CREATE EXTENSION pgcrypto
--       2) SECURITY DEFINER 执行时 search_path 未包含扩展所在 schema（如 extensions）

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.generate_sign_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

COMMENT ON FUNCTION public.generate_sign_token() IS '生成签署随机 token；依赖 pgcrypto.gen_random_bytes';
