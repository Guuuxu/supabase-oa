-- 创建权限检查函数
CREATE OR REPLACE FUNCTION has_permission(user_id uuid, permission_code text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles p
    LEFT JOIN role_permissions rp ON p.role_id = rp.role_id
    LEFT JOIN permissions perm ON rp.permission_id = perm.id
    WHERE p.id = user_id 
    AND perm.code = permission_code
  );
$$;

-- 删除旧的主管策略
DROP POLICY IF EXISTS "主管可以创建公司" ON companies;
DROP POLICY IF EXISTS "主管可以更新公司" ON companies;
DROP POLICY IF EXISTS "主管可以删除公司" ON companies;

-- 创建新的基于权限的策略
CREATE POLICY "有权限的用户可以创建公司"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (
  -- 基础角色系统：manager可以创建
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
  OR
  -- 自定义角色系统：有company_create权限的用户可以创建
  has_permission(auth.uid(), 'company_create')
);

CREATE POLICY "有权限的用户可以更新公司"
ON companies
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
  OR
  has_permission(auth.uid(), 'company_edit')
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
  OR
  has_permission(auth.uid(), 'company_edit')
);

CREATE POLICY "有权限的用户可以删除公司"
ON companies
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
  OR
  has_permission(auth.uid(), 'company_delete')
);