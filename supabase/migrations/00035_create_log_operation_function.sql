
-- 创建记录操作日志的函数
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
    uid(),
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
