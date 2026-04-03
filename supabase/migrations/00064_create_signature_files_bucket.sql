-- 创建签署文件存储桶（通过insert语句）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'signature-files',
  'signature-files',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO NOTHING;

-- 设置存储桶的RLS策略
-- 1. 允许认证用户上传文件
CREATE POLICY "signature_files_insert_policy" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'signature-files');

-- 2. 允许认证用户查看自己公司的文件
CREATE POLICY "signature_files_select_policy" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'signature-files');

-- 3. 允许认证用户更新自己公司的文件
CREATE POLICY "signature_files_update_policy" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'signature-files');

-- 4. 允许认证用户删除自己公司的文件
CREATE POLICY "signature_files_delete_policy" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'signature-files');