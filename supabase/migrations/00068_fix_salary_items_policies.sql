-- 删除旧的策略
DROP POLICY IF EXISTS "用户可以创建工资明细" ON salary_items;
DROP POLICY IF EXISTS "用户可以更新工资明细" ON salary_items;
DROP POLICY IF EXISTS "用户可以删除工资明细" ON salary_items;
DROP POLICY IF EXISTS "用户可以查看工资明细" ON salary_items;

-- 创建新的INSERT策略：允许有"工资表管理"权限的用户创建工资明细
CREATE POLICY "用户可以创建工资明细"
ON salary_items
FOR INSERT
TO public
WITH CHECK (
  has_permission(uid(), '工资表管理')
);

-- 创建新的UPDATE策略
CREATE POLICY "用户可以更新工资明细"
ON salary_items
FOR UPDATE
TO public
USING (
  has_permission(uid(), '工资表管理')
);

-- 创建新的DELETE策略
CREATE POLICY "用户可以删除工资明细"
ON salary_items
FOR DELETE
TO public
USING (
  has_permission(uid(), '工资表管理')
);

-- 创建新的SELECT策略
CREATE POLICY "用户可以查看工资明细"
ON salary_items
FOR SELECT
TO public
USING (
  -- 有权限的用户可以查看所有工资明细
  has_permission(uid(), '工资表管理')
  OR
  -- 或者员工可以查看自己的工资明细
  employee_id = uid()
);