-- 为manager角色添加公司管理权限

-- 1. manager可以创建公司（INSERT）
CREATE POLICY "主管可以创建公司"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
);

-- 2. manager可以更新公司信息（UPDATE）
CREATE POLICY "主管可以更新公司"
ON companies
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
);

-- 3. manager可以删除公司（DELETE）
CREATE POLICY "主管可以删除公司"
ON companies
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
);