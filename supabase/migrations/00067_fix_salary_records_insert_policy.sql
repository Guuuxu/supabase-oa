-- 删除旧的INSERT策略
DROP POLICY IF EXISTS "用户可以创建工资记录" ON salary_records;

-- 创建新的INSERT策略：允许有"工资表管理"权限的用户创建工资记录
CREATE POLICY "用户可以创建工资记录"
ON salary_records
FOR INSERT
TO public
WITH CHECK (
  has_permission(uid(), '工资表管理')
);

-- 同时更新UPDATE和DELETE策略，使用权限检查
DROP POLICY IF EXISTS "用户可以更新工资记录" ON salary_records;
CREATE POLICY "用户可以更新工资记录"
ON salary_records
FOR UPDATE
TO public
USING (
  has_permission(uid(), '工资表管理')
);

DROP POLICY IF EXISTS "用户可以删除工资记录" ON salary_records;
CREATE POLICY "用户可以删除工资记录"
ON salary_records
FOR DELETE
TO public
USING (
  has_permission(uid(), '工资表管理')
);

-- SELECT策略保持不变（用户只能查看所属公司的工资记录）
-- 但也添加一个基于权限的查看策略
DROP POLICY IF EXISTS "用户可以查看所属公司的工资记录" ON salary_records;
CREATE POLICY "用户可以查看所属公司的工资记录"
ON salary_records
FOR SELECT
TO public
USING (
  -- 有权限的用户可以查看所有公司的工资记录
  has_permission(uid(), '工资表管理')
  OR
  -- 或者查看自己所属公司的工资记录
  company_id IN (SELECT p.company_id FROM profiles p WHERE p.id = uid())
);