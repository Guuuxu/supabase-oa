-- 修复salary_records表的RLS策略
DROP POLICY IF EXISTS "用户可以查看所属公司的工资记录" ON salary_records;
DROP POLICY IF EXISTS "用户可以创建工资记录" ON salary_records;
DROP POLICY IF EXISTS "用户可以更新工资记录" ON salary_records;
DROP POLICY IF EXISTS "用户可以删除工资记录" ON salary_records;

CREATE POLICY "用户可以查看所属公司的工资记录"
ON salary_records
FOR SELECT
TO public
USING (
  company_id IN (
    SELECT p.company_id 
    FROM profiles p
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "用户可以创建工资记录"
ON salary_records
FOR INSERT
TO public
WITH CHECK (
  company_id IN (
    SELECT p.company_id 
    FROM profiles p
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "用户可以更新工资记录"
ON salary_records
FOR UPDATE
TO public
USING (
  company_id IN (
    SELECT p.company_id 
    FROM profiles p
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "用户可以删除工资记录"
ON salary_records
FOR DELETE
TO public
USING (
  company_id IN (
    SELECT p.company_id 
    FROM profiles p
    WHERE p.id = auth.uid()
  )
);

-- 修复salary_items表的RLS策略（如果存在）
DROP POLICY IF EXISTS "用户可以查看工资明细" ON salary_items;
DROP POLICY IF EXISTS "用户可以创建工资明细" ON salary_items;
DROP POLICY IF EXISTS "用户可以更新工资明细" ON salary_items;
DROP POLICY IF EXISTS "用户可以删除工资明细" ON salary_items;

-- 为salary_items创建新策略（通过salary_records关联）
CREATE POLICY "用户可以查看工资明细"
ON salary_items
FOR SELECT
TO public
USING (
  salary_record_id IN (
    SELECT sr.id 
    FROM salary_records sr
    INNER JOIN profiles p ON sr.company_id = p.company_id
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "用户可以创建工资明细"
ON salary_items
FOR INSERT
TO public
WITH CHECK (
  salary_record_id IN (
    SELECT sr.id 
    FROM salary_records sr
    INNER JOIN profiles p ON sr.company_id = p.company_id
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "用户可以更新工资明细"
ON salary_items
FOR UPDATE
TO public
USING (
  salary_record_id IN (
    SELECT sr.id 
    FROM salary_records sr
    INNER JOIN profiles p ON sr.company_id = p.company_id
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "用户可以删除工资明细"
ON salary_items
FOR DELETE
TO public
USING (
  salary_record_id IN (
    SELECT sr.id 
    FROM salary_records sr
    INNER JOIN profiles p ON sr.company_id = p.company_id
    WHERE p.id = auth.uid()
  )
);