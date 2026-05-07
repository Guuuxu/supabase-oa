-- 人事经理等角色通常归属 profiles.company_id，但未必是 companies.owner_id。
-- 原策略仅依赖 can_access_company_data（所有者/上级链），导致有「工资结构模板」权限的用户无法 INSERT/部分场景无法 SELECT/UPDATE/DELETE。
-- 本迁移在保留原规则的前提下，增加：同公司 + 对应细粒度权限（含 00084 旧码 salary_structure_*）。

DROP POLICY IF EXISTS "用户可以查看工资结构模板" ON salary_structure_templates;
CREATE POLICY "用户可以查看工资结构模板" ON salary_structure_templates
  FOR SELECT
  USING (
    is_super_admin(auth.uid())
    OR is_universal = true
    OR can_access_company_data(auth.uid(), company_id)
    OR (
      company_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
          AND p.company_id IS NOT NULL
          AND p.company_id = salary_structure_templates.company_id
      )
      AND (
        has_permission(auth.uid(), 'salary_template_view')
        OR has_permission(auth.uid(), 'salary_structure_view')
      )
    )
  );

DROP POLICY IF EXISTS "用户可以创建工资结构模板" ON salary_structure_templates;
CREATE POLICY "用户可以创建工资结构模板" ON salary_structure_templates
  FOR INSERT
  WITH CHECK (
    is_super_admin(auth.uid())
    OR (is_universal = true AND is_super_admin(auth.uid()))
    OR can_access_company_data(auth.uid(), company_id)
    OR (
      company_id IS NOT NULL
      AND COALESCE(is_universal, false) = false
      AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
          AND p.company_id IS NOT NULL
          AND p.company_id = company_id
      )
      AND (
        has_permission(auth.uid(), 'salary_template_create')
        OR has_permission(auth.uid(), 'salary_structure_create')
      )
    )
  );

DROP POLICY IF EXISTS "用户可以更新工资结构模板" ON salary_structure_templates;
CREATE POLICY "用户可以更新工资结构模板" ON salary_structure_templates
  FOR UPDATE
  USING (
    is_super_admin(auth.uid())
    OR is_universal = true
    OR can_access_company_data(auth.uid(), company_id)
    OR (
      company_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
          AND p.company_id IS NOT NULL
          AND p.company_id = salary_structure_templates.company_id
      )
      AND (
        has_permission(auth.uid(), 'salary_template_edit')
        OR has_permission(auth.uid(), 'salary_structure_edit')
      )
    )
  )
  WITH CHECK (
    is_super_admin(auth.uid())
    OR is_universal = true
    OR can_access_company_data(auth.uid(), company_id)
    OR (
      company_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
          AND p.company_id IS NOT NULL
          AND p.company_id = company_id
      )
      AND (
        has_permission(auth.uid(), 'salary_template_edit')
        OR has_permission(auth.uid(), 'salary_structure_edit')
      )
    )
  );

DROP POLICY IF EXISTS "用户可以删除工资结构模板" ON salary_structure_templates;
CREATE POLICY "用户可以删除工资结构模板" ON salary_structure_templates
  FOR DELETE
  USING (
    is_super_admin(auth.uid())
    OR (NOT COALESCE(is_universal, false) AND can_access_company_data(auth.uid(), company_id))
    OR (
      NOT COALESCE(is_universal, false)
      AND company_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
          AND p.company_id IS NOT NULL
          AND p.company_id = salary_structure_templates.company_id
      )
      AND (
        has_permission(auth.uid(), 'salary_template_delete')
        OR has_permission(auth.uid(), 'salary_structure_delete')
      )
    )
  );

COMMENT ON POLICY "用户可以查看工资结构模板" ON salary_structure_templates IS '超管、通用模板、公司所有者链；或同公司且具备模板查看权限';
COMMENT ON POLICY "用户可以创建工资结构模板" ON salary_structure_templates IS '超管可建通用模板；所有者链；或同公司且具备模板新建权限（非通用）';
COMMENT ON POLICY "用户可以更新工资结构模板" ON salary_structure_templates IS '超管、通用模板可改、所有者链；或同公司且具备模板编辑权限';
COMMENT ON POLICY "用户可以删除工资结构模板" ON salary_structure_templates IS '超管；非通用且所有者链；或同公司且具备模板删除权限';
