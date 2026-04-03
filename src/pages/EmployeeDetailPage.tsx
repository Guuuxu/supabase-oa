import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  getEmployeeById,
  getSigningRecordsByEmployee,
  getCurrentUserPermissions,
  createNotification
} from '@/db/api';
import type { Employee, SigningRecord } from '@/types/types';
import { 
  User, 
  FileSignature, 
  ArrowLeft,
  Edit,
  Bell,
  Plus,
  Building2,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  IdCard,
  MapPin
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EMPLOYEE_STATUS_LABELS, SIGNING_STATUS_LABELS } from '@/types/types';
import { toast } from 'sonner';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [signingRecords, setSigningRecords] = useState<SigningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderContent, setReminderContent] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [employeeData, signingData, perms] = await Promise.all([
        getEmployeeById(id),
        getSigningRecordsByEmployee(id),
        getCurrentUserPermissions()
      ]);

      setEmployee(employeeData);
      setSigningRecords(signingData);
      setPermissions(perms);
    } catch (error) {
      console.error('加载员工详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const handleSendReminder = async () => {
    if (!employee || !reminderContent.trim()) {
      toast.error('请输入提醒内容');
      return;
    }

    setSendingReminder(true);
    try {
      await createNotification({
        user_id: employee.id,
        type: 'system',
        title: '系统提醒',
        content: reminderContent,
        related_id: employee.id
      });

      toast.success('提醒发送成功');
      setReminderOpen(false);
      setReminderContent('');
    } catch (error) {
      console.error('发送提醒失败:', error);
      toast.error('发送提醒失败');
    } finally {
      setSendingReminder(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full bg-muted" />
          <Skeleton className="h-48 w-full bg-muted" />
          <Skeleton className="h-96 w-full bg-muted" />
        </div>
      </MainLayout>
    );
  }

  if (!employee) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">员工不存在</h2>
          <p className="text-muted-foreground mb-6">未找到该员工信息</p>
          <Button onClick={() => navigate('/employees')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回员工列表
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/employees" className="hover:text-foreground">
            员工管理
          </Link>
          <span>/</span>
          <span className="text-foreground">{employee.name}</span>
        </div>

        {/* 员工基本信息 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{employee.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                      {EMPLOYEE_STATUS_LABELS[employee.status]}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {hasPermission('employee_edit') && (
                  <Button variant="outline" onClick={() => navigate('/employees')}>
                    <Edit className="mr-2 h-4 w-4" />
                    编辑
                  </Button>
                )}
                <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Bell className="mr-2 h-4 w-4" />
                      发送提醒
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>发送提醒给 {employee.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>提醒内容</Label>
                        <Textarea
                          placeholder="请输入提醒内容..."
                          value={reminderContent}
                          onChange={(e) => setReminderContent(e.target.value)}
                          rows={5}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setReminderOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handleSendReminder} disabled={sendingReminder}>
                          {sendingReminder ? '发送中...' : '发送'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                {hasPermission('document_initiate') && (
                  <Button onClick={() => navigate('/signings')}>
                    <Plus className="mr-2 h-4 w-4" />
                    发起签署
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <IdCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">身份证号</p>
                  <p className="font-medium font-mono">{employee.id_card}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">手机号</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">邮箱</p>
                  <p className="font-medium">{employee.email || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">所属公司</p>
                  <p className="font-medium">{employee.company_name || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">部门</p>
                  <p className="font-medium">{employee.department || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">岗位</p>
                  <p className="font-medium">{employee.position || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">入职日期</p>
                  <p className="font-medium">
                    {employee.hire_date
                      ? format(new Date(employee.hire_date), 'yyyy-MM-dd', { locale: zhCN })
                      : '-'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">合同起始日期</p>
                  <p className="font-medium">
                    {employee.contract_start_date
                      ? format(new Date(employee.contract_start_date), 'yyyy-MM-dd', { locale: zhCN })
                      : '-'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">合同结束日期</p>
                  <p className="font-medium">
                    {employee.contract_end_date
                      ? format(new Date(employee.contract_end_date), 'yyyy-MM-dd', { locale: zhCN })
                      : '-'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">地址</p>
                  <p className="font-medium">{employee.address || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 签署记录 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileSignature className="h-5 w-5" />
                签署记录 ({signingRecords.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {signingRecords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                暂无签署记录
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>公司名称</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>员工签署时间</TableHead>
                      <TableHead>公司签署时间</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signingRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.company_name || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === 'completed'
                                ? 'default'
                                : record.status === 'pending'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {SIGNING_STATUS_LABELS[record.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.employee_signed_at
                            ? format(new Date(record.employee_signed_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {record.company_signed_at
                            ? format(new Date(record.company_signed_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(record.created_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {record.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
