-- 添加withdrawn（撤回）状态到signing_status枚举
ALTER TYPE signing_status ADD VALUE IF NOT EXISTS 'withdrawn';