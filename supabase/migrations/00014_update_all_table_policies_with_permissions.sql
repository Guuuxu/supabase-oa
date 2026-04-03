-- 1.1 创建 uid() 函数：获取当前用户ID
CREATE OR REPLACE FUNCTION uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;
GRANT EXECUTE ON FUNCTION uid() TO authenticated;

-- 更新employees表的策略
DROP POLICY IF EXISTS "管理员可以管理员工" ON employees;

CREATE POLICY "有权限的用户可以管理员工"
ON employees
FOR ALL
TO authenticated
USING (
  is_admin(uid())
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

-- 更新document_templates表的策略
DROP POLICY IF EXISTS "管理员可以管理文书模板" ON document_templates;

CREATE POLICY "有权限的用户可以管理文书模板"
ON document_templates
FOR ALL
TO authenticated
USING (
  is_admin(uid())
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

-- 更新signing_records表的策略
DROP POLICY IF EXISTS "管理员可以管理签署记录" ON signing_records;

CREATE POLICY "有权限的用户可以管理签署记录"
ON signing_records
FOR ALL
TO authenticated
USING (
  is_admin(uid())
  OR
  has_permission(auth.uid(), 'document_manage')
  OR
  has_permission(auth.uid(), 'document_initiate')
  OR
  has_permission(auth.uid(), 'document_view')
);