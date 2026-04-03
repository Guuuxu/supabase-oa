-- 修复log_operation函数，当用户未登录时跳过日志记录
CREATE OR REPLACE FUNCTION public.log_operation(
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
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  v_log_id uuid;
  v_user_id uuid;
BEGIN
  -- 获取当前用户ID
  v_user_id := auth.uid();
  
  -- 如果用户未登录，跳过日志记录并返回NULL
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- 插入操作日志
  INSERT INTO operation_logs (
    user_id,
    operation_type,
    operation_detail,
    target_type,
    target_id,
    ip_address,
    user_agent
  ) VALUES (
    v_user_id,
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
$function$;