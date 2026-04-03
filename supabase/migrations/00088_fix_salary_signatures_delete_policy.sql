-- 修复薪酬签署删除策略
-- 改为基于权限检查，允许拥有删除权限的用户删除

-- 删除旧的删除策略
DROP POLICY IF EXISTS salary_signatures_delete_policy ON salary_signatures;

-- 创建新的删除策略，基于权限检查
CREATE POLICY salary_signatures_delete_policy ON salary_signatures
  FOR DELETE
  USING (
    is_super_admin(auth.uid()) 
    OR has_permission(auth.uid(), 'salary_signing_delete')
  );