import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  updateProfile,
  createUser,
  getVisibleProfiles,
  getRoles,
  deleteUser,
  toggleUserStatus,
  updateUserPassword,
  getProfile,
} from '@/db/api';
import { supabase } from '@/db/supabase';
import { USER_ROLE_LABELS } from '@/types/types';
import type { Profile, UserRole, Role } from '@/types/types';
import { toast } from 'sonner';
import { Plus, Trash2, Ban, CheckCircle, Edit, Key } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


export default function UsersPage() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'employee' as UserRole,
    role_id: '',
    manager_id: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState<Profile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    void loadData();
  }, [profile?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);

      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        setUsers([]);
        return;
      }

      const p = await getProfile(user.id);
      if (!p) {
        console.error('[UsersPage] getProfile 为空，多为 profiles RLS 拒绝或会话已变为无 user_view 的账号');
        setUsers([]);
        toast.error('读不到当前账号的资料，无法加载用户列表。请退出后使用管理员账号重新登录，或确认已部署 admin-create-user 且未在创建用户时被切换会话。');
        return;
      }

      const usersData = await getVisibleProfiles(p.id as string, p.role as UserRole);
      setUsers(usersData);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: Profile) => {
    setSelectedUser(user);
    setIsCreating(false);
    setFormData({
      username: user.username as string,
      password: '',
      full_name: (user.full_name || '') as string,
      phone: (user.phone || '') as string,
      role: user.role as UserRole,
      role_id: (user.role_id || '') as string,
      manager_id: (user.manager_id || '') as string
    });
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsCreating(true);
    setFormData({
      username: '',
      password: '',
      full_name: '',
      phone: '',
      role: 'employee',
      role_id: '',
      manager_id: ''
    });
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setIsCreating(false);
    setFormData({
      username: '',
      password: '',
      full_name: '',
      phone: '',
      role: 'employee',
      role_id: '',
      manager_id: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUser && !isCreating) {
      // 编辑用户
      const submitData = {
        full_name: formData.full_name || null,
        phone: formData.phone || null,
        role: formData.role,
        role_id: formData.role_id || null,
        manager_id: formData.manager_id === 'none' ? null : (formData.manager_id || null)
      };

      const success = await updateProfile(selectedUser.id as string, submitData);
      if (success) {
        toast.success('更新成功');
        handleCancel();
        loadData();
      } else {
        toast.error('更新失败');
      }
    } else {
      // 创建新用户
      if (!formData.username || !formData.password) {
        toast.error('请填写用户名和密码');
        return;
      }

      if (formData.password.length < 6) {
        toast.error('密码长度至少6位');
        return;
      }

      const {
        data: { user: sessionBefore },
      } = await supabase.auth.getUser();

      const result = await createUser({
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name || undefined,
        phone: formData.phone || undefined,
        role: formData.role,
        role_id: formData.role_id || undefined,
        manager_id: formData.manager_id === 'none' ? undefined : (formData.manager_id || undefined)
      });

      if (result.success) {
        const {
          data: { user: sessionAfter },
        } = await supabase.auth.getUser();
        if (
          sessionBefore?.id &&
          sessionAfter?.id &&
          sessionBefore.id !== sessionAfter.id
        ) {
          toast.error('登录身份已变为新创建的用户，列表会因权限为空。请退出后重新使用原管理员账号登录。');
          await supabase.auth.signOut();
          navigate('/login', { replace: true });
          return;
        }

        toast.success('创建用户成功');
        handleCancel();
        await refreshProfile();
        await loadData();
      } else {
        toast.error(result.error || '创建用户失败');
      }
    }
  };

  const handleDeleteClick = (user: Profile) => {
    // 不能删除自己
    if (user.id === profile?.id) {
      toast.error('不能删除自己');
      return;
    }
    // 不能删除超级管理员
    if (user.role === 'super_admin') {
      toast.error('不能删除超级管理员');
      return;
    }
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    const result = await deleteUser(userToDelete.id as string);
    if (result.success) {
      toast.success('删除用户成功');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      loadData();
    } else {
      toast.error(result.error || '删除用户失败');
    }
  };

  const handleToggleStatus = async (user: Profile) => {
    // 不能暂停自己
    if (user.id === profile?.id) {
      toast.error('不能暂停自己');
      return;
    }
    // 不能暂停超级管理员
    if (user.role === 'super_admin') {
      toast.error('不能暂停超级管理员');
      return;
    }

    const newStatus = !user.is_active;
    const result = await toggleUserStatus(user.id as string, newStatus);
    if (result.success) {
      toast.success(newStatus ? '启用用户成功' : '暂停用户成功');
      loadData();
    } else {
      toast.error(result.error || '操作失败');
    }
  };

  const handleChangePasswordClick = (user: Profile) => {
    setUserToChangePassword(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordDialogOpen(true);
  };

  const handleChangePasswordConfirm = async () => {
    if (!userToChangePassword) return;

    // 验证密码
    if (!newPassword) {
      toast.error('请输入新密码');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('密码长度至少6位');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    const result = await updateUserPassword(userToChangePassword.id as string, newPassword);
    if (result.success) {
      toast.success('修改密码成功');
      setPasswordDialogOpen(false);
      setUserToChangePassword(null);
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.error || '修改密码失败');
    }
  };


  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'manager':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">用户管理</h1>
            <p className="text-muted-foreground mt-2">管理系统用户信息和角色</p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            添加用户
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：用户列表 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>用户列表</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-muted" />
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无用户数据
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[140px] whitespace-nowrap">用户名</TableHead>
                        <TableHead className="w-[100px] whitespace-nowrap">姓名</TableHead>
                        <TableHead className="w-[130px] whitespace-nowrap">手机号</TableHead>
                        <TableHead className="w-[120px] whitespace-nowrap">角色</TableHead>
                        <TableHead className="w-[120px] whitespace-nowrap">直属上级</TableHead>
                        <TableHead className="w-[100px] whitespace-nowrap">状态</TableHead>
                        <TableHead className="w-[120px] whitespace-nowrap">注册时间</TableHead>
                        <TableHead className="w-[180px] text-right whitespace-nowrap">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => {
                        const manager = users.find(u => u.id === user.manager_id);
                        const userRole = user.role_id ? roles.find(r => r.id === user.role_id) : null;
                        const isSelected = selectedUser?.id === user.id;
                        return (
                          <TableRow 
                            key={user.id as string}
                            className={`${isSelected ? 'bg-muted' : ''}`}
                          >
                            <TableCell 
                              className="font-medium cursor-pointer hover:text-primary hover:underline whitespace-nowrap"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/?userId=${user.id}`);
                              }}
                              title="点击查看该用户的数据看板"
                            >
                              {user.username as string}
                            </TableCell>
                            <TableCell onClick={() => handleSelectUser(user)} className="cursor-pointer whitespace-nowrap">
                              {(user.full_name || '-') as string}
                            </TableCell>
                            <TableCell onClick={() => handleSelectUser(user)} className="cursor-pointer whitespace-nowrap">
                              {(user.phone || '-') as string}
                            </TableCell>
                            <TableCell onClick={() => handleSelectUser(user)} className="cursor-pointer whitespace-nowrap">
                              <Badge variant={getRoleBadgeVariant(user.role as UserRole)}>
                                {userRole ? userRole.name : USER_ROLE_LABELS[user.role as UserRole]}
                              </Badge>
                            </TableCell>
                            <TableCell onClick={() => handleSelectUser(user)} className="cursor-pointer whitespace-nowrap">
                              {manager ? ((manager.full_name || manager.username) as string) : '-'}
                            </TableCell>
                            <TableCell onClick={() => handleSelectUser(user)} className="cursor-pointer whitespace-nowrap">
                              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                {user.is_active ? '正常' : '已暂停'}
                              </Badge>
                            </TableCell>
                            <TableCell onClick={() => handleSelectUser(user)} className="cursor-pointer whitespace-nowrap">
                              {new Date(user.created_at as string).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectUser(user);
                                  }}
                                  title="编辑用户"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  编辑
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangePasswordClick(user);
                                  }}
                                  title="修改密码"
                                >
                                  <Key className="h-4 w-4 mr-1" />
                                  改密
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStatus(user);
                                  }}
                                  disabled={user.id === profile?.id || user.role === 'super_admin'}
                                  title={user.is_active ? '暂停用户' : '启用用户'}
                                >
                                  {user.is_active ? (
                                    <>
                                      <Ban className="h-4 w-4 mr-1" />
                                      暂停
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      启用
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(user);
                                  }}
                                  disabled={user.id === profile?.id || user.role === 'super_admin'}
                                  title="删除用户"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  删除
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 右侧：用户详情表单 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>
                {isCreating ? '添加用户' : selectedUser ? '编辑用户' : '用户详情'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isCreating && !selectedUser ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>请选择一个用户进行编辑</p>
                  <p className="text-sm mt-2">或点击"添加用户"创建新用户</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名 *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="请输入用户名"
                      disabled={!!selectedUser && !isCreating}
                    />
                  </div>
                  {isCreating && (
                    <div className="space-y-2">
                      <Label htmlFor="password">密码 *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="请输入密码（至少6位）"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">姓名</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="请输入姓名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">手机号</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="请输入手机号"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role_id">角色 *</Label>
                    <Select
                      value={formData.role_id}
                      onValueChange={(value) => setFormData({ ...formData, role_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager_id">直属上级</Label>
                    <Select
                      value={formData.manager_id}
                      onValueChange={(value) => setFormData({ ...formData, manager_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择上级（可选）" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无</SelectItem>
                        {users
                          .filter(u => u.id !== selectedUser?.id)
                          .map((user) => (
                            <SelectItem key={user.id as string} value={user.id as string}>
                              {(user.full_name || user.username) as string} ({USER_ROLE_LABELS[user.role as UserRole]})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                      取消
                    </Button>
                    <Button type="submit" className="flex-1">
                      {isCreating ? '创建' : '保存'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除用户</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除用户 <span className="font-semibold">{userToDelete?.username as string}</span> 吗？
              此操作不可撤销，将永久删除该用户的所有数据。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 修改密码对话框 */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改用户密码</DialogTitle>
            <DialogDescription>
              为用户 <span className="font-semibold">{userToChangePassword?.username as string}</span> 设置新密码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">新密码 *</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码（至少6位）"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">确认密码 *</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入新密码"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleChangePasswordConfirm}>
              确认修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
