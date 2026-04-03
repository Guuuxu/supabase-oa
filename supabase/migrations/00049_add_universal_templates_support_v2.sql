
-- 允许document_templates表的company_id为NULL，以支持通用模板
ALTER TABLE document_templates 
ALTER COLUMN company_id DROP NOT NULL;

-- 添加注释说明
COMMENT ON COLUMN document_templates.company_id IS '所属公司ID，NULL表示通用模板（所有公司可用）';

-- 临时禁用审计触发器
ALTER TABLE document_templates DISABLE TRIGGER document_templates_audit_trigger;

-- 创建一些通用模板示例（只在不存在时创建）
DO $$
BEGIN
  -- 检查是否已有通用模板
  IF NOT EXISTS (SELECT 1 FROM document_templates WHERE company_id IS NULL LIMIT 1) THEN
    INSERT INTO document_templates (company_id, name, category, requires_company_signature, is_active)
    VALUES 
      (NULL, '劳动合同', 'onboarding', true, true),
      (NULL, '保密协议', 'onboarding', false, true),
      (NULL, '员工手册', 'onboarding', false, true),
      (NULL, '入职登记表', 'onboarding', false, true),
      (NULL, '求职登记表', 'onboarding', false, true),
      (NULL, '承诺书', 'onboarding', false, true),
      (NULL, '考勤确认', 'compensation', false, true),
      (NULL, '绩效考核确认', 'compensation', false, true),
      (NULL, '工资条确认', 'compensation', false, true);
  END IF;
END $$;

-- 重新启用审计触发器
ALTER TABLE document_templates ENABLE TRIGGER document_templates_audit_trigger;
