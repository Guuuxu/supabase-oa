-- ============================================
-- 公司所有权和层级访问控制
-- ============================================

-- 1. 在companies表添加created_by字段
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 2. 为现有公司设置创建者（设为超级管理员）
UPDATE companies 
SET created_by = (
  SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1
)
WHERE created_by IS NULL;

-- 3. 设置created_by为NOT NULL
ALTER TABLE companies 
ALTER COLUMN created_by SET NOT NULL;

-- 4. 添加索引
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);

-- 5. 创建递归函数：获取用户的所有上级ID
CREATE OR REPLACE FUNCTION get_manager_chain(user_id UUID)
RETURNS TABLE(manager_id UUID)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  WITH RECURSIVE manager_chain AS (
    -- 基础情况：直接上级
    SELECT manager_id FROM profiles WHERE id = user_id AND manager_id IS NOT NULL
    UNION
    -- 递归情况：上级的上级
    SELECT p.manager_id 
    FROM profiles p
    INNER JOIN manager_chain mc ON p.id = mc.manager_id
    WHERE p.manager_id IS NOT NULL
  )
  SELECT manager_id FROM manager_chain;
$$;

-- 6. 创建辅助函数：判断用户是否可以访问某个公司
CREATE OR REPLACE FUNCTION can_access_company_data(user_id UUID, target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  company_creator UUID;
BEGIN
  -- 超级管理员可以访问所有公司
  IF is_super_admin(user_id) THEN
    RETURN TRUE;
  END IF;
  
  -- 获取公司的创建者
  SELECT created_by INTO company_creator FROM companies WHERE id = target_company_id;
  
  IF company_creator IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- 如果是创建者本人
  IF company_creator = user_id THEN
    RETURN TRUE;
  END IF;
  
  -- 如果是创建者的上级（在上级链中）
  IF EXISTS(
    SELECT 1 FROM get_manager_chain(company_creator) WHERE manager_id = user_id
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- ============================================
-- 更新 companies 表的 RLS 策略
-- ============================================

-- 删除旧的SELECT策略
DROP POLICY IF EXISTS "有权限的用户可以查看公司" ON companies;

-- 创建新的SELECT策略：基于所有权和层级关系
CREATE POLICY "用户可以查看自己创建的公司和下属创建的公司"
ON companies
FOR SELECT
USING (
  -- 超级管理员可以查看所有
  is_super_admin(auth.uid())
  OR
  -- 创建者可以查看
  created_by = auth.uid()
  OR
  -- 创建者的上级可以查看（递归）
  EXISTS(
    SELECT 1 FROM get_manager_chain(created_by) WHERE manager_id = auth.uid()
  )
);

-- 更新INSERT策略
DROP POLICY IF EXISTS "有权限的用户可以创建公司" ON companies;

CREATE POLICY "用户可以创建公司"
ON companies
FOR INSERT
WITH CHECK (
  -- 超级管理员可以创建
  is_super_admin(auth.uid())
  OR
  -- 有company_create权限的用户可以创建
  has_permission(auth.uid(), 'company_create')
  OR
  -- manager角色可以创建
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'manager'
  )
);

-- 更新UPDATE策略
DROP POLICY IF EXISTS "有权限的用户可以更新公司" ON companies;

CREATE POLICY "用户可以更新自己创建的公司"
ON companies
FOR UPDATE
USING (
  -- 超级管理员可以更新所有
  is_super_admin(auth.uid())
  OR
  -- 创建者可以更新
  created_by = auth.uid()
  OR
  -- 创建者的直接上级可以更新
  created_by IN (
    SELECT id FROM profiles WHERE manager_id = auth.uid()
  )
)
WITH CHECK (
  -- 更新后仍然满足条件
  is_super_admin(auth.uid())
  OR
  created_by = auth.uid()
  OR
  created_by IN (
    SELECT id FROM profiles WHERE manager_id = auth.uid()
  )
);

-- 更新DELETE策略
DROP POLICY IF EXISTS "有权限的用户可以删除公司" ON companies;

CREATE POLICY "用户可以删除自己创建的公司"
ON companies
FOR DELETE
USING (
  -- 超级管理员可以删除所有
  is_super_admin(auth.uid())
  OR
  -- 创建者可以删除
  created_by = auth.uid()
  OR
  -- 有delete权限且是创建者的直接上级
  (
    has_permission(auth.uid(), 'company_delete')
    AND created_by IN (
      SELECT id FROM profiles WHERE manager_id = auth.uid()
    )
  )
);

-- ============================================
-- 更新 employees 表的 RLS 策略
-- ============================================

-- 删除旧的SELECT策略
DROP POLICY IF EXISTS "用户可以查看自己公司的员工和下属" ON employees;

-- 创建新的SELECT策略：基于公司所有权
CREATE POLICY "用户可以查看有权访问的公司的员工"
ON employees
FOR SELECT
USING (
  -- 超级管理员可以查看所有
  is_super_admin(auth.uid())
  OR
  -- 可以查看有权访问的公司的员工
  can_access_company_data(auth.uid(), company_id)
);

-- 更新INSERT策略
DROP POLICY IF EXISTS "用户可以创建自己公司的员工" ON employees;
DROP POLICY IF EXISTS "用户可以创建有权访问的公司的员工" ON employees;

CREATE POLICY "用户可以创建有权访问的公司的员工"
ON employees
FOR INSERT
WITH CHECK (
  -- 超级管理员可以创建
  is_super_admin(auth.uid())
  OR
  -- 可以在有权访问的公司创建员工
  (
    has_permission(auth.uid(), 'employee_create')
    AND can_access_company_data(auth.uid(), company_id)
  )
);

-- 更新UPDATE策略
DROP POLICY IF EXISTS "用户可以更新自己公司的员工和下属" ON employees;
DROP POLICY IF EXISTS "用户可以更新有权访问的公司的员工" ON employees;

CREATE POLICY "用户可以更新有权访问的公司的员工"
ON employees
FOR UPDATE
USING (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'employee_edit')
    AND can_access_company_data(auth.uid(), company_id)
  )
)
WITH CHECK (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'employee_edit')
    AND can_access_company_data(auth.uid(), company_id)
  )
);

