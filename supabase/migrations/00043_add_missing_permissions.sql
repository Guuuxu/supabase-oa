-- 添加缺失的权限

-- AI助手权限
INSERT INTO permissions (code, name, description) VALUES
('ai_assistant_use', 'AI助手使用', '使用AI助手功能')
ON CONFLICT (code) DO NOTHING;

-- 招聘数据查询权限
INSERT INTO permissions (code, name, description) VALUES
('recruitment_query_view', '招聘数据查看', '查看招聘数据查询结果'),
('recruitment_query_export', '招聘数据导出', '导出招聘数据')
ON CONFLICT (code) DO NOTHING;

-- 实名认证权限
INSERT INTO permissions (code, name, description) VALUES
('identity_verification_manage', '实名认证管理', '管理实名认证'),
('identity_verification_view', '实名认证查看', '查看实名认证记录')
ON CONFLICT (code) DO NOTHING;

-- 操作日志权限
INSERT INTO permissions (code, name, description) VALUES
('audit_log_view', '操作日志查看', '查看系统操作日志'),
('audit_log_export', '操作日志导出', '导出操作日志数据')
ON CONFLICT (code) DO NOTHING;