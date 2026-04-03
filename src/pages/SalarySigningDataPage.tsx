import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getSalarySignatures, getAttendanceSignatures, getCompanies } from '@/db/api';
import type { SalarySignature, AttendanceSignature, Company } from '@/types/types';
import { 
  SALARY_SIGNATURE_STATUS_LABELS, 
  SALARY_SIGNATURE_TYPE_LABELS,
  ATTENDANCE_SIGNATURE_STATUS_LABELS 
} from '@/types/types';
import { toast } from 'sonner';
import { Download, FileSpreadsheet, FileText, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import * as XLSX from 'xlsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SalarySigningDataPage() {
  const [salarySignatures, setSalarySignatures] = useState<SalarySignature[]>([]);
  const [attendanceSignatures, setAttendanceSignatures] = useState<AttendanceSignature[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // 文件预览Dialog状态
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState<SalarySignature | AttendanceSignature | null>(null);

  // 筛选条件
  const [filters, setFilters] = useState({
    company_id: 'all',
    status: 'all',
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString()
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [salaryData, attendanceData, companiesData] = await Promise.all([
      getSalarySignatures(),
      getAttendanceSignatures(),
      getCompanies()
    ]);
    setSalarySignatures(salaryData);
    setAttendanceSignatures(attendanceData);
    setCompanies(companiesData);
    setLoading(false);
  };

  // 筛选薪酬签署记录
  const filteredSalarySignatures = salarySignatures.filter(record => {
    if (filters.company_id !== 'all' && record.company_id !== filters.company_id) return false;
    if (filters.status !== 'all' && record.status !== filters.status) return false;
    if (filters.year !== 'all' && record.year.toString() !== filters.year) return false;
    if (filters.month !== 'all' && record.month.toString() !== filters.month) return false;
    return true;
  });

  // 筛选考勤签署记录
  const filteredAttendanceSignatures = attendanceSignatures.filter(record => {
    if (filters.company_id !== 'all' && record.company_id !== filters.company_id) return false;
    if (filters.status !== 'all' && record.status !== filters.status) return false;
    if (filters.year !== 'all' && record.year.toString() !== filters.year) return false;
    if (filters.month !== 'all' && record.month.toString() !== filters.month) return false;
    return true;
  });

  // 导出薪酬签署数据到Excel
  const handleExportSalary = () => {
    if (filteredSalarySignatures.length === 0) {
      toast.error('没有可导出的数据');
      return;
    }

    setExporting(true);
    try {
      const exportData = filteredSalarySignatures.map(record => ({
        '公司名称': record.company?.name || '-',
        '员工姓名': record.employee?.name || '-',
        
        '部门': record.employee?.department || '-',
        '类型': SALARY_SIGNATURE_TYPE_LABELS[record.type],
        '年份': record.year,
        '月份': record.month,
        '状态': SALARY_SIGNATURE_STATUS_LABELS[record.status],
        '发送时间': record.sent_at ? new Date(record.sent_at).toLocaleString('zh-CN') : '-',
        '签署时间': record.signed_at ? new Date(record.signed_at).toLocaleString('zh-CN') : '-',
        '创建时间': record.created_at ? new Date(record.created_at).toLocaleString('zh-CN') : '-'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '薪酬签署记录');

      const fileName = `薪酬签署记录_${filters.year}年${filters.month}月_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  // 导出考勤签署数据到Excel
  const handleExportAttendance = () => {
    if (filteredAttendanceSignatures.length === 0) {
      toast.error('没有可导出的数据');
      return;
    }

    setExporting(true);
    try {
      const exportData = filteredAttendanceSignatures.map(record => ({
        '公司名称': record.company?.name || '-',
        '员工姓名': record.employee?.name || '-',
        
        '部门': record.employee?.department || '-',
        '年份': record.year,
        '月份': record.month,
        '状态': ATTENDANCE_SIGNATURE_STATUS_LABELS[record.status],
        '发送时间': record.sent_at ? new Date(record.sent_at).toLocaleString('zh-CN') : '-',
        '签署时间': record.signed_at ? new Date(record.signed_at).toLocaleString('zh-CN') : '-',
        '创建时间': record.created_at ? new Date(record.created_at).toLocaleString('zh-CN') : '-'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '考勤签署记录');

      const fileName = `考勤签署记录_${filters.year}年${filters.month}月_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  // 获取状态徽章样式
  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'signed':
        return 'default';
      case 'sent':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'rejected':
        return 'destructive';
      case 'revoked':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  /**
   * 下载已签署文件
   * 
   * 注意：在实际应用中，signed_file_url应该由第三方电子签系统返回
   * 集成流程：
   * 1. 用户点击"立即签署"按钮
   * 2. 系统调用第三方电子签API，发送签署请求
   * 3. 员工通过短信链接完成签署
   * 4. 电子签系统回调通知签署完成
   * 5. 在回调中更新salary_signatures表的signed_file_url字段为电子签系统返回的已签署文件URL
   * 6. 用户即可通过此功能下载/查看已签署的文件
   */
  const handleDownloadSignedFile = (fileUrl: string | null, fileName: string) => {
    if (!fileUrl) {
      toast.error('签署文件不存在');
      return;
    }
    
    // 检查URL是否为示例URL
    if (fileUrl.includes('example.com')) {
      toast.error('这是示例数据，真实文件URL需要在签署完成后由电子签系统返回');
      return;
    }
    
    // 打开新窗口查看/下载文件
    try {
      window.open(fileUrl, '_blank');
      toast.success('正在打开签署文件...');
    } catch (error) {
      console.error('打开文件失败:', error);
      toast.error('打开文件失败，请检查文件URL是否有效');
    }
  };

  // 查看文件详情
  const handleViewFile = (signature: SalarySignature | AttendanceSignature) => {
    setSelectedSignature(signature);
    setFileDialogOpen(true);
  };

  // 下载单个文件
  const handleDownloadFile = (signature: SalarySignature | AttendanceSignature) => {
    if (!signature.signed_file_url) {
      toast.error('该文件没有可下载的链接');
      return;
    }

    // 检查URL是否为示例URL
    if (signature.signed_file_url.includes('example.com')) {
      toast.error('这是示例数据，真实文件URL需要在签署完成后由电子签系统返回');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = signature.signed_file_url;
      const fileName = 'type' in signature 
        ? `${signature.employee?.name}_${signature.year}年${signature.month}月_${SALARY_SIGNATURE_TYPE_LABELS[signature.type]}.pdf`
        : `${signature.employee?.name}_${signature.year}年${signature.month}月_考勤确认表.pdf`;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('开始下载文件');
    } catch (error) {
      console.error('下载文件失败:', error);
      toast.error('下载文件失败');
    }
  };

  // 预览文件
  const handlePreviewFile = (signature: SalarySignature | AttendanceSignature) => {
    if (!signature.signed_file_url) {
      toast.error('该文件没有可预览的链接');
      return;
    }

    // 检查URL是否为示例URL
    if (signature.signed_file_url.includes('example.com')) {
      toast.error('这是示例数据，真实文件URL需要在签署完成后由电子签系统返回');
      return;
    }

    try {
      window.open(signature.signed_file_url, '_blank');
      toast.success('正在打开文件预览...');
    } catch (error) {
      console.error('预览文件失败:', error);
      toast.error('预览文件失败');
    }
  };

  // 生成年份选项
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // 生成月份选项
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">薪酬档案下载</h1>
          <p className="text-muted-foreground mt-2">
            查询和导出薪酬相关签署记录
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>筛选条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">公司</label>
                <Select
                  value={filters.company_id}
                  onValueChange={(value) => setFilters({ ...filters, company_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择公司" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部公司</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">状态</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待签署</SelectItem>
                    <SelectItem value="sent">已发送</SelectItem>
                    <SelectItem value="signed">已签署</SelectItem>
                    <SelectItem value="rejected">已拒签</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">年份</label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => setFilters({ ...filters, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择年份" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部年份</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}年
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">月份</label>
                <Select
                  value={filters.month}
                  onValueChange={(value) => setFilters({ ...filters, month: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择月份" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部月份</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month}月
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>签署记录</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <Tabs defaultValue="salary" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="salary">工资条签署</TabsTrigger>
                  <TabsTrigger value="attendance">考勤确认签署</TabsTrigger>
                </TabsList>

                <TabsContent value="salary" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      共 {filteredSalarySignatures.length} 条记录
                    </div>
                    <Button
                      onClick={handleExportSalary}
                      disabled={exporting || filteredSalarySignatures.length === 0}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      {exporting ? '导出中...' : '导出Excel'}
                    </Button>
                  </div>

                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">公司名称</TableHead>
                          <TableHead className="whitespace-nowrap">员工姓名</TableHead>
                          <TableHead className="whitespace-nowrap">部门</TableHead>
                          <TableHead className="whitespace-nowrap">类型</TableHead>
                          <TableHead className="whitespace-nowrap">年月</TableHead>
                          <TableHead className="whitespace-nowrap">状态</TableHead>
                          <TableHead className="whitespace-nowrap">发送时间</TableHead>
                          <TableHead className="whitespace-nowrap">签署时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSalarySignatures.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center text-muted-foreground">
                              暂无签署记录
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSalarySignatures.map((signature) => (
                            <TableRow key={signature.id}>
                              <TableCell className="font-medium whitespace-nowrap">
                                {signature.company?.name || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.employee?.name || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.employee?.department || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge variant="outline">
                                  {SALARY_SIGNATURE_TYPE_LABELS[signature.type]}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.year}年{signature.month}月
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge variant={getStatusBadgeVariant(signature.status)}>
                                  {SALARY_SIGNATURE_STATUS_LABELS[signature.status]}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.sent_at
                                  ? new Date(signature.sent_at).toLocaleString('zh-CN')
                                  : '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.signed_at ? (
                                  <div className="flex items-center gap-2">
                                    <span>{new Date(signature.signed_at).toLocaleString('zh-CN')}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8"
                                      onClick={() => handleViewFile(signature)}
                                      title="查看文件"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      共 {filteredAttendanceSignatures.length} 条记录
                    </div>
                    <Button
                      onClick={handleExportAttendance}
                      disabled={exporting || filteredAttendanceSignatures.length === 0}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      {exporting ? '导出中...' : '导出Excel'}
                    </Button>
                  </div>

                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">公司名称</TableHead>
                          <TableHead className="whitespace-nowrap">员工姓名</TableHead>
                          <TableHead className="whitespace-nowrap">部门</TableHead>
                          <TableHead className="whitespace-nowrap">年月</TableHead>
                          <TableHead className="whitespace-nowrap">状态</TableHead>
                          <TableHead className="whitespace-nowrap">发送时间</TableHead>
                          <TableHead className="whitespace-nowrap">签署时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAttendanceSignatures.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground">
                              暂无签署记录
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAttendanceSignatures.map((signature) => (
                            <TableRow key={signature.id}>
                              <TableCell className="font-medium whitespace-nowrap">
                                {signature.company?.name || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.employee?.name || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.employee?.department || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.year}年{signature.month}月
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge variant={getStatusBadgeVariant(signature.status)}>
                                  {ATTENDANCE_SIGNATURE_STATUS_LABELS[signature.status]}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.sent_at
                                  ? new Date(signature.sent_at).toLocaleString('zh-CN')
                                  : '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.signed_at ? (
                                  <div className="flex items-center gap-2">
                                    <span>{new Date(signature.signed_at).toLocaleString('zh-CN')}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8"
                                      onClick={() => handleViewFile(signature)}
                                      title="查看文件"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* 文件预览Dialog */}
        <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>签署文件详情</DialogTitle>
              <DialogDescription>
                {selectedSignature && (
                  <>
                    公司: {companies.find(c => c.id === selectedSignature.company_id)?.name || '未知'} |
                    员工: {selectedSignature.employee?.name || '未知'} |
                    {'type' in selectedSignature 
                      ? `类型: ${SALARY_SIGNATURE_TYPE_LABELS[selectedSignature.type]}`
                      : '类型: 考勤确认表'
                    } |
                    年月: {selectedSignature.year}年{selectedSignature.month}月
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedSignature?.signed_file_url ? (
                <div className="space-y-4">
                  {/* 文件信息卡片 */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium">
                              {'type' in selectedSignature 
                                ? SALARY_SIGNATURE_TYPE_LABELS[selectedSignature.type]
                                : '考勤确认表'
                              }
                            </span>
                          </div>
                          <Badge variant="default">已签署</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>签署时间: {selectedSignature.signed_at 
                            ? new Date(selectedSignature.signed_at).toLocaleString('zh-CN')
                            : '-'
                          }</div>
                          <div>发送时间: {selectedSignature.sent_at 
                            ? new Date(selectedSignature.sent_at).toLocaleString('zh-CN')
                            : '-'
                          }</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 操作按钮 */}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => selectedSignature && handlePreviewFile(selectedSignature)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      预览文件
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => selectedSignature && handleDownloadFile(selectedSignature)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      下载文件
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>暂无签署文件</p>
                  <p className="text-sm mt-2">文件将在签署完成后生成</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
