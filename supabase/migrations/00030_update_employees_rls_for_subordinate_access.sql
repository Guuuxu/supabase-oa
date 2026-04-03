
-- 删除旧的employees表SELECT策略
DROP POLICY IF EXISTS "用户可以查看所有员工" ON employees;
DROP POLICY IF EXISTS "超级管理员可以查看所有员工" ON employees;

-- 创建新的SELECT策略：可以查看自己和下级负责的公司的员工
CREATE POLICY "用户可以查看自己和下级负责的公司的员工"
ON employees
FOR SELECT
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'employee_view') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);

-- 删除旧的UPDATE策略
DROP POLICY IF EXISTS "用户可以更新员工" ON employees;
DROP POLICY IF EXISTS "超级管理员可以更新所有员工" ON employees;

-- 创建新的UPDATE策略
CREATE POLICY "用户可以更新自己和下级负责的公司的员工"
ON employees
FOR UPDATE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'employee_edit') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);

-- 删除旧的DELETE策略
DROP POLICY IF EXISTS "超级管理员可以删除员工" ON employees;

-- 创建新的DELETE策略
CREATE POLICY "用户可以删除自己和下级负责的公司的员工"
ON employees
FOR DELETE
TO authenticated
USING (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'employee_delete') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);

-- INSERT策略
DROP POLICY IF EXISTS "用户可以创建员工" ON employees;
CREATE POLICY "用户可以创建员工"
ON employees
FOR INSERT
TO authenticated
WITH CHECK (
  is_super_admin(uid()) OR
  (has_permission(uid(), 'employee_create') AND 
   company_id IN (
     SELECT id FROM companies 
     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))
   ))
);
