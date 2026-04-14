-- 文书模板与爱签开放平台模板关联（template/list 的 templateIdent 等）
ALTER TABLE document_templates
  ADD COLUMN IF NOT EXISTS asign_template_ident TEXT,
  ADD COLUMN IF NOT EXISTS asign_template_type SMALLINT;

COMMENT ON COLUMN document_templates.asign_template_ident IS '爱签模板编号，与当前 ASIGN_APP_ID 下控制台模板一致';
COMMENT ON COLUMN document_templates.asign_template_type IS '爱签模板类型：1=word 2=pdf 3=html';

-- 仅对「启用」行约束唯一，避免与软删除（is_active=false）旧行冲突
CREATE UNIQUE INDEX IF NOT EXISTS document_templates_asign_ident_universal_uq
  ON document_templates (asign_template_ident)
  WHERE company_id IS NULL AND asign_template_ident IS NOT NULL AND is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS document_templates_asign_ident_company_uq
  ON document_templates (company_id, asign_template_ident)
  WHERE company_id IS NOT NULL AND asign_template_ident IS NOT NULL AND is_active = true;
