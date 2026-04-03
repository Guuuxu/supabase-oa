
-- 删除旧的log_operation函数
DROP FUNCTION IF EXISTS log_operation(operation_type, text, text, uuid, text, text);

-- 重新创建log_operation函数，添加search_path
CREATE OR REPLACE FUNCTION log_operation(
  p_operation_type operation_type,
  p_operation_detail text,
  p_target_type text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO operation_logs (
    user_id,
    operation_type,
    operation_detail,
    target_type,
    target_id,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),  -- 使用auth.uid()更明确
    p_operation_type,
    p_operation_detail,
    p_target_type,
    p_target_id,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

COMMENT ON FUNCTION log_operation IS '记录操作日志';
