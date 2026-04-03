-- 修复所有RLS策略，将uid()改为auth.uid()

-- 1. 修复companies表的策略
DROP POLICY IF EXISTS "有权限的用户可以创建公司" ON companies;
DROP POLICY IF EXISTS "有权限的用户可以更新公司" ON companies;
DROP POLICY IF EXISTS "有权限的用户可以删除公司" ON companies;

CREATE POLICY "有权限的用户可以创建公司"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
  OR
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

-- 2. 修复employees表的策略
DROP POLICY IF EXISTS "有权限的用户可以管理员工" ON employees;

CREATE POLICY "有权限的用户可以管理员工"
ON employees
FOR ALL
TO authenticated
USING (
  is_admin(auth.uid())
  OR
  has_permission(auth.uid(), 'employee_manage')
  OR
  has_permission(auth.uid(), 'employee_view')
  OR
  has_permission(auth.uid(), 'employee_edit')
  OR
  has_permission(auth.uid(), 'employee_create')
  OR
  has_permission(auth.uid(), 'employee_delete')
);

-- 3. 修复document_templates表的策略
DROP POLICY IF EXISTS "有权限的用户可以管理文书模板" ON document_templates;

CREATE POLICY "有权限的用户可以管理文书模板"
ON document_templates
FOR ALL
TO authenticated
USING (
  is_admin(auth.uid())
  OR
  has_permission(auth.uid(), 'template_manage')
  OR
  has_permission(auth.uid(), 'template_view')
  OR
  has_permission(auth.uid(), 'template_edit')
  OR
  has_permission(auth.uid(), 'template_create')
  OR
  has_permission(auth.uid(), 'template_delete')
);

-- 4. 修复signing_records表的策略
DROP POLICY IF EXISTS "有权限的用户可以管理签署记录" ON signing_records;

CREATE POLICY "有权限的用户可以管理签署记录"
ON signing_records
FOR ALL
TO authenticated
USING (
  is_admin(auth.uid())
  OR
  has_permission(auth.uid(), 'document_manage')
  OR
  has_permission(auth.uid(), 'document_initiate')
  OR
  has_permission(auth.uid(), 'document_view')
);