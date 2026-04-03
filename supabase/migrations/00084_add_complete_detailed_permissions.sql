-- 添加完整详细的系统权限
-- 本迁移文件为九头鸟人事托管签署系统添加所有功能模块的详细权限

-- ==================== 1. 公司管理权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('company_view', '公司查看', '查看公司列表和详情'),
('company_create', '公司新增', '新增公司信息'),
('company_edit', '公司编辑', '编辑公司信息'),
('company_delete', '公司删除', '删除公司记录'),
('company_export', '公司导出', '导出公司数据')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 2. 员工管理权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('employee_view', '员工查看', '查看员工列表和详情'),
('employee_create', '员工新增', '新增员工信息'),
('employee_edit', '员工编辑', '编辑员工信息'),
('employee_delete', '员工删除', '删除员工记录'),
('employee_export', '员工导出', '导出员工数据'),
('employee_status_view', '员工状态查看', '查看员工状态'),
('employee_status_edit', '员工状态编辑', '修改员工状态')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 3. 文书模板权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('template_view', '模板查看', '查看文书模板列表和详情'),
('template_create', '模板新增', '新增文书模板'),
('template_edit', '模板编辑', '编辑文书模板'),
('template_delete', '模板删除', '删除文书模板'),
('template_enable', '模板启用', '启用或禁用文书模板')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 4. 文书签署权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('signing_view', '签署查看', '查看签署记录和状态'),
('signing_initiate', '签署发起', '发起文书签署流程'),
('signing_revoke', '签署撤回', '撤回已发起的签署'),
('signing_delete', '签署删除', '删除签署记录'),
('signing_export', '签署导出', '导出签署数据'),
('signing_download', '签署下载', '下载已签署文件'),
('signing_statistics', '签署统计', '查看签署数据统计')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 5. 薪资管理权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('salary_structure_view', '工资结构查看', '查看工资结构模板'),
('salary_structure_create', '工资结构新增', '新增工资结构模板'),
('salary_structure_edit', '工资结构编辑', '编辑工资结构模板'),
('salary_structure_delete', '工资结构删除', '删除工资结构模板'),
('salary_record_view', '工资记录查看', '查看工资记录'),
('salary_record_upload', '工资表上传', '上传工资表文件'),
('salary_record_edit', '工资记录编辑', '编辑工资记录'),
('salary_record_delete', '工资记录删除', '删除工资记录'),
('salary_record_export', '工资记录导出', '导出工资数据'),
('salary_signing_view', '工资条签署查看', '查看工资条签署状态'),
('salary_signing_initiate', '工资条签署发起', '发起工资条签署'),
('salary_signing_revoke', '工资条签署撤回', '撤回工资条签署'),
('salary_signing_delete', '工资条签署删除', '删除工资条签署记录')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 6. 考勤管理权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('attendance_view', '考勤查看', '查看考勤记录'),
('attendance_upload', '考勤上传', '上传考勤表文件'),
('attendance_edit', '考勤编辑', '编辑考勤记录'),
('attendance_delete', '考勤删除', '删除考勤记录'),
('attendance_export', '考勤导出', '导出考勤数据'),
('attendance_signing_view', '考勤签署查看', '查看考勤确认签署状态'),
('attendance_signing_initiate', '考勤签署发起', '发起考勤确认签署'),
('attendance_signing_revoke', '考勤签署撤回', '撤回考勤确认签署'),
('attendance_signing_delete', '考勤签署删除', '删除考勤签署记录')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 7. 用户管理权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('user_view', '用户查看', '查看用户列表和详情'),
('user_create', '用户新增', '新增系统用户'),
('user_edit', '用户编辑', '编辑用户信息'),
('user_delete', '用户删除', '删除或停用用户'),
('user_role_assign', '用户角色分配', '为用户分配角色')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 8. 角色权限管理 ====================
INSERT INTO permissions (code, name, description) VALUES
('role_view', '角色查看', '查看角色列表和详情'),
('role_create', '角色新增', '新增系统角色'),
('role_edit', '角色编辑', '编辑角色信息'),
('role_delete', '角色删除', '删除角色'),
('role_permission_config', '角色权限配置', '配置角色的权限')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 9. 系统配置权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('system_config_view', '系统配置查看', '查看系统配置'),
('system_config_edit', '系统配置编辑', '编辑系统配置'),
('esign_config_view', '电子签配置查看', '查看电子签API配置'),
('esign_config_edit', '电子签配置编辑', '编辑电子签API配置'),
('reminder_config_view', '提醒配置查看', '查看提醒配置'),
('reminder_config_edit', '提醒配置编辑', '编辑提醒配置')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 10. 通知管理权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('notification_view', '通知查看', '查看系统通知'),
('notification_send', '通知发送', '发送系统通知'),
('notification_delete', '通知删除', '删除通知记录')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 11. 数据统计权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('dashboard_view', '看板查看', '查看数据看板'),
('statistics_view', '统计查看', '查看数据统计'),
('report_view', '报表查看', '查看各类报表'),
('report_export', '报表导出', '导出报表数据')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 12. 操作日志权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('audit_log_view', '操作日志查看', '查看系统操作日志'),
('audit_log_export', '操作日志导出', '导出操作日志数据')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 13. 工具箱权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('ai_assistant_use', 'AI助手使用', '使用AI助手功能'),
('recruitment_query_view', '招聘数据查看', '查看招聘数据查询结果'),
('recruitment_query_export', '招聘数据导出', '导出招聘数据'),
('identity_verification_manage', '实名认证管理', '管理实名认证'),
('identity_verification_view', '实名认证查看', '查看实名认证记录')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 14. 其他权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('subordinate_view', '下属查看', '查看下属员工'),
('subordinate_manage', '下属管理', '管理下属员工')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==================== 15. 档案下载权限 ====================
INSERT INTO permissions (code, name, description) VALUES
('signed_document_view', '已签文书查看', '查看已签署文书'),
('signed_document_download', '已签文书下载', '下载已签署文书'),
('salary_archive_view', '薪酬档案查看', '查看薪酬档案'),
('salary_archive_download', '薪酬档案下载', '下载薪酬档案')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 添加注释说明
COMMENT ON TABLE permissions IS '系统权限表，存储所有可分配的权限项';
COMMENT ON COLUMN permissions.code IS '权限代码，唯一标识';
COMMENT ON COLUMN permissions.name IS '权限名称，用于显示';
COMMENT ON COLUMN permissions.description IS '权限描述，说明权限的作用';