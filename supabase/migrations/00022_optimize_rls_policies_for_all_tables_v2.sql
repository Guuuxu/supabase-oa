-- ============================================
-- 优化所有表的RLS策略，确保权限控制一致性
-- ============================================

-- ============================================
-- 1. employees表：员工数据
-- ============================================

-- 删除冗余的SELECT策略
DROP POLICY IF EXISTS "员工可以查看同公司员工" ON employees;
DROP POLICY IF EXISTS "管理员可以查看所有员工" ON employees;
DROP POLICY IF EXISTS "有权限的用户可以管理员工" ON employees;

-- 保留并确认核心策略
-- SELECT策略已存在："用户可以查看有权访问的公司的员工"
-- INSERT策略已存在："用户可以创建有权访问的公司的员工"
-- UPDATE策略已存在："用户可以更新有权访问的公司的员工"
-- DELETE策略已存在："用户可以删除有权访问的公司的员工"

-- ============================================
-- 2. document_templates表：文书模板
-- ============================================

-- 删除冗余的SELECT策略
DROP POLICY IF EXISTS "所有认证用户可以查看文书模板" ON document_templates;
DROP POLICY IF EXISTS "有权限的用户可以管理文书模板" ON document_templates;

-- 保留并确认核心策略
-- SELECT策略已存在："用户可以查看有权访问的公司的文书模板"
-- INSERT策略已存在："用户可以创建有权访问的公司的文书模板"
-- UPDATE策略已存在："用户可以更新有权访问的公司的文书模板"
-- DELETE策略已存在："用户可以删除有权访问的公司的文书模板"

-- ============================================
-- 3. signing_records表：签署记录
-- ============================================

-- 删除冗余的SELECT策略
DROP POLICY IF EXISTS "员工可以查看相关签署记录" ON signing_records;
DROP POLICY IF EXISTS "管理员可以查看所有签署记录" ON signing_records;
DROP POLICY IF EXISTS "有权限的用户可以管理签署记录" ON signing_records;

-- 保留并确认核心策略
-- SELECT策略已存在："用户可以查看有权访问的公司的签署记录"
-- INSERT策略已存在："用户可以创建有权访问的公司的签署记录"
-- UPDATE策略已存在："用户可以更新有权访问的公司的签署记录"

-- 添加DELETE策略
DROP POLICY IF EXISTS "用户可以删除有权访问的公司的签署记录" ON signing_records;

CREATE POLICY "用户可以删除有权访问的公司的签署记录"
ON signing_records
FOR DELETE
USING (
  is_super_admin(auth.uid())
  OR
  (has_permission(auth.uid(), 'document_delete') AND can_access_company_data(auth.uid(), company_id))
  OR
  created_by = auth.uid()
);

-- ============================================
-- 4. signed_documents表：已签署文书
-- ============================================

-- 检查是否存在RLS策略，如果没有则创建
DROP POLICY IF EXISTS "用户可以查看有权访问的签署记录的已签署文书" ON signed_documents;
DROP POLICY IF EXISTS "用户可以创建有权访问的签署记录的已签署文书" ON signed_documents;
DROP POLICY IF EXISTS "用户可以更新有权访问的签署记录的已签署文书" ON signed_documents;
DROP POLICY IF EXISTS "用户可以删除有权访问的签署记录的已签署文书" ON signed_documents;

CREATE POLICY "用户可以查看有权访问的签署记录的已签署文书"
ON signed_documents
FOR SELECT
USING (
  is_super_admin(auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM signing_records sr
    WHERE sr.id = signed_documents.signing_record_id
      AND can_access_company_data(auth.uid(), sr.company_id)
  )
);

CREATE POLICY "用户可以创建有权访问的签署记录的已签署文书"
ON signed_documents
FOR INSERT
WITH CHECK (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'document_create')
    AND EXISTS (
      SELECT 1 FROM signing_records sr
      WHERE sr.id = signed_documents.signing_record_id
        AND can_access_company_data(auth.uid(), sr.company_id)
    )
  )
);

