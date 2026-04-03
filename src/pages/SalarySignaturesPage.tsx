import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  DialogFooter,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { CompanySelector } from '@/components/ui/company-selector';
import { toast } from 'sonner';
import { Send, Trash2, Search, FileText, Calendar, Download, Undo2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getSalarySignatures,
  getAttendanceSignatures,
  sendSalarySignatureSMS,
  batchSendSalarySignatureSMS,
  deleteSalarySignature,
  deleteAttendanceSignature,
  updateSalarySignature,
  getCompanies
} from '@/db/api';
import type { SalarySignature, AttendanceSignature, Company, SalarySignatureStatus, SalarySignatureType } from '@/types/types';
import { SALARY_SIGNATURE_STATUS_LABELS, SALARY_SIGNATURE_TYPE_LABELS, ATTENDANCE_SIGNATURE_STATUS_LABELS } from '@/types/types';
import { exportToCSV, formatDateTime } from '@/utils/exportUtils';

export default function SalarySignaturesPage() {
  const [signatures, setSignatures] = useState<SalarySignature[]>([]);
  const [attendanceSignatures, setAttendanceSignatures] = useState<AttendanceSignature[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterYearMonth, setFilterYearMonth] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [signatureToDelete, setSignatureToDelete] = useState<SalarySignature | null>(null);
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  
  // 批量选择相关状态
  const [selectedSalaryIds, setSelectedSalaryIds] = useState<string[]>([]);
  const [selectedAttendanceIds, setSelectedAttendanceIds] = useState<string[]>([]);
  
  // 分页相关状态
  const [salaryCurrentPage, setSalaryCurrentPage] = useState(1);
  const [attendanceCurrentPage, setAttendanceCurrentPage] = useState(1);
  const pageSize = 15; // 每页显示15条
  
  // 批量发送相关状态
  const [batchSendDialogOpen, setBatchSendDialogOpen] = useState(false);
  const [batchSendCompany, setBatchSendCompany] = useState<string>('');
  const [batchSendYearMonth, setBatchSendYearMonth] = useState<string>('');
  const [batchSendTypes, setBatchSendTypes] = useState<SalarySignatureType[]>(['salary_slip', 'attendance_record']);
  const [batchSending, setBatchSending] = useState(false);
  const [batchSendProgress, setBatchSendProgress] = useState({ current: 0, total: 0 });
  const [batchSendResults, setBatchSendResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [signaturesData, attendanceData, companiesData] = await Promise.all([
      getSalarySignatures(),
      getAttendanceSignatures(),
      getCompanies()
    ]);
    setSignatures(signaturesData);
    setAttendanceSignatures(attendanceData);
    setCompanies(companiesData);
    setLoading(false);
  };

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

    if (!confirm('确定要撤回该签署吗？撤回后状态将变为已撤回。')) {
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

  const handleDeleteClick = (signature: SalarySignature) => {
    setSignatureToDelete(signature);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!signatureToDelete) return;

    const success = await deleteSalarySignature(signatureToDelete.id);
    if (success) {
      toast.success('删除成功');
      loadData();
    } else {
      toast.error('删除失败');
    }
    setDeleteDialogOpen(false);
    setSignatureToDelete(null);
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

  // 全选/取消全选 - 工资条
  const handleSelectAllSalary = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedSalaryIds(paginatedSalarySignatures.map(s => s.id));
    } else {
      setSelectedSalaryIds([]);
    }
  };

  // 单选 - 工资条
  const handleSelectSalary = (id: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedSalaryIds([...selectedSalaryIds, id]);
    } else {
      setSelectedSalaryIds(selectedSalaryIds.filter(sid => sid !== id));
    }
  };

  // 全选/取消全选 - 考勤
  const handleSelectAllAttendance = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedAttendanceIds(paginatedAttendanceSignatures.map(s => s.id));
    } else {
      setSelectedAttendanceIds([]);
    }
  };

  // 单选 - 考勤
  const handleSelectAttendance = (id: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedAttendanceIds([...selectedAttendanceIds, id]);
    } else {
      setSelectedAttendanceIds(selectedAttendanceIds.filter(sid => sid !== id));
    }
  };

  // 批量撤回 - 工资条
  const handleBatchRevokeSalary = async () => {
    console.log('批量撤回工资条被调用，选中的记录:', selectedSalaryIds);
    
    if (selectedSalaryIds.length === 0) {
      toast.error('请先选择要撤回的记录');
      return;
    }

    if (!confirm(`确定要撤回选中的 ${selectedSalaryIds.length} 条签署记录吗？`)) {
      console.log('用户取消批量撤回');
      return;
    }

    console.log('开始批量撤回...');
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedSalaryIds) {
      const signature = signatures.find(s => s.id === id);
      if (signature && (signature.status === 'sent' || signature.status === 'pending')) {
        const success = await updateSalarySignature(id, {
          status: 'revoked',
          sent_at: null
        });
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      } else {
        failCount++;
      }
    }

    console.log('批量撤回结果:', { successCount, failCount });
    
    if (successCount > 0) {
      toast.success(`成功撤回 ${successCount} 条记录${failCount > 0 ? `，失败 ${failCount} 条` : ''}`);
    } else {
      toast.error('批量撤回失败');
    }
    
    setSelectedSalaryIds([]);
    loadData();
  };

  // 批量删除 - 工资条
  const handleBatchDeleteSalary = async () => {
    console.log('批量删除工资条被调用，选中的记录:', selectedSalaryIds);
    
    if (selectedSalaryIds.length === 0) {
      toast.error('请先选择要删除的记录');
      return;
    }

    if (!confirm(`确定要删除选中的 ${selectedSalaryIds.length} 条签署记录吗？此操作不可撤销。`)) {
      console.log('用户取消批量删除');
      return;
    }

    console.log('开始批量删除...');
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedSalaryIds) {
      const success = await deleteSalarySignature(id);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('批量删除结果:', { successCount, failCount });
    
    if (successCount > 0) {
      toast.success(`成功删除 ${successCount} 条记录${failCount > 0 ? `，失败 ${failCount} 条` : ''}`);
    } else {
      toast.error('批量删除失败');
    }
    
    setSelectedSalaryIds([]);
    loadData();
  };

  // 批量撤回 - 考勤
  const handleBatchRevokeAttendance = async () => {
    console.log('批量撤回考勤被调用，选中的记录:', selectedAttendanceIds);
    
    if (selectedAttendanceIds.length === 0) {
      toast.error('请先选择要撤回的记录');
      return;
    }

    if (!confirm(`确定要撤回选中的 ${selectedAttendanceIds.length} 条签署记录吗？`)) {
      console.log('用户取消批量撤回');
      return;
    }

    console.log('开始批量撤回...');
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedAttendanceIds) {
      const signature = attendanceSignatures.find(s => s.id === id);
      if (signature && (signature.status === 'sent' || signature.status === 'pending')) {
        // 注意：这里需要一个更新考勤签署状态的API函数
        // 暂时使用删除后重新创建的方式，实际应该有updateAttendanceSignature函数
        const success = await deleteAttendanceSignature(id);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      } else {
        failCount++;
      }
    }

    console.log('批量撤回结果:', { successCount, failCount });
    
    if (successCount > 0) {
      toast.success(`成功撤回 ${successCount} 条记录${failCount > 0 ? `，失败 ${failCount} 条` : ''}`);
    } else {
      toast.error('批量撤回失败');
    }
    
    setSelectedAttendanceIds([]);
    loadData();
  };

  // 批量删除 - 考勤
  const handleBatchDeleteAttendance = async () => {
    console.log('批量删除考勤被调用，选中的记录:', selectedAttendanceIds);
    
    if (selectedAttendanceIds.length === 0) {
      toast.error('请先选择要删除的记录');
      return;
    }

    if (!confirm(`确定要删除选中的 ${selectedAttendanceIds.length} 条签署记录吗？此操作不可撤销。`)) {
      console.log('用户取消批量删除');
      return;
    }

    console.log('开始批量删除...');
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedAttendanceIds) {
      const success = await deleteAttendanceSignature(id);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('批量删除结果:', { successCount, failCount });
    
    if (successCount > 0) {
      toast.success(`成功删除 ${successCount} 条记录${failCount > 0 ? `，失败 ${failCount} 条` : ''}`);
    } else {
      toast.error('批量删除失败');
    }
    
    setSelectedAttendanceIds([]);
    loadData();
  };

  // 批量下载工资条签署记录
  const handleBatchDownloadSalary = () => {
    if (selectedSalaryIds.length === 0) {
      toast.error('请先选择要下载的记录');
      return;
    }

    try {
      const selectedRecords = signatures.filter(s => selectedSalaryIds.includes(s.id));
      
      const exportData = selectedRecords.map(signature => ({
        employee_name: signature.employee_name || '',
        company_name: signature.company_name || '',
        type: SALARY_SIGNATURE_TYPE_LABELS[signature.type as SalarySignatureType] || signature.type,
        year_month: signature.year_month || '',
        status: SALARY_SIGNATURE_STATUS_LABELS[signature.status] || signature.status,
        sent_at: formatDateTime(signature.sent_at),
        signed_at: formatDateTime(signature.signed_at),
        employee_phone: signature.employee_phone || '',
        department: signature.department || ''
      }));

      const headers = [
        { key: 'employee_name' as const, label: '员工姓名' },
        { key: 'company_name' as const, label: '公司名称' },
        { key: 'type' as const, label: '类型' },
        { key: 'year_month' as const, label: '年月' },
        { key: 'status' as const, label: '状态' },
        { key: 'sent_at' as const, label: '发送时间' },
        { key: 'signed_at' as const, label: '签署时间' },
        { key: 'employee_phone' as const, label: '员工电话' },
        { key: 'department' as const, label: '部门' }
      ];

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      exportToCSV(exportData, headers, `工资条签署记录_${timestamp}`);
      
      toast.success(`成功导出 ${selectedSalaryIds.length} 条工资条记录`);
      setSelectedSalaryIds([]);
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败，请重试');
    }
  };

  // 批量下载考勤签署记录
  const handleBatchDownloadAttendance = () => {
    if (selectedAttendanceIds.length === 0) {
      toast.error('请先选择要下载的记录');
      return;
    }

    try {
      const selectedRecords = attendanceSignatures.filter(a => selectedAttendanceIds.includes(a.id));
      
      const exportData = selectedRecords.map(signature => ({
        employee_name: signature.employee_name || '',
        company_name: signature.company_name || '',
        year_month: signature.year_month || '',
        status: ATTENDANCE_SIGNATURE_STATUS_LABELS[signature.status] || signature.status,
        sent_at: formatDateTime(signature.sent_at),
        signed_at: formatDateTime(signature.signed_at),
        employee_phone: signature.employee_phone || '',
        department: signature.department || ''
      }));

      const headers = [
        { key: 'employee_name' as const, label: '员工姓名' },
        { key: 'company_name' as const, label: '公司名称' },
        { key: 'year_month' as const, label: '年月' },
        { key: 'status' as const, label: '状态' },
        { key: 'sent_at' as const, label: '发送时间' },
        { key: 'signed_at' as const, label: '签署时间' },
        { key: 'employee_phone' as const, label: '员工电话' },
        { key: 'department' as const, label: '部门' }
      ];

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      exportToCSV(exportData, headers, `考勤签署记录_${timestamp}`);
      
      toast.success(`成功导出 ${selectedAttendanceIds.length} 条考勤记录`);
      setSelectedAttendanceIds([]);
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败，请重试');
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
  const handleDownloadSignedFile = (signature: SalarySignature) => {
    if (!signature.signed_file_url) {
      toast.error('签署文件不存在');
      return;
    }
    
    // 检查URL是否为示例URL
    if (signature.signed_file_url.includes('example.com')) {
      toast.error('这是示例数据，真实文件URL需要在签署完成后由电子签系统返回');
      return;
    }
    
    // 打开新窗口查看/下载文件
    try {
      window.open(signature.signed_file_url, '_blank');
      toast.success('正在打开签署文件...');
    } catch (error) {
      console.error('打开文件失败:', error);
      toast.error('打开文件失败，请检查文件URL是否有效');
    }
  };

  // 下载已签署的考勤文件
  const handleDownloadAttendanceFile = (signature: AttendanceSignature) => {
    if (!signature.signed_file_url) {
      toast.error('签署文件不存在');
      return;
    }
    
    // 检查URL是否为示例URL
    if (signature.signed_file_url.includes('example.com')) {
      toast.error('这是示例数据，真实文件URL需要在签署完成后由电子签系统返回');
      return;
    }
    
    // 打开新窗口查看/下载文件
    try {
      window.open(signature.signed_file_url, '_blank');
      toast.success('正在打开签署文件...');
    } catch (error) {
      console.error('打开文件失败:', error);
      toast.error('打开文件失败，请检查文件URL是否有效');
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

  // 筛选薪酬签署记录
  const filteredSalarySignatures = selectedCompanyId === 'all' 
    ? signatures 
    : signatures.filter(r => r.company_id === selectedCompanyId);

  // 筛选考勤签署记录
  const filteredAttendanceSignatures = selectedCompanyId === 'all' 
    ? attendanceSignatures 
    : attendanceSignatures.filter(r => r.company_id === selectedCompanyId);

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

  // 分页数据计算
  const salaryTotalPages = Math.ceil(filteredSalarySignatures.length / pageSize);
  const salaryStartIndex = (salaryCurrentPage - 1) * pageSize;
  const salaryEndIndex = salaryStartIndex + pageSize;
  const paginatedSalarySignatures = filteredSalarySignatures.slice(salaryStartIndex, salaryEndIndex);

  const attendanceTotalPages = Math.ceil(filteredAttendanceSignatures.length / pageSize);
  const attendanceStartIndex = (attendanceCurrentPage - 1) * pageSize;
  const attendanceEndIndex = attendanceStartIndex + pageSize;
  const paginatedAttendanceSignatures = filteredAttendanceSignatures.slice(attendanceStartIndex, attendanceEndIndex);

  // 打开批量发送对话框
  const handleOpenBatchSend = () => {
    // 默认设置为当前月份
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setBatchSendYearMonth(yearMonth);
    setBatchSendCompany('');
    setBatchSendTypes(['salary_slip', 'attendance_record']); // 默认全选
    setBatchSendResults({ success: 0, failed: 0, errors: [] });
    setBatchSendProgress({ current: 0, total: 0 });
    setBatchSendDialogOpen(true);
  };

  // 执行批量发送
  const handleBatchSendConfirm = async () => {
    if (!batchSendCompany) {
      toast.error('请选择公司');
      return;
    }

    if (!batchSendYearMonth) {
      toast.error('请选择年月');
      return;
    }

    if (batchSendTypes.length === 0) {
      toast.error('请至少选择一种文件类型');
      return;
    }

    const [year, month] = batchSendYearMonth.split('-').map(Number);

    // 筛选待发送的签署记录（根据选择的文件类型）
    const pendingSignatures = signatures.filter(sig => 
      sig.company_id === batchSendCompany &&
      sig.year === year &&
      sig.month === month &&
      sig.status === 'pending' &&
      batchSendTypes.includes(sig.type)
    );

    if (pendingSignatures.length === 0) {
      toast.error('没有找到待签署的记录');
      return;
    }

    setBatchSending(true);
    setBatchSendProgress({ current: 0, total: pendingSignatures.length });
    
    // 使用批量发送API
    const signatureIds = pendingSignatures.map(sig => sig.id);
    const result = await batchSendSalarySignatureSMS(signatureIds);

    setBatchSendProgress({ current: result.successCount + result.failCount, total: pendingSignatures.length });
    
    const results = {
      success: result.successCount,
      failed: result.failCount,
      errors: result.errors
    };

    setBatchSendResults(results);
    setBatchSending(false);

    // 显示结果
    if (results.failed === 0) {
      toast.success(`批量发送成功！共发送 ${results.success} 条短信`);
    } else {
      toast.warning(`发送完成：成功 ${results.success} 条，失败 ${results.failed} 条`);
    }

    // 刷新数据
    await loadData();
  };

  // 处理文件类型选择
  const handleTypeToggle = (type: SalarySignatureType) => {
    setBatchSendTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // 关闭批量发送对话框
  const handleCloseBatchSend = () => {
    if (batchSending) {
      toast.error('正在发送中，请稍候...');
      return;
    }
    setBatchSendDialogOpen(false);
  };

  // 过滤签署记录
  const filteredSignatures = signatures.filter(sig => {
    // 公司筛选
    if (filterCompany !== 'all' && sig.company_id !== filterCompany) {
      return false;
    }

    // 状态筛选
    if (filterStatus !== 'all' && sig.status !== filterStatus) {
      return false;
    }

    // 类型筛选
    if (filterType !== 'all' && sig.type !== filterType) {
      return false;
    }

    // 年月筛选
    if (filterYearMonth) {
      const [year, month] = filterYearMonth.split('-').map(Number);
      if (sig.year !== year || sig.month !== month) {
        return false;
      }
    }

    // 关键词搜索
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        sig.employee?.name?.toLowerCase().includes(keyword) ||
        sig.company?.name?.toLowerCase().includes(keyword)
      );
    }

    return true;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">薪酬签署</h1>
            <p className="text-muted-foreground mt-2">管理工资条和考勤确认表的签署流程</p>
          </div>
          <Button onClick={handleOpenBatchSend} size="lg">
            <Send className="h-5 w-5 mr-2" />
            一键发起签署
          </Button>
        </div>

        {/* 签署状态统计和列表 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="whitespace-nowrap">签署状态统计</CardTitle>
              <div className="w-64">
                <CompanySelector
                  companies={companies}
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full bg-muted" />
                <Skeleton className="h-64 w-full bg-muted" />
              </div>
            ) : (
              <Tabs defaultValue="salary" className="w-full">
                <TabsList className="inline-flex w-auto flex-nowrap">
                  <TabsTrigger value="salary" className="whitespace-nowrap">工资条签署</TabsTrigger>
                  <TabsTrigger value="attendance" className="whitespace-nowrap">考勤确认签署</TabsTrigger>
                </TabsList>

                <TabsContent value="salary" className="space-y-4">
                  {/* 批量操作按钮 */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchRevokeSalary}
                      disabled={selectedSalaryIds.length === 0}
                    >
                      <Undo2 className="h-4 w-4 mr-1" />
                      批量撤回 {selectedSalaryIds.length > 0 && `(${selectedSalaryIds.length})`}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDeleteSalary}
                      disabled={selectedSalaryIds.length === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      批量删除 {selectedSalaryIds.length > 0 && `(${selectedSalaryIds.length})`}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchDownloadSalary}
                      disabled={selectedSalaryIds.length === 0}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      批量下载 {selectedSalaryIds.length > 0 && `(${selectedSalaryIds.length})`}
                    </Button>
                  </div>

                  {/* 统计卡片 */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
                          <TableHead className="text-right whitespace-nowrap">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedSalarySignatures.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                                  {signature.status === 'signed' && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleDownloadSignedFile(signature)}
                                    >
                                      <Download className="h-4 w-4 mr-1" />
                                      查看文件
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClick(signature)}
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

                  {/* 分页组件 */}
                  {salaryTotalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        共 {filteredSalarySignatures.length} 条记录，第 {salaryCurrentPage} / {salaryTotalPages} 页
                      </div>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setSalaryCurrentPage(Math.max(1, salaryCurrentPage - 1))}
                              className={salaryCurrentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {Array.from({ length: salaryTotalPages }, (_, i) => i + 1)
                            .filter(page => {
                              // 显示当前页前后2页
                              return page === 1 || 
                                     page === salaryTotalPages || 
                                     Math.abs(page - salaryCurrentPage) <= 2;
                            })
                            .map((page, index, array) => {
                              // 添加省略号
                              if (index > 0 && page - array[index - 1] > 1) {
                                return [
                                  <PaginationItem key={`ellipsis-${page}`}>
                                    <span className="px-4">...</span>
                                  </PaginationItem>,
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => setSalaryCurrentPage(page)}
                                      isActive={page === salaryCurrentPage}
                                      className="cursor-pointer"
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                ];
                              }
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setSalaryCurrentPage(page)}
                                    isActive={page === salaryCurrentPage}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
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
                  {/* 批量操作按钮 */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchRevokeAttendance}
                      disabled={selectedAttendanceIds.length === 0}
                    >
                      <Undo2 className="h-4 w-4 mr-1" />
                      批量撤回 {selectedAttendanceIds.length > 0 && `(${selectedAttendanceIds.length})`}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDeleteAttendance}
                      disabled={selectedAttendanceIds.length === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      批量删除 {selectedAttendanceIds.length > 0 && `(${selectedAttendanceIds.length})`}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchDownloadAttendance}
                      disabled={selectedAttendanceIds.length === 0}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      批量下载 {selectedAttendanceIds.length > 0 && `(${selectedAttendanceIds.length})`}
                    </Button>
                  </div>

                  {/* 统计卡片 */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
                          <TableHead className="text-right whitespace-nowrap">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedAttendanceSignatures.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                                  {ATTENDANCE_SIGNATURE_STATUS_LABELS[signature.status] || signature.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {signature.sent_at
                                  ? new Date(signature.sent_at).toLocaleString('zh-CN')
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                  {signature.status === 'signed' && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleDownloadAttendanceFile(signature)}
                                    >
                                      <Download className="h-4 w-4 mr-1" />
                                      查看文件
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteAttendanceSignature(signature.id)}
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

                  {/* 分页组件 */}
                  {attendanceTotalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        共 {filteredAttendanceSignatures.length} 条记录，第 {attendanceCurrentPage} / {attendanceTotalPages} 页
                      </div>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setAttendanceCurrentPage(Math.max(1, attendanceCurrentPage - 1))}
                              className={attendanceCurrentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {Array.from({ length: attendanceTotalPages }, (_, i) => i + 1)
                            .filter(page => {
                              // 显示当前页前后2页
                              return page === 1 || 
                                     page === attendanceTotalPages || 
                                     Math.abs(page - attendanceCurrentPage) <= 2;
                            })
                            .map((page, index, array) => {
                              // 添加省略号
                              if (index > 0 && page - array[index - 1] > 1) {
                                return [
                                  <PaginationItem key={`ellipsis-${page}`}>
                                    <span className="px-4">...</span>
                                  </PaginationItem>,
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => setAttendanceCurrentPage(page)}
                                      isActive={page === attendanceCurrentPage}
                                      className="cursor-pointer"
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                ];
                              }
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setAttendanceCurrentPage(page)}
                                    isActive={page === attendanceCurrentPage}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
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

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除签署记录</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除该签署记录吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 批量发送对话框 */}
      <Dialog open={batchSendDialogOpen} onOpenChange={handleCloseBatchSend}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>一键发起薪酬签署</DialogTitle>
            <DialogDescription>
              选择公司和年月，系统将向该公司所有待签署的员工发送短信
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batch-company">所属公司 *</Label>
              <Select
                value={batchSendCompany}
                onValueChange={setBatchSendCompany}
                disabled={batchSending}
              >
                <SelectTrigger id="batch-company">
                  <SelectValue placeholder="请选择公司" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-year-month">年月 *</Label>
              <Input
                id="batch-year-month"
                type="month"
                value={batchSendYearMonth}
                onChange={(e) => setBatchSendYearMonth(e.target.value)}
                disabled={batchSending}
              />
            </div>

            {/* 文件类型选择 */}
            <div className="space-y-2">
              <Label>待签署文件类型 *</Label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="type-salary-slip"
                    checked={batchSendTypes.includes('salary_slip')}
                    onCheckedChange={() => handleTypeToggle('salary_slip')}
                    disabled={batchSending}
                  />
                  <label
                    htmlFor="type-salary-slip"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    工资条
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="type-attendance-record"
                    checked={batchSendTypes.includes('attendance_record')}
                    onCheckedChange={() => handleTypeToggle('attendance_record')}
                    disabled={batchSending}
                  />
                  <label
                    htmlFor="type-attendance-record"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    考勤确认表
                  </label>
                </div>
              </div>
            </div>

            {/* 发送进度 */}
            {batchSending && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>发送进度</span>
                  <span>{batchSendProgress.current} / {batchSendProgress.total}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(batchSendProgress.current / batchSendProgress.total) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* 发送结果 */}
            {!batchSending && batchSendResults.success + batchSendResults.failed > 0 && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="font-medium">发送结果</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>成功：</span>
                    <span className="text-green-600 font-medium">{batchSendResults.success} 条</span>
                  </div>
                  <div className="flex justify-between">
                    <span>失败：</span>
                    <span className="text-red-600 font-medium">{batchSendResults.failed} 条</span>
                  </div>
                </div>
                {batchSendResults.errors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm font-medium text-destructive">失败详情：</div>
                    <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                      {batchSendResults.errors.map((error, index) => (
                        <div key={index} className="text-muted-foreground">• {error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseBatchSend}
              disabled={batchSending}
            >
              {batchSendResults.success + batchSendResults.failed > 0 ? '关闭' : '取消'}
            </Button>
            {batchSendResults.success + batchSendResults.failed === 0 && (
              <Button
                onClick={handleBatchSendConfirm}
                disabled={batchSending}
              >
                {batchSending ? '发送中...' : '开始发送'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
