-- 修复工资条PDF生成后的回写权限：
-- 允许具备上传/生成权限的用户更新 salary_items（写入 pdf_url 等字段）

DROP POLICY IF EXISTS "用户可以更新工资明细" ON salary_items;

CREATE POLICY "用户可以更新工资明细"
ON salary_items
FOR UPDATE
TO public
USING (
  has_permission(uid(), 'salary_record_manage')
  OR has_permission(uid(), 'salary_record_upload')
  OR has_permission(uid(), 'salary_slip_generate')
)
WITH CHECK (
  has_permission(uid(), 'salary_record_manage')
  OR has_permission(uid(), 'salary_record_upload')
  OR has_permission(uid(), 'salary_slip_generate')
);
