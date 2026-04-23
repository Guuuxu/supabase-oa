-- 修复工资上传相关INSERT策略，统一使用系统现有权限code

-- salary_records: 创建工资记录（上传工资表）
DROP POLICY IF EXISTS "用户可以创建工资记录" ON salary_records;
CREATE POLICY "用户可以创建工资记录"
ON salary_records
FOR INSERT
TO public
WITH CHECK (
  has_permission(uid(), 'salary_record_upload')
  OR has_permission(uid(), 'salary_record_edit')
);

-- salary_items: 创建工资明细（工资表拆分）
DROP POLICY IF EXISTS "用户可以创建工资明细" ON salary_items;
CREATE POLICY "用户可以创建工资明细"
ON salary_items
FOR INSERT
TO public
WITH CHECK (
  has_permission(uid(), 'salary_split')
  OR has_permission(uid(), 'salary_record_upload')
);
