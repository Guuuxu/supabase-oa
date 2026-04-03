
-- 为有user_view权限的用户添加查看所有用户的策略
CREATE POLICY "有user_view权限的用户可以查看所有用户"
ON profiles
FOR SELECT
TO authenticated
USING (
  is_super_admin(uid()) OR
  has_permission(uid(), 'user_view')
);

-- 删除旧的策略（因为新策略已经包含了超级管理员的权限）
DROP POLICY IF EXISTS "超级管理员可以查看所有用户" ON profiles;
DROP POLICY IF EXISTS "用户可以查看自己的资料" ON profiles;
