import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getSigningRecord } from '@/db/api';
import { SIGNING_STATUS_LABELS, DOCUMENT_CATEGORY_LABELS } from '@/types/types';
import type { SigningRecord } from '@/types/types';
import { ArrowLeft, FileText, User, Building2, Calendar, CheckCircle, Clock, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function SigningRecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<SigningRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await getSigningRecord(id);
      if (data) {
        setRecord(data);
      } else {
        toast.error('签署记录不存在');
        navigate('/signing-status');
      }
    } catch (error) {
      console.error('加载签署记录失败:', error);
      toast.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取状态徽章样式
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'employee_signed':
      case 'company_signed':
        return 'outline';
      case 'rejected':
      case 'withdrawn':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48 bg-muted" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-muted" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!record) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">签署记录不存在</p>
          <Button onClick={() => navigate('/signing-status')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/signing-status')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-3xl font-bold">签署记录详情</h1>
              <p className="text-muted-foreground mt-1">
                查看签署记录的详细信息
              </p>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(record.status)} className="text-base px-4 py-2">
            {SIGNING_STATUS_LABELS[record.status]}
          </Badge>
        </div>

        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>公司名称</span>
                </div>
                <p className="font-medium">{record.company?.name || '-'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>员工姓名</span>
                </div>
                <p className="font-medium">{record.employee?.name || '-'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>文书类型</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {record.template_names && record.template_names.length > 0 ? (
                    record.template_names.map((name: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>创建时间</span>
                </div>
                <p className="font-medium">
                  {record.created_at ? new Date(record.created_at).toLocaleString('zh-CN') : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 签署信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              签署信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 员工签署信息 */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  员工签署
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">签署状态</p>
                    <Badge variant={record.employee_signed_at ? 'default' : 'secondary'}>
                      {record.employee_signed_at ? '已签署' : '待签署'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">签署时间</p>
                    <p className="font-medium">
                      {record.employee_signed_at 
                        ? new Date(record.employee_signed_at).toLocaleString('zh-CN')
                        : '-'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 公司签署信息 */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  公司签署
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">签署状态</p>
                    <Badge variant={record.company_signed_at ? 'default' : 'secondary'}>
                      {record.company_signed_at ? '已签署' : '待签署'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">签署时间</p>
                    <p className="font-medium">
                      {record.company_signed_at 
                        ? new Date(record.company_signed_at).toLocaleString('zh-CN')
                        : '-'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 员工信息 */}
        {record.employee_form_data && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                员工信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {record.employee_form_data.name && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">姓名</p>
                    <p className="font-medium">{record.employee_form_data.name}</p>
                  </div>
                )}
                {record.employee_form_data.id_card && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">身份证号</p>
                    <p className="font-medium">{record.employee_form_data.id_card}</p>
                  </div>
                )}
                {record.employee_form_data.phone && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">联系电话</p>
                    <p className="font-medium">{record.employee_form_data.phone}</p>
                  </div>
                )}
                {record.employee_form_data.email && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">电子邮箱</p>
                    <p className="font-medium">{record.employee_form_data.email}</p>
                  </div>
                )}
                {record.employee_form_data.department && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">部门</p>
                    <p className="font-medium">{record.employee_form_data.department}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 文件信息 */}
        {record.signed_file_url && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                签署文件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">已签署文件</p>
                    <p className="text-sm text-muted-foreground">
                      {record.company_signed_at 
                        ? `签署于 ${new Date(record.company_signed_at).toLocaleString('zh-CN')}`
                        : '已完成签署'
                      }
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(record.signed_file_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 备注信息 */}
        {record.notes && (
          <Card>
            <CardHeader>
              <CardTitle>备注</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{record.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
