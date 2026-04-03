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
import { getSigningRecords, getCompanies, getEmployees, getSignedDocuments } from '@/db/api';
import type { SigningRecord, Company, Employee, SignedDocument } from '@/types/types';
import { toast } from 'sonner';
import { Download, Search, FileSpreadsheet, Check, ChevronsUpDown, FileText } from 'lucide-react';
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
      setSignedDocuments(documents);
    } catch (error) {
      console.error('获取签署文件列表失败:', error);
      toast.error('获取签署文件列表失败');
      setSignedDocuments([]);
    } finally {
      setLoadingDocuments(false);
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
          <CardHeader>
            <CardTitle>签署记录（共 {filteredRecords.length} 条）</CardTitle>
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
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewFiles(record)}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  查看文件
                                </Button>
                                {record.signed_file_url && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownloadFile(record)}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    下载
                                  </Button>
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
                  <div className="flex justify-end gap-2">
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
