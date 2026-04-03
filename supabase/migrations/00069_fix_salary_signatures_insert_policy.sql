-- 更新salary_signatures的INSERT策略
DROP POLICY IF EXISTS "salary_signatures_insert_policy" ON salary_signatures;

CREATE POLICY "salary_signatures_insert_policy"
ON salary_signatures
FOR INSERT
TO public
WITH CHECK (
  -- 超级管理员可以创建
  is_super_admin(uid())
  OR
  -- 有权限的用户可以创建
  has_permission(uid(), '工资表管理')
  OR
  has_permission(uid(), '薪酬签署')
  OR
  -- 可以访问该公司数据的用户可以创建
  can_access_company_data(uid(), company_id)
);