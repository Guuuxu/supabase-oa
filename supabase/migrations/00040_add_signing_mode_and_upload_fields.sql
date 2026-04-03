
-- 创建签署模式枚举类型
DO $$ BEGIN
  CREATE TYPE signing_mode AS ENUM ('electronic', 'offline');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 为signing_records表添加签署模式和上传相关字段
ALTER TABLE signing_records
ADD COLUMN IF NOT EXISTS signing_mode signing_mode DEFAULT 'electronic',
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS uploaded_by TEXT DEFAULT NULL;

COMMENT ON COLUMN signing_records.signing_mode IS '签署模式：electronic=电子签，offline=线下签署';
COMMENT ON COLUMN signing_records.uploaded_at IS '附件上传时间';
COMMENT ON COLUMN signing_records.uploaded_by IS '附件上传人ID';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_signing_records_mode ON signing_records(signing_mode);
CREATE INDEX IF NOT EXISTS idx_signing_records_uploaded_at ON signing_records(uploaded_at);
