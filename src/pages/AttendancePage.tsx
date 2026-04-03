import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CompanySelector } from '@/components/ui/company-selector';
import { toast } from 'sonner';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload, 
  Download, 
  Trash2, 
  Search,
  FileSpreadsheet,
  Calendar,
  Users
} from 'lucide-react';
import { 
  getAttendanceRecords, 
  createAttendanceRecordsBatch,
  deleteAttendanceRecord,
  deleteAttendanceRecordsBatch,
  getCompanies,
  getEmployees,
  getEmployeesByCompany,
  getCurrentUserPermissions,
  createSalarySignaturesBatch,
  updateAttendanceRecord,
  updateSalarySignatureFileUrl
} from '@/db/api';
import { generateAttendanceRecordPDF, uploadPDFToStorage } from '@/utils/pdfGenerator';
import type { AttendanceRecord, Company, Employee } from '@/types/types';
import * as XLSX from 'xlsx';
import { Skeleton } from '@/components/ui/skeleton';

export default function AttendancePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  
  // 模板下载对话框状态
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateCompanyId, setTemplateCompanyId] = useState<string>('');
  const [templateMonth, setTemplateMonth] = useState<string>('');

  // 从 URL 参数读取公司ID筛选
  useEffect(() => {
    const companyId = searchParams.get('company_id');
    if (companyId) {
      setSelectedCompanyId(companyId);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [selectedCompanyId, selectedMonth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, companiesData, perms] = await Promise.all([
        getAttendanceRecords(selectedCompanyId || undefined, selectedMonth || undefined),
        getCompanies(),
        getCurrentUserPermissions()
      ]);

      setRecords(recordsData);
      setCompanies(companiesData);
      setPermissions(perms);

      // 如果选择了公司，加载该公司的员工
      if (selectedCompanyId) {
        const employeesData = await getEmployeesByCompany(selectedCompanyId);
        setEmployees(employeesData);
      }
    } catch (error) {
      console.error('加载考勤数据失败:', error);
      alert('加载失败：无法加载考勤数据，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  // 后台生成考勤确认表PDF
  const generateAttendancePDFsInBackground = async (
    attendanceRecords: AttendanceRecord[],
    company: Company
  ) => {
    let successCount = 0;
    let failCount = 0;

    for (const record of attendanceRecords) {
      try {
        // 获取员工详细信息
        const employee = employees.find(e => e.id === record.employee_id);
        
        if (!employee) {
          console.warn(`未找到员工信息: ${record.employee_id}`);
          failCount++;
          continue;
        }

        // 解析年月
        const [year, month] = record.month.split('-').map(Number);

        // 生成PDF
        const pdfBlob = await generateAttendanceRecordPDF({
          companyName: company.name,
          employeeName: employee.name,
          department: employee.department,
          position: employee.position,
          year,
          month,
          attendanceData: {
            work_days: record.work_days,
            absent_days: record.absent_days,
            late_count: record.late_times,
            leave_days: record.leave_days,
            overtime_hours: record.overtime_hours,
            notes: record.remarks
          }
        });

        // 上传PDF到Storage
        const fileName = `${company.name}_${employee.name}_${record.month}_考勤确认表_${Date.now()}.pdf`;
        const pdfUrl = await uploadPDFToStorage(pdfBlob, fileName);

        if (pdfUrl) {
          // 更新考勤记录，保存PDF URL
          await updateAttendanceRecord(record.id, { pdf_url: pdfUrl });
          
          // 更新签署记录，保存原始文件URL
          await updateSalarySignatureFileUrl(record.id, record.employee_id, pdfUrl, 'attendance_record');

          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`生成考勤确认表PDF失败 - ${record.employee_id}:`, error);
        failCount++;
      }
    }

    // 显示结果
    if (failCount === 0) {
      toast.success(`所有考勤确认表PDF已生成完成（${successCount}个）`);
    } else {
      toast.warning(`PDF生成完成：成功${successCount}个，失败${failCount}个`);
    }

    // 刷新数据
    loadData();
  };

  // 处理Excel文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedCompanyId) {
      alert('请先选择公司再上传考勤表');
      return;
    }

    setUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('解析的Excel数据:', jsonData);

      // 获取该公司的所有员工（用于匹配）
      const companyEmployees = await getEmployeesByCompany(selectedCompanyId);

      // 解析考勤数据
      const attendanceRecords: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>[] = [];
      
      for (const row of jsonData as any[]) {
        // 支持新旧两种格式
        // 新格式：公司名称、部门、员工姓名、员工身份证号码、月份、出勤天数...
        // 旧格式：姓名、月份、出勤天数...
        
        const employeeName = row['员工姓名'] || row['姓名'] || row['name'];
        const idCardNumber = row['员工身份证号码'] || row['身份证号'] || row['id_card_number'];
        
        if (!employeeName && !idCardNumber) {
          console.warn('跳过无效行（缺少员工标识）:', row);
          continue;
        }

        // 优先通过身份证号匹配，其次姓名
        let employee = companyEmployees.find(e => 
          (idCardNumber && e.id_card_number === idCardNumber) ||
          (employeeName && e.name === employeeName)
        );

        if (!employee) {
          console.warn(`未找到员工: ${employeeName || idCardNumber}`);
          continue;
        }

        // 提取考勤月份
        const month = row['月份'] || row['考勤月份'] || row['month'] || selectedMonth;
        if (!month) {
          console.warn('跳过无效行（缺少月份）:', row);
          continue;
        }

        // 提取考勤数据
        const record: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'> = {
          company_id: selectedCompanyId,
          employee_id: employee.id,
          month: month,
          work_days: parseFloat(row['出勤天数'] || row['work_days'] || '0'),
          absent_days: parseFloat(row['缺勤天数'] || row['absent_days'] || '0'),
          late_times: parseFloat(row['迟到次数'] || row['late_times'] || '0'),
          leave_days: parseFloat(row['请假天数'] || row['leave_days'] || '0'),
          overtime_hours: parseFloat(row['加班小时'] || row['overtime_hours'] || '0'),
          remarks: row['备注'] || row['remarks'] || ''
        };

        attendanceRecords.push(record);
      }

      if (attendanceRecords.length === 0) {
        alert('上传失败：未能从Excel中解析出有效的考勤数据，请检查文件格式');
        return;
      }

      console.log('准备导入的考勤记录:', attendanceRecords);

      // 批量创建考勤记录
      const createdRecords = await createAttendanceRecordsBatch(attendanceRecords);

      // 自动创建薪酬签署记录（使用创建后的记录ID）
      const signatureRecords = createdRecords.map(record => {
        const [year, month] = record.month.split('-').map(Number);
        return {
          company_id: record.company_id,
          employee_id: record.employee_id,
          type: 'attendance_record' as const,
          reference_id: record.id, // 使用考勤记录ID
          year,
          month,
          status: 'pending' as const
        };
      });

      await createSalarySignaturesBatch(signatureRecords);

      alert(`上传成功：成功导入 ${createdRecords.length} 条考勤记录并创建签署任务`);

      // 获取公司信息
      const company = companies.find(c => c.id === selectedCompanyId);
      
      if (company && createdRecords.length > 0) {
        // 后台生成PDF（不阻塞用户操作）
        toast.info('正在后台生成考勤确认表PDF文件，请稍候...');
        generateAttendancePDFsInBackground(createdRecords, company);
      }

      setUploadDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('上传考勤表失败:', error);
      alert(`上传失败：${error instanceof Error ? error.message : '上传考勤表时发生错误'}`);
    } finally {
      setUploading(false);
      // 重置文件输入
      event.target.value = '';
    }
  };

  // 下载考勤模板
  // 打开模板下载对话框
  const openTemplateDialog = () => {
    // 默认设置为当前月份
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setTemplateMonth(yearMonth);
    setTemplateCompanyId('');
    setTemplateDialogOpen(true);
  };

  // 下载考勤模板
  const downloadTemplate = async () => {
    if (!templateCompanyId) {
      toast.error('请先选择所属公司');
      return;
    }

    if (!templateMonth) {
      toast.error('请先选择月份');
      return;
    }

    const company = companies.find(c => c.id === templateCompanyId);
    
    if (!company) {
      toast.error('公司信息不存在');
      return;
    }

    // 获取该公司的所有员工
    const companyEmployees = await getEmployeesByCompany(templateCompanyId);

    if (companyEmployees.length === 0) {
      toast.error('该公司暂无员工，无法生成模板');
      return;
    }

    // 创建Excel模板，包含公司名称、部门、员工姓名、身份证号
    const headers = ['公司名称', '部门', '员工姓名', '员工身份证号码', '月份', '出勤天数', '缺勤天数', '迟到次数', '请假天数', '加班小时', '备注'];
    
    // 为每个员工创建一行数据
    const rows = companyEmployees.map(emp => [
      company.name,
      emp.department || '',
      emp.name,
      emp.id_card_number || '',
      templateMonth,
      '', // 出勤天数
      '', // 缺勤天数
      '', // 迟到次数
      '', // 请假天数
      '', // 加班小时
      ''  // 备注
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '考勤表');

    XLSX.writeFile(wb, `考勤表模板_${company.name}_${templateMonth}.xlsx`);
    toast.success('模板下载成功');
    setTemplateDialogOpen(false);
  };

  // 删除考勤记录
  const handleDelete = async (id: string) => {
    console.log('删除按钮被点击，记录ID:', id);
    
    if (!window.confirm('确定要删除这条考勤记录吗？')) {
      console.log('用户取消删除');
      return;
    }

    console.log('开始删除考勤记录...');
    try {
      const success = await deleteAttendanceRecord(id);
      console.log('删除结果:', success);
      toast.success('删除成功');
      loadData();
    } catch (error) {
      console.error('删除考勤记录失败:', error);
      toast.error('删除失败');
    }
  };

  // 批量删除考勤记录
  const handleBatchDelete = async () => {
    console.log('批量删除被调用，选中的记录:', selectedRecords);
    
    if (selectedRecords.length === 0) {
      toast.error('请先选择要删除的记录');
      return;
    }

    if (!window.confirm(`确定要删除选中的 ${selectedRecords.length} 条考勤记录吗？`)) {
      console.log('用户取消批量删除');
      return;
    }

    console.log('开始批量删除...');
    try {
      const success = await deleteAttendanceRecordsBatch(selectedRecords);
      console.log('批量删除结果:', success);
      toast.success(`成功删除 ${selectedRecords.length} 条记录`);
      setSelectedRecords([]);
      loadData();
    } catch (error) {
      console.error('批量删除考勤记录失败:', error);
      toast.error('批量删除失败');
    }
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedRecords(filteredRecords.map(r => r.id));
    } else {
      setSelectedRecords([]);
    }
  };

  // 单选
  const handleSelectRecord = (id: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedRecords([...selectedRecords, id]);
    } else {
      setSelectedRecords(selectedRecords.filter(rid => rid !== id));
    }
  };

  // 过滤记录
  const filteredRecords = records.filter(record => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      record.employee?.name?.toLowerCase().includes(keyword) ||
      record.month?.includes(keyword)
    );
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full bg-muted" />
          <Skeleton className="h-96 w-full bg-muted" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">考勤管理</h1>
            <p className="text-muted-foreground mt-2">管理员工考勤记录</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openTemplateDialog}>
              <Download className="mr-2 h-4 w-4" />
              下载模板
            </Button>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              上传考勤表
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">考勤记录总数</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{records.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">覆盖员工数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(records.map(r => r.employee_id)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">考勤月份数</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(records.map(r => r.month)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选和搜索 */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>公司</Label>
                <Select value={selectedCompanyId || undefined} onValueChange={(value) => setSelectedCompanyId(value || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部公司" />
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
                <Label>月份</Label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  placeholder="选择月份"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索员工姓名或月份..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 考勤记录表格 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>考勤记录列表</CardTitle>
            <div className="flex gap-2">
              {hasPermission('attendance_delete') && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBatchDelete}
                  disabled={selectedRecords.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  批量删除 {selectedRecords.length > 0 && `(${selectedRecords.length})`}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileSpreadsheet className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>暂无考勤记录</p>
                <p className="text-sm mt-2">点击"上传考勤表"按钮导入考勤数据</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                          onCheckedChange={handleSelectAll}
                          disabled={!hasPermission('attendance_delete')}
                        />
                      </TableHead>
                      <TableHead className="whitespace-nowrap">员工姓名</TableHead>
                      <TableHead className="whitespace-nowrap min-w-[200px]">所属公司</TableHead>
                      <TableHead className="whitespace-nowrap">月份</TableHead>
                      <TableHead className="text-right whitespace-nowrap">出勤天数</TableHead>
                      <TableHead className="text-right whitespace-nowrap">缺勤天数</TableHead>
                      <TableHead className="text-right whitespace-nowrap">迟到次数</TableHead>
                      <TableHead className="text-right whitespace-nowrap">请假天数</TableHead>
                      <TableHead className="text-right whitespace-nowrap">加班小时</TableHead>
                      <TableHead className="whitespace-nowrap">备注</TableHead>
                      <TableHead className="text-right whitespace-nowrap">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRecords.includes(record.id)}
                            onCheckedChange={(checked) => handleSelectRecord(record.id, checked)}
                            disabled={!hasPermission('attendance_delete')}
                          />
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {record.employee?.name || '-'}
                        </TableCell>
                        <TableCell 
                          className="whitespace-nowrap text-primary hover:underline cursor-pointer"
                          onClick={() => {
                            if (record.employee?.company_id) {
                              // 跳转到考勤管理页面，并筛选该公司的所有员工考勤记录
                              navigate(`/attendance?company_id=${record.employee.company_id}`);
                            }
                          }}
                        >
                          {record.employee?.company?.name || '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{record.month}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{record.work_days}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{record.absent_days}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{record.late_times}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{record.leave_days}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{record.overtime_hours}</TableCell>
                        <TableCell className="max-w-[200px] truncate whitespace-nowrap">
                          {record.remarks || '-'}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                            disabled={!hasPermission('attendance_delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 上传对话框 */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上传考勤表</DialogTitle>
              <DialogDescription>
                选择Excel文件上传考勤数据，系统将自动拆分每个员工的考勤记录
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>选择公司 *</Label>
                <CompanySelector
                  companies={companies}
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                  placeholder="请选择公司"
                  emptyText="未找到公司"
                  searchPlaceholder="搜索公司名称..."
                />
              </div>
              <div className="space-y-2">
                <Label>默认月份（可选）</Label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  placeholder="如Excel中无月份列，使用此默认值"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-upload">选择Excel文件 *</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={uploading || !selectedCompanyId}
                />
                <p className="text-xs text-muted-foreground">
                  支持.xlsx和.xls格式，文件应包含：姓名、月份、出勤天数、缺勤天数、迟到次数、请假天数、加班小时等列
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
                取消
              </Button>
              <Button onClick={openTemplateDialog} variant="secondary">
                下载模板
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 模板下载对话框 */}
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>下载考勤表模板</DialogTitle>
              <DialogDescription>
                选择公司和月份，系统将生成包含该公司所有员工信息的考勤表模板
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template-company">所属公司 *</Label>
                <CompanySelector
                  companies={companies}
                  value={templateCompanyId}
                  onValueChange={setTemplateCompanyId}
                  placeholder="请选择公司"
                  emptyText="未找到公司"
                  searchPlaceholder="搜索公司名称..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-month">月份 *</Label>
                <Input
                  id="template-month"
                  type="month"
                  value={templateMonth}
                  onChange={(e) => setTemplateMonth(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setTemplateDialogOpen(false)}
              >
                取消
              </Button>
              <Button onClick={downloadTemplate}>
                下载模板
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
