import { useEffect, useState, useRef } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CompanySelector } from '@/components/ui/company-selector';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Upload, 
  FileSpreadsheet, 
  Eye, 
  Send, 
  Trash2, 
  Download, 
  AlertCircle, 
  FileText,
  Settings,
  Plus,
  GripVertical
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import * as XLSX from 'xlsx';
import {
  getSalaryRecords,
  getSalaryStructureTemplates,
  getCompanies,
  getEmployees,
  createSalaryRecord,
  updateSalaryRecord,
  deleteSalaryRecord,
  getSalaryItems,
  createSalaryItems,
  markSalaryItemsAsSent,
  createSalarySignaturesBatch,
  updateSalaryItem,
  updateSalarySignatureFileUrl,
  createSalaryStructureTemplate,
  updateSalaryStructureTemplate
} from '@/db/api';
import { generateSalarySlipPDF, uploadPDFToStorage } from '@/utils/pdfGenerator';
import type { SalaryRecord, SalaryStructureTemplate, SalaryStructureField, Company, Employee, SalaryItem } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

export default function SalaryRecordsPage() {
  const { profile } = useAuth();
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [templates, setTemplates] = useState<SalaryStructureTemplate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);
  const [salaryItems, setSalaryItems] = useState<SalaryItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模板设置相关状态
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SalaryStructureTemplate | null>(null);
  const [templateFormData, setTemplateFormData] = useState({
    company_id: '',
    name: '',
    description: '',
    fields: [] as SalaryStructureField[],
    is_default: false
  });
  const [newField, setNewField] = useState<SalaryStructureField>({
    name: '',
    code: '',
    type: 'number',
    required: false,
    order: 0
  });

  const [formData, setFormData] = useState({
    company_id: '',
    template_id: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    file: null as File | null
  });

  const [parsedData, setParsedData] = useState<any[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [recordsData, templatesData, companiesData, employeesData] = await Promise.all([
      getSalaryRecords(),
      getSalaryStructureTemplates(),
      getCompanies(),
      getEmployees()
    ]);
    setRecords(recordsData);
    setTemplates(templatesData);
    setCompanies(companiesData);
    setEmployees(employeesData);
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  // 后台生成PDF文件
  const generatePDFsInBackground = async (
    salaryItems: any[],
    template: SalaryStructureTemplate,
    company: Company,
    year: number,
    month: number,
    salaryRecordId: string
  ) => {
    let successCount = 0;
    let failCount = 0;

    for (const item of salaryItems) {
      try {
        // 获取员工详细信息
        const employee = employees.find(e => e.id === item.employee_id);
        
        // 生成PDF
        const pdfBlob = await generateSalarySlipPDF({
          companyName: company.name,
          employeeName: item.employee_name,
          department: employee?.department,
          position: employee?.position,
          year,
          month,
          salaryData: item.data,
          totalAmount: item.total_amount,
          template
        });

        // 上传PDF到Storage
        const fileName = `${company.name}_${item.employee_name}_${year}${String(month).padStart(2, '0')}_${Date.now()}.pdf`;
        const pdfUrl = await uploadPDFToStorage(pdfBlob, fileName);

        if (pdfUrl) {
          // 更新工资条记录，保存PDF URL
          await updateSalaryItem(item.id, { pdf_url: pdfUrl });
          
          // 更新签署记录，保存原始文件URL
          await updateSalarySignatureFileUrl(salaryRecordId, item.employee_id, pdfUrl, 'salary_slip');

          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`生成PDF失败 - ${item.employee_name}:`, error);
        failCount++;
      }
    }

    // 更新工资记录状态
    await updateSalaryRecord(salaryRecordId, {
      pdf_generated: failCount === 0,
      pdf_generation_error: failCount > 0 ? `${failCount}个PDF生成失败` : undefined
    });

    // 显示结果
    if (failCount === 0) {
      toast.success(`所有工资条PDF已生成完成（${successCount}个）`);
    } else {
      toast.warning(`PDF生成完成：成功${successCount}个，失败${failCount}个`);
    }

    // 刷新数据
    loadData();
  };

  const parseExcelFile = async (file: File, template: SalaryStructureTemplate, companyId: string): Promise<{ data: any[], errors: string[] }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const errors: string[] = [];
          const parsedData: any[] = [];

          // 只查找该公司的员工
          const companyEmployees = employees.filter(e => e.company_id === companyId);

          if (companyEmployees.length === 0) {
            resolve({ data: [], errors: ['该公司暂无员工，无法解析工资表'] });
            return;
          }

          // 验证和解析每一行数据
          jsonData.forEach((row: any, index: number) => {
            const rowNumber = index + 2; // Excel行号从2开始（第1行是表头）

            // 查找员工（支持新旧格式）
            const employeeName = row['员工姓名'] || row['姓名'];
            const employeeIdCard = row['员工身份证号'] || row['员工身份证号码'] || row['身份证号码'] || row['身份证号'];

            if (!employeeName) {
              errors.push(`第${rowNumber}行：缺少员工姓名`);
              return;
            }

            // 在该公司的员工中查找（优先通过身份证号，其次姓名）
            const employee = companyEmployees.find(e => {
              if (employeeIdCard && e.id_card_number) {
                return e.id_card_number === employeeIdCard;
              }
              return e.name === employeeName;
            });

            if (!employee) {
              errors.push(`第${rowNumber}行：在该公司中找不到员工"${employeeName}"${employeeIdCard ? `（身份证号：${employeeIdCard}）` : ''}`);
              return;
            }

            // 解析工资字段
            const salaryData: Record<string, number | string> = {};
            let totalAmount = 0;

            template.fields.forEach((field: SalaryStructureField) => {
              const value = row[field.name];
              if (value !== undefined && value !== null && value !== '') {
                if (field.type === 'number') {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue)) {
                    salaryData[field.code] = numValue;
                    // 累加到总金额（假设所有数字字段都是金额）
                    if (field.code.includes('salary') || field.code.includes('bonus') || field.code.includes('allowance')) {
                      totalAmount += numValue;
                    } else if (field.code.includes('deduction') || field.code.includes('tax')) {
                      totalAmount -= numValue;
                    }
                  } else {
                    errors.push(`第${rowNumber}行：字段"${field.name}"的值"${value}"不是有效数字`);
                  }
                } else {
                  salaryData[field.code] = String(value);
                }
              } else if (field.required) {
                errors.push(`第${rowNumber}行：缺少必填字段"${field.name}"`);
              }
            });

            // 如果有"实发工资"或"应发工资"字段，使用它作为总金额
            if (row['实发工资']) {
              totalAmount = parseFloat(row['实发工资']);
            } else if (row['应发工资']) {
              totalAmount = parseFloat(row['应发工资']);
            }

            parsedData.push({
              employee_id: employee.id,
              employee_name: employee.name,
              data: salaryData,
              total_amount: totalAmount
            });
          });

          resolve({ data: parsedData, errors });
        } catch (error) {
          resolve({ data: [], errors: ['文件解析失败，请确保文件格式正确'] });
        }
      };
      reader.readAsBinaryString(file);
    });
  };

  const handleUpload = async () => {
    if (!formData.company_id || !formData.template_id || !formData.file) {
      toast.error('请填写所有必填项并选择文件');
      return;
    }

    const template = templates.find(t => t.id === formData.template_id);
    if (!template) {
      toast.error('找不到选择的工资结构模板');
      return;
    }

    const company = companies.find(c => c.id === formData.company_id);
    if (!company) {
      toast.error('找不到选择的公司');
      return;
    }

    try {
      // 解析Excel文件（传递公司ID）
      const { data, errors } = await parseExcelFile(formData.file, template, formData.company_id);
      
      if (errors.length > 0) {
        setParseErrors(errors);
        setParsedData(data);
        return;
      }

      if (data.length === 0) {
        toast.error('文件中没有有效的工资数据');
        return;
      }

      // 创建工资记录
      const totalAmount = data.reduce((sum, item) => sum + item.total_amount, 0);
      const salaryRecord = await createSalaryRecord({
        company_id: formData.company_id,
        template_id: formData.template_id,
        year: formData.year,
        month: formData.month,
        file_name: formData.file.name,
        total_amount: totalAmount,
        employee_count: data.length,
        status: 'processed',
        pdf_generated: false
      });

      if (!salaryRecord) {
        toast.error('创建工资记录失败');
        return;
      }

      // 批量创建工资条
      const salaryItemsData = data.map(item => ({
        ...item,
        salary_record_id: salaryRecord.id
      }));

      const createdItems = await createSalaryItems(salaryItemsData);

      // 自动创建薪酬签署记录
      const signatureRecords = data.map(item => ({
        company_id: formData.company_id,
        employee_id: item.employee_id,
        type: 'salary_slip' as const,
        reference_id: salaryRecord.id,
        year: formData.year,
        month: formData.month,
        status: 'pending' as const
      }));

      await createSalarySignaturesBatch(signatureRecords);

      toast.success(`工资表上传成功，已为 ${data.length} 名员工生成工资条和签署记录`);
      
      // 后台生成PDF（不阻塞用户操作）
      toast.info('正在后台生成工资条PDF文件，请稍候...');
      generatePDFsInBackground(createdItems, template, company, formData.year, formData.month, salaryRecord.id);

      setUploadDialogOpen(false);
      setFormData({
        company_id: '',
        template_id: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        file: null
      });
      setParsedData([]);
      setParseErrors([]);
      loadData();
    } catch (error: any) {
      console.error('上传工资表失败:', error);
      if (error.message?.includes('duplicate key')) {
        toast.error('该公司该月份的工资记录已存在');
      } else {
        toast.error(`上传失败：${error.message || '未知错误'}`);
      }
    }
  };

  const handlePreview = async (record: SalaryRecord) => {
    setSelectedRecord(record);
    const items = await getSalaryItems(record.id);
    setSalaryItems(items);
    setPreviewDialogOpen(true);
  };

  const handleSendSalarySlips = async (recordId: string) => {
    if (!confirm('确定要发送工资条给所有员工吗？')) {
      return;
    }

    try {
      await markSalaryItemsAsSent(recordId);
      await updateSalaryRecord(recordId, { status: 'sent' });
      toast.success('工资条已发送');
      loadData();
    } catch (error) {
      toast.error('发送失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条工资记录吗？删除后将无法恢复。')) {
      return;
    }

    try {
      await deleteSalaryRecord(id);
      toast.success('删除成功');
      loadData();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleDownloadTemplate = async () => {
    if (!formData.company_id) {
      toast.error('请先选择所属公司');
      return;
    }

    if (!formData.template_id) {
      toast.error('请先选择工资结构模板');
      return;
    }

    const template = templates.find(t => t.id === formData.template_id);
    const company = companies.find(c => c.id === formData.company_id);
    
    if (!template || !company) {
      return;
    }

    // 获取该公司的所有员工
    const companyEmployees = employees.filter(e => e.company_id === formData.company_id);

    if (companyEmployees.length === 0) {
      toast.error('该公司暂无员工，无法生成模板');
      return;
    }

    // 调试：打印员工数据
    console.log('员工数据:', companyEmployees.map(e => ({
      name: e.name,
      id_card_number: e.id_card_number
    })));

    // 创建Excel模板，包含公司名称、部门、员工姓名、身份证号
    const headers = ['公司名称', '部门', '员工姓名', '员工身份证号', ...template.fields.map((f: SalaryStructureField) => f.name)];
    
    // 为每个员工创建一行数据
    const rows = companyEmployees.map(emp => [
      company.name,
      emp.department || '',
      emp.name,
      emp.id_card_number || '',
      ...template.fields.map((f: SalaryStructureField) => f.type === 'number' ? 0 : '')
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '工资表');

    XLSX.writeFile(wb, `工资表模板_${company.name}_${template.name}_${formData.year}年${formData.month}月.xlsx`);
    toast.success('模板下载成功');
  };

  // ==================== 模板设置相关函数 ====================

  const handleOpenTemplateDialog = (template?: SalaryStructureTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateFormData({
        company_id: template.company_id,
        name: template.name,
        description: template.description || '',
        fields: template.fields || [],
        is_default: template.is_default || false
      });
    } else {
      setEditingTemplate(null);
      setTemplateFormData({
        company_id: '',
        name: '',
        description: '',
        fields: [],
        is_default: false
      });
    }
    setTemplateDialogOpen(true);
  };

  const handleAddField = () => {
    if (!newField.name || !newField.code) {
      toast.error('请填写字段名称和代码');
      return;
    }

    // 检查代码是否重复
    if (templateFormData.fields.some(f => f.code === newField.code)) {
      toast.error('字段代码已存在');
      return;
    }

    const field: SalaryStructureField = {
      ...newField,
      order: templateFormData.fields.length
    };

    setTemplateFormData({
      ...templateFormData,
      fields: [...templateFormData.fields, field]
    });

    // 重置新字段表单
    setNewField({
      name: '',
      code: '',
      type: 'number',
      required: false,
      order: 0
    });

    toast.success('字段添加成功');
  };

  const handleRemoveField = (index: number) => {
    const newFields = templateFormData.fields.filter((_, i) => i !== index);
    // 重新排序
    const reorderedFields = newFields.map((field, i) => ({ ...field, order: i }));
    setTemplateFormData({
      ...templateFormData,
      fields: reorderedFields
    });
    toast.success('字段已删除');
  };

  const handleSubmitTemplate = async () => {
    if (!templateFormData.company_id || !templateFormData.name) {
      toast.error('请填写必填项');
      return;
    }

    if (templateFormData.fields.length === 0) {
      toast.error('请至少添加一个字段');
      return;
    }

    try {
      if (editingTemplate) {
        // 更新模板
        const success = await updateSalaryStructureTemplate(editingTemplate.id, templateFormData);
        if (success) {
          toast.success('模板更新成功');
          setTemplateDialogOpen(false);
          loadData();
        } else {
          toast.error('模板更新失败');
        }
      } else {
        // 创建新模板
        const newTemplate = await createSalaryStructureTemplate(templateFormData);
        if (newTemplate) {
          toast.success('模板创建成功');
          setTemplateDialogOpen(false);
          loadData();
        } else {
          toast.error('模板创建失败');
        }
      }
    } catch (error) {
      console.error('保存模板失败:', error);
      toast.error('保存模板失败');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">工资表管理</h1>
            <p className="text-muted-foreground mt-2">上传工资表，自动拆分成员工工资条</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenTemplateDialog()}>
              <Settings className="mr-2 h-4 w-4" />
              设置工资结构模板
            </Button>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              上传工资表
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>工资记录列表</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="搜索公司名称..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">暂无工资记录</p>
                <p className="text-sm mt-2">点击"上传工资表"按钮开始上传</p>
              </div>
            ) : (() => {
              // 过滤记录
              const filteredRecords = records.filter(record => {
                if (!searchKeyword) return true;
                const company = companies.find(c => c.id === record.company_id);
                return company?.name?.toLowerCase().includes(searchKeyword.toLowerCase());
              });

              return filteredRecords.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">未找到匹配的工资记录</p>
                  <p className="text-sm mt-2">请尝试其他关键词</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">年月</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[200px]">所属公司</TableHead>
                    <TableHead className="whitespace-nowrap">员工数量</TableHead>
                    <TableHead className="whitespace-nowrap">总金额</TableHead>
                    <TableHead className="whitespace-nowrap">状态</TableHead>
                    <TableHead className="whitespace-nowrap">上传时间</TableHead>
                    <TableHead className="text-right whitespace-nowrap">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => {
                    const company = companies.find(c => c.id === record.company_id);
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {record.year}年{record.month}月
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{company?.name || '未知公司'}</TableCell>
                        <TableCell className="whitespace-nowrap">{record.employee_count || 0} 人</TableCell>
                        <TableCell className="whitespace-nowrap">¥{record.total_amount?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {record.status === 'sent' ? (
                            <Badge>已发送</Badge>
                          ) : record.status === 'processed' ? (
                            <Badge variant="secondary">已处理</Badge>
                          ) : (
                            <Badge variant="outline">待处理</Badge>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(record.created_at).toLocaleString('zh-CN')}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {record.status !== 'sent' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendSalarySlips(record.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              );
            })()}
          </CardContent>
        </Card>

        {/* 上传对话框 */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>上传工资表</DialogTitle>
              <DialogDescription>
                选择公司、工资结构模板和Excel文件，系统将自动拆分成员工工资条
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_id">所属公司 *</Label>
                  <CompanySelector
                    companies={companies}
                    value={formData.company_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, company_id: value, template_id: '' });
                    }}
                    placeholder="请选择公司"
                    emptyText="未找到公司"
                    searchPlaceholder="搜索公司名称..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template_id">工资结构模板 *</Label>
                  <Select
                    value={formData.template_id}
                    onValueChange={(value) => setFormData({ ...formData, template_id: value })}
                    disabled={!formData.company_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择模板" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const filteredTemplates = templates.filter(t => t.is_universal || t.company_id === formData.company_id);
                        console.log('所有模板:', JSON.stringify(templates.map(t => ({ 
                          id: t.id, 
                          name: t.name, 
                          company_id: t.company_id, 
                          is_universal: t.is_universal 
                        })), null, 2));
                        console.log('当前选择的公司ID:', formData.company_id);
                        console.log('过滤后的模板:', JSON.stringify(filteredTemplates.map(t => ({ 
                          id: t.id, 
                          name: t.name, 
                          company_id: t.company_id,
                          is_universal: t.is_universal 
                        })), null, 2));
                        console.log('过滤后的模板数量:', filteredTemplates.length);
                        return filteredTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                            {template.is_universal && (
                              <span className="ml-2 text-xs text-muted-foreground">(通用)</span>
                            )}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">年份 *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">月份 *</Label>
                  <Select
                    value={formData.month.toString()}
                    onValueChange={(value) => setFormData({ ...formData, month: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month}月
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">工资表文件 *</Label>
                <div className="flex gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".xlsx,.xls"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <Button
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    disabled={!formData.template_id}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    下载模板
                  </Button>
                </div>
                {formData.file && (
                  <p className="text-sm text-muted-foreground">
                    已选择：{formData.file.name}
                  </p>
                )}
              </div>

              {parseErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-semibold mb-2">文件解析发现以下错误：</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {parseErrors.slice(0, 10).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {parseErrors.length > 10 && (
                        <li>...还有 {parseErrors.length - 10} 个错误</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setUploadDialogOpen(false);
                setParseErrors([]);
                setParsedData([]);
              }}>
                取消
              </Button>
              <Button onClick={handleUpload} disabled={parseErrors.length > 0}>
                上传并拆分
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 预览对话框 */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                工资条预览 - {selectedRecord?.year}年{selectedRecord?.month}月
              </DialogTitle>
              <DialogDescription>
                共 {salaryItems.length} 名员工
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {salaryItems.map((item) => {
                // 查找对应的员工信息以获取身份证号
                const employee = employees.find(e => e.id === item.employee_id);
                return (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{item.employee_name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            身份证号：{employee?.id_card_number || '未填写'}
                          </p>
                        </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">¥{item.total_amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">实发工资</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      {Object.entries(item.data).map(([key, value]) => {
                        const template = templates.find(t => t.id === selectedRecord?.template_id);
                        const field = template?.fields.find((f: SalaryStructureField) => f.code === key);
                        return (
                          <div key={key} className="space-y-1">
                            <p className="text-sm text-muted-foreground">{field?.name || key}</p>
                            <p className="font-medium">
                              {typeof value === 'number' ? `¥${value.toFixed(2)}` : String(value)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 工资结构模板设置对话框 */}
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? '编辑工资结构模板' : '创建工资结构模板'}</DialogTitle>
              <DialogDescription>
                定义工资结构字段，用于自动拆分工资表
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template_company_id">所属公司 *</Label>
                  <CompanySelector
                    companies={companies}
                    value={templateFormData.company_id}
                    onValueChange={(value) => setTemplateFormData({ ...templateFormData, company_id: value })}
                    placeholder="请选择公司"
                    emptyText="未找到公司"
                    searchPlaceholder="搜索公司名称..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template_name">模板名称 *</Label>
                  <Input
                    id="template_name"
                    value={templateFormData.name}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                    placeholder="例如：标准工资结构"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template_description">模板描述</Label>
                <Textarea
                  id="template_description"
                  value={templateFormData.description}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, description: e.target.value })}
                  placeholder="描述这个工资结构模板的用途"
                  rows={2}
                />
              </div>

              {/* 字段配置 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">工资结构字段</Label>
                  <Badge variant="secondary">{templateFormData.fields.length} 个字段</Badge>
                </div>

                {/* 已添加的字段列表 */}
                {templateFormData.fields.length > 0 && (
                  <div className="border rounded-lg p-4 space-y-2">
                    {templateFormData.fields.map((field, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium">{field.name}</p>
                            <p className="text-xs text-muted-foreground">字段名称</p>
                          </div>
                          <div>
                            <p className="text-sm font-mono">{field.code}</p>
                            <p className="text-xs text-muted-foreground">字段代码</p>
                          </div>
                          <div>
                            <Badge variant="outline">{field.type === 'number' ? '数字' : '文本'}</Badge>
                            {field.required && <Badge variant="secondary" className="ml-2">必填</Badge>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 添加新字段 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">添加新字段</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="field_name">字段名称</Label>
                        <Input
                          id="field_name"
                          value={newField.name}
                          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                          placeholder="例如：基本工资"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field_code">字段代码</Label>
                        <Input
                          id="field_code"
                          value={newField.code}
                          onChange={(e) => setNewField({ ...newField, code: e.target.value })}
                          placeholder="例如：base_salary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field_type">字段类型</Label>
                        <Select
                          value={newField.type}
                          onValueChange={(value: 'number' | 'text') => setNewField({ ...newField, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="number">数字</SelectItem>
                            <SelectItem value="text">文本</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleAddField} className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          添加字段
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmitTemplate}>
                {editingTemplate ? '保存' : '创建'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
