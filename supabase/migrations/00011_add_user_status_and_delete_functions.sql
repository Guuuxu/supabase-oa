
-- 添加is_active字段到profiles表
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- 添加注释
COMMENT ON COLUMN profiles.is_active IS '用户是否激活，false表示暂停';

-- 创建删除用户的RPC函数
CREATE OR REPLACE FUNCTION delete_user(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- 检查用户是否存在
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    RETURN json_build_object('success', false, 'error', '用户不存在');
  END IF;
  
  -- 检查是否是超级管理员
  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND role = 'super_admin') THEN
    RETURN json_build_object('success', false, 'error', '不能删除超级管理员');
  END IF;
  
  -- 删除profiles记录
  DELETE FROM profiles WHERE id = user_id;
  
  -- 删除auth.users记录（需要service_role权限）
  DELETE FROM auth.users WHERE id = user_id;
  
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 创建切换用户状态的RPC函数
CREATE OR REPLACE FUNCTION toggle_user_status(user_id UUID, new_status BOOLEAN)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- 检查用户是否存在
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    RETURN json_build_object('success', false, 'error', '用户不存在');
  END IF;
  
  -- 检查是否是超级管理员
  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND role = 'super_admin') THEN
    RETURN json_build_object('success', false, 'error', '不能暂停超级管理员');
  END IF;
  
  -- 更新状态
  UPDATE profiles SET is_active = new_status WHERE id = user_id;
  
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 更新现有用户的is_active为true
UPDATE profiles SET is_active = true WHERE is_active IS NULL;
