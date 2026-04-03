
-- 创建函数：检查用户是否可以访问某个用户的数据（包括自己和下级）
CREATE OR REPLACE FUNCTION can_access_user_data(accessing_user_id uuid, target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 超级管理员可以访问所有数据
  IF is_super_admin(accessing_user_id) THEN
    RETURN true;
  END IF;
  
  -- 可以访问自己的数据
  IF accessing_user_id = target_user_id THEN
    RETURN true;
  END IF;
  
  -- 可以访问下级的数据
  IF target_user_id IN (SELECT subordinate_id FROM get_subordinates(accessing_user_id)) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 创建函数：获取用户可以访问的所有用户ID（包括自己和下级）
CREATE OR REPLACE FUNCTION get_accessible_users(user_id uuid)
RETURNS TABLE(accessible_user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  -- 自己
  SELECT user_id
  UNION
  -- 所有下级
  SELECT subordinate_id FROM get_subordinates(user_id);
END;
$$;

-- 注释
COMMENT ON FUNCTION can_access_user_data IS '检查用户是否可以访问目标用户的数据（包括自己和下级）';
COMMENT ON FUNCTION get_accessible_users IS '获取用户可以访问的所有用户ID列表（包括自己和下级）';
