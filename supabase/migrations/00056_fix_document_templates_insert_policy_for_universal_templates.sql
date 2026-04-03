-- 删除旧的INSERT策略
DROP POLICY IF EXISTS "用户可以创建文书模板" ON document_templates;
DROP POLICY IF EXISTS "用户可以创建有权访问的公司的文书模板" ON document_templates;

-- 创建新的INSERT策略，允许创建通用模板（company_id为null）
CREATE POLICY "用户可以创建文书模板"
ON document_templates
FOR INSERT
TO authenticated
WITH CHECK (
  is_super_admin(uid()) 
  OR (
    has_permission(uid(), 'template_create') 
    AND (
      -- 允许创建通用模板（company_id为null）
      company_id IS NULL
      OR
      -- 或者创建所属公司的模板
      company_id IN (
        SELECT companies.id
        FROM companies
        WHERE companies.owner_id IN (
          SELECT accessible_user_id
          FROM get_accessible_users(uid())
        )
      )
    )
  )
);

CREATE POLICY "用户可以创建有权访问的公司的文书模板"
ON document_templates
FOR INSERT
TO public
WITH CHECK (
  is_super_admin(uid()) 
  OR (
    has_permission(uid(), 'template_create') 
    AND (
      -- 允许创建通用模板（company_id为null）
      company_id IS NULL
      OR
      -- 或者创建有权访问的公司的模板
      can_access_company_data(uid(), company_id)
    )
  )
);

-- 同样修复SELECT策略，允许查看通用模板
DROP POLICY IF EXISTS "用户可以查看有权访问的公司的文书模板" ON document_templates;
DROP POLICY IF EXISTS "用户可以查看自己和下级负责的公司的文书模板" ON document_templates;

CREATE POLICY "用户可以查看有权访问的公司的文书模板"
ON document_templates
FOR SELECT
TO public
USING (
  is_super_admin(uid()) 
  OR company_id IS NULL  -- 所有人都可以查看通用模板
  OR can_access_company_data(uid(), company_id)
);

CREATE POLICY "用户可以查看自己和下级负责的公司的文书模板"
ON document_templates
FOR SELECT
TO authenticated
USING (
  is_super_admin(uid()) 
  OR company_id IS NULL  -- 所有人都可以查看通用模板
  OR (
    has_permission(uid(), 'template_view') 
    AND company_id IN (
      SELECT companies.id
      FROM companies
      WHERE companies.owner_id IN (
        SELECT accessible_user_id
        FROM get_accessible_users(uid())
      )
    )
  )
);

-- 修复UPDATE策略，允许更新通用模板
DROP POLICY IF EXISTS "用户可以更新有权访问的公司的文书模板" ON document_templates;
DROP POLICY IF EXISTS "用户可以更新自己和下级负责的公司的文书模板" ON document_templates;

CREATE POLICY "用户可以更新有权访问的公司的文书模板"
ON document_templates
FOR UPDATE
TO public
USING (
  is_super_admin(uid()) 
  OR (
    has_permission(uid(), 'template_edit') 
    AND (
      company_id IS NULL  -- 允许更新通用模板
      OR can_access_company_data(uid(), company_id)
    )
  )
)
WITH CHECK (
  is_super_admin(uid()) 
  OR (
    has_permission(uid(), 'template_edit') 
    AND (
      company_id IS NULL  -- 允许更新为通用模板
      OR can_access_company_data(uid(), company_id)
    )
  )
);

CREATE POLICY "用户可以更新自己和下级负责的公司的文书模板"
ON document_templates
FOR UPDATE
TO authenticated
USING (
  is_super_admin(uid()) 
  OR (
    has_permission(uid(), 'template_edit') 
    AND (
      company_id IS NULL  -- 允许更新通用模板
      OR company_id IN (
        SELECT companies.id
        FROM companies
        WHERE companies.owner_id IN (
          SELECT accessible_user_id
          FROM get_accessible_users(uid())
        )
      )
    )
  )
);

-- 修复DELETE策略，允许删除通用模板
DROP POLICY IF EXISTS "用户可以删除有权访问的公司的文书模板" ON document_templates;
DROP POLICY IF EXISTS "用户可以删除自己和下级负责的公司的文书模板" ON document_templates;

CREATE POLICY "用户可以删除有权访问的公司的文书模板"
ON document_templates
FOR DELETE
TO public
USING (
  is_super_admin(uid()) 
  OR (
    has_permission(uid(), 'template_delete') 
    AND (
      company_id IS NULL  -- 允许删除通用模板
      OR can_access_company_data(uid(), company_id)
    )
  )
);

CREATE POLICY "用户可以删除自己和下级负责的公司的文书模板"
ON document_templates
FOR DELETE
TO authenticated
USING (
  is_super_admin(uid()) 
  OR (
    has_permission(uid(), 'template_delete') 
    AND (
      company_id IS NULL  -- 允许删除通用模板
      OR company_id IN (
        SELECT companies.id
        FROM companies
        WHERE companies.owner_id IN (
          SELECT accessible_user_id
          FROM get_accessible_users(uid())
        )
      )
    )
  )
);