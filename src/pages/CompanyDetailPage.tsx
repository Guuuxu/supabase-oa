import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  getCompanyById,
  getEmployeesByCompany,
  getTemplatesByCompany,
  getSigningRecordsByCompany,
  getCurrentUserPermissions
} from '@/db/api';
import type { Company, Employee, DocumentTemplate, SigningRecord } from '@/types/types';
import { 
  Building2, 
  Users, 
  FileText, 
  FileSignature, 
  ArrowLeft,
  Edit,
  Share2,
  Calendar,
  MapPin,
  Phone,
  User
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

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [signingRecords, setSigningRecords] = useState<SigningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [companyData, employeesData, templatesData, signingData, perms] = await Promise.all([
        getCompanyById(id),
        getEmployeesByCompany(id),
        getTemplatesByCompany(id),
        getSigningRecordsByCompany(id),
        getCurrentUserPermissions()
      ]);

      setCompany(companyData);
      setEmployees(employeesData);
      setTemplates(templatesData);
      setSigningRecords(signingData);
      setPermissions(perms);
    } catch (error) {
      console.error('加载公司详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
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

  if (!company) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">公司不存在</h2>
          <p className="text-muted-foreground mb-6">未找到该公司信息</p>
          <Button onClick={() => navigate('/companies')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回公司列表
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
          <Link to="/companies" className="hover:text-foreground">
            公司管理
          </Link>
          <span>/</span>
          <span className="text-foreground">{company.name}</span>
        </div>

        {/* 公司基本信息 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{company.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">公司编码: {company.code}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {hasPermission('company_edit') && (
                  <Button variant="outline" onClick={() => navigate('/companies')}>
                    <Edit className="mr-2 h-4 w-4" />
                    编辑
                  </Button>
                )}
                {hasPermission('company_transfer') && (
                  <Button variant="outline" onClick={() => navigate('/companies')}>
                    <Share2 className="mr-2 h-4 w-4" />
                    流转
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">联系人</p>
                  <p className="font-medium">{company.contact_person || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">联系电话</p>
                  <p className="font-medium">{company.contact_phone || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">地址</p>
                  <p className="font-medium">{company.address || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">服务期限</p>
                  <p className="font-medium">
                    {company.service_start_date && company.service_end_date
                      ? `${format(new Date(company.service_start_date), 'yyyy-MM-dd')} 至 ${format(new Date(company.service_end_date), 'yyyy-MM-dd')}`
                      : '-'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">发薪日</p>
                  <p className="font-medium">
                    {company.payday_date ? `每月${company.payday_date}号` : '-'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">服务状态</p>
                  <Badge variant={company.service_status ? 'default' : 'secondary'}>
                    {company.service_status ? '服务中' : '已停止'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                在职员工
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {employees.filter(e => e.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">人</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                文书模板
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground mt-1">个</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileSignature className="h-4 w-4 text-green-600" />
                签署记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{signingRecords.length}</div>
              <p className="text-xs text-muted-foreground mt-1">条</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab内容 */}
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">
              <Users className="mr-2 h-4 w-4" />
              员工列表 ({employees.length})
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="mr-2 h-4 w-4" />
              文书模板 ({templates.length})
            </TabsTrigger>
            <TabsTrigger value="signings">
              <FileSignature className="mr-2 h-4 w-4" />
              签署记录 ({signingRecords.length})
            </TabsTrigger>
          </TabsList>

          {/* 员工列表 */}
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>员工列表</CardTitle>
                  {hasPermission('employee_create') && (
                    <Button onClick={() => navigate('/employees')}>
                      添加员工
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {employees.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无员工数据
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>姓名</TableHead>
                          <TableHead>身份证号</TableHead>
                          <TableHead>手机号</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>入职日期</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell 
                              className="font-medium text-primary hover:underline cursor-pointer"
                              onClick={() => navigate(`/employees/${employee.id}`)}
                            >
                              {employee.name}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {employee.id_card}
                            </TableCell>
                            <TableCell>{employee.phone}</TableCell>
                            <TableCell>
                              <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                {EMPLOYEE_STATUS_LABELS[employee.status]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {employee.hire_date
                                ? format(new Date(employee.hire_date), 'yyyy-MM-dd', { locale: zhCN })
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 文书模板 */}
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>文书模板</CardTitle>
                  {hasPermission('template_create') && (
                    <Button onClick={() => navigate('/templates')}>
                      添加模板
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {templates.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无文书模板
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>模板名称</TableHead>
                          <TableHead>分类</TableHead>
                          <TableHead>创建时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templates.map((template) => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">{template.name}</TableCell>
                            <TableCell>{template.category}</TableCell>
                            <TableCell>
                              {format(new Date(template.created_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 签署记录 */}
          <TabsContent value="signings">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>签署记录</CardTitle>
                  {hasPermission('document_initiate') && (
                    <Button onClick={() => navigate('/signings')}>
                      发起签署
                    </Button>
                  )}
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
                          <TableHead>员工姓名</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>员工签署时间</TableHead>
                          <TableHead>公司签署时间</TableHead>
                          <TableHead>创建时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {signingRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              {record.employee_name || '-'}
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
