-- 修复signing_records表的RLS策略，使用正确的权限code
-- 问题：策略使用了不存在的权限code（document_create, document_edit, document_delete）
-- 解决：使用正确的权限code（document_initiate, document_manage）

-- 1. 删除旧的INSERT策略
DROP POLICY IF EXISTS "用户可以创建有权访问的公司的签署记录" ON signing_records;

-- 2. 创建新的INSERT策略，使用正确的权限code
CREATE POLICY "用户可以创建有权访问的公司的签署记录"
ON signing_records FOR INSERT
TO public
WITH CHECK (
  is_super_admin(uid()) 
  OR (has_permission(uid(), 'document_initiate') AND can_access_company_data(uid(), company_id))
);

-- 3. 删除旧的UPDATE策略
DROP POLICY IF EXISTS "用户可以更新有权访问的公司的签署记录" ON signing_records;

-- 4. 创建新的UPDATE策略，使用正确的权限code
CREATE POLICY "用户可以更新有权访问的公司的签署记录"
ON signing_records FOR UPDATE
TO public
USING (
  is_super_admin(uid()) 
  OR (has_permission(uid(), 'document_manage') AND can_access_company_data(uid(), company_id))
  OR (created_by = uid())
)
WITH CHECK (
  is_super_admin(uid()) 
  OR (has_permission(uid(), 'document_manage') AND can_access_company_data(uid(), company_id))
  OR (created_by = uid())
);

-- 5. 删除旧的DELETE策略
DROP POLICY IF EXISTS "用户可以删除有权访问的公司的签署记录" ON signing_records;

-- 6. 创建新的DELETE策略，使用正确的权限code
CREATE POLICY "用户可以删除有权访问的公司的签署记录"
ON signing_records FOR DELETE
TO public
USING (
  is_super_admin(uid()) 
  OR (has_permission(uid(), 'document_manage') AND can_access_company_data(uid(), company_id))
  OR (created_by = uid())
);