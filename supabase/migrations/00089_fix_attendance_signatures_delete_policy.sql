-- 修复考勤签署删除策略
-- 改为基于权限检查，允许拥有删除权限的用户删除

-- 删除旧的删除策略
DROP POLICY IF EXISTS attendance_signatures_delete_policy ON attendance_signatures;

-- 创建新的删除策略，基于权限检查
CREATE POLICY attendance_signatures_delete_policy ON attendance_signatures
  FOR DELETE
  USING (
    is_super_admin(auth.uid()) 
    OR has_permission(auth.uid(), 'attendance_signing_delete')
  );