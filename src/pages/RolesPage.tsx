import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { getRoles, getPermissions, createRole, updateRole, deleteRole, getRolePermissions, setRolePermissions } from '@/db/api';
import type { Role, Permission } from '@/types/types';
import { toast } from 'sonner';
import { Plus, Save, X, Trash2, Shield, Info, HelpCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export default function RolesPage() {
  const { profile } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // 检查用户权限
  const isSuperAdmin = profile?.role === 'super_admin';
  const hasRoleCreatePermission = isSuperAdmin; // 只有超级管理员可以创建角色
  const hasRoleEditPermission = isSuperAdmin; // 只有超级管理员可以编辑角色
  const hasRoleDeletePermission = isSuperAdmin; // 只有超级管理员可以删除角色

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [rolesData, permissionsData] = await Promise.all([
      getRoles(),
      getPermissions()
    ]);
    setRoles(rolesData);
    setPermissions(permissionsData);
    setLoading(false);
  };

  const handleSelectRole = async (role: Role) => {
    setSelectedRole(role);
    setIsEditing(true); // 自动进入编辑模式
    setIsCreating(false);
    
    // 加载角色的权限
    const rolePerms = await getRolePermissions(role.id);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: rolePerms.map(p => p.id)
    });
  };

  const handleCreateNew = () => {
    if (!hasRoleCreatePermission) {
      toast.error('您没有权限创建角色');
      return;
    }
    setSelectedRole(null);
    setIsCreating(true);
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
  };

  const handleEdit = () => {
    if (!hasRoleEditPermission) {
      toast.error('您没有权限编辑角色');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
      setFormData({ name: '', description: '', permissions: [] });
    } else if (isEditing && selectedRole) {
      setIsEditing(false);
      handleSelectRole(selectedRole);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('请填写角色名称');
      return;
    }

    if (isCreating && !hasRoleCreatePermission) {
      toast.error('您没有权限创建角色');
      return;
    }

    if (!isCreating && !hasRoleEditPermission) {
      toast.error('您没有权限编辑角色');
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      is_system_role: false,
      company_id: null
    };

    if (isCreating) {
      // 创建新角色
      const result = await createRole(submitData);
      if (result) {
        await setRolePermissions(result.id, formData.permissions);
        toast.success('创建成功');
        await loadData();
        setIsCreating(false);
        // 选中新创建的角色
        const newRole = await getRoles();
        const createdRole = newRole.find(r => r.id === result.id);
        if (createdRole) {
          handleSelectRole(createdRole);
        }
      } else {
        toast.error('创建失败');
      }
    } else if (selectedRole) {
      // 更新角色
      const success = await updateRole(selectedRole.id, submitData);
      if (success) {
        await setRolePermissions(selectedRole.id, formData.permissions);
        toast.success('更新成功');
        await loadData();
        setIsEditing(false);
        // 重新选中当前角色
        const updatedRoles = await getRoles();
        const updatedRole = updatedRoles.find(r => r.id === selectedRole.id);
        if (updatedRole) {
          handleSelectRole(updatedRole);
        }
      } else {
        toast.error('更新失败');
      }
    }
  };

  const handleDelete = async (role: Role) => {
    if (!hasRoleDeletePermission) {
      toast.error('您没有权限删除角色');
      return;
    }

    if (!confirm(`确定要删除角色"${role.name}"吗？`)) return;

    const success = await deleteRole(role.id);
    if (success) {
      toast.success('删除成功');
      if (selectedRole?.id === role.id) {
        setSelectedRole(null);
        setFormData({ name: '', description: '', permissions: [] });
      }
      loadData();
    } else {
      toast.error('删除失败');
    }
  };

  const togglePermission = (permissionId: string) => {
    if (formData.permissions.includes(permissionId)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(id => id !== permissionId)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionId]
      });
    }
  };

  const toggleAllPermissions = () => {
    if (formData.permissions.length === permissions.length) {
      setFormData({ ...formData, permissions: [] });
    } else {
      setFormData({ ...formData, permissions: permissions.map(p => p.id) });
    }
  };

  // 切换模块所有权限
  const toggleModulePermissions = (modulePermissions: Permission[]) => {
    const modulePermissionIds = modulePermissions.map(p => p.id);
    const allSelected = modulePermissionIds.every(id => formData.permissions.includes(id));
    
    if (allSelected) {
      // 取消选中该模块的所有权限
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(id => !modulePermissionIds.includes(id))
      });
    } else {
      // 选中该模块的所有权限
      const newPermissions = [...new Set([...formData.permissions, ...modulePermissionIds])];
      setFormData({
        ...formData,
        permissions: newPermissions
      });
    }
  };

  // 按模块分组权限
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const code = permission.code;
    let moduleName = '其他';
    
    // 基础管理
    if (code.startsWith('company_')) {
      moduleName = '📊 公司管理';
    } else if (code.startsWith('employee_')) {
      moduleName = '👥 员工管理';
    }
    // 文书管理
    else if (code.startsWith('template_')) {
      moduleName = '📄 文书模板';
    } else if (code.startsWith('document_') || code.startsWith('signing_') || code.startsWith('signed_')) {
      moduleName = '✍️ 文书签署';
    }
    // 薪资管理
    else if (code.startsWith('salary_')) {
      moduleName = '💰 薪资管理';
    } else if (code.startsWith('attendance_')) {
      moduleName = '📅 考勤管理';
    }
    // 用户与角色
    else if (code.startsWith('role_')) {
      moduleName = '🔐 角色权限';
    } else if (code.startsWith('user_')) {
      moduleName = '👤 用户管理';
    }
    // 系统管理
    else if (code.startsWith('notification_')) {
      moduleName = '🔔 通知管理';
    } else if (code.startsWith('audit_')) {
      moduleName = '📋 操作日志';
    } else if (code.startsWith('system_') || code.startsWith('esign_') || code.startsWith('reminder_')) {
      moduleName = '⚙️ 系统配置';
    }
    // 工具箱
    else if (code.startsWith('ai_')) {
      moduleName = '🤖 AI助手';
    } else if (code.startsWith('recruitment_')) {
      moduleName = '📈 招聘数据查询';
    } else if (code.startsWith('identity_')) {
      moduleName = '✅ 实名认证';
    }
    // 数据统计
    else if (code.startsWith('dashboard_')) {
      moduleName = '📊 数据看板';
    } else if (code.startsWith('statistics_') || code.startsWith('report_')) {
      moduleName = '📈 数据统计';
    }
    // 其他
    else if (code.startsWith('subordinate_')) {
      moduleName = '👨‍👩‍👧‍👦 下属管理';
    }
    
    if (!acc[moduleName]) {
      acc[moduleName] = [];
    }
    acc[moduleName].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // 定义模块显示顺序
  const moduleOrder = [
    '📊 数据看板',
    '📊 公司管理',
    '👥 员工管理',
    '📄 文书模板',
    '✍️ 文书签署',
    '💰 薪资管理',
    '📅 考勤管理',
    '👤 用户管理',
    '🔐 角色权限',
    '🔔 通知管理',
    '📋 操作日志',
    '⚙️ 系统配置',
    '🤖 AI助手',
    '📈 招聘数据查询',
    '✅ 实名认证',
    '📈 数据统计',
    '👨‍👩‍👧‍👦 下属管理',
    '其他'
  ];

  // 按定义的顺序排序模块
  const sortedModules = Object.keys(groupedPermissions).sort((a, b) => {
    const indexA = moduleOrder.indexOf(a);
    const indexB = moduleOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const isFormEditable = isCreating || isEditing;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">角色权限管理</h1>
            <p className="text-muted-foreground mt-2">管理系统角色和权限配置</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <HelpCircle className="mr-2 h-4 w-4" />
                权限说明
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>权限详细说明</DialogTitle>
                <DialogDescription>
                  系统共有53个权限，分为15个功能模块
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* 基础管理 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">📊 基础管理</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">公司管理（6个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 公司查看：查看公司列表和详情</li>
                        <li>• 公司录入：管理公司信息</li>
                        <li>• 公司创建：创建新公司</li>
                        <li>• 公司编辑：编辑公司信息</li>
                        <li>• 公司删除：删除公司</li>
                        <li>• 公司服务状态管理：管理公司服务状态</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">员工管理（7个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 员工查看：查看员工列表和详情</li>
                        <li>• 员工录入：管理员工信息</li>
                        <li>• 员工创建：创建新员工</li>
                        <li>• 员工编辑：编辑员工信息</li>
                        <li>• 员工删除：删除员工</li>
                        <li>• 员工状态管理：修改员工状态（在职、离职等）</li>
                        <li>• 员工批量导入：批量导入员工数据</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 文书管理 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">📄 文书管理</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">文书模板（5个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 文书模板查看：查看文书模板列表</li>
                        <li>• 文书模板增加：管理文书模板</li>
                        <li>• 文书模板创建：创建新文书模板</li>
                        <li>• 文书模板编辑：编辑文书模板</li>
                        <li>• 文书模板删除：删除文书模板</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">文书签署（5个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 文书查看：查看文书签署记录</li>
                        <li>• 文书发起：发起文书签署</li>
                        <li>• 文书管理：管理文书记录</li>
                        <li>• 签署状态查看：查看签署状态统计</li>
                        <li>• 档案下载：下载已签署文件</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 系统管理 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">⚙️ 系统管理</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">角色权限（6个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 角色查看：查看角色列表</li>
                        <li>• 角色创建：创建新角色</li>
                        <li>• 角色编辑：编辑角色信息</li>
                        <li>• 角色删除：删除角色</li>
                        <li>• 角色权限配置：配置角色的权限</li>
                        <li>• 角色分配：分配用户角色</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">用户管理（5个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 用户查看：查看用户列表</li>
                        <li>• 用户管理：管理系统用户</li>
                        <li>• 用户创建：创建新用户</li>
                        <li>• 用户编辑：编辑用户信息</li>
                        <li>• 用户删除：删除用户</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">通知中心（3个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 通知查看：查看通知中心</li>
                        <li>• 通知发送：发送站内通知</li>
                        <li>• 通知管理：管理通知（标记已读、删除）</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">操作日志（2个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 操作日志查看：查看系统操作日志</li>
                        <li>• 操作日志导出：导出操作日志数据</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">系统配置（5个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 系统配置查看：查看系统配置</li>
                        <li>• 系统配置：系统配置管理</li>
                        <li>• 系统配置编辑：编辑系统配置</li>
                        <li>• 电子签配置：配置第三方电子签接口</li>
                        <li>• 提醒配置：配置合同到期提醒规则</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 工具箱 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔧 工具箱</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">AI助手（1个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• AI助手使用：使用AI助手功能</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">招聘数据查询（2个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 招聘数据查看：查看招聘数据查询结果</li>
                        <li>• 招聘数据导出：导出招聘数据</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">实名认证（2个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 实名认证查看：查看实名认证记录</li>
                        <li>• 实名认证管理：管理实名认证</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 数据统计 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">📈 数据统计</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">看板（1个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 看板：查看数据看板</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">数据统计（2个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 数据统计查看：查看各类数据统计</li>
                        <li>• 报表导出：导出各类报表数据</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 其他 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">👨‍👩‍👧‍👦 其他</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">下属管理（1个权限）</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 下属管理：管理下属员工</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 权限说明 */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">预设角色说明：</p>
              <ul className="text-sm space-y-1 ml-4">
                <li><strong>人事经理</strong>：拥有除系统配置外的所有权限，负责人事战略规划和全面管理</li>
                <li><strong>人事主管</strong>：拥有员工管理、文书管理、下属管理等核心业务权限</li>
                <li><strong>人事专员</strong>：拥有基础的员工和文书查看、操作权限，负责日常人事工作</li>
                <li><strong>系统管理员</strong>：拥有所有系统配置和管理权限，负责系统维护</li>
                <li><strong>财务专员</strong>：拥有查看权限和报表导出，负责财务相关数据查询</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                💡 提示：您可以基于预设角色进行修改，或创建新的自定义角色。每个模块支持独立全选/取消全选操作。
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-12 gap-6">
          {/* 左侧：角色列表 */}
          <div className="col-span-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>角色列表</CardTitle>
                  {hasRoleCreatePermission && (
                    <Button size="sm" onClick={handleCreateNew}>
                      <Plus className="mr-2 h-4 w-4" />
                      添加角色
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-280px)]">
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : roles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无角色
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <Card
                          key={role.id}
                          className={`cursor-pointer transition-colors hover:bg-accent ${
                            selectedRole?.id === role.id ? 'border-primary bg-accent' : ''
                          }`}
                          onClick={() => handleSelectRole(role)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-primary" />
                                  <h3 className="font-semibold">{role.name}</h3>
                                </div>
                                {role.description && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {role.description}
                                  </p>
                                )}
                              </div>
                              {hasRoleDeletePermission && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(role);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：角色详情和权限配置 */}
          <div className="col-span-8">
            {!selectedRole && !isCreating ? (
              <Card>
                <CardContent className="flex items-center justify-center h-[calc(100vh-280px)]">
                  <div className="text-center text-muted-foreground">
                    <Shield className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">请选择一个角色或创建新角色</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {isCreating ? '创建新角色' : isEditing ? '编辑角色' : '角色详情'}
                    </CardTitle>
                    <div className="flex gap-2">
                      {isFormEditable ? (
                        <>
                          <Button variant="outline" size="sm" onClick={handleCancel}>
                            <X className="mr-2 h-4 w-4" />
                            取消
                          </Button>
                          <Button size="sm" onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" />
                            保存
                          </Button>
                        </>
                      ) : (
                        hasRoleEditPermission && selectedRole && (
                          <Button size="sm" onClick={handleEdit}>
                            编辑
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="space-y-6">
                      {/* 基本信息 */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">角色名称 *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="请输入角色名称"
                            disabled={!isFormEditable}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">角色描述</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="请输入角色描述"
                            disabled={!isFormEditable}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* 权限配置 */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label className="text-base font-semibold">功能权限</Label>
                            <Badge variant="outline" className="text-xs">
                              已选 {formData.permissions.length} / {permissions.length}
                            </Badge>
                          </div>
                          {isFormEditable && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={toggleAllPermissions}
                            >
                              {formData.permissions.length === permissions.length ? '取消全选' : '全选'}
                            </Button>
                          )}
                        </div>

                        {loading ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <Skeleton key={i} className="h-32 w-full" />
                            ))}
                          </div>
                        ) : permissions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            暂无可用权限
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {sortedModules.map((moduleName) => {
                              const modulePermissions = groupedPermissions[moduleName];
                              const modulePermissionIds = (modulePermissions as Permission[]).map(p => p.id);
                              const selectedCount = modulePermissionIds.filter(id => formData.permissions.includes(id)).length;
                              const allSelected = selectedCount === modulePermissionIds.length;
                              
                              return (
                                <Card key={moduleName} className="border-2">
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <CardTitle className="text-base">{moduleName}</CardTitle>
                                        <Badge variant="secondary" className="text-xs">
                                          {selectedCount}/{modulePermissionIds.length}
                                        </Badge>
                                      </div>
                                      {isFormEditable && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleModulePermissions(modulePermissions as Permission[])}
                                          className="h-7 text-xs"
                                        >
                                          {allSelected ? '取消全选' : '全选'}
                                        </Button>
                                      )}
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                      {(modulePermissions as Permission[]).map((permission) => (
                                        <div key={permission.id} className="flex items-start space-x-3">
                                          <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={formData.permissions.includes(permission.id)}
                                            onCheckedChange={() => togglePermission(permission.id)}
                                            disabled={!isFormEditable}
                                          />
                                          <div className="grid gap-1.5 leading-none flex-1">
                                            <label
                                              htmlFor={`permission-${permission.id}`}
                                              className={`text-sm font-medium leading-none ${
                                                isFormEditable ? 'cursor-pointer' : 'cursor-default'
                                              }`}
                                            >
                                              {permission.name}
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                              {permission.description}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        )}

                        {/* 已选权限统计 */}
                        {!loading && permissions.length > 0 && (
                          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <span className="text-sm text-muted-foreground">
                              已选择权限
                            </span>
                            <Badge variant="secondary">
                              {formData.permissions.length} / {permissions.length}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
