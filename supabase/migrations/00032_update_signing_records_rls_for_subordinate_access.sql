
-- 删除旧的signing_records表SELECT策略
DROP POLICY IF EXISTS "用户可以查看所有签署记录" ON signing_records;
DROP POLICY IF EXISTS "超级管理员可以查看所有签署记录" ON signing_records;

-- 创建新的SELECT策略
CREATE POLICY "用户可以查看自己和下级负责的公司的签署记录"
ON signing_records
FOR SELECT
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'document_view') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);

-- UPDATE策略
DROP POLICY IF EXISTS "用户可以更新签署记录" ON signing_records;
CREATE POLICY "用户可以更新自己和下级负责的公司的签署记录"
ON signing_records
FOR UPDATE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'document_manage') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);

-- DELETE策略
DROP POLICY IF EXISTS "用户可以删除签署记录" ON signing_records;
CREATE POLICY "用户可以删除自己和下级负责的公司的签署记录"
ON signing_records
FOR DELETE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'document_manage') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);

-- INSERT策略
DROP POLICY IF EXISTS "用户可以创建签署记录" ON signing_records;
CREATE POLICY "用户可以创建签署记录"
ON signing_records
FOR INSERT
TO authenticated
WITH CHECK (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'document_initiate') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);
