-- 薪酬签署记录：关联文书模板并冗余存储文书名称（与签署详情展示一致）
ALTER TABLE salary_signatures
  ADD COLUMN IF NOT EXISTS document_template_id UUID REFERENCES document_templates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS document_name TEXT;

COMMENT ON COLUMN salary_signatures.document_template_id IS '发起签署使用的文书模板 ID';
COMMENT ON COLUMN salary_signatures.document_name IS '文书名称（冗余存储，便于列表与导出展示）';
