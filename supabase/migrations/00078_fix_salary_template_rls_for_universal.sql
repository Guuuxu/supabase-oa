-- 修改工资结构模板的RLS策略，允许查看通用模板

-- 删除旧的SELECT策略
DROP POLICY IF EXISTS "用户可以查看工资结构模板" ON salary_structure_templates;

-- 创建新的SELECT策略，允许查看通用模板和有权限的公司模板
CREATE POLICY "用户可以查看工资结构模板" ON salary_structure_templates
  FOR SELECT
  USING (
    is_super_admin(auth.uid()) 
    OR is_universal = true  -- 所有用户都可以查看通用模板
    OR can_access_company_data(auth.uid(), company_id)
  );

-- 修改INSERT策略，允许创建通用模板
DROP POLICY IF EXISTS "用户可以创建工资结构模板" ON salary_structure_templates;

CREATE POLICY "用户可以创建工资结构模板" ON salary_structure_templates
  FOR INSERT
  WITH CHECK (
    is_super_admin(auth.uid()) 
    OR (is_universal = true AND is_super_admin(auth.uid()))  -- 只有超级管理员可以创建通用模板
    OR can_access_company_data(auth.uid(), company_id)
  );

-- 修改UPDATE策略，允许更新通用模板
DROP POLICY IF EXISTS "用户可以更新工资结构模板" ON salary_structure_templates;

CREATE POLICY "用户可以更新工资结构模板" ON salary_structure_templates
  FOR UPDATE
  USING (
    is_super_admin(auth.uid()) 
    OR is_universal = true  -- 所有用户都可以编辑通用模板
    OR can_access_company_data(auth.uid(), company_id)
  )
  WITH CHECK (
    is_super_admin(auth.uid()) 
    OR is_universal = true  -- 所有用户都可以编辑通用模板
    OR can_access_company_data(auth.uid(), company_id)
  );

-- 修改DELETE策略，只有超级管理员可以删除通用模板
DROP POLICY IF EXISTS "用户可以删除工资结构模板" ON salary_structure_templates;

CREATE POLICY "用户可以删除工资结构模板" ON salary_structure_templates
  FOR DELETE
  USING (
    is_super_admin(auth.uid()) 
    OR (NOT is_universal AND can_access_company_data(auth.uid(), company_id))  -- 普通用户只能删除公司模板
  );

COMMENT ON POLICY "用户可以查看工资结构模板" ON salary_structure_templates IS '允许用户查看通用模板和有权限的公司模板';
COMMENT ON POLICY "用户可以创建工资结构模板" ON salary_structure_templates IS '允许超级管理员创建通用模板，普通用户创建公司模板';
COMMENT ON POLICY "用户可以更新工资结构模板" ON salary_structure_templates IS '允许所有用户编辑通用模板和有权限的公司模板';
COMMENT ON POLICY "用户可以删除工资结构模板" ON salary_structure_templates IS '只允许超级管理员删除通用模板，普通用户可删除公司模板';
