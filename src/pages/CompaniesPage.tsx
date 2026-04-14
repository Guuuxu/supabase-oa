import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getCompanies, createCompany, updateCompany, deleteCompany, generateCompanyCode, transferCompany, getCompanyTransferHistory, getAllProfiles } from '@/db/api';
import type { Company, CompanyTransfer, Profile } from '@/types/types';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Users, FileCheck, UserMinus, Search, ArrowRightLeft, History, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { exportToCSV, formatDate } from '@/utils/exportUtils';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

export default function CompaniesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [expiringFilter, setExpiringFilter] = useState<number>(0);
  const [expiredFilter, setExpiredFilter] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  
  // 流转相关状态
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferringCompany, setTransferringCompany] = useState<Company | null>(null);
  const [transferToUserId, setTransferToUserId] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [transferHistory, setTransferHistory] = useState<CompanyTransfer[]>([]);
  const [viewingHistoryCompany, setViewingHistoryCompany] = useState<Company | null>(null);
  
  // 用户筛选状态
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  // 批量选择状态
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  
  // 工商信息查询状态
  const [queryingCompanyInfo, setQueryingCompanyInfo] = useState(false);
  
  // 分页Hook
  const pagination = usePagination(filteredCompanies, 15);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credit_no: '', // 统一社会信用代码
    legal_person: '', // 法定代表人
    contact_person: '',
    contact_phone: '',
    address: '',
    service_start_date: '',
    service_end_date: '',
    service_status: '服务中',
    industry: '其他',
    region: '武汉市',
    employee_scale: '小于10人',
    payday_date: null as number | null
  });

  useEffect(() => {
    loadCompanies();
    loadAllUsers(); // 加载所有用户用于流转
    // 处理URL参数
    const expiring = searchParams.get('expiring');
    const expired = searchParams.get('expired');
    if (expiring) {
      setExpiringFilter(parseInt(expiring));
    }
    if (expired === 'true') {
      setExpiredFilter(true);
    }
  }, [searchParams]);

  useEffect(() => {
    // 搜索和URL参数过滤
    let filtered = [...companies];

    // 搜索关键词过滤
    if (searchKeyword.trim() !== '') {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(keyword) ||
          company.code.toLowerCase().includes(keyword)
      );
    }

    // 用户筛选
    if (selectedUserId) {
      filtered = filtered.filter(company => company.owner_id === selectedUserId);
    }

    // 即将到期公司筛选
    if (expiringFilter > 0) {
      filtered = filtered.filter(company => {
        if (!company.service_end_date || company.service_status === '已暂停') return false;
        const end = new Date(company.service_end_date);
        const now = new Date();
        const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= expiringFilter && diffDays >= 0;
      });
    }

    // 已到期公司筛选
    if (expiredFilter) {
      filtered = filtered.filter(company => {
        if (!company.service_end_date || company.service_status === '已暂停') return false;
        const end = new Date(company.service_end_date);
        const now = new Date();
        return end < now;
      });
    }

    setFilteredCompanies(filtered);
  }, [searchKeyword, companies, expiringFilter, expiredFilter, selectedUserId]);

  const loadCompanies = async () => {
    setLoading(true);
    const data = await getCompanies();
    setCompanies(data);
    setFilteredCompanies(data);
    setLoading(false);
  };

  // 加载所有用户
  const loadAllUsers = async () => {
    const users = await getAllProfiles();
    setAllUsers(users);
  };

  // 点击用户名筛选该用户的公司
  const handleFilterByUser = (userId: string) => {
    if (selectedUserId === userId) {
      // 如果已经选中该用户，则取消筛选
      setSelectedUserId('');
      toast.info('已取消用户筛选');
    } else {
      setSelectedUserId(userId);
      const user = allUsers.find(u => u.id === userId);
      toast.success(`正在显示 ${user?.full_name || user?.username || '该用户'} 的公司`);
    }
  };

  // 获取用户显示名称
  const getUserDisplayName = (userId: string): string => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return '未知用户';
    const displayName = user.full_name || user.username;
    return displayName ? String(displayName) : '未知用户';
  };

  // 打开流转对话框
  const handleOpenTransferDialog = (company: Company) => {
    setTransferringCompany(company);
    setTransferToUserId('');
    setTransferReason('');
    setTransferDialogOpen(true);
  };

  // 执行流转
  const handleTransfer = async () => {
    if (!transferringCompany || !transferToUserId) {
      toast.error('请选择目标用户');
      return;
    }

    try {
      setSubmitting(true);
      await transferCompany(transferringCompany.id, transferToUserId, transferReason);
      toast.success('公司流转成功');
      setTransferDialogOpen(false);
      loadCompanies(); // 重新加载公司列表
    } catch (error: unknown) {
      console.error('流转公司失败:', error);
      const errorMessage = error instanceof Error ? error.message : '流转失败';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // 查看流转历史
  const handleViewHistory = async (company: Company) => {
    setViewingHistoryCompany(company);
    const history = await getCompanyTransferHistory(company.id);
    setTransferHistory(history);
    setHistoryDialogOpen(true);
  };

  // 跳转到员工管理页面，筛选该公司的在职员工
  const handleNavigateToEmployees = (companyId: string, status: string = 'active') => {
    navigate(`/employees?company_id=${companyId}&status=${status}`);
  };

  // 跳转到签署情况页面，查看该公司已签署的员工
  const handleNavigateToSigningStatus = (companyId: string) => {
    navigate(`/signing-status?company_id=${companyId}&status=completed`);
  };

  // 查询企业工商信息
  const handleQueryCompanyInfo = async () => {
    if (!formData.name.trim()) {
      toast.error('请先输入公司名称');
      return;
    }

    setQueryingCompanyInfo(true);
    try {
      const { supabase } = await import('@/db/supabase');
      
      const fnQuery = new URLSearchParams({ keyword: formData.name.trim() });
      const response = await supabase.functions.invoke(`query-company-info?${fnQuery.toString()}`, {
        method: 'GET',
      });

      if (response.error) {
        const errorMsg = await response.error?.context?.text?.() || response.error.message;
        console.error('查询企业工商信息失败:', errorMsg);
        toast.error(errorMsg || '查询失败，请检查公司名称是否正确');
        return;
      }

      if (response.data?.success && response.data?.data) {
        const companyInfo = response.data.data;
        
        console.log('查询到的企业信息:', companyInfo);
        console.log('地域信息:', companyInfo.region);
        console.log('行业信息:', companyInfo.industry);
        
        // 自动填充字段
        setFormData(prev => ({
          ...prev,
          credit_no: companyInfo.creditNo || prev.credit_no,
          legal_person: companyInfo.legalPerson || prev.legal_person,
          address: companyInfo.companyAddress || prev.address,
          region: companyInfo.region || prev.region,
          industry: companyInfo.industry || prev.industry
        }));

        toast.success('已自动填充企业工商信息（含行业和地域）');
      } else {
        const errorMsg = response.data?.error || '未找到该企业的工商信息';
        const suggestion = response.data?.suggestion || response.data?.details || '';
        toast.error(errorMsg + (suggestion ? '\n' + suggestion : ''));
      }
    } catch (error) {
      console.error('查询企业工商信息异常:', error);
      toast.error('查询失败，请稍后重试');
    } finally {
      setQueryingCompanyInfo(false);
    }
  };

  const handleOpenDialog = async (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setFormData({
        name: company.name,
        code: company.code,
        credit_no: company.credit_no || '',
        legal_person: company.legal_person || '',
        contact_person: company.contact_person || '',
        contact_phone: company.contact_phone || '',
        address: company.address || '',
        service_start_date: company.service_start_date || '',
        service_end_date: company.service_end_date || '',
        service_status: company.service_status || '服务中',
        industry: company.industry || '其他',
        region: company.region || '武汉市',
        employee_scale: company.employee_scale || '小于10人',
        payday_date: company.payday_date || 1
      });
    } else {
      setEditingCompany(null);
      // 自动生成公司编码
      const newCode = await generateCompanyCode();
      setFormData({
        name: '',
        code: newCode,
        credit_no: '',
        legal_person: '',
        contact_person: '',
        contact_phone: '',
        address: '',
        service_start_date: '',
        service_end_date: '',
        service_status: '服务中',
        industry: '其他',
        region: '武汉市',
        employee_scale: '小于10人',
        payday_date: 1 // 默认为每月1号
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证所有必填字段
    if (!formData.name || !formData.code || !formData.credit_no || 
        !formData.legal_person || !formData.contact_person || 
        !formData.contact_phone || !formData.address || 
        !formData.service_start_date || !formData.service_end_date || 
        !formData.payday_date) {
      toast.error('请填写所有必填字段');
      return;
    }

    // 验证发薪日期范围
    if (formData.payday_date < 1 || formData.payday_date > 31) {
      toast.error('发薪日期必须在1-31之间');
      return;
    }

    // 验证联系电话格式（简单验证：11位数字）
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.contact_phone)) {
      toast.error('请输入正确的手机号码格式');
      return;
    }

    if (submitting) {
      return; // 防止重复提交
    }

    setSubmitting(true);
    try {
      // 检查公司名称唯一性
      const existingByName = companies.find(
        c => c.name === formData.name && (!editingCompany || c.id !== editingCompany.id)
      );
      if (existingByName) {
        toast.error('公司名称已存在，请使用其他名称');
        setSubmitting(false);
        return;
      }

      // 检查联系电话唯一性
      const existingByPhone = companies.find(
        c => c.contact_phone === formData.contact_phone && (!editingCompany || c.id !== editingCompany.id)
      );
      if (existingByPhone) {
        toast.error('联系电话已被使用，请使用其他电话号码');
        setSubmitting(false);
        return;
      }

      if (editingCompany) {
        const success = await updateCompany(editingCompany.id, formData);
        if (success) {
          toast.success('更新成功');
          setDialogOpen(false);
          loadCompanies();
        } else {
          toast.error('更新失败，请检查控制台查看详细错误信息');
          console.error('更新公司失败，表单数据:', formData);
        }
      } else {
        const result = await createCompany(formData);
        if (result) {
          toast.success('创建成功');
          setDialogOpen(false);
          loadCompanies();
        } else {
          toast.error('创建失败，请检查控制台查看详细错误信息');
          console.error('创建公司失败，表单数据:', formData);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个公司吗？')) return;

    const success = await deleteCompany(id);
    if (success) {
      toast.success('删除成功');
      loadCompanies();
    } else {
      toast.error('删除失败');
    }
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedCompanyIds(filteredCompanies.map(c => c.id));
    } else {
      setSelectedCompanyIds([]);
    }
  };

  // 单选
  const handleSelectCompany = (id: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedCompanyIds([...selectedCompanyIds, id]);
    } else {
      setSelectedCompanyIds(selectedCompanyIds.filter(cid => cid !== id));
    }
  };

  // 批量下载
  const handleBatchDownload = () => {
    if (selectedCompanyIds.length === 0) {
      toast.error('请先选择要下载的公司');
      return;
    }

    try {
      const selectedCompanies = companies.filter(c => selectedCompanyIds.includes(c.id));
      
      const exportData = selectedCompanies.map(company => ({
        name: company.name,
        code: company.code,
        credit_no: company.credit_no || '',
        legal_person: company.legal_person || '',
        contact_person: company.contact_person || '',
        contact_phone: company.contact_phone || '',
        address: company.address || '',
        service_start_date: formatDate(company.service_start_date),
        service_end_date: formatDate(company.service_end_date),
        service_status: company.service_status,
        industry: company.industry || '',
        region: company.region || '',
        salary_payment_date: company.salary_payment_date || '',
        employee_count: company.employee_count || 0,
        signed_employee_count: company.signed_employee_count || 0,
        resigned_within_year_count: company.resigned_within_year_count || 0
      }));

      const headers = [
        { key: 'name' as const, label: '公司名称' },
        { key: 'code' as const, label: '公司编码' },
        { key: 'credit_no' as const, label: '统一社会信用代码' },
        { key: 'legal_person' as const, label: '法定代表人' },
        { key: 'contact_person' as const, label: '联系人' },
        { key: 'contact_phone' as const, label: '联系电话' },
        { key: 'address' as const, label: '地址' },
        { key: 'service_start_date' as const, label: '服务开始日期' },
        { key: 'service_end_date' as const, label: '服务结束日期' },
        { key: 'service_status' as const, label: '服务状态' },
        { key: 'industry' as const, label: '行业' },
        { key: 'region' as const, label: '地区' },
        { key: 'salary_payment_date' as const, label: '发薪日期' },
        { key: 'employee_count' as const, label: '在职员工数' },
        { key: 'signed_employee_count' as const, label: '已签署员工数' },
        { key: 'resigned_within_year_count' as const, label: '一年内离职数' }
      ];

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      exportToCSV(exportData, headers, `公司列表_${timestamp}`);
      
      toast.success(`成功导出 ${selectedCompanyIds.length} 条公司记录`);
      setSelectedCompanyIds([]);
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败，请重试');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">公司管理</h1>
            <p className="text-muted-foreground mt-2">管理系统中的公司信息</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                添加公司
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingCompany ? '编辑公司' : '添加公司'}</DialogTitle>
                  <DialogDescription>
                    {editingCompany ? '修改公司信息' : '创建新的公司'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-x-6 gap-y-3 py-4">
                  {/* 第一列 - 公司基本信息 */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm">公司名称 *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onBlur={handleQueryCompanyInfo}
                          placeholder="请输入公司名称"
                          required
                          className="h-9 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleQueryCompanyInfo}
                          disabled={queryingCompanyInfo || !formData.name.trim()}
                          className="h-9 shrink-0"
                        >
                          {queryingCompanyInfo ? '查询中...' : '查询'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        输入公司名称后自动查询工商信息
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="code" className="text-sm">公司编码 *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        placeholder="自动生成"
                        disabled
                        className="bg-muted h-9"
                      />
                      <p className="text-xs text-muted-foreground">
                        编码规则：年月日+3位序号
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="credit_no" className="text-sm">统一社会信用代码 *</Label>
                      <Input
                        id="credit_no"
                        value={formData.credit_no}
                        onChange={(e) => setFormData({ ...formData, credit_no: e.target.value })}
                        placeholder="请输入或自动查询"
                        required
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="legal_person" className="text-sm">法定代表人 *</Label>
                      <Input
                        id="legal_person"
                        value={formData.legal_person}
                        onChange={(e) => setFormData({ ...formData, legal_person: e.target.value })}
                        placeholder="请输入或自动查询"
                        required
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="industry" className="text-sm">所属行业 *</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => setFormData({ ...formData, industry: value })}
                      >
                        <SelectTrigger id="industry" className="h-9">
                          <SelectValue placeholder="请选择所属行业" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="制造业">制造业</SelectItem>
                          <SelectItem value="信息技术">信息技术</SelectItem>
                          <SelectItem value="金融服务">金融服务</SelectItem>
                          <SelectItem value="教育培训">教育培训</SelectItem>
                          <SelectItem value="医疗健康">医疗健康</SelectItem>
                          <SelectItem value="零售批发">零售批发</SelectItem>
                          <SelectItem value="建筑工程">建筑工程</SelectItem>
                          <SelectItem value="餐饮服务">餐饮服务</SelectItem>
                          <SelectItem value="物流运输">物流运输</SelectItem>
                          <SelectItem value="其他">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="employee_scale" className="text-sm">员工规模 *</Label>
                      <Select
                        value={formData.employee_scale}
                        onValueChange={(value) => setFormData({ ...formData, employee_scale: value })}
                      >
                        <SelectTrigger id="employee_scale" className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="小于10人">小于10人</SelectItem>
                          <SelectItem value="10-30人">10-30人</SelectItem>
                          <SelectItem value="30-50人">30-50人</SelectItem>
                          <SelectItem value="50-100人">50-100人</SelectItem>
                          <SelectItem value="大于100人">大于100人</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 第二列 - 服务相关信息 */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="service_start_date" className="text-sm">服务开始日期 *</Label>
                      <Input
                        id="service_start_date"
                        type="date"
                        value={formData.service_start_date}
                        onChange={(e) => setFormData({ ...formData, service_start_date: e.target.value })}
                        required
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="service_end_date" className="text-sm">服务结束日期 *</Label>
                      <Input
                        id="service_end_date"
                        type="date"
                        value={formData.service_end_date}
                        onChange={(e) => setFormData({ ...formData, service_end_date: e.target.value })}
                        required
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="service_status" className="text-sm">服务状态 *</Label>
                      <Select
                        value={formData.service_status}
                        onValueChange={(value) => setFormData({ ...formData, service_status: value })}
                      >
                        <SelectTrigger id="service_status" className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="服务中">服务中</SelectItem>
                          <SelectItem value="已到期">已到期</SelectItem>
                          <SelectItem value="已暂停">已暂停</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="payday_date" className="text-sm">发薪日期 *</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">每月</span>
                        <Input
                          id="payday_date"
                          type="number"
                          min="1"
                          max="31"
                          placeholder="1-31"
                          value={formData.payday_date || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              setFormData({ ...formData, payday_date: null });
                            } else {
                              const num = parseInt(value);
                              if (num >= 1 && num <= 31) {
                                setFormData({ ...formData, payday_date: num });
                              }
                            }
                          }}
                          className="w-20 h-9"
                          required
                        />
                        <span className="text-sm text-muted-foreground">号</span>
                      </div>
                      <p className="text-xs text-muted-foreground">设置每月固定发薪日期（1-31号）</p>
                    </div>
                  </div>

                  {/* 第三列 - 联系与地址信息 */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact_person" className="text-sm">联系人 *</Label>
                      <Input
                        id="contact_person"
                        value={formData.contact_person}
                        onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                        placeholder="请输入联系人"
                        required
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact_phone" className="text-sm">联系电话 *</Label>
                      <Input
                        id="contact_phone"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        placeholder="请输入联系电话"
                        required
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="region" className="text-sm">所在地域 *</Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) => setFormData({ ...formData, region: value })}
                      >
                        <SelectTrigger id="region" className="h-9">
                          <SelectValue placeholder="请选择所在地域" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="武汉市">武汉市</SelectItem>
                          <SelectItem value="襄阳市">襄阳市</SelectItem>
                          <SelectItem value="宜昌市">宜昌市</SelectItem>
                          <SelectItem value="十堰市">十堰市</SelectItem>
                          <SelectItem value="荆州市">荆州市</SelectItem>
                          <SelectItem value="黄冈市">黄冈市</SelectItem>
                          <SelectItem value="孝感市">孝感市</SelectItem>
                          <SelectItem value="黄石市">黄石市</SelectItem>
                          <SelectItem value="咸宁市">咸宁市</SelectItem>
                          <SelectItem value="随州市">随州市</SelectItem>
                          <SelectItem value="恩施州">恩施州</SelectItem>
                          <SelectItem value="荆门市">荆门市</SelectItem>
                          <SelectItem value="鄂州市">鄂州市</SelectItem>
                          <SelectItem value="仙桃市">仙桃市</SelectItem>
                          <SelectItem value="潜江市">潜江市</SelectItem>
                          <SelectItem value="天门市">天门市</SelectItem>
                          <SelectItem value="神农架林区">神农架林区</SelectItem>
                          <SelectItem value="北京市">北京市</SelectItem>
                          <SelectItem value="上海市">上海市</SelectItem>
                          <SelectItem value="广州市">广州市</SelectItem>
                          <SelectItem value="深圳市">深圳市</SelectItem>
                          <SelectItem value="成都市">成都市</SelectItem>
                          <SelectItem value="重庆市">重庆市</SelectItem>
                          <SelectItem value="杭州市">杭州市</SelectItem>
                          <SelectItem value="南京市">南京市</SelectItem>
                          <SelectItem value="苏州市">苏州市</SelectItem>
                          <SelectItem value="西安市">西安市</SelectItem>
                          <SelectItem value="郑州市">郑州市</SelectItem>
                          <SelectItem value="长沙市">长沙市</SelectItem>
                          <SelectItem value="合肥市">合肥市</SelectItem>
                          <SelectItem value="南昌市">南昌市</SelectItem>
                          <SelectItem value="其他">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-sm">地址 *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="请输入地址"
                        required
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                    取消
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? '提交中...' : (editingCompany ? '保存' : '创建')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* 流转对话框 */}
          <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>流转公司</DialogTitle>
                <DialogDescription>
                  将公司 "{transferringCompany?.name}" 流转给其他用户
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="transfer-user">目标用户 *</Label>
                  <Select value={transferToUserId} onValueChange={setTransferToUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择用户" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((user) => (
                        <SelectItem key={user.id as string} value={user.id as string}>
                          {(user.full_name || user.username) as string} ({user.username as string})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transfer-reason">流转原因（可选）</Label>
                  <textarea
                    id="transfer-reason"
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    placeholder="请输入流转原因..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleTransfer} disabled={submitting || !transferToUserId}>
                  {submitting ? '流转中...' : '确认流转'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 流转历史对话框 */}
          <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>流转历史</DialogTitle>
                <DialogDescription>
                  公司 "{viewingHistoryCompany?.name}" 的流转记录
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {transferHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    暂无流转记录
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transferHistory.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{record.from_full_name || record.from_username}</span>
                            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{record.to_full_name || record.to_username}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.created_at).toLocaleString('zh-CN')}
                          </span>
                        </div>
                        {record.reason && (
                          <div className="text-sm text-muted-foreground">
                            原因：{record.reason}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          操作人：{record.transferred_by_full_name || record.transferred_by_username}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setHistoryDialogOpen(false)}>关闭</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* 搜索框 */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索公司名称或编码..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-9"
            />
          </div>
          {searchKeyword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchKeyword('')}
            >
              清除
            </Button>
          )}
          {selectedUserId && (
            <Badge variant="secondary" className="px-3 py-1.5">
              筛选用户：{getUserDisplayName(selectedUserId)}
              <button
                className="ml-2 hover:text-destructive"
                onClick={() => setSelectedUserId('')}
              >
                ✕
              </button>
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>公司列表</CardTitle>
              <div className="flex items-center gap-2">
                {selectedCompanyIds.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchDownload}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    批量下载 ({selectedCompanyIds.length})
                  </Button>
                )}
                {searchKeyword && (
                  <span className="text-sm text-muted-foreground">
                    找到 {filteredCompanies.length} 个结果
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchKeyword || expiringFilter || expiredFilter ? '未找到符合条件的公司' : '暂无公司数据'}
              </div>
            ) : (
              <>
                <div className="min-w-[1340px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              filteredCompanies.length > 0 &&
                              filteredCompanies.every(c => selectedCompanyIds.includes(c.id))
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-[180px]">公司名称</TableHead>
                        <TableHead className="w-[120px]">公司编码</TableHead>
                        <TableHead className="w-[60px]">所属用户</TableHead>
                        <TableHead className="w-[80px] text-center">在职员工</TableHead>
                        <TableHead className="w-[90px] text-center">已签署员工</TableHead>
                        <TableHead className="w-[90px] text-center">一年内离职</TableHead>
                        <TableHead className="w-[160px]">服务日期</TableHead>
                        <TableHead className="w-[100px]">发薪日期</TableHead>
                        <TableHead className="w-[80px] text-center">服务状态</TableHead>
                        <TableHead className="w-[180px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.currentData.map((company) => (
                      <TableRow 
                        key={company.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleOpenDialog(company)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedCompanyIds.includes(company.id)}
                            onCheckedChange={(checked) => handleSelectCompany(company.id, checked)}
                          />
                        </TableCell>
                        <TableCell 
                          className="font-medium text-primary hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/companies/${company.id}`);
                          }}
                        >
                          {company.name}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{company.code}</TableCell>
                        <TableCell>
                          <button
                            className="text-sm text-primary hover:underline cursor-pointer font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFilterByUser(company.owner_id);
                            }}
                            title={`点击查看 ${getUserDisplayName(company.owner_id)} 的所有公司`}
                          >
                            {getUserDisplayName(company.owner_id)}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div 
                            className="flex items-center justify-center gap-1.5 cursor-pointer hover:text-primary transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToEmployees(company.id, 'active');
                            }}
                            title="点击查看该公司的在职员工"
                          >
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-semibold">{company.active_employees_count || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className="flex items-center justify-center gap-1.5 cursor-pointer hover:text-green-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToSigningStatus(company.id);
                            }}
                            title="点击查看该公司已签署的员工"
                          >
                            <FileCheck className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">{company.signed_employees_count || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className="flex items-center justify-center gap-1.5 cursor-pointer hover:text-orange-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToEmployees(company.id, 'resigned');
                            }}
                            title="点击查看该公司一年内离职的员工"
                          >
                            <UserMinus className="h-4 w-4 text-orange-600" />
                            <span className="font-semibold">{company.resigned_employees_count || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="text-sm">
                            {company.service_start_date || company.service_end_date ? (
                              <div className="space-y-0.5">
                                <div className="font-medium">{company.service_start_date || '未设置'}</div>
                                <div className="text-xs text-muted-foreground">至 {company.service_end_date || '未设置'}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">未设置</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="text-sm">
                            {company.payday_date ? (
                              <span className="font-medium">每月 {company.payday_date} 号</span>
                            ) : (
                              <span className="text-muted-foreground">未设置</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={
                            company.service_status === '服务中' ? 'default' :
                            company.service_status === '已到期' ? 'destructive' :
                            'secondary'
                          }>
                            {company.service_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTransferDialog(company);
                            }}
                            title="流转公司"
                          >
                            <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewHistory(company);
                            }}
                            title="查看流转历史"
                          >
                            <History className="h-4 w-4 text-purple-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(company);
                            }}
                            title="编辑"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(company.id);
                            }}
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* 分页控件 */}
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.goToPage}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                totalItems={pagination.totalItems}
              />
            </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
