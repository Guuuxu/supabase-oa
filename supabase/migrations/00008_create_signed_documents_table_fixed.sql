
-- 创建signed_documents表，存储每份签署文件的详细信息
CREATE TABLE signed_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signing_record_id UUID NOT NULL REFERENCES signing_records(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加注释
COMMENT ON TABLE signed_documents IS '已签署文件表，存储每份具体的签署文件';
COMMENT ON COLUMN signed_documents.signing_record_id IS '关联的签署记录ID';
COMMENT ON COLUMN signed_documents.template_id IS '文书模板ID';
COMMENT ON COLUMN signed_documents.template_name IS '文书名称（冗余存储，便于查询）';
COMMENT ON COLUMN signed_documents.file_url IS '已签署文件的URL';
COMMENT ON COLUMN signed_documents.file_size IS '文件大小（字节）';
COMMENT ON COLUMN signed_documents.signed_at IS '签署完成时间';

-- 创建索引
CREATE INDEX idx_signed_documents_signing_record_id ON signed_documents(signing_record_id);
CREATE INDEX idx_signed_documents_template_id ON signed_documents(template_id);
CREATE INDEX idx_signed_documents_signed_at ON signed_documents(signed_at);

-- 创建更新时间触发器函数（如果不存在）
CREATE OR REPLACE FUNCTION update_signed_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER update_signed_documents_updated_at
  BEFORE UPDATE ON signed_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_signed_documents_updated_at();

-- RLS策略
ALTER TABLE signed_documents ENABLE ROW LEVEL SECURITY;

-- 认证用户可以查看所有已签署文件
CREATE POLICY "authenticated_users_can_view_signed_documents"
  ON signed_documents FOR SELECT
  TO authenticated
  USING (true);

-- 认证用户可以创建已签署文件记录
CREATE POLICY "authenticated_users_can_create_signed_documents"
  ON signed_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 认证用户可以更新已签署文件记录
CREATE POLICY "authenticated_users_can_update_signed_documents"
  ON signed_documents FOR UPDATE
  TO authenticated
  USING (true);

-- 认证用户可以删除已签署文件记录
CREATE POLICY "authenticated_users_can_delete_signed_documents"
  ON signed_documents FOR DELETE
  TO authenticated
  USING (true);
