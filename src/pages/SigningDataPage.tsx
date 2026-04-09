import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import { getSigningRecords, getCompanies, getEmployees, getSignedDocuments, downloadAsignContractAndSyncArchive } from '@/db/api';
import type { SigningRecord, Company, Employee, SignedDocument } from '@/types/types';
import { toast } from 'sonner';
import { Download, Search, FileSpreadsheet, Check, ChevronsUpDown, FileText, CloudDownload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';

export default function SigningDataPage() {
  const [signingRecords, setSigningRecords] = useState<SigningRecord[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false);
  
  // 文件列表Dialog状态
  const [filesDialogOpen, setFilesDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SigningRecord | null>(null);
  const [signedDocuments, setSignedDocuments] = useState<SignedDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [syncingAsignId, setSyncingAsignId] = useState<string | null>(null);
  const [batchSyncing, setBatchSyncing] = useState(false);

  // 筛选条件
  const [filters, setFilters] = useState({
    company_id: 'all',
    employee_id: 'all',
    status: 'all',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [recordsData, companiesData, employeesData] = await Promise.all([
      getSigningRecords(),
      getCompanies(),
      getEmployees()
    ]);
    setSigningRecords(recordsData);
    setCompanies(companiesData);
    setEmployees(employeesData);
    setLoading(false);
  };

  // 筛选签署记录
  const filteredRecords = signingRecords.filter(record => {
    if (filters.company_id && filters.company_id !== 'all' && record.company_id !== filters.company_id) return false;
    if (filters.employee_id && filters.employee_id !== 'all' && record.employee_id !== filters.employee_id) return false;
    if (filters.status && filters.status !== 'all' && record.status !== filters.status) return false;
    if (filters.start_date && record.created_at < filters.start_date) return false;
    if (filters.end_date && record.created_at > filters.end_date) return false;
    return true;
  });

  // 重置筛选条件
  const handleReset = () => {
    setFilters({
      company_id: 'all',
      employee_id: 'all',
      status: 'all',
      start_date: '',
      end_date: ''
    });
  };

  // 导出Excel
  const handleExport = () => {
    if (filteredRecords.length === 0) {
      toast.error('没有数据可导出');
      return;
    }

    setExporting(true);

    try {
      const exportData = filteredRecords.map(record => {
        const company = companies.find(c => c.id === record.company_id);
        const employee = employees.find(e => e.id === record.employee_id);
        const employeeName = employee?.name || '未知';

        return {
          '签署ID': record.id,
          '所属公司': company?.name || '未知',
          '文书模板': record.template_name || '未知',
          '签署员工': employeeName,
          '签署状态': record.status === 'pending' ? '待签署' : record.status === 'completed' ? '已完成' : '已拒绝',
          '发起时间': record.created_at ? new Date(record.created_at).toLocaleString('zh-CN') : '',
          '完成时间': record.completed_at ? new Date(record.completed_at).toLocaleString('zh-CN') : '',
          '备注': record.notes || ''
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '签署数据');
      
      const fileName = `签署数据_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'withdrawn':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'pending':
        return '待签署';
      case 'rejected':
        return '已拒绝';
      case 'withdrawn':
        return '已撤回';
      case 'employee_signed':
        return '员工已签';
      case 'company_signed':
        return '公司已签';
      default:
        return status;
    }
  };

  // 下载已签署文件
  const handleDownloadFile = (record: SigningRecord) => {
    if (!record.signed_file_url) {
      toast.error('该记录没有可下载的文件');
      return;
    }

    try {
      // 创建一个隐藏的a标签来触发下载
      const link = document.createElement('a');
      link.href = record.signed_file_url;
      link.download = `签署文件_${record.id.slice(0, 8)}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.pdf`;
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

  // 查看签署文件列表
  const handleViewFiles = async (record: SigningRecord) => {
    setSelectedRecord(record);
    setFilesDialogOpen(true);
    setLoadingDocuments(true);

    try {
      const documents = await getSignedDocuments(record.id);
      if (documents.length > 0) {
        setSignedDocuments(documents);
      } else if (record.signed_file_url) {
        // 兜底：若明细表暂无数据，但签署记录已保存总合同URL，仍允许查看/下载
        setSignedDocuments([
          {
            id: `record-${record.id}`,
            signing_record_id: record.id,
            template_id: 'record_signed_contract',
            template_name: '签署合同文件',
            file_url: record.signed_file_url,
            file_size: undefined,
            signed_at: record.company_signed_at || record.employee_signed_at || record.updated_at,
            created_at: record.created_at,
            updated_at: record.updated_at,
          },
        ]);
      } else {
        setSignedDocuments([]);
      }
    } catch (error) {
      console.error('获取签署文件列表失败:', error);
      toast.error('获取签署文件列表失败');
      setSignedDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  /** 爱签 downloadContract 拉 PDF 并写入档案（与回调通知独立） */
  const handleSyncAsignPdfToArchive = async (record: SigningRecord, force: 0 | 1) => {
    if (!record.third_party_contract_no?.trim()) {
      toast.error('该记录无爱签合同号');
      return;
    }
    if (force === 1) {
      const ok = confirm('确定使用强制拉取（force=1）吗？');
      if (!ok) return;
    }
    setSyncingAsignId(record.id);
    try {
      const result = await downloadAsignContractAndSyncArchive({
        signingRecordId: record.id,
        force,
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
        console.error('[ASIGN_SYNC] 档案页同步失败', result);
        return;
      }
      toast.success(`已从爱签同步 PDF（${result.updatedRecordCount} 条相关记录）`);
      await loadData();
      if (selectedRecord?.id === record.id && filesDialogOpen) {
        setLoadingDocuments(true);
        try {
          const documents = await getSignedDocuments(record.id);
          setSignedDocuments(documents);
        } finally {
          setLoadingDocuments(false);
        }
      }
    } catch (e) {
      console.error('[ASIGN_SYNC] 档案页异常', e);
      toast.error('同步失败');
    } finally {
      setSyncingAsignId(null);
    }
  };

  /** 对当前筛选列表中「电子签 + 已完成 + 有爱签合同号」逐条拉取 PDF，避免与表格展示范围不一致 */
  const handleBatchSync = async () => {
    const targets = filteredRecords.filter(
      (r) =>
        r.status === 'completed' &&
        r.signing_mode === 'electronic' &&
        Boolean(r.third_party_contract_no?.trim()),
    );
    if (targets.length === 0) {
      toast.error('当前列表没有可批量同步的记录（需：已完成、电子签、有爱签合同号）');
      return;
    }
    setBatchSyncing(true);
    let ok = 0;
    let fail = 0;
    console.log('[ASIGN_SYNC_BATCH] 开始', { count: targets.length });
    const batchCooldownMs = 900;
    try {
      for (let i = 0; i < targets.length; i += 1) {
        const record = targets[i];
        setSyncingAsignId(record.id);
        try {
          const result = await downloadAsignContractAndSyncArchive({
            signingRecordId: record.id,
            force: 0,
          });
          if (result.ok) {
            ok += 1;
          } else {
            fail += 1;
            console.error('[ASIGN_SYNC_BATCH] 单条失败', record.id, result);
          }
        } catch (e) {
          fail += 1;
          console.error('[ASIGN_SYNC_BATCH] 单条异常', record.id, e);
        } finally {
          setSyncingAsignId(null);
        }
        if (i < targets.length - 1) {
          await new Promise((r) => setTimeout(r, batchCooldownMs));
        }
      }
      await loadData();
      if (fail === 0) {
        toast.success(`批量同步完成，共 ${ok} 条`);
      } else {
        toast.warning(`批量同步结束：成功 ${ok} 条，失败 ${fail} 条`);
      }
    } finally {
      setBatchSyncing(false);
    }
  };

  // 下载单个签署文件
  // 下载单个签署文件
  const handleDownloadSingleFile = (doc: SignedDocument) => {
    if (!doc.file_url) {
      toast.error('该文件没有可下载的链接');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = doc.file_url;
      link.download = `${doc.template_name}_${doc.id.slice(0, 8)}.pdf`;
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">档案下载</h1>
            <p className="text-muted-foreground mt-2">查询和导出签署数据</p>
          </div>
          <Button onClick={handleExport} disabled={exporting || filteredRecords.length === 0}>
            {exporting ? (
              <>
                <FileSpreadsheet className="mr-2 h-4 w-4 animate-pulse" />
                导出中...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                导出Excel
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              筛选条件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>所属公司</Label>
                <Popover open={companyPopoverOpen} onOpenChange={setCompanyPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={companyPopoverOpen}
                      className="w-full justify-between"
                    >
                      {filters.company_id === 'all'
                        ? '全部公司'
                        : companies.find((company) => company.id === filters.company_id)?.name || '选择公司'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="搜索公司名称..." />
                      <CommandList>
                        <CommandEmpty>未找到公司</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="all"
                            onSelect={() => {
                              setFilters({ ...filters, company_id: 'all' });
                              setCompanyPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                filters.company_id === 'all' ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            全部公司
                          </CommandItem>
                          {companies.map((company) => (
                            <CommandItem
                              key={company.id}
                              value={company.name}
                              onSelect={() => {
                                setFilters({ ...filters, company_id: company.id });
                                setCompanyPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  filters.company_id === company.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {company.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>签署员工</Label>
                <Select 
                  value={filters.employee_id} 
                  onValueChange={(value) => setFilters({ ...filters, employee_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="全部员工" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部员工</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>签署状态</Label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="全部状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待签署</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>开始日期</Label>
                <Input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>结束日期</Label>
                <Input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                />
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={handleReset} className="w-full">
                  重置筛选
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between" style={{flexDirection: 'row'}}>
            <CardTitle>签署记录（共 {filteredRecords.length} 条）</CardTitle>
            <Button
              size="sm"
              onClick={() => void handleBatchSync()}
              disabled={batchSyncing || loading || filteredRecords.length === 0}
            >
              {batchSyncing ? '批量同步中…' : '批量同步'}
            </Button>      
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">暂无签署记录</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">签署ID</TableHead>
                      <TableHead className="whitespace-nowrap min-w-[200px]">所属公司</TableHead>
                      <TableHead className="whitespace-nowrap">文书模板</TableHead>
                      <TableHead className="whitespace-nowrap">签署员工</TableHead>
                      <TableHead className="whitespace-nowrap">状态</TableHead>
                      <TableHead className="whitespace-nowrap">发起时间</TableHead>
                      <TableHead className="whitespace-nowrap">完成时间</TableHead>
                      <TableHead className="whitespace-nowrap">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => {
                      const company = companies.find(c => c.id === record.company_id);
                      const employee = employees.find(e => e.id === record.employee_id);
                      const employeeName = employee?.name || '未知';

                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-xs whitespace-nowrap">
                            {record.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{company?.name || '未知'}</TableCell>
                          <TableCell className="whitespace-nowrap">{record.template_name || '未知'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employeeName}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant={getStatusBadgeVariant(record.status)}>
                              {getStatusLabel(record.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {record.created_at ? new Date(record.created_at).toLocaleString('zh-CN') : '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {record.completed_at ? new Date(record.completed_at).toLocaleString('zh-CN') : '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {record.status === 'completed' ? (
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewFiles(record)}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  查看文件
                                </Button>
                                {/* {record.signed_file_url && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownloadFile(record)}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    下载
                                  </Button>
                                )} */}
                                {record.signing_mode === 'electronic' &&
                                  record.third_party_contract_no && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={batchSyncing || syncingAsignId === record.id}
                                        onClick={() => handleSyncAsignPdfToArchive(record, 0)}
                                      >
                                        <CloudDownload className="h-4 w-4 mr-1" />
                                        {syncingAsignId === record.id ? '同步中…' : '爱签同步'}
                                      </Button>
                                      {/* <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={batchSyncing || syncingAsignId === record.id}
                                        onClick={() => handleSyncAsignPdfToArchive(record, 1)}
                                        className="text-muted-foreground"
                                      >
                                        强制
                                      </Button> */}
                                    </>
                                  )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
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

        {/* 签署文件列表Dialog */}
        <Dialog open={filesDialogOpen} onOpenChange={setFilesDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>签署文件列表</DialogTitle>
              <DialogDescription>
                签署ID: {selectedRecord?.id.slice(0, 8)}... | 
                公司: {companies.find(c => c.id === selectedRecord?.company_id)?.name || '未知'} |
                员工: {employees.find(e => e.id === selectedRecord?.employee_id)?.name || '未知'}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {loadingDocuments ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full bg-muted" />
                  <Skeleton className="h-12 w-full bg-muted" />
                  <Skeleton className="h-12 w-full bg-muted" />
                </div>
              ) : signedDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>暂无签署文件</p>
                  <p className="text-sm mt-2">文件将在签署完成后生成</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 批量操作按钮 */}
                  <div className="flex justify-end gap-2 flex-wrap">
                    {selectedRecord?.signing_mode === 'electronic' &&
                      selectedRecord.third_party_contract_no && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={batchSyncing || syncingAsignId === selectedRecord.id}
                            onClick={() =>
                              selectedRecord && handleSyncAsignPdfToArchive(selectedRecord, 0)
                            }
                          >
                            <CloudDownload className="h-4 w-4 mr-1" />
                            {syncingAsignId === selectedRecord?.id ? '同步中…' : '从爱签同步 PDF'}
                          </Button>
                          {/* <Button
                            variant="outline"
                            size="sm"
                            disabled={batchSyncing || syncingAsignId === selectedRecord.id}
                            onClick={() =>
                              selectedRecord && handleSyncAsignPdfToArchive(selectedRecord, 1)
                            }
                          >
                            强制拉取
                          </Button> */}
                        </>
                      )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        signedDocuments.forEach(doc => {
                          if (doc.file_url) {
                            handleDownloadSingleFile(doc);
                          }
                        });
                      }}
                      disabled={!signedDocuments.some(doc => doc.file_url)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      下载全部
                    </Button>
                  </div>

                  {/* 文件列表 */}
                  <div className="overflow-y-auto max-h-[50vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>文书名称</TableHead>
                          <TableHead>文件大小</TableHead>
                          <TableHead>签署时间</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {signedDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.template_name}</TableCell>
                            <TableCell>
                              {doc.file_size 
                                ? `${(doc.file_size / 1024).toFixed(2)} KB` 
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {doc.signed_at 
                                ? new Date(doc.signed_at).toLocaleString('zh-CN') 
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {doc.file_url ? (
                                <Badge variant="default">已生成</Badge>
                              ) : (
                                <Badge variant="secondary">待生成</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {doc.file_url ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      window.open(doc.file_url!, '_blank');
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    预览
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownloadSingleFile(doc)}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    下载
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">文件未生成</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
