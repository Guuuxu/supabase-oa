-- 创建修改用户密码的函数
CREATE OR REPLACE FUNCTION update_user_password(
  user_id UUID,
  new_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- 检查当前用户是否是超级管理员
  IF NOT is_super_admin(uid()) THEN
    RETURN json_build_object(
      'success', false,
      'error', '只有超级管理员可以修改用户密码'
    );
  END IF;

  -- 检查密码长度
  IF LENGTH(new_password) < 6 THEN
    RETURN json_build_object(
      'success', false,
      'error', '密码长度至少6位'
    );
  END IF;

  -- 更新用户密码
  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_password, gen_salt('bf')),
    updated_at = NOW()
  WHERE id = user_id;

  -- 检查是否更新成功
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', '用户不存在'
    );
  END IF;

  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;