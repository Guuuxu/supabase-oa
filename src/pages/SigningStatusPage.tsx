import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getSigningRecords,
  getCompanies,
  sendSigningSMS,
  updateSigningRecord
} from '@/db/api';
import type { SigningRecord, Company } from '@/types/types';
import { 
  SIGNING_STATUS_LABELS,
  DOCUMENT_CATEGORY_LABELS
} from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { CompanySelector } from '@/components/ui/company-selector';
import { Button } from '@/components/ui/button';
import { Send, Eye, Download, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePermissions } from '@/hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, formatDateTime } from '@/utils/exportUtils';

export default function SigningStatusPage() {
  const [signingRecords, setSigningRecords] = useState<SigningRecord[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  
  // 批量选择状态
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);
  const [selectedCompletedIds, setSelectedCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, companiesData] = await Promise.all([
        getSigningRecords(),
        getCompanies()
      ]);
      setSigningRecords(recordsData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 筛选签署记录
  const filteredRecords = selectedCompanyId === 'all' 
    ? signingRecords 
    : signingRecords.filter(r => r.company_id === selectedCompanyId);

  // 按状态分组
  const pendingRecords = filteredRecords.filter(r => 
    r.status === 'pending' || r.status === 'employee_signed' || r.status === 'company_signed'
  );
  const completedRecords = filteredRecords.filter(r => 
    r.status === 'completed' || r.status === 'rejected' || r.status === 'withdrawn'
  );

  // 发送签署短信
  const handleSendSMS = async (id: string) => {
    const loadingToast = toast.loading('正在发送签署短信...');
    
    try {
      const result = await sendSigningSMS(id);
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('签署短信发送成功');
        loadData();
      } else {
        toast.error(result.error || '发送失败');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('发送失败:', error);
      toast.error('发送失败');
    }
  };

  // 撤回签署
  const handleRevokeRecord = async (id: string) => {
    if (!confirm('确定要撤回该签署记录吗？')) {
      return;
    }

    const loadingToast = toast.loading('正在撤回签署记录...');
    
    try {
      const success = await updateSigningRecord(id, { 
        status: 'withdrawn'
      });
      
      toast.dismiss(loadingToast);
      
      if (success) {
        toast.success('签署记录已撤回');
        loadData();
      } else {
        toast.error('撤回失败');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('撤回失败:', error);
      toast.error('撤回失败');
    }
  };

  // 查看详情
  const handleViewDetail = (id: string) => {
    navigate(`/signing-status/${id}`);
  };

  // 待签署列表 - 全选/取消全选
  const handleSelectAllPending = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const pendingRecords = filteredRecords.filter(r => r.status === 'pending' || r.status === 'employee_signed' || r.status === 'company_signed');
      setSelectedPendingIds(pendingRecords.map(r => r.id));
    } else {
      setSelectedPendingIds([]);
    }
  };

  // 待签署列表 - 单选
  const handleSelectPending = (id: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedPendingIds([...selectedPendingIds, id]);
    } else {
      setSelectedPendingIds(selectedPendingIds.filter(rid => rid !== id));
    }
  };

  // 已完成列表 - 全选/取消全选
  const handleSelectAllCompleted = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const completedRecords = filteredRecords.filter(r => r.status === 'completed');
      setSelectedCompletedIds(completedRecords.map(r => r.id));
    } else {
      setSelectedCompletedIds([]);
    }
  };

  // 已完成列表 - 单选
  const handleSelectCompleted = (id: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedCompletedIds([...selectedCompletedIds, id]);
    } else {
      setSelectedCompletedIds(selectedCompletedIds.filter(rid => rid !== id));
    }
  };

  // 批量下载待签署记录
  const handleBatchDownloadPending = () => {
    if (selectedPendingIds.length === 0) {
      toast.error('请先选择要下载的记录');
      return;
    }

    try {
      const selectedRecords = signingRecords.filter(r => selectedPendingIds.includes(r.id));
      
      const exportData = selectedRecords.map(record => ({
        employee_name: record.employee_name || '',
        company_name: record.company_name || '',
        category: DOCUMENT_CATEGORY_LABELS[record.category] || record.category,
        year_month: record.year_month || '',
        status: SIGNING_STATUS_LABELS[record.status] || record.status,
        sent_at: formatDateTime(record.sent_at),
        signed_at: formatDateTime(record.signed_at),
        employee_phone: record.employee_phone || '',
        department: record.department || ''
      }));

      const headers = [
        { key: 'employee_name' as const, label: '员工姓名' },
        { key: 'company_name' as const, label: '公司名称' },
        { key: 'category' as const, label: '文书类别' },
        { key: 'year_month' as const, label: '年月' },
        { key: 'status' as const, label: '签署状态' },
        { key: 'sent_at' as const, label: '发送时间' },
        { key: 'signed_at' as const, label: '签署时间' },
        { key: 'employee_phone' as const, label: '员工电话' },
        { key: 'department' as const, label: '部门' }
      ];

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      exportToCSV(exportData, headers, `待签署列表_${timestamp}`);
      
      toast.success(`成功导出 ${selectedPendingIds.length} 条待签署记录`);
      setSelectedPendingIds([]);
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败，请重试');
    }
  };

  // 批量下载已完成记录
  const handleBatchDownloadCompleted = () => {
    if (selectedCompletedIds.length === 0) {
      toast.error('请先选择要下载的记录');
      return;
    }

    try {
      const selectedRecords = signingRecords.filter(r => selectedCompletedIds.includes(r.id));
      
      const exportData = selectedRecords.map(record => ({
        employee_name: record.employee_name || '',
        company_name: record.company_name || '',
        category: DOCUMENT_CATEGORY_LABELS[record.category] || record.category,
        year_month: record.year_month || '',
        status: SIGNING_STATUS_LABELS[record.status] || record.status,
        sent_at: formatDateTime(record.sent_at),
        signed_at: formatDateTime(record.signed_at),
        employee_phone: record.employee_phone || '',
        department: record.department || ''
      }));

      const headers = [
        { key: 'employee_name' as const, label: '员工姓名' },
        { key: 'company_name' as const, label: '公司名称' },
        { key: 'category' as const, label: '文书类别' },
        { key: 'year_month' as const, label: '年月' },
        { key: 'status' as const, label: '签署状态' },
        { key: 'sent_at' as const, label: '发送时间' },
        { key: 'signed_at' as const, label: '签署时间' },
        { key: 'employee_phone' as const, label: '员工电话' },
        { key: 'department' as const, label: '部门' }
      ];

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      exportToCSV(exportData, headers, `已完成列表_${timestamp}`);
      
      toast.success(`成功导出 ${selectedCompletedIds.length} 条已完成记录`);
      setSelectedCompletedIds([]);
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败，请重试');
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
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">文书签署状态</h1>
            <p className="text-muted-foreground mt-1">
              查看文书签署记录和签署状态
            </p>
          </div>
          <CompanySelector
            companies={companies}
            value={selectedCompanyId}
            onValueChange={setSelectedCompanyId}
          />
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              待签署 ({pendingRecords.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              已完成 ({completedRecords.length})
            </TabsTrigger>
          </TabsList>

          {/* 待签署列表 */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>待签署列表</CardTitle>
                  {selectedPendingIds.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchDownloadPending}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      批量下载 ({selectedPendingIds.length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full bg-muted" />
                    <Skeleton className="h-12 w-full bg-muted" />
                    <Skeleton className="h-12 w-full bg-muted" />
                  </div>
                ) : pendingRecords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无签署记录
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                pendingRecords.length > 0 &&
                                pendingRecords.every(r => selectedPendingIds.includes(r.id))
                              }
                              onCheckedChange={handleSelectAllPending}
                            />
                          </TableHead>
                          <TableHead>公司名称</TableHead>
                          <TableHead>员工姓名</TableHead>
                          <TableHead>部门</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>年月</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>发送时间</TableHead>
                          <TableHead>完成时间</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedPendingIds.includes(record.id)}
                                onCheckedChange={(checked) => handleSelectPending(record.id, checked)}
                              />
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.company?.name || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.employee?.name || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.employee?.department || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant="outline">
                                {record.template_names?.join(', ') || '未知'}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              -
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={getStatusBadgeVariant(record.status)}>
                                {SIGNING_STATUS_LABELS[record.status]}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.created_at ? new Date(record.created_at).toLocaleString('zh-CN') : '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.completed_at ? new Date(record.completed_at).toLocaleString('zh-CN') : record.employee_signed_at ? new Date(record.employee_signed_at).toLocaleString('zh-CN') : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetail(record.id)}
                                  title="查看详情"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {record.status === 'pending' && hasPermission('signing_revoke') && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRevokeRecord(record.id)}
                                    title="撤回签署"
                                  >
                                    <Undo2 className="h-4 w-4" />
                                  </Button>
                                )}
                                {record.status === 'pending' && hasPermission('sms_send') && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSendSMS(record.id)}
                                    title="发送短信"
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
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

          {/* 已完成列表 */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>已完成列表</CardTitle>
                  {selectedCompletedIds.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchDownloadCompleted}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      批量下载 ({selectedCompletedIds.length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full bg-muted" />
                    <Skeleton className="h-12 w-full bg-muted" />
                    <Skeleton className="h-12 w-full bg-muted" />
                  </div>
                ) : completedRecords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无签署记录
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                completedRecords.length > 0 &&
                                completedRecords.every(r => selectedCompletedIds.includes(r.id))
                              }
                              onCheckedChange={handleSelectAllCompleted}
                            />
                          </TableHead>
                          <TableHead>公司名称</TableHead>
                          <TableHead>员工姓名</TableHead>
                          <TableHead>部门</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>年月</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>发送时间</TableHead>
                          <TableHead>完成时间</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedCompletedIds.includes(record.id)}
                                onCheckedChange={(checked) => handleSelectCompleted(record.id, checked)}
                              />
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.company?.name || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.employee?.name || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.employee?.department || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant="outline">
                                {record.template_names?.join(', ') || '未知'}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              -
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={getStatusBadgeVariant(record.status)}>
                                {SIGNING_STATUS_LABELS[record.status]}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.created_at ? new Date(record.created_at).toLocaleString('zh-CN') : '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {record.completed_at ? new Date(record.completed_at).toLocaleString('zh-CN') : record.employee_signed_at ? new Date(record.employee_signed_at).toLocaleString('zh-CN') : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetail(record.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
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
