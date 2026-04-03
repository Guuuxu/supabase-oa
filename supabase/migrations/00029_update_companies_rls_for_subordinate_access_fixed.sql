
-- 删除旧的companies表SELECT策略
DROP POLICY IF EXISTS "用户可以查看自己负责的公司" ON companies;
DROP POLICY IF EXISTS "超级管理员可以查看所有公司" ON companies;
DROP POLICY IF EXISTS "有company_view权限的用户可以查看所有公司" ON companies;

-- 创建新的SELECT策略：可以查看自己和下级负责的公司
CREATE POLICY "用户可以查看自己和下级负责的公司"
ON companies
FOR SELECT
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'company_view') AND 
   owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid())))
);

-- 删除旧的UPDATE策略
DROP POLICY IF EXISTS "用户可以更新自己负责的公司" ON companies;
DROP POLICY IF EXISTS "超级管理员可以更新所有公司" ON companies;

-- 创建新的UPDATE策略：可以更新自己和下级负责的公司
CREATE POLICY "用户可以更新自己和下级负责的公司"
ON companies
FOR UPDATE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'company_edit') AND 
   owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid())))
);

-- 删除旧的DELETE策略
DROP POLICY IF EXISTS "超级管理员可以删除公司" ON companies;

-- 创建新的DELETE策略：超级管理员或有权限的用户可以删除自己和下级负责的公司
CREATE POLICY "用户可以删除自己和下级负责的公司"
ON companies
FOR DELETE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'company_delete') AND 
   owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid())))
);

-- INSERT策略保持不变
DROP POLICY IF EXISTS "用户可以创建公司" ON companies;
CREATE POLICY "用户可以创建公司"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (
  is_super_admin(uid()) OR
  has_permission(uid(), 'company_create')
);
