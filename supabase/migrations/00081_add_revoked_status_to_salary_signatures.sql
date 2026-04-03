-- 为薪酬签署状态枚举添加已撤回状态
ALTER TYPE salary_signature_status ADD VALUE IF NOT EXISTS 'revoked';

-- 添加注释
COMMENT ON TYPE salary_signature_status IS '薪酬签署状态: pending(待签署), sent(已发送), signed(已签署), rejected(已拒签), revoked(已撤回)';
