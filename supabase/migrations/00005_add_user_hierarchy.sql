-- 为profiles表添加上级字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- 添加索引提升查询性能
CREATE INDEX IF NOT EXISTS idx_profiles_manager_id ON profiles(manager_id);

-- 添加注释
COMMENT ON COLUMN profiles.manager_id IS '直属上级用户ID';

-- 创建递归查询函数：获取用户的所有下级（包括间接下级）
CREATE OR REPLACE FUNCTION get_subordinates(user_id UUID)
RETURNS TABLE (subordinate_id UUID) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE subordinates AS (
    -- 基础查询：直接下级
    SELECT id FROM profiles WHERE manager_id = user_id
    UNION
    -- 递归查询：间接下级
    SELECT p.id FROM profiles p
    INNER JOIN subordinates s ON p.manager_id = s.id
  )
  SELECT id FROM subordinates;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：检查用户是否有权限查看目标用户的数据
CREATE OR REPLACE FUNCTION can_view_user_data(viewer_id UUID, target_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  viewer_role TEXT;
BEGIN
  -- 获取查看者的角色
  SELECT role INTO viewer_role FROM profiles WHERE id = viewer_id;
  
  -- super_admin可以查看所有数据
  IF viewer_role = 'super_admin' THEN
    RETURN TRUE;
  END IF;
  
  -- 可以查看自己的数据
  IF viewer_id = target_id THEN
    RETURN TRUE;
  END IF;
  
  -- manager可以查看下级的数据
  IF viewer_role = 'manager' THEN
    RETURN EXISTS (
      SELECT 1 FROM get_subordinates(viewer_id) WHERE subordinate_id = target_id
    );
  END IF;
  
  -- 其他情况不允许查看
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;