-- 修复salary_records的策略，使用正确的权限code
DROP POLICY IF EXISTS "用户可以创建工资记录" ON salary_records;
CREATE POLICY "用户可以创建工资记录"
ON salary_records
FOR INSERT
TO public
WITH CHECK (
  has_permission(uid(), 'salary_record_manage')
  OR has_permission(uid(), 'salary_record_upload')
);

DROP POLICY IF EXISTS "用户可以更新工资记录" ON salary_records;
CREATE POLICY "用户可以更新工资记录"
ON salary_records
FOR UPDATE
TO public
USING (
  has_permission(uid(), 'salary_record_manage')
);

DROP POLICY IF EXISTS "用户可以删除工资记录" ON salary_records;
CREATE POLICY "用户可以删除工资记录"
ON salary_records
FOR DELETE
TO public
USING (
  has_permission(uid(), 'salary_record_manage')
);

DROP POLICY IF EXISTS "用户可以查看所属公司的工资记录" ON salary_records;
CREATE POLICY "用户可以查看所属公司的工资记录"
ON salary_records
FOR SELECT
TO public
USING (
  has_permission(uid(), 'salary_record_manage')
  OR has_permission(uid(), 'salary_record_view')
  OR company_id IN (SELECT p.company_id FROM profiles p WHERE p.id = uid())
);

-- 修复salary_items的策略
DROP POLICY IF EXISTS "用户可以创建工资明细" ON salary_items;
CREATE POLICY "用户可以创建工资明细"
ON salary_items
FOR INSERT
TO public
WITH CHECK (
  has_permission(uid(), 'salary_record_manage')
  OR has_permission(uid(), 'salary_slip_generate')
);

DROP POLICY IF EXISTS "用户可以更新工资明细" ON salary_items;
CREATE POLICY "用户可以更新工资明细"
ON salary_items
FOR UPDATE
TO public
USING (
  has_permission(uid(), 'salary_record_manage')
);

DROP POLICY IF EXISTS "用户可以删除工资明细" ON salary_items;
CREATE POLICY "用户可以删除工资明细"
ON salary_items
FOR DELETE
TO public
USING (
  has_permission(uid(), 'salary_record_manage')
);

DROP POLICY IF EXISTS "用户可以查看工资明细" ON salary_items;
CREATE POLICY "用户可以查看工资明细"
ON salary_items
FOR SELECT
TO public
USING (
  has_permission(uid(), 'salary_record_manage')
  OR has_permission(uid(), 'salary_record_view')
  OR employee_id = uid()
);

-- 修复salary_signatures的策略
DROP POLICY IF EXISTS "salary_signatures_insert_policy" ON salary_signatures;
CREATE POLICY "salary_signatures_insert_policy"
ON salary_signatures
FOR INSERT
TO public
WITH CHECK (
  is_super_admin(uid())
  OR has_permission(uid(), 'salary_record_manage')
  OR has_permission(uid(), 'salary_slip_send')
  OR can_access_company_data(uid(), company_id)
);