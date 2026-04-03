import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getSalarySignatures, 
  getAttendanceSignatures, 
  getCompanies,
  deleteSalarySignature,
  deleteAttendanceSignature,
  deleteSalarySignaturesBatch,
  deleteAttendanceSignaturesBatch,
  revokeSalarySignaturesBatch,
  revokeAttendanceSignaturesBatch,
  sendSalarySignatureSMS,
  updateSalarySignature
} from '@/db/api';
import type { SalarySignature, AttendanceSignature, Company } from '@/types/types';
import { 
  SALARY_SIGNATURE_STATUS_LABELS, 
  SALARY_SIGNATURE_TYPE_LABELS,
  ATTENDANCE_SIGNATURE_STATUS_LABELS 
} from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { CompanySelector } from '@/components/ui/company-selector';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Send, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePermissions } from '@/hooks/usePermissions';

export default function SalarySigningStatusPage() {
  const [salarySignatures, setSalarySignatures] = useState<SalarySignature[]>([]);
  const [attendanceSignatures, setAttendanceSignatures] = useState<AttendanceSignature[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  const [selectedSalaryIds, setSelectedSalaryIds] = useState<string[]>([]);
  const [selectedAttendanceIds, setSelectedAttendanceIds] = useState<string[]>([]);
  const [salaryCurrentPage, setSalaryCurrentPage] = useState(1);
  const [attendanceCurrentPage, setAttendanceCurrentPage] = useState(1);
  const pageSize = 15;
  const { hasPermission } = usePermissions();

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
  const filteredSalarySignatures = selectedCompanyId === 'all' 
    ? salarySignatures 
    : salarySignatures.filter(r => r.company_id === selectedCompanyId);

  // 筛选考勤签署记录
  const filteredAttendanceSignatures = selectedCompanyId === 'all' 
    ? attendanceSignatures 
    : attendanceSignatures.filter(r => r.company_id === selectedCompanyId);

  // 删除薪酬签署记录
  const handleDeleteSalarySignature = async (id: string) => {
    if (!confirm('确定要删除这条签署记录吗？')) return;
    
    const success = await deleteSalarySignature(id);
    if (success) {
      toast.success('删除成功');
      loadData();
    } else {
      toast.error('删除失败');
    }
  };

  // 删除考勤签署记录
  const handleDeleteAttendanceSignature = async (id: string) => {
    if (!confirm('确定要删除这条签署记录吗？')) return;
    
    const success = await deleteAttendanceSignature(id);
    if (success) {
      toast.success('删除成功');
      loadData();
    } else {
      toast.error('删除失败');
    }
  };

  // 发送薪酬签署短信
  const handleSendSMS = async (signature: SalarySignature) => {
    if (!signature.employee?.phone) {
      toast.error('员工手机号为空，无法发送短信');
      return;
    }

    setSendingIds(prev => new Set(prev).add(signature.id));
    const result = await sendSalarySignatureSMS(signature.id);
    setSendingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(signature.id);
      return newSet;
    });

    if (result.success) {
      toast.success('短信发送成功');
      loadData();
    } else {
      toast.error(result.error || '短信发送失败');
    }
  };

  // 撤回签署
  const handleRevoke = async (signature: SalarySignature) => {
    if (signature.status !== 'sent' && signature.status !== 'pending') {
      toast.error('只能撤回已发送或待签署的记录');
      return;
    }

    if (!window.confirm('确定要撤回该签署吗？撤回后状态将变为已撤回。')) {
      return;
    }

    const success = await updateSalarySignature(signature.id, {
      status: 'revoked',
      sent_at: null
    });

    if (success) {
      toast.success('撤回成功');
      loadData();
    } else {
      toast.error('撤回失败');
    }
  };

  // 批量删除薪酬签署记录
  const handleBatchDeleteSalary = async () => {
    console.log('批量删除被调用，选中的ID:', selectedSalaryIds);
    
    if (selectedSalaryIds.length === 0) {
      toast.error('请先选择要删除的记录');
      return;
    }

    if (!window.confirm(`确定要删除选中的 ${selectedSalaryIds.length} 条记录吗？`)) {
      return;
    }

    console.log('开始批量删除...');
    const success = await deleteSalarySignaturesBatch(selectedSalaryIds);
    console.log('批量删除结果:', success);
    
    if (success) {
      toast.success(`成功删除 ${selectedSalaryIds.length} 条记录`);
      setSelectedSalaryIds([]);
      loadData();
    } else {
      toast.error('批量删除失败');
    }
  };

  // 批量撤回薪酬签署记录
  const handleBatchRevokeSalary = async () => {
    console.log('批量撤回被调用，选中的ID:', selectedSalaryIds);
    
    if (selectedSalaryIds.length === 0) {
      toast.error('请先选择要撤回的记录');
      return;
    }

    if (!window.confirm(`确定要撤回选中的 ${selectedSalaryIds.length} 条记录吗？`)) {
      return;
    }

    console.log('开始批量撤回...');
    const success = await revokeSalarySignaturesBatch(selectedSalaryIds);
    console.log('批量撤回结果:', success);
    
    if (success) {
      toast.success(`成功撤回 ${selectedSalaryIds.length} 条记录`);
      setSelectedSalaryIds([]);
      loadData();
    } else {
      toast.error('批量撤回失败');
    }
  };

  // 批量删除考勤签署记录
  const handleBatchDeleteAttendance = async () => {
    console.log('批量删除考勤被调用，选中的ID:', selectedAttendanceIds);
    
    if (selectedAttendanceIds.length === 0) {
      toast.error('请先选择要删除的记录');
      return;
    }

    if (!window.confirm(`确定要删除选中的 ${selectedAttendanceIds.length} 条记录吗？`)) {
      return;
    }

    console.log('开始批量删除考勤...');
    const success = await deleteAttendanceSignaturesBatch(selectedAttendanceIds);
    console.log('批量删除考勤结果:', success);
    
    if (success) {
      toast.success(`成功删除 ${selectedAttendanceIds.length} 条记录`);
      setSelectedAttendanceIds([]);
      loadData();
    } else {
      toast.error('批量删除失败');
    }
  };

  // 批量撤回考勤签署记录
  const handleBatchRevokeAttendance = async () => {
    console.log('批量撤回考勤被调用，选中的ID:', selectedAttendanceIds);
    
    if (selectedAttendanceIds.length === 0) {
      toast.error('请先选择要撤回的记录');
      return;
    }

    if (!window.confirm(`确定要撤回选中的 ${selectedAttendanceIds.length} 条记录吗？`)) {
      return;
    }

    console.log('开始批量撤回考勤...');
    const success = await revokeAttendanceSignaturesBatch(selectedAttendanceIds);
    console.log('批量撤回考勤结果:', success);
    
    if (success) {
      toast.success(`成功撤回 ${selectedAttendanceIds.length} 条记录`);
      setSelectedAttendanceIds([]);
      loadData();
    } else {
      toast.error('批量撤回失败');
    }
  };

  // 薪酬签署全选/取消全选
  const handleSelectAllSalary = (checked: boolean | "indeterminate") => {
    console.log('薪酬全选被调用，checked:', checked, '当前页记录数:', paginatedSalarySignatures.length);
    if (checked === true) {
      const ids = paginatedSalarySignatures.map(s => s.id);
      console.log('全选ID列表:', ids);
      setSelectedSalaryIds(ids);
    } else {
      console.log('取消全选');
      setSelectedSalaryIds([]);
    }
  };

  // 薪酬签署单选
  const handleSelectSalary = (id: string, checked: boolean | "indeterminate") => {
    console.log('薪酬单选被调用，id:', id, 'checked:', checked);
    if (checked === true) {
      setSelectedSalaryIds([...selectedSalaryIds, id]);
    } else {
      setSelectedSalaryIds(selectedSalaryIds.filter(sid => sid !== id));
    }
  };

  // 考勤签署全选/取消全选
  const handleSelectAllAttendance = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedAttendanceIds(paginatedAttendanceSignatures.map(s => s.id));
    } else {
      setSelectedAttendanceIds([]);
    }
  };

  // 考勤签署单选
  const handleSelectAttendance = (id: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedAttendanceIds([...selectedAttendanceIds, id]);
    } else {
      setSelectedAttendanceIds(selectedAttendanceIds.filter(sid => sid !== id));
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

  // 统计数据
  const salaryStats = {
    total: filteredSalarySignatures.length,
    pending: filteredSalarySignatures.filter(s => s.status === 'pending').length,
    sent: filteredSalarySignatures.filter(s => s.status === 'sent').length,
    signed: filteredSalarySignatures.filter(s => s.status === 'signed').length,
    rejected: filteredSalarySignatures.filter(s => s.status === 'rejected').length,
    revoked: filteredSalarySignatures.filter(s => s.status === 'revoked').length
  };

  const attendanceStats = {
    total: filteredAttendanceSignatures.length,
    pending: filteredAttendanceSignatures.filter(s => s.status === 'pending').length,
    sent: filteredAttendanceSignatures.filter(s => s.status === 'sent').length,
    signed: filteredAttendanceSignatures.filter(s => s.status === 'signed').length,
    rejected: filteredAttendanceSignatures.filter(s => s.status === 'rejected').length,
    revoked: filteredAttendanceSignatures.filter(s => s.status === 'revoked').length
  };

  // 分页计算
  const salaryTotalPages = Math.ceil(filteredSalarySignatures.length / pageSize);
  const salaryStartIndex = (salaryCurrentPage - 1) * pageSize;
  const salaryEndIndex = salaryStartIndex + pageSize;
  const paginatedSalarySignatures = filteredSalarySignatures.slice(salaryStartIndex, salaryEndIndex);

  const attendanceTotalPages = Math.ceil(filteredAttendanceSignatures.length / pageSize);
  const attendanceStartIndex = (attendanceCurrentPage - 1) * pageSize;
  const attendanceEndIndex = attendanceStartIndex + pageSize;
  const paginatedAttendanceSignatures = filteredAttendanceSignatures.slice(attendanceStartIndex, attendanceEndIndex);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">薪酬签署状态</h1>
          <p className="text-muted-foreground mt-2">
            查看和管理薪酬相关签署的状态统计
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>签署状态统计</CardTitle>
              <CompanySelector
                companies={companies}
                value={selectedCompanyId}
                onValueChange={setSelectedCompanyId}
              />
            </div>
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
                  {/* 统计卡片 */}
                  <div className="grid grid-cols-6 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          总计
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{salaryStats.total}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          待签署
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{salaryStats.pending}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          已发送
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{salaryStats.sent}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          已签署
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{salaryStats.signed}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          已拒签
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{salaryStats.rejected}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          已撤回
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{salaryStats.revoked}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 批量操作按钮 */}
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDeleteSalary}
                      disabled={selectedSalaryIds.length === 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      批量删除 {selectedSalaryIds.length > 0 && `(${selectedSalaryIds.length})`}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleBatchRevokeSalary}
                      disabled={selectedSalaryIds.length === 0}
                    >
                      <Undo2 className="mr-2 h-4 w-4" />
                      批量撤回 {selectedSalaryIds.length > 0 && `(${selectedSalaryIds.length})`}
                    </Button>
                  </div>

                  {/* 签署记录列表 */}
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                paginatedSalarySignatures.length > 0 &&
                                paginatedSalarySignatures.every(s => selectedSalaryIds.includes(s.id))
                              }
                              onCheckedChange={handleSelectAllSalary}
                            />
                          </TableHead>
                          <TableHead className="whitespace-nowrap">公司名称</TableHead>
                          <TableHead className="whitespace-nowrap">员工姓名</TableHead>
                          <TableHead className="whitespace-nowrap">类型</TableHead>
                          <TableHead className="whitespace-nowrap">年月</TableHead>
                          <TableHead className="whitespace-nowrap">状态</TableHead>
                          <TableHead className="whitespace-nowrap">发送时间</TableHead>
                          <TableHead className="whitespace-nowrap">签署时间</TableHead>
                          <TableHead className="text-right whitespace-nowrap">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedSalarySignatures.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center text-muted-foreground">
                              暂无签署记录
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedSalarySignatures.map((signature) => (
                            <TableRow key={signature.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedSalaryIds.includes(signature.id)}
                                  onCheckedChange={(checked) => handleSelectSalary(signature.id, checked)}
                                />
                              </TableCell>
                              <TableCell className="font-medium whitespace-nowrap">
                                {signature.company?.name || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.employee?.name || '-'}
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
                                {signature.signed_at
                                  ? new Date(signature.signed_at).toLocaleString('zh-CN')
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                  {signature.status === 'pending' && (
                                    <>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleSendSMS(signature)}
                                        disabled={sendingIds.has(signature.id)}
                                      >
                                        <Send className="h-4 w-4 mr-1" />
                                        {sendingIds.has(signature.id) ? '发送中...' : '立即签署'}
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleRevoke(signature)}
                                      >
                                        撤回
                                      </Button>
                                    </>
                                  )}
                                  {signature.status === 'sent' && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSendSMS(signature)}
                                        disabled={sendingIds.has(signature.id)}
                                      >
                                        <Send className="h-4 w-4 mr-1" />
                                        {sendingIds.has(signature.id) ? '发送中...' : '重新发送'}
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleRevoke(signature)}
                                      >
                                        撤回
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteSalarySignature(signature.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    删除
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 分页 */}
                  {salaryTotalPages > 1 && (
                    <div className="flex justify-center mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setSalaryCurrentPage(Math.max(1, salaryCurrentPage - 1))}
                              className={salaryCurrentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {Array.from({ length: salaryTotalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setSalaryCurrentPage(page)}
                                isActive={page === salaryCurrentPage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setSalaryCurrentPage(Math.min(salaryTotalPages, salaryCurrentPage + 1))}
                              className={salaryCurrentPage === salaryTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  {/* 统计卡片 */}
                  <div className="grid grid-cols-6 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          总计
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{attendanceStats.total}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          待签署
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{attendanceStats.pending}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          已发送
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{attendanceStats.sent}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          已签署
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{attendanceStats.signed}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          已拒签
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{attendanceStats.rejected}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          已撤回
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{attendanceStats.revoked}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 批量操作按钮 */}
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDeleteAttendance}
                      disabled={selectedAttendanceIds.length === 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      批量删除 {selectedAttendanceIds.length > 0 && `(${selectedAttendanceIds.length})`}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleBatchRevokeAttendance}
                      disabled={selectedAttendanceIds.length === 0}
                    >
                      <Undo2 className="mr-2 h-4 w-4" />
                      批量撤回 {selectedAttendanceIds.length > 0 && `(${selectedAttendanceIds.length})`}
                    </Button>
                  </div>

                  {/* 签署记录列表 */}
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                paginatedAttendanceSignatures.length > 0 &&
                                paginatedAttendanceSignatures.every(s => selectedAttendanceIds.includes(s.id))
                              }
                              onCheckedChange={handleSelectAllAttendance}
                            />
                          </TableHead>
                          <TableHead className="whitespace-nowrap">公司名称</TableHead>
                          <TableHead className="whitespace-nowrap">员工姓名</TableHead>
                          <TableHead className="whitespace-nowrap">年月</TableHead>
                          <TableHead className="whitespace-nowrap">状态</TableHead>
                          <TableHead className="whitespace-nowrap">发送时间</TableHead>
                          <TableHead className="whitespace-nowrap">签署时间</TableHead>
                          <TableHead className="text-right whitespace-nowrap">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedAttendanceSignatures.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground">
                              暂无签署记录
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedAttendanceSignatures.map((signature) => (
                            <TableRow key={signature.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedAttendanceIds.includes(signature.id)}
                                  onCheckedChange={(checked) => handleSelectAttendance(signature.id, checked)}
                                />
                              </TableCell>
                              <TableCell className="font-medium whitespace-nowrap">
                                {signature.company?.name || '-'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.employee?.name || '-'}
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
                                {signature.signed_at
                                  ? new Date(signature.signed_at).toLocaleString('zh-CN')
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAttendanceSignature(signature.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  删除
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 分页 */}
                  {attendanceTotalPages > 1 && (
                    <div className="flex justify-center mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setAttendanceCurrentPage(Math.max(1, attendanceCurrentPage - 1))}
                              className={attendanceCurrentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {Array.from({ length: attendanceTotalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setAttendanceCurrentPage(page)}
                                isActive={page === attendanceCurrentPage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setAttendanceCurrentPage(Math.min(attendanceTotalPages, attendanceCurrentPage + 1))}
                              className={attendanceCurrentPage === attendanceTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
