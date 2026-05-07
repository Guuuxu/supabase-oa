-- 允许具备工资结构模板新建权限的用户（及人事经理/主管）创建通用模板
-- 原 00098：通用模板仅 is_super_admin 可 INSERT；人事勾选「通用模板」即 company_id 为空，必然被拒。

DROP POLICY IF EXISTS "用户可以创建工资结构模板" ON salary_structure_templates;
CREATE POLICY "用户可以创建工资结构模板" ON salary_structure_templates
  FOR INSERT
  WITH CHECK (
    is_super_admin(auth.uid())
    OR (
      COALESCE(is_universal, false) = true
      AND company_id IS NULL
      AND (
        has_permission(auth.uid(), 'salary_template_create')
        OR has_permission(auth.uid(), 'salary_structure_create')
        OR EXISTS (
          SELECT 1 FROM profiles p2
          INNER JOIN roles r ON r.id = p2.role_id
          WHERE p2.id = auth.uid()
            AND r.name IN ('人事经理', '人事主管')
        )
      )
    )
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

DROP POLICY IF EXISTS "用户可以删除工资结构模板" ON salary_structure_templates;
CREATE POLICY "用户可以删除工资结构模板" ON salary_structure_templates
  FOR DELETE
  USING (
    is_super_admin(auth.uid())
    OR (
      COALESCE(is_universal, false) = true
      AND (
        has_permission(auth.uid(), 'salary_template_delete')
        OR has_permission(auth.uid(), 'salary_structure_delete')
        OR EXISTS (
          SELECT 1 FROM profiles p2
          INNER JOIN roles r ON r.id = p2.role_id
          WHERE p2.id = auth.uid()
            AND r.name IN ('人事经理', '人事主管')
        )
      )
    )
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

COMMENT ON POLICY "用户可以创建工资结构模板" ON salary_structure_templates IS '超管；通用且 company_id 为空且具备新建权限或人事经理/主管；所有者链；非通用同公司新建';
COMMENT ON POLICY "用户可以删除工资结构模板" ON salary_structure_templates IS '超管；通用且具备删除权限或人事经理/主管；非通用所有者链或同公司删除';
