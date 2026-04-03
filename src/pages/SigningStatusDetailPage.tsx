import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSigningRecords, getCompanies, getDocumentTemplates } from '@/db/api';
import { SIGNING_STATUS_LABELS, DOCUMENT_CATEGORY_LABELS } from '@/types/types';
import type { SigningRecord, Company, DocumentTemplate } from '@/types/types';
import { ArrowLeft, FileSignature, CheckCircle, XCircle, Clock, TrendingUp, Building2, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SigningStatusDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [signingRecords, setSigningRecords] = useState<SigningRecord[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const statusParam = searchParams.get('status') || 'all';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [recordsData, companiesData, templatesData] = await Promise.all([
      getSigningRecords(),
      getCompanies(),
      getDocumentTemplates()
    ]);
    setSigningRecords(recordsData);
    setCompanies(companiesData);
    setTemplates(templatesData);
    setLoading(false);
  };

  // 筛选签署记录
  const filteredRecords = statusParam === 'all' 
    ? signingRecords 
    : signingRecords.filter(r => r.status === statusParam);

  // 统计数据
  const totalRecords = filteredRecords.length;
  const pendingCount = filteredRecords.filter(r => r.status === 'pending').length;
  const completedCount = filteredRecords.filter(r => r.status === 'completed').length;
  const rejectedCount = filteredRecords.filter(r => r.status === 'rejected').length;
  const completionRate = totalRecords > 0 ? ((completedCount / totalRecords) * 100).toFixed(1) : '0';

  // 按文书模板统计
  const templateStats = filteredRecords.reduce((acc, record) => {
    // 获取模板ID数组
    const templateIds = record.template_ids || [];
    templateIds.forEach((templateId: string) => {
      const template = templates.find(t => t.id === templateId);
      const templateName = template?.name || '未知模板';
      
      if (!acc[templateName]) {
        acc[templateName] = { total: 0, completed: 0, pending: 0, rejected: 0 };
      }
      acc[templateName].total++;
      if (record.status === 'completed') acc[templateName].completed++;
      if (record.status === 'pending') acc[templateName].pending++;
      if (record.status === 'rejected') acc[templateName].rejected++;
    });
    return acc;
  }, {} as Record<string, { total: number; completed: number; pending: number; rejected: number }>);

  // 按公司统计
  const companyStats = filteredRecords.reduce((acc, record) => {
    const company = companies.find(c => c.id === record.company_id);
    const companyName = company?.name || '未知公司';
    
    if (!acc[companyName]) {
      acc[companyName] = { total: 0, completed: 0, pending: 0, rejected: 0 };
    }
    acc[companyName].total++;
    if (record.status === 'completed') acc[companyName].completed++;
    if (record.status === 'pending') acc[companyName].pending++;
    if (record.status === 'rejected') acc[companyName].rejected++;
    return acc;
  }, {} as Record<string, { total: number; completed: number; pending: number; rejected: number }>);

  // 获取状态标题和图标
  const getStatusInfo = () => {
    switch (statusParam) {
      case 'pending':
        return { title: '待签署', icon: Clock, color: 'text-yellow-500' };
      case 'completed':
        return { title: '已完成', icon: CheckCircle, color: 'text-green-500' };
      case 'rejected':
        return { title: '已拒绝', icon: XCircle, color: 'text-red-500' };
      default:
        return { title: '全部签署记录', icon: FileSignature, color: 'text-primary' };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 顶部导航 */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/signing-status')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
            <div>
              <h1 className="text-3xl font-bold">{statusInfo.title}</h1>
              <p className="text-muted-foreground mt-1">详细数据统计和分析</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        ) : (
          <>
            {/* 签署完成率卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  签署完成率
                </CardTitle>
                <CardDescription>当前签署完成情况统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">完成率</span>
                      <span className="text-2xl font-bold text-primary">{completionRate}%</span>
                    </div>
                    <Progress value={parseFloat(completionRate)} className="h-3" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">待签署</div>
                      <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">已完成</div>
                      <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">已拒绝</div>
                      <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 统计卡片 */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* 按文书类型统计 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    按文书类型统计
                  </CardTitle>
                  <CardDescription>各类文书的签署情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(templateStats).length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        暂无数据
                      </div>
                    ) : (
                      Object.entries(templateStats).map(([templateName, stats]) => {
                        const statData = stats as { total: number; completed: number; pending: number; rejected: number };
                        const rate = statData.total > 0 ? ((statData.completed / statData.total) * 100).toFixed(0) : '0';
                        return (
                          <div key={templateName} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{templateName}</span>
                              <span className="text-sm text-muted-foreground">{statData.completed}/{statData.total}</span>
                            </div>
                            <Progress value={parseFloat(rate)} className="h-2" />
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>待签署: {statData.pending}</span>
                              <span>已完成: {statData.completed}</span>
                              <span>已拒绝: {statData.rejected}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 按公司统计 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    按公司统计
                  </CardTitle>
                  <CardDescription>各公司的签署情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(companyStats).length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        暂无数据
                      </div>
                    ) : (
                      Object.entries(companyStats).map(([companyName, stats]) => {
                        const statData = stats as { total: number; completed: number; pending: number; rejected: number };
                        const rate = statData.total > 0 ? ((statData.completed / statData.total) * 100).toFixed(0) : '0';
                        return (
                          <div key={companyName} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{companyName}</span>
                              <span className="text-sm text-muted-foreground">{statData.completed}/{statData.total}</span>
                            </div>
                            <Progress value={parseFloat(rate)} className="h-2" />
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>待签署: {statData.pending}</span>
                              <span>已完成: {statData.completed}</span>
                              <span>已拒绝: {statData.rejected}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 签署记录列表 */}
            <Card>
              <CardHeader>
                <CardTitle>签署记录列表</CardTitle>
                <CardDescription>共 {totalRecords} 条记录</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRecords.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    暂无签署记录
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>公司</TableHead>
                        <TableHead>员工</TableHead>
                        <TableHead>文书模板</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>创建时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => {
                        const company = companies.find(c => c.id === record.company_id);
                        const templateNames = (record.template_ids || [])
                          .map((id: string) => templates.find(t => t.id === id)?.name || '未知')
                          .join(', ');
                        
                        return (
                          <TableRow key={record.id}>
                            <TableCell>{company?.name || '未知公司'}</TableCell>
                            <TableCell>{record.employee?.name || '未知员工'}</TableCell>
                            <TableCell className="max-w-xs truncate">{templateNames}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  record.status === 'completed' ? 'default' :
                                  record.status === 'pending' ? 'secondary' :
                                  'destructive'
                                }
                              >
                                {SIGNING_STATUS_LABELS[record.status]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(record.created_at).toLocaleDateString('zh-CN')}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}
