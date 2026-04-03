-- 为工资结构模板添加PDF模板配置
ALTER TABLE salary_structure_templates
ADD COLUMN IF NOT EXISTS pdf_template_config JSONB DEFAULT '{
  "title": "工资条",
  "show_company_logo": true,
  "show_company_name": true,
  "show_period": true,
  "header_color": "#1e40af",
  "font_size": 10,
  "show_signature_area": true,
  "signature_label": "员工签名",
  "footer_text": "本工资条仅供个人查阅，请妥善保管"
}'::jsonb;

-- 添加注释
COMMENT ON COLUMN salary_structure_templates.pdf_template_config IS 'PDF模板配置（JSON格式）：标题、样式、布局等';

-- 为工资记录表添加PDF生成状态
ALTER TABLE salary_records
ADD COLUMN IF NOT EXISTS pdf_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pdf_generation_error TEXT;

COMMENT ON COLUMN salary_records.pdf_generated IS 'PDF是否已生成';
COMMENT ON COLUMN salary_records.pdf_generation_error IS 'PDF生成错误信息';

-- 为工资条明细表添加PDF文件URL
ALTER TABLE salary_items
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

COMMENT ON COLUMN salary_items.pdf_url IS '工资条PDF文件URL';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_salary_items_pdf_url ON salary_items(pdf_url) WHERE pdf_url IS NOT NULL;