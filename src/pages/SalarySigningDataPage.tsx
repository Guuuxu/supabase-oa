import { useEffect, useMemo, useState } from 'react';
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
import {
  getSalarySignatures,
  getCompanies,
  getDocumentTemplates,
  downloadAsignContractAndSyncArchive,
} from '@/db/api';
import type { SalarySignature, Company, DocumentTemplate } from '@/types/types';
import { 
  SALARY_SIGNATURE_STATUS_LABELS, 
  SALARY_SIGNATURE_TYPE_LABELS
} from '@/types/types';
import { toast } from 'sonner';
import { Download, FileSpreadsheet, FileText, Eye, CloudDownload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import * as XLSX from 'xlsx';

export default function SalarySigningDataPage() {
  const [salarySignatures, setSalarySignatures] = useState<SalarySignature[]>([]);
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // 文件预览Dialog状态
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState<SalarySignature | null>(null);
  const [syncingSalarySignatureId, setSyncingSalarySignatureId] = useState<string | null>(null);

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
    const [salaryData, companiesData, templatesData] = await Promise.all([
      getSalarySignatures(),
      getCompanies(),
      getDocumentTemplates(),
    ]);
    setSalarySignatures(salaryData);
    setCompanies(companiesData);
    setDocumentTemplates(templatesData);
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

  const templateNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of documentTemplates) {
      m.set(t.id, t.name);
    }
    return m;
  }, [documentTemplates]);

  /** 文书名称：冗余字段 → 按模板 ID 查 document_templates → 最后才用签署类型标签 */
  const getSalarySignatureDocumentName = (record: SalarySignature): string => {
    const fromDb = (record.document_name ?? '').trim();
    if (fromDb.length > 0) {
      return fromDb;
    }
    const templateId = (record.document_template_id ?? '').trim();
    if (templateId.length > 0) {
      const fromTemplate = (templateNameById.get(templateId) ?? '').trim();
      if (fromTemplate.length > 0) {
        return fromTemplate;
      }
    }
    return SALARY_SIGNATURE_TYPE_LABELS[record.type];
  };

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
        '文书名称': getSalarySignatureDocumentName(record),
        '年份': record.year,
        '月份': record.month,
        '状态': SALARY_SIGNATURE_STATUS_LABELS[record.status],
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
  // 查看文件详情
  const handleViewFile = (signature: SalarySignature) => {
    setSelectedSignature(signature);
    setFileDialogOpen(true);
  };

  // 下载单个文件
  const handleDownloadFile = (signature: SalarySignature) => {
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
      const fileName = `${signature.employee?.name}_${signature.year}年${signature.month}月_${getSalarySignatureDocumentName(signature)}.pdf`;
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

  const handleSyncSalarySignedFile = async (signature: SalarySignature) => {
    const contractNo = String(signature.third_party_contract_no ?? '').trim();
    if (!contractNo) {
      toast.error('该记录无爱签合同号，无法从爱签同步');
      return;
    }
    setSyncingSalarySignatureId(signature.id);
    try {
      const result = await downloadAsignContractAndSyncArchive({
        contractNo,
        force: 0,
      });
      if (!result.ok) {
        let detailStr = '';
        if (result.detail !== undefined) {
          if (typeof result.detail === 'string') {
            detailStr = result.detail.slice(0, 220);
          } else {
            detailStr = JSON.stringify(result.detail).slice(0, 220);
          }
        }
        toast.error(result.error, detailStr ? { description: detailStr } : undefined);
        return;
      }
      toast.success(`已从爱签同步 PDF，共更新 ${result.updatedRecordCount} 条记录`);
      await loadData();
      setSelectedSignature((prev) => {
        if (!prev || prev.id !== signature.id) {
          return prev;
        }
        return {
          ...prev,
          signed_file_url: result.publicUrl,
          status: 'signed',
        };
      });
    } catch (error) {
      console.error('[SALARY_SIGNING_DATA_SYNC] 同步失败', error);
      toast.error('同步失败');
    } finally {
      setSyncingSalarySignatureId(null);
    }
  };

  // 预览文件
  const handlePreviewFile = (signature: SalarySignature) => {
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
                    {/* <SelectItem value="sent">已发送</SelectItem> */}
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
              <div className="space-y-4">
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
                        <TableHead className="whitespace-nowrap">文书名称</TableHead>
                        <TableHead className="whitespace-nowrap">年月</TableHead>
                        <TableHead className="whitespace-nowrap">状态</TableHead>
                        <TableHead className="whitespace-nowrap">创建时间</TableHead>
                        <TableHead className="whitespace-nowrap">签署时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSalarySignatures.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground">
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
                              {signature.employee?.department || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant="outline">
                                {getSalarySignatureDocumentName(signature)}
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
                              {signature.created_at
                                ? new Date(signature.created_at).toLocaleString('zh-CN')
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
              </div>
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
                    文书名称: {getSalarySignatureDocumentName(selectedSignature)} |
                    年月: {selectedSignature.year}年{selectedSignature.month}月
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedSignature && (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium">
                              {getSalarySignatureDocumentName(selectedSignature)}
                            </span>
                          </div>
                          <Badge variant="default">已签署</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            签署时间:{' '}
                            {selectedSignature.signed_at
                              ? new Date(selectedSignature.signed_at).toLocaleString('zh-CN')
                              : '-'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {selectedSignature.signed_file_url ? (
                    <>
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Button type="button" variant="outline" onClick={() => handlePreviewFile(selectedSignature)}>
                          <Eye className="h-4 w-4 mr-2" />
                          预览文件
                        </Button>
                        <Button type="button" onClick={() => handleDownloadFile(selectedSignature)}>
                          <Download className="h-4 w-4 mr-2" />
                          下载文件
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="py-1 text-muted-foreground space-y-2">
                      <p>请点击下方「从爱签同步 PDF」拉取已签文件。</p>
                      
                    </div>
                  )}
                  {selectedSignature.third_party_contract_no && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={syncingSalarySignatureId === selectedSignature.id}
                        onClick={() => handleSyncSalarySignedFile(selectedSignature)}
                      >
                        <CloudDownload className="h-4 w-4 mr-1" />
                        {syncingSalarySignatureId === selectedSignature.id ? '同步中…' : '从爱签同步 PDF'}
                      </Button>
                      <span className="text-xs text-muted-foreground font-mono break-all">
                        {selectedSignature.third_party_contract_no}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
