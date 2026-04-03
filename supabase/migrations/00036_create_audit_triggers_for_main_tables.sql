
-- 创建通用的审计触发器函数
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_operation_type operation_type;
  v_operation_detail text;
  v_target_type text;
BEGIN
  -- 确定操作类型
  v_target_type := TG_TABLE_NAME;
  
  IF TG_OP = 'INSERT' THEN
    CASE TG_TABLE_NAME
      WHEN 'companies' THEN
        v_operation_type := 'company_create';
        v_operation_detail := format('创建公司: %s (编码: %s)', NEW.name, NEW.code);
      WHEN 'employees' THEN
        v_operation_type := 'employee_create';
        v_operation_detail := format('创建员工: %s (工号: %s)', NEW.name, NEW.employee_number);
      WHEN 'document_templates' THEN
        v_operation_type := 'template_create';
        v_operation_detail := format('创建文书模板: %s', NEW.name);
      WHEN 'signing_records' THEN
        v_operation_type := 'signing_initiate';
        v_operation_detail := format('发起签署记录: %s', NEW.id);
      WHEN 'roles' THEN
        v_operation_type := 'role_create';
        v_operation_detail := format('创建角色: %s', NEW.name);
      ELSE
        RETURN NEW;
    END CASE;
    
    PERFORM log_operation(v_operation_type, v_operation_detail, v_target_type, NEW.id);
    
  ELSIF TG_OP = 'UPDATE' THEN
    CASE TG_TABLE_NAME
      WHEN 'companies' THEN
        v_operation_type := 'company_update';
        v_operation_detail := format('更新公司: %s', NEW.name);
      WHEN 'employees' THEN
        v_operation_type := 'employee_update';
        v_operation_detail := format('更新员工: %s', NEW.name);
      WHEN 'document_templates' THEN
        v_operation_type := 'template_update';
        v_operation_detail := format('更新文书模板: %s', NEW.name);
      WHEN 'signing_records' THEN
        -- 检查是员工签署还是公司签署
        IF NEW.employee_signed_at IS NOT NULL AND OLD.employee_signed_at IS NULL THEN
          v_operation_type := 'signing_employee';
          v_operation_detail := format('员工签署: %s', NEW.id);
        ELSIF NEW.company_signed_at IS NOT NULL AND OLD.company_signed_at IS NULL THEN
          v_operation_type := 'signing_company';
          v_operation_detail := format('公司签署: %s', NEW.id);
        ELSE
          v_operation_type := 'signing_initiate';
          v_operation_detail := format('更新签署记录: %s', NEW.id);
        END IF;
      WHEN 'roles' THEN
        v_operation_type := 'role_update';
        v_operation_detail := format('更新角色: %s', NEW.name);
      ELSE
        RETURN NEW;
    END CASE;
    
    PERFORM log_operation(v_operation_type, v_operation_detail, v_target_type, NEW.id);
    
  ELSIF TG_OP = 'DELETE' THEN
    CASE TG_TABLE_NAME
      WHEN 'companies' THEN
        v_operation_type := 'company_delete';
        v_operation_detail := format('删除公司: %s', OLD.name);
      WHEN 'employees' THEN
        v_operation_type := 'employee_delete';
        v_operation_detail := format('删除员工: %s', OLD.name);
      WHEN 'document_templates' THEN
        v_operation_type := 'template_delete';
        v_operation_detail := format('删除文书模板: %s', OLD.name);
      WHEN 'roles' THEN
        v_operation_type := 'role_delete';
        v_operation_detail := format('删除角色: %s', OLD.name);
      ELSE
        RETURN OLD;
    END CASE;
    
    PERFORM log_operation(v_operation_type, v_operation_detail, v_target_type, OLD.id);
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- 为companies表创建触发器
CREATE TRIGGER companies_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON companies
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();

-- 为employees表创建触发器
CREATE TRIGGER employees_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON employees
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();

-- 为document_templates表创建触发器
CREATE TRIGGER document_templates_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON document_templates
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();

-- 为signing_records表创建触发器
CREATE TRIGGER signing_records_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON signing_records
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();

-- 为roles表创建触发器
CREATE TRIGGER roles_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON roles
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();

COMMENT ON FUNCTION audit_trigger_function IS '审计触发器函数，自动记录数据变更日志';
