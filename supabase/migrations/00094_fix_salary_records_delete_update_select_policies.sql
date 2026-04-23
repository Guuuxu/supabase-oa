-- 修复 salary_records 的更新/删除/查询策略，使用当前权限体系的权限 code

DROP POLICY IF EXISTS "用户可以更新工资记录" ON salary_records;
CREATE POLICY "用户可以更新工资记录"
ON salary_records
FOR UPDATE
TO public
USING (
  has_permission(uid(), 'salary_record_edit')
);

DROP POLICY IF EXISTS "用户可以删除工资记录" ON salary_records;
CREATE POLICY "用户可以删除工资记录"
ON salary_records
FOR DELETE
TO public
USING (
  has_permission(uid(), 'salary_record_delete')
);

DROP POLICY IF EXISTS "用户可以查看所属公司的工资记录" ON salary_records;
CREATE POLICY "用户可以查看所属公司的工资记录"
ON salary_records
FOR SELECT
TO public
USING (
  has_permission(uid(), 'salary_record_view')
  OR has_permission(uid(), 'salary_record_edit')
  OR has_permission(uid(), 'salary_record_delete')
  OR has_permission(uid(), 'salary_record_upload')
  OR company_id IN (SELECT p.company_id FROM profiles p WHERE p.id = uid())
);
