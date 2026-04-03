
-- 删除旧的transfer_company函数
DROP FUNCTION IF EXISTS transfer_company(uuid, uuid, text);

-- 重新创建transfer_company函数，确保正确引用auth.uid()
CREATE OR REPLACE FUNCTION transfer_company(
  p_company_id UUID,
  p_to_user_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_from_user_id UUID;
  v_current_user_id UUID;
  v_can_transfer BOOLEAN;
BEGIN
  -- 获取当前用户ID
  v_current_user_id := auth.uid();
  
  -- 获取公司的当前所有者
  SELECT owner_id INTO v_from_user_id FROM companies WHERE id = p_company_id;
  
  IF v_from_user_id IS NULL THEN
    RAISE EXCEPTION '公司不存在';
  END IF;
  
  -- 检查权限：所有者本人、所有者的直接上级、超级管理员
  v_can_transfer := (
    v_from_user_id = v_current_user_id  -- 所有者本人
    OR is_super_admin(v_current_user_id)  -- 超级管理员
    OR EXISTS(  -- 所有者的直接上级
      SELECT 1 FROM profiles
      WHERE id = v_from_user_id AND manager_id = v_current_user_id
    )
  );
  
  IF NOT v_can_transfer THEN
    RAISE EXCEPTION '没有权限流转此公司';
  END IF;
  
  -- 检查目标用户是否存在
  IF NOT EXISTS(SELECT 1 FROM profiles WHERE id = p_to_user_id) THEN
    RAISE EXCEPTION '目标用户不存在';
  END IF;
  
  -- 更新公司所有者
  UPDATE companies 
  SET owner_id = p_to_user_id, updated_at = NOW()
  WHERE id = p_company_id;
  
  -- 记录流转历史
  INSERT INTO company_transfers (
    company_id, from_user_id, to_user_id, transferred_by, reason
  ) VALUES (
    p_company_id, v_from_user_id, p_to_user_id, v_current_user_id, p_reason
  );
  
  -- 记录操作日志
  PERFORM log_operation(
    'company_transfer'::operation_type,
    format('流转公司给用户: %s，原因: %s', p_to_user_id, COALESCE(p_reason, '无')),
    'company',
    p_company_id
  );
  
  RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION transfer_company IS '流转公司给其他用户';
