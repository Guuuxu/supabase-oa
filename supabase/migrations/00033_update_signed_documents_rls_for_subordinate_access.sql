
-- 删除旧的signed_documents表SELECT策略
DROP POLICY IF EXISTS "用户可以查看所有已签署文档" ON signed_documents;
DROP POLICY IF EXISTS "超级管理员可以查看所有已签署文档" ON signed_documents;

-- 创建新的SELECT策略：通过signing_record关联到company
CREATE POLICY "用户可以查看自己和下级负责的公司的已签署文档"
ON signed_documents
FOR SELECT
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'signed_file_download') AND 
   signing_record_id IN (
     SELECT id FROM signing_records 
     WHERE company_id IN (
       SELECT id FROM companies 
       WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
     )
   ))
);

-- UPDATE策略
DROP POLICY IF EXISTS "用户可以更新已签署文档" ON signed_documents;
CREATE POLICY "用户可以更新自己和下级负责的公司的已签署文档"
ON signed_documents
FOR UPDATE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'document_manage') AND 
   signing_record_id IN (
     SELECT id FROM signing_records 
     WHERE company_id IN (
       SELECT id FROM companies 
       WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
     )
   ))
);

-- DELETE策略
DROP POLICY IF EXISTS "用户可以删除已签署文档" ON signed_documents;
CREATE POLICY "用户可以删除自己和下级负责的公司的已签署文档"
ON signed_documents
FOR DELETE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'document_manage') AND 
   signing_record_id IN (
     SELECT id FROM signing_records 
     WHERE company_id IN (
       SELECT id FROM companies 
       WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
     )
   ))
);

-- INSERT策略
DROP POLICY IF EXISTS "用户可以创建已签署文档" ON signed_documents;
CREATE POLICY "用户可以创建已签署文档"
ON signed_documents
FOR INSERT
TO authenticated
WITH CHECK (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'document_manage') AND 
   signing_record_id IN (
     SELECT id FROM signing_records 
     WHERE company_id IN (
       SELECT id FROM companies 
       WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
     )
   ))
);
