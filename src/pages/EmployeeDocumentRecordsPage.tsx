import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  getEmployeeDocumentRecords, 
  getEmployees, 
  getCompanies,
  createEmployeeDocumentRecord,
  createLaborContractHistory,
  getLaborContractHistory,
  updateEmployeeContractCount
} from '@/db/api';
import type { EmployeeDocumentRecord, Employee, Company } from '@/types/types';
import { toast } from 'sonner';
import { FileText, Download, Search, Filter, Plus, Upload, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/db/supabase';

export default function EmployeeDocumentRecordsPage() {
  const [records, setRecords] = useState<EmployeeDocumentRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<EmployeeDocumentRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 筛选条件
  const [filters, setFilters] = useState({
    employee_id: 'all',
    company_id: 'all',
    document_type: 'all',
    signed_year: 'all'
  });

  // 新增历史记录表单
  const [formData, setFormData] = useState({
    company_id: '',
    employee_id: '',
    document_type: '',
    document_name: '',
    template_category: '',
    signed_at: '',
    expiry_time: '', // 到期时间（可以是日期或文本）
    notes: '',
    // 劳动合同特有字段
    contract_start_date: '',
    contract_end_date: '',
    contract_type: '固定期限'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [records, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, employeesData, companiesData] = await Promise.all([
        getEmployeeDocumentRecords(),
        getEmployees(),
        getCompanies()
      ]);
      setRecords(recordsData);
      setEmployees(employeesData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];

    if (filters.employee_id !== 'all') {
      filtered = filtered.filter(r => r.employee_id === filters.employee_id);
    }

    if (filters.company_id !== 'all') {
      filtered = filtered.filter(r => r.company_id === filters.company_id);
    }

    if (filters.document_type !== 'all') {
      filtered = filtered.filter(r => r.document_type === filters.document_type);
    }

    if (filters.signed_year !== 'all') {
      const year = parseInt(filters.signed_year);
      filtered = filtered.filter(r => r.signed_year === year);
    }

    setFilteredRecords(filtered);
  };

  const resetFilters = () => {
    setFilters({
      employee_id: 'all',
      company_id: 'all',
      document_type: 'all',
      signed_year: 'all'
    });
  };

  // 获取所有文书类型
  const documentTypes = Array.from(new Set(records.map(r => r.document_type))).filter(Boolean);

  // 获取所有签署年份
  const signedYears = Array.from(new Set(records.map(r => r.signed_year).filter(Boolean))).sort((a, b) => b! - a!);

  const handleDownload = (record: EmployeeDocumentRecord) => {
    if (!record.file_url) {
      toast.error('该文书没有可下载的文件');
      return;
    }

    try {
      window.open(record.file_url, '_blank');
      toast.success('正在打开文件...');
    } catch (error) {
      console.error('打开文件失败:', error);
      toast.error('打开文件失败');
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('只支持 PDF、JPG、PNG 格式的文件');
        return;
      }
      // 验证文件大小（最大10MB）
      if (file.size > 10 * 1024 * 1024) {
        toast.error('文件大小不能超过 10MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  // 上传文件到 Supabase Storage
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `employee_documents/${fileName}`;

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('文件上传失败:', error);
        return null;
      }

      // 获取公开URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('文件上传异常:', error);
      return null;
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      company_id: '',
      employee_id: '',
      document_type: '',
      document_name: '',
      template_category: '',
      signed_at: '',
      expiry_time: '',
      notes: '',
      contract_start_date: '',
      contract_end_date: '',
      contract_type: '固定期限'
    });
    setUploadedFile(null);
    setUploadProgress(0);
  };

  // 提交表单
  const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.company_id || !formData.employee_id || !formData.document_type || 
        !formData.document_name || !formData.signed_at) {
      toast.error('请填写所有必填字段');
      return;
    }

    // 如果是劳动合同，验证合同特有字段
    if (formData.document_type === '劳动合同') {
      if (!formData.contract_start_date || !formData.contract_end_date) {
        toast.error('劳动合同需要填写合同开始日期和结束日期');
        return;
      }
    }

    setSubmitting(true);
    try {
      let fileUrl: string | null = null;

      // 如果有上传文件，先上传文件
      if (uploadedFile) {
        toast.info('正在上传文件...');
        fileUrl = await uploadFile(uploadedFile);
        if (!fileUrl) {
          toast.error('文件上传失败');
          setSubmitting(false);
          return;
        }
      }

      // 提取签署年份
      const signedYear = new Date(formData.signed_at).getFullYear();

      // 创建员工文书记录
      await createEmployeeDocumentRecord({
        employee_id: formData.employee_id,
        company_id: formData.company_id,
        document_type: formData.document_type,
        document_name: formData.document_name,
        template_category: formData.template_category || undefined,
        signed_at: formData.signed_at,
        signed_year: signedYear,
        file_url: fileUrl || undefined,
        expiry_time: formData.expiry_time || undefined
      });

      // 如果是劳动合同，同步创建劳动合同历史记录
      if (formData.document_type === '劳动合同') {
        // 获取该员工的劳动合同历史记录，计算合同次数
        const contractHistory = await getLaborContractHistory(formData.employee_id);
        const contractNumber = contractHistory.length + 1;

        // 创建劳动合同历史记录
        await createLaborContractHistory({
          employee_id: formData.employee_id,
          company_id: formData.company_id,
          contract_number: contractNumber,
          start_date: formData.contract_start_date,
          end_date: formData.contract_end_date,
          contract_type: formData.contract_type,
          notes: formData.notes || undefined
        });

        // 更新员工的劳动合同签订次数
        await updateEmployeeContractCount(formData.employee_id, contractNumber);
      }

      toast.success('历史记录添加成功');
      setDialogOpen(false);
      resetForm();
      loadData(); // 重新加载数据
    } catch (error) {
      console.error('添加历史记录失败:', error);
      toast.error('添加历史记录失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 文书类型选项
  const documentTypeOptions = [
    '劳动合同',
    '入职信息登记表',
    '岗位职责',
    '员工手册',
    '规章制度',
    '保密协议',
    '竞业禁止协议',
    '培训协议',
    '劳动合同续签',
    '劳动合同变更协议',
    '岗位调整',
    '薪酬调整',
    '职级调整',
    '离职申请',
    '离职交接确认表',
    '解除劳动合同协议',
    '离职证明',
    '考勤确认',
    '绩效考核确认',
    '工资条确认',
    '收入证明',
    '在职证明'
  ];

  // 模板大类选项
  const templateCategoryOptions = [
    '入职管理',
    '在职管理',
    '离职管理',
    '薪酬管理',
    '证明开具'
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">历史记录</h1>
            <p className="text-muted-foreground mt-1">
              查询和管理员工已签署的所有文书记录
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增历史记录
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              筛选条件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>公司</Label>
                <Select
                  value={filters.company_id}
                  onValueChange={(value) => setFilters({ ...filters, company_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部公司</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>员工</Label>
                <Select
                  value={filters.employee_id}
                  onValueChange={(value) => setFilters({ ...filters, employee_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部员工</SelectItem>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>文书类型</Label>
                <Select
                  value={filters.document_type}
                  onValueChange={(value) => setFilters({ ...filters, document_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>签署年份</Label>
                <Select
                  value={filters.signed_year}
                  onValueChange={(value) => setFilters({ ...filters, signed_year: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部年份</SelectItem>
                    {signedYears.map(year => (
                      <SelectItem key={year} value={year!.toString()}>
                        {year}年
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={resetFilters}>
                重置筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>文书记录列表（共 {filteredRecords.length} 条）</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full bg-muted" />
                <Skeleton className="h-12 w-full bg-muted" />
                <Skeleton className="h-12 w-full bg-muted" />
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无文书记录</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>公司名称</TableHead>
                      <TableHead>员工姓名</TableHead>
                      <TableHead>文书类型</TableHead>
                      <TableHead>文书名称</TableHead>
                      <TableHead>模板大类</TableHead>
                      <TableHead>签署时间</TableHead>
                      <TableHead>签署年份</TableHead>
                      <TableHead>到期时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="whitespace-nowrap">
                          {record.company?.name || '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {record.employee?.name || '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline">{record.document_type}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {record.document_name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {record.template_category || '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {record.signed_at 
                            ? new Date(record.signed_at).toLocaleString('zh-CN')
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {record.signed_year ? `${record.signed_year}年` : '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {record.expiry_time || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {record.file_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(record)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              下载
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 新增历史记录对话框 */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增历史文书记录</DialogTitle>
              <DialogDescription>
                录入员工历史签署的文书或合同，支持上传附件
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">公司 *</Label>
                  <Select
                    value={formData.company_id}
                    onValueChange={(value) => setFormData({ ...formData, company_id: value })}
                  >
                    <SelectTrigger id="company">
                      <SelectValue placeholder="选择公司" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee">员工 *</Label>
                  <Select
                    value={formData.employee_id}
                    onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                  >
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="选择员工" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter(emp => !formData.company_id || emp.company_id === formData.company_id)
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document_type">文书类型 *</Label>
                  <Select
                    value={formData.document_type}
                    onValueChange={(value) => setFormData({ ...formData, document_type: value })}
                  >
                    <SelectTrigger id="document_type">
                      <SelectValue placeholder="选择文书类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template_category">模板大类</Label>
                  <Select
                    value={formData.template_category}
                    onValueChange={(value) => setFormData({ ...formData, template_category: value })}
                  >
                    <SelectTrigger id="template_category">
                      <SelectValue placeholder="选择模板大类" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateCategoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_name">文书名称 *</Label>
                <Input
                  id="document_name"
                  value={formData.document_name}
                  onChange={(e) => setFormData({ ...formData, document_name: e.target.value })}
                  placeholder="例如：2023年劳动合同"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signed_at">签署时间 *</Label>
                <Input
                  id="signed_at"
                  type="datetime-local"
                  value={formData.signed_at}
                  onChange={(e) => setFormData({ ...formData, signed_at: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_time">到期时间</Label>
                <Input
                  id="expiry_time"
                  type="text"
                  value={formData.expiry_time}
                  onChange={(e) => setFormData({ ...formData, expiry_time: e.target.value })}
                  placeholder="可填写日期或文本，例如：2025-12-31 或 长期有效"
                />
              </div>

              {/* 劳动合同特有字段 */}
              {formData.document_type === '劳动合同' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contract_start_date">合同开始日期 *</Label>
                      <Input
                        id="contract_start_date"
                        type="date"
                        value={formData.contract_start_date}
                        onChange={(e) => setFormData({ ...formData, contract_start_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contract_end_date">合同结束日期 *</Label>
                      <Input
                        id="contract_end_date"
                        type="date"
                        value={formData.contract_end_date}
                        onChange={(e) => setFormData({ ...formData, contract_end_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contract_type">合同类型</Label>
                    <Select
                      value={formData.contract_type}
                      onValueChange={(value) => setFormData({ ...formData, contract_type: value })}
                    >
                      <SelectTrigger id="contract_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="固定期限">固定期限</SelectItem>
                        <SelectItem value="无固定期限">无固定期限</SelectItem>
                        <SelectItem value="以完成一定工作任务为期限">以完成一定工作任务为期限</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">备注</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="可选填写备注信息"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">附件上传</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadedFile ? uploadedFile.name : '选择文件（PDF、JPG、PNG，最大10MB）'}
                  </Button>
                  {uploadedFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                取消
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? '提交中...' : '确认添加'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
