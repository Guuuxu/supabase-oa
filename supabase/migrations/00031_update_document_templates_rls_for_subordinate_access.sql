
-- 删除旧的document_templates表SELECT策略
DROP POLICY IF EXISTS "用户可以查看所有文书模板" ON document_templates;
DROP POLICY IF EXISTS "超级管理员可以查看所有文书模板" ON document_templates;

-- 创建新的SELECT策略
CREATE POLICY "用户可以查看自己和下级负责的公司的文书模板"
ON document_templates
FOR SELECT
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'template_view') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);

-- UPDATE策略
DROP POLICY IF EXISTS "用户可以更新文书模板" ON document_templates;
CREATE POLICY "用户可以更新自己和下级负责的公司的文书模板"
ON document_templates
FOR UPDATE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'template_edit') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);

-- DELETE策略
DROP POLICY IF EXISTS "用户可以删除文书模板" ON document_templates;
CREATE POLICY "用户可以删除自己和下级负责的公司的文书模板"
ON document_templates
FOR DELETE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'template_delete') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);

-- INSERT策略
DROP POLICY IF EXISTS "用户可以创建文书模板" ON document_templates;
CREATE POLICY "用户可以创建文书模板"
ON document_templates
FOR INSERT
TO authenticated
WITH CHECK (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'template_create') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);
