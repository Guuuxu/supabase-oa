
-- 创建已签署文档存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('signed-documents', 'signed-documents', true)
ON CONFLICT (id) DO NOTHING;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "允许认证用户上传已签署文档" ON storage.objects;
DROP POLICY IF EXISTS "允许所有人查看已签署文档" ON storage.objects;
DROP POLICY IF EXISTS "允许认证用户删除自己上传的文档" ON storage.objects;

-- 设置存储策略：允许认证用户上传
CREATE POLICY "允许认证用户上传已签署文档"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'signed-documents');

-- 设置存储策略：允许所有人查看已签署文档
CREATE POLICY "允许所有人查看已签署文档"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'signed-documents');

-- 设置存储策略：允许认证用户删除自己上传的文档
CREATE POLICY "允许认证用户删除自己上传的文档"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'signed-documents' AND owner::text = auth.uid()::text);
