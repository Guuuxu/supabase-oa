
-- 为signing_records表添加signed_file_url字段，用于存储已签署文件的URL
ALTER TABLE signing_records
ADD COLUMN signed_file_url TEXT;

COMMENT ON COLUMN signing_records.signed_file_url IS '已签署文件的URL，存储在Supabase Storage中';
