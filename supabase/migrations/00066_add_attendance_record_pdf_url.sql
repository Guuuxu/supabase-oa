-- 为考勤记录表添加PDF文件URL
ALTER TABLE attendance_records
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

COMMENT ON COLUMN attendance_records.pdf_url IS '考勤确认表PDF文件URL';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_attendance_records_pdf_url ON attendance_records(pdf_url) WHERE pdf_url IS NOT NULL;