CREATE POLICY "用户可以更新有权访问的签署记录的已签署文书"
ON signed_documents
FOR UPDATE
USING (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'document_edit')
    AND EXISTS (
      SELECT 1 FROM signing_records sr
      WHERE sr.id = signed_documents.signing_record_id
        AND can_access_company_data(auth.uid(), sr.company_id)
    )
  )
)
WITH CHECK (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'document_edit')
    AND EXISTS (
      SELECT 1 FROM signing_records sr
      WHERE sr.id = signed_documents.signing_record_id
        AND can_access_company_data(auth.uid(), sr.company_id)
    )
  )
);

CREATE POLICY "用户可以删除有权访问的签署记录的已签署文书"
ON signed_documents
FOR DELETE
USING (
  is_super_admin(auth.uid())
  OR
  (
    has_permission(auth.uid(), 'document_delete')
    AND EXISTS (
      SELECT 1 FROM signing_records sr
      WHERE sr.id = signed_documents.signing_record_id
        AND can_access_company_data(auth.uid(), sr.company_id)
    )
  )
);

-- ============================================
-- 5. notifications表：通知记录
-- ============================================

-- 通知记录的权限控制：用户可以查看自己的通知和下级的通知
DROP POLICY IF EXISTS "用户可以查看自己和下级的通知" ON notifications;
DROP POLICY IF EXISTS "用户可以创建通知" ON notifications;
DROP POLICY IF EXISTS "用户可以更新自己和下级的通知" ON notifications;
DROP POLICY IF EXISTS "用户可以删除自己和下级的通知" ON notifications;

CREATE POLICY "用户可以查看自己和下级的通知"
ON notifications
FOR SELECT
USING (
  is_super_admin(auth.uid())
  OR
  user_id = auth.uid()
  OR
  user_id IN (
    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())
  )
);

CREATE POLICY "用户可以创建通知"
ON notifications
FOR INSERT
WITH CHECK (
  is_super_admin(auth.uid())
  OR
  user_id = auth.uid()
  OR
  user_id IN (
    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())
  )
);

CREATE POLICY "用户可以更新自己和下级的通知"
ON notifications
FOR UPDATE
USING (
  is_super_admin(auth.uid())
  OR
  user_id = auth.uid()
  OR
  user_id IN (
    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())
  )
)
WITH CHECK (
  is_super_admin(auth.uid())
  OR
  user_id = auth.uid()
  OR
  user_id IN (
    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())
  )
);

CREATE POLICY "用户可以删除自己和下级的通知"
ON notifications
FOR DELETE
USING (
  is_super_admin(auth.uid())
  OR
  user_id = auth.uid()
  OR
  user_id IN (
    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())
  )
);

-- ============================================
-- 6. reminder_configs表：提醒配置
-- ============================================

-- 提醒配置的权限控制：超级管理员可以管理
DROP POLICY IF EXISTS "超级管理员可以查看所有提醒配置" ON reminder_configs;
DROP POLICY IF EXISTS "超级管理员可以创建提醒配置" ON reminder_configs;
DROP POLICY IF EXISTS "超级管理员可以更新提醒配置" ON reminder_configs;
DROP POLICY IF EXISTS "超级管理员可以删除提醒配置" ON reminder_configs;

CREATE POLICY "超级管理员可以查看所有提醒配置"
ON reminder_configs
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "超级管理员可以创建提醒配置"
ON reminder_configs
FOR INSERT
WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "超级管理员可以更新提醒配置"
ON reminder_configs
FOR UPDATE
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "超级管理员可以删除提醒配置"
ON reminder_configs
FOR DELETE
USING (is_super_admin(auth.uid()));

-- 添加注释
COMMENT ON POLICY "用户可以查看有权访问的公司的员工" ON employees IS '用户可以查看自己和下级拥有的公司的员工';
COMMENT ON POLICY "用户可以查看有权访问的公司的文书模板" ON document_templates IS '用户可以查看自己和下级拥有的公司的文书模板';
COMMENT ON POLICY "用户可以查看有权访问的公司的签署记录" ON signing_records IS '用户可以查看自己和下级拥有的公司的签署记录';
COMMENT ON POLICY "用户可以查看有权访问的签署记录的已签署文书" ON signed_documents IS '用户可以查看有权访问的签署记录的已签署文书';
COMMENT ON POLICY "用户可以查看自己和下级的通知" ON notifications IS '用户可以查看自己和下级的通知记录';