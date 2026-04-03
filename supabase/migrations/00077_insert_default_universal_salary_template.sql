-- 插入一个默认的通用工资结构模板
INSERT INTO salary_structure_templates (
  company_id,
  name,
  description,
  fields,
  is_default,
  is_universal,
  created_at,
  updated_at
) VALUES (
  NULL, -- 通用模板，不属于任何公司
  '标准工资结构模板',
  '适用于大多数企业的标准工资结构，包含基本工资、绩效奖金、各项补贴和扣除项',
  '[
    {"name": "基本工资", "code": "base_salary", "type": "number", "required": true},
    {"name": "岗位工资", "code": "position_salary", "type": "number", "required": false},
    {"name": "绩效奖金", "code": "performance_bonus", "type": "number", "required": false},
    {"name": "全勤奖", "code": "attendance_bonus", "type": "number", "required": false},
    {"name": "加班费", "code": "overtime_pay", "type": "number", "required": false},
    {"name": "交通补贴", "code": "transport_allowance", "type": "number", "required": false},
    {"name": "餐补", "code": "meal_allowance", "type": "number", "required": false},
    {"name": "通讯补贴", "code": "communication_allowance", "type": "number", "required": false},
    {"name": "应发工资", "code": "gross_salary", "type": "number", "required": true},
    {"name": "社保个人部分", "code": "social_insurance_personal", "type": "number", "required": false},
    {"name": "公积金个人部分", "code": "housing_fund_personal", "type": "number", "required": false},
    {"name": "个人所得税", "code": "personal_income_tax", "type": "number", "required": false},
    {"name": "其他扣款", "code": "other_deductions", "type": "number", "required": false},
    {"name": "实发工资", "code": "net_salary", "type": "number", "required": true}
  ]'::jsonb,
  true, -- 设为默认模板
  true, -- 设为通用模板
  now(),
  now()
) ON CONFLICT DO NOTHING; -- 如果已存在则不插入

-- 添加注释
COMMENT ON TABLE salary_structure_templates IS '工资结构模板表，支持通用模板（company_id为NULL）和公司专属模板';
