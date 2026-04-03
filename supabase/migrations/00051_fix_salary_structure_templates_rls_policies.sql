-- 删除旧的错误策略
DROP POLICY IF EXISTS "用户可以查看所属公司的工资结构模板" ON salary_structure_templates;
DROP POLICY IF EXISTS "用户可以创建工资结构模板" ON salary_structure_templates;
DROP POLICY IF EXISTS "用户可以更新工资结构模板" ON salary_structure_templates;
DROP POLICY IF EXISTS "用户可以删除工资结构模板" ON salary_structure_templates;

-- 创建正确的RLS策略
-- 1. 查看策略：用户可以查看所属公司的工资结构模板
CREATE POLICY "用户可以查看所属公司的工资结构模板"
ON salary_structure_templates
FOR SELECT
TO public
USING (
  company_id IN (
    SELECT company_id 
    FROM auth.users 
    WHERE id = auth.uid()
  )
);

-- 2. 插入策略：用户可以创建所属公司的工资结构模板
CREATE POLICY "用户可以创建工资结构模板"
ON salary_structure_templates
FOR INSERT
TO public
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM auth.users 
    WHERE id = auth.uid()
  )
);

-- 3. 更新策略：用户可以更新所属公司的工资结构模板
CREATE POLICY "用户可以更新工资结构模板"
ON salary_structure_templates
FOR UPDATE
TO public
USING (
  company_id IN (
    SELECT company_id 
    FROM auth.users 
    WHERE id = auth.uid()
  )
);

-- 4. 删除策略：用户可以删除所属公司的工资结构模板
CREATE POLICY "用户可以删除工资结构模板"
ON salary_structure_templates
FOR DELETE
TO public
USING (
  company_id IN (
    SELECT company_id 
    FROM auth.users 
    WHERE id = auth.uid()
  )
);