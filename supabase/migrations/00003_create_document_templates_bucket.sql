-- 创建文书模板附件存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('document-templates', 'document-templates', true)
ON CONFLICT (id) DO NOTHING;

-- 设置存储桶策略：允许认证用户上传
CREATE POLICY "允许认证用户上传文书模板附件"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'document-templates');

-- 设置存储桶策略：允许所有人查看
CREATE POLICY "允许所有人查看文书模板附件"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'document-templates');

-- 设置存储桶策略：允许认证用户删除自己上传的文件
CREATE POLICY "允许认证用户删除文书模板附件"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'document-templates');