-- 更新DELETE策略
DROP POLICY IF EXISTS "用户可以删除自己公司的员工" ON employees;
DROP POLICY IF EXISTS "用户可以删除有权访问的公司的员工" ON employees;

CREATE POLICY "用户可以删除有权访问的公司的员工"
ON employees
FOR DELETE
USING (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'employee_delete')
    AND can_access_company_data(auth.uid(), company_id)
  )
);

-- ============================================
-- 更新 document_templates 表的 RLS 策略
-- ============================================

-- 删除旧策略
DROP POLICY IF EXISTS "用户可以查看自己公司的文书模板" ON document_templates;
DROP POLICY IF EXISTS "用户可以查看有权访问的公司的文书模板" ON document_templates;

-- 创建新的SELECT策略
CREATE POLICY "用户可以查看有权访问的公司的文书模板"
ON document_templates
FOR SELECT
USING (
  is_super_admin(auth.uid())
  OR
  can_access_company_data(auth.uid(), company_id)
);

-- 更新INSERT策略
DROP POLICY IF EXISTS "用户可以创建自己公司的文书模板" ON document_templates;
DROP POLICY IF EXISTS "用户可以创建有权访问的公司的文书模板" ON document_templates;

CREATE POLICY "用户可以创建有权访问的公司的文书模板"
ON document_templates
FOR INSERT
WITH CHECK (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'template_create')
    AND can_access_company_data(auth.uid(), company_id)
  )
);

-- 更新UPDATE策略
DROP POLICY IF EXISTS "用户可以更新自己公司的文书模板" ON document_templates;
DROP POLICY IF EXISTS "用户可以更新有权访问的公司的文书模板" ON document_templates;

CREATE POLICY "用户可以更新有权访问的公司的文书模板"
ON document_templates
FOR UPDATE
USING (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'template_edit')
    AND can_access_company_data(auth.uid(), company_id)
  )
)
WITH CHECK (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'template_edit')
    AND can_access_company_data(auth.uid(), company_id)
  )
);

-- 更新DELETE策略
DROP POLICY IF EXISTS "用户可以删除自己公司的文书模板" ON document_templates;
DROP POLICY IF EXISTS "用户可以删除有权访问的公司的文书模板" ON document_templates;

CREATE POLICY "用户可以删除有权访问的公司的文书模板"
ON document_templates
FOR DELETE
USING (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'template_delete')
    AND can_access_company_data(auth.uid(), company_id)
  )
);

-- ============================================
-- 更新 signing_records 表的 RLS 策略
-- ============================================

-- 删除旧策略
DROP POLICY IF EXISTS "用户可以查看自己公司的签署记录" ON signing_records;
DROP POLICY IF EXISTS "用户可以查看有权访问的公司的签署记录" ON signing_records;

-- 创建新的SELECT策略
CREATE POLICY "用户可以查看有权访问的公司的签署记录"
ON signing_records
FOR SELECT
USING (
  is_super_admin(auth.uid())
  OR
  -- 可以查看有权访问的公司的签署记录
  can_access_company_data(auth.uid(), company_id)
  OR
  -- 创建者可以查看自己创建的签署记录
  created_by = auth.uid()
);

-- 更新INSERT策略
DROP POLICY IF EXISTS "用户可以创建自己公司的签署记录" ON signing_records;
DROP POLICY IF EXISTS "用户可以创建有权访问的公司的签署记录" ON signing_records;

CREATE POLICY "用户可以创建有权访问的公司的签署记录"
ON signing_records
FOR INSERT
WITH CHECK (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'document_create')
    AND can_access_company_data(auth.uid(), company_id)
  )
);

-- 更新UPDATE策略
DROP POLICY IF EXISTS "用户可以更新自己公司的签署记录" ON signing_records;
DROP POLICY IF EXISTS "用户可以更新有权访问的公司的签署记录" ON signing_records;

CREATE POLICY "用户可以更新有权访问的公司的签署记录"
ON signing_records
FOR UPDATE
USING (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'document_edit')
    AND can_access_company_data(auth.uid(), company_id)
  )
  OR
  -- 创建者可以更新自己创建的签署记录
  created_by = auth.uid()
)
WITH CHECK (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'document_edit')
    AND can_access_company_data(auth.uid(), company_id)
  )
  OR
  created_by = auth.uid()
);

-- 添加注释
COMMENT ON COLUMN companies.created_by IS '公司创建者ID';
COMMENT ON FUNCTION get_manager_chain IS '递归获取用户的所有上级ID';
COMMENT ON FUNCTION can_access_company_data IS '判断用户是否可以访问某个公司的数据（创建者或其上级）';