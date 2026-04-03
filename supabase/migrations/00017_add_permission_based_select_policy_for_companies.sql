-- 删除旧的SELECT策略，重新创建基于权限的策略
DROP POLICY IF EXISTS "员工可以查看自己所属公司" ON companies;
DROP POLICY IF EXISTS "管理员可以查看所有公司" ON companies;

-- 创建新的SELECT策略：有company_view权限的用户可以查看所有公司
CREATE POLICY "有权限的用户可以查看公司"
ON companies
FOR SELECT
USING (
  -- 超级管理员可以查看所有
  is_super_admin(auth.uid())
  OR
  -- manager角色可以查看所有
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'manager'
  )
  OR
  -- 有company_view权限的用户可以查看所有
  has_permission(auth.uid(), 'company_view')
  OR
  -- 员工可以查看自己所属的公司
  id IN (
    SELECT company_id FROM profiles
    WHERE id = auth.uid()
  )
);