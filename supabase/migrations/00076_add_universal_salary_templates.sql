-- 修改salary_structure_templates表，允许company_id为NULL以支持通用模板
ALTER TABLE salary_structure_templates ALTER COLUMN company_id DROP NOT NULL;

-- 添加注释说明
COMMENT ON COLUMN salary_structure_templates.company_id IS '所属公司ID，NULL表示通用模板，所有公司都可使用';

-- 添加is_universal字段，明确标识通用模板
ALTER TABLE salary_structure_templates ADD COLUMN IF NOT EXISTS is_universal BOOLEAN DEFAULT false;

COMMENT ON COLUMN salary_structure_templates.is_universal IS '是否为通用模板，通用模板可被所有公司使用';

-- 更新现有的NULL company_id记录为通用模板
UPDATE salary_structure_templates SET is_universal = true WHERE company_id IS NULL;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_salary_structure_templates_is_universal ON salary_structure_templates(is_universal) WHERE is_universal = true;
