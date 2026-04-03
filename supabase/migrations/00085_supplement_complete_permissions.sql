-- 补充完整的系统权限配置
-- 根据九头鸟人事托管签署系统的实际功能补充缺失的权限

-- ==================== 补充客户管理权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('customer_view', '客户查看', '查看客户列表和详情'),
('customer_create', '客户新增', '新增客户信息'),
('customer_edit', '客户编辑', '编辑客户信息'),
('customer_delete', '客户删除', '删除客户记录'),
('customer_export', '客户导出', '导出客户数据'),
('customer_seal_view', '客户签章查看', '查看客户签章使用数据')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 补充公司流转权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('company_transfer', '公司流转', '流转公司所有权'),
('company_transfer_history_view', '公司流转历史查看', '查看公司流转历史记录')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 补充员工导入权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('employee_import', '员工批量导入', '批量导入员工数据')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 补充文书历史记录权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('document_history_view', '文书历史查看', '查看员工文书签署历史记录'),
('document_history_export', '文书历史导出', '导出文书历史数据')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 补充批量操作权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('batch_download', '批量下载', '批量下载记录数据'),
('batch_revoke', '批量撤回', '批量撤回签署记录'),
('batch_delete', '批量删除', '批量删除记录')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 补充工资表拆分权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('salary_split', '工资表拆分', '将工资表拆分为工资条')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 补充短信发送权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('sms_send', '短信发送', '发送签署短信通知'),
('sms_batch_send', '批量短信发送', '批量发送签署短信')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 补充工资结构模板权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('salary_template_view', '工资结构模板查看', '查看工资结构模板'),
('salary_template_create', '工资结构模板新增', '新增工资结构模板'),
('salary_template_edit', '工资结构模板编辑', '编辑工资结构模板'),
('salary_template_delete', '工资结构模板删除', '删除工资结构模板')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 补充工资条管理权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('salary_item_view', '工资条查看', '查看工资条列表'),
('salary_item_export', '工资条导出', '导出工资条数据')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
