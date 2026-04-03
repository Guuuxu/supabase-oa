import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isSuperAdmin } from '@/lib/utils';
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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getEmployees, getCompanies, createEmployee, updateEmployee, deleteEmployee, createEmployeesBatch } from '@/db/api';
import { EMPLOYEE_STATUS_LABELS } from '@/types/types';
import type { Employee, Company, EmployeeStatus } from '@/types/types';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, AlertCircle, Check, ChevronsUpDown, Upload, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { exportToCSV, formatDate } from '@/utils/exportUtils';
import * as XLSX from 'xlsx';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function EmployeesPage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [batchImportDialogOpen, setBatchImportDialogOpen] = useState(false);
  const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreviewData, setImportPreviewData] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expiringFilter, setExpiringFilter] = useState<number>(0);
  const [companyIdFilter, setCompanyIdFilter] = useState<string>('');
  
  // 批量选择状态
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  
  // 验证相关状态
  const [verifying, setVerifying] = useState(false);
  const [idCardVerified, setIdCardVerified] = useState<boolean | null>(null);
  const [phoneError, setPhoneError] = useState<string>('');
  const [idCardError, setIdCardError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    company_id: '',
    name: '',
    id_card_type: '身份证',
    id_card_number: '',
    gender: '',
    birth_date: '',
    phone: '',
    department: '',
    position: '',
    address: '',
    insurance_start_date: '',
    status: 'active' as EmployeeStatus,
    hire_date: '',
    contract_start_date: '',
    contract_end_date: ''
  });

  useEffect(() => {
    loadData();
    // 处理URL参数
    const status = searchParams.get('status');
    const expiring = searchParams.get('expiring');
    const companyId = searchParams.get('company_id');
    if (status) {
      setStatusFilter(status);
    }
    if (expiring) {
      setExpiringFilter(parseInt(expiring));
    }
    if (companyId) {
      setCompanyIdFilter(companyId);
    }
  }, [profile, searchParams]);

  const loadData = async () => {
    setLoading(true);
    const companyId = isSuperAdmin(profile) ? undefined : (profile?.company_id as string | undefined);
    const [employeesData, companiesData] = await Promise.all([
      getEmployees(companyId),
      getCompanies()
    ]);
    setEmployees(employeesData);
    setCompanies(companiesData);
    setLoading(false);
  };

  // 验证手机号码格式
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('手机号码格式不正确，应为11位数字，以1开头');
      return false;
    }
    setPhoneError('');
    return true;
  };

  // 验证身份证号码格式
  const validateIdCard = (idCard: string): boolean => {
    const idCardRegex = /^\d{17}[\dXx]$/;
    if (!idCardRegex.test(idCard)) {
      setIdCardError('身份证号码格式不正确，应为18位，最后一位可以是数字或X');
      return false;
    }
    setIdCardError('');
    return true;
  };

  // 调用身份证二要素验证API
  const verifyIdCard = async () => {
    if (!formData.name || !formData.id_card_number) {
      toast.error('请先输入姓名和身份证号码');
      return;
    }

    // 先验证格式
    if (!validateIdCard(formData.id_card_number)) {
      return;
    }

    setVerifying(true);
    setIdCardVerified(null);
    
    try {
      const { supabase } = await import('@/db/supabase');
      
      const response = await supabase.functions.invoke(
        `verify-idcard?idcard=${encodeURIComponent(formData.id_card_number)}&name=${encodeURIComponent(formData.name)}`,
        { method: 'GET' }
      );

      if (response.error) {
        const errorMsg = await response.error?.context?.text?.() || response.error.message;
        console.error('身份证验证失败:', errorMsg);
        setIdCardVerified(false);
        setIdCardError(errorMsg || '验证失败');
        toast.error('身份证验证失败: ' + errorMsg);
        return;
      }

      if (response.data?.success && response.data?.data) {
        const result = response.data.data;
        
        if (result.matched) {
          setIdCardVerified(true);
          setIdCardError('');
          
          // 自动填充性别和出生日期
          if (result.sex) {
            const gender = result.sex === 'M' ? '男' : '女';
            setFormData(prev => ({
              ...prev,
              gender: prev.gender || gender,
              birth_date: prev.birth_date || result.birthday
            }));
          }
          
          toast.success('身份证验证通过！已自动填充性别和出生日期');
        } else {
          setIdCardVerified(false);
          setIdCardError(result.message || '姓名与身份证号码不匹配');
          toast.error('验证失败: ' + result.message);
        }
      } else {
        setIdCardVerified(false);
        setIdCardError(response.data?.error || '验证失败');
        toast.error(response.data?.error || '验证失败');
      }
    } catch (error) {
      console.error('身份证验证异常:', error);
      setIdCardVerified(false);
      setIdCardError('验证失败，请稍后重试');
      toast.error('验证失败，请稍后重试');
    } finally {
      setVerifying(false);
    }
  };

  const handleOpenDialog = (employee?: Employee) => {
    // 重置验证状态
    setIdCardVerified(null);
    setPhoneError('');
    setIdCardError('');
    
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        company_id: employee.company_id,
        name: employee.name,
        id_card_type: employee.id_card_type || '身份证',
        id_card_number: employee.id_card_number || '',
        gender: employee.gender || '',
        birth_date: employee.birth_date || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        address: employee.address || '',
        insurance_start_date: employee.insurance_start_date || '',
        status: employee.status,
        hire_date: employee.hire_date || '',
        contract_start_date: employee.contract_start_date || '',
        contract_end_date: employee.contract_end_date || ''
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        company_id: (profile?.company_id || '') as string,
        name: '',
        id_card_type: '身份证',
        id_card_number: '',
        gender: '',
        birth_date: '',
        phone: '',
        department: '',
        position: '',
        address: '',
        insurance_start_date: '',
        status: 'active',
        hire_date: '',
        contract_start_date: '',
        contract_end_date: ''
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证所有必填项（五险参保时间改为可选）
    if (!formData.company_id || !formData.name || 
        !formData.id_card_type || !formData.gender || !formData.birth_date ||
        !formData.phone || !formData.address ||
        !formData.department || !formData.position || 
        !formData.status || !formData.hire_date ||
        !formData.contract_start_date || !formData.contract_end_date) {
      toast.error('请填写所有必填项');
      return;
    }

    // 验证手机号码格式
    if (!validatePhone(formData.phone)) {
      toast.error('手机号码格式不正确');
      return;
    }

    // 验证身份证号码格式
    if (formData.id_card_number && !validateIdCard(formData.id_card_number)) {
      toast.error('身份证号码格式不正确');
      return;
    }

    // 如果身份证号码已填写但未验证，提示用户
    if (formData.id_card_number && idCardVerified === null) {
      toast.error('请先验证身份证信息');
      return;
    }

    // 如果验证失败，不允许提交
    if (formData.id_card_number && idCardVerified === false) {
      toast.error('身份证验证未通过，请检查姓名和身份证号码是否匹配');
      return;
    }

    const submitData = {
      ...formData,
      insurance_start_date: formData.insurance_start_date && formData.insurance_start_date !== '无' ? formData.insurance_start_date : null // 将"无"转换为null
    };

    if (editingEmployee) {
      const success = await updateEmployee(editingEmployee.id, submitData);
      if (success) {
        toast.success('更新成功');
        setDialogOpen(false);
        loadData();
      } else {
        toast.error('更新失败');
      }
    } else {
      try {
        const result = await createEmployee(submitData);
        if (result) {
          toast.success('创建成功');
          setDialogOpen(false);
          loadData();
        } else {
          toast.error('创建失败');
        }
      } catch (error: any) {
        console.error('创建员工失败:', error);
        
        // 检查是否是唯一约束错误
        const errorMessage = error?.message || '';
        if (errorMessage.includes('unique_phone') || errorMessage.includes('phone')) {
          toast.error('该手机号码已被使用，请使用其他手机号码');
        } else if (errorMessage.includes('unique_id_card_number') || errorMessage.includes('id_card_number')) {
          toast.error('该身份证号码已被使用，请检查是否重复添加员工');
        } else {
          toast.error('创建失败: ' + errorMessage);
        }
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个员工吗？')) return;

    const success = await deleteEmployee(id);
    if (success) {
      toast.success('删除成功');
      loadData();
    } else {
      toast.error('删除失败');
    }
  };

  const getStatusBadgeVariant = (status: EmployeeStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'resigned':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const isContractExpiring = (endDate?: string) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  // 根据URL参数筛选员工
  const getFilteredEmployees = () => {
    let filtered = [...employees];

    // 按公司ID筛选
    if (companyIdFilter) {
      filtered = filtered.filter(emp => emp.company_id === companyIdFilter);
    }

    // 按状态筛选
    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    // 按合同到期筛选
    if (expiringFilter > 0) {
      filtered = filtered.filter(emp => {
        if (!emp.contract_end_date) return false;
        const end = new Date(emp.contract_end_date);
        const now = new Date();
        const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= expiringFilter && diffDays >= 0;
      });
    }

    return filtered;
  };

  const filteredEmployees = getFilteredEmployees();

  // 下载Excel模板
  const handleDownloadTemplate = () => {
    const template = [
      {
        '姓名': '张三',
        '证件类型': '身份证',
        '证件号码': '420101199001011234',
        '性别': '男',
        '出生日期': '1990-01-01',
        '联系电话': '13800138000',
        '所属公司': '湖北九头鸟企业服务有限公司',
        '部门': '技术部',
        '岗位': '软件工程师',
        '通讯地址': '湖北省武汉市洪山区光谷大道XXX号',
        '入职日期': '2024-01-01',
        '参保时间': '无',
        '状态': '在职',
        '合同开始日期': '2024-01-01',
        '合同结束日期': '2026-12-31'
      }
    ];

    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(template);
    
    // 设置列宽，确保所有列都有足够的宽度
    const colWidths = [
      { wch: 10 },  // 姓名
      { wch: 12 },  // 证件类型
      { wch: 20 },  // 证件号码
      { wch: 8 },   // 性别
      { wch: 12 },  // 出生日期
      { wch: 15 },  // 联系电话
      { wch: 30 },  // 所属公司
      { wch: 15 },  // 部门
      { wch: 15 },  // 岗位
      { wch: 35 },  // 通讯地址
      { wch: 12 },  // 入职日期
      { wch: 12 },  // 参保时间
      { wch: 10 },  // 状态
      { wch: 15 },  // 合同开始日期
      { wch: 15 }   // 合同结束日期
    ];
    ws['!cols'] = colWidths;
    
    // 设置所有单元格为文本格式，防止数字被自动转换
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) continue;
        
        // 设置单元格格式为文本
        if (!ws[cellAddress].z) {
          ws[cellAddress].z = '@'; // @ 表示文本格式
        }
        
        // 确保单元格类型为字符串
        if (ws[cellAddress].t !== 's') {
          ws[cellAddress].t = 's';
          ws[cellAddress].v = String(ws[cellAddress].v);
        }
      }
    }
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '员工信息');
    XLSX.writeFile(wb, '员工批量导入模板.xlsx');
    toast.success('模板下载成功');
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setImportPreviewData(jsonData);
        toast.success(`成功读取 ${jsonData.length} 条数据`);
      } catch (error) {
        console.error('解析Excel文件失败:', error);
        toast.error('解析Excel文件失败，请检查文件格式');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // 辅助函数：将Excel日期序列号或日期字符串转换为YYYY-MM-DD格式
  const parseExcelDate = (value: any): string => {
    if (!value) return '';
    
    const str = value.toString().trim();
    
    // 如果是无效值，抛出错误
    if (str === '无' || str === '' || str === 'null' || str === 'undefined') {
      throw new Error(`无效的日期值: "${str}"`);
    }
    
    // 如果是纯数字（Excel日期序列号）
    if (/^\d+(\.\d+)?$/.test(str)) {
      try {
        const excelDate = parseFloat(str);
        // Excel日期从1900年1月1日开始计算（但Excel错误地认为1900年是闰年）
        const excelEpoch = new Date(1899, 11, 30); // 1899年12月30日
        const jsDate = new Date(excelEpoch.getTime() + excelDate * 86400000);
        
        const year = jsDate.getFullYear();
        const month = String(jsDate.getMonth() + 1).padStart(2, '0');
        const day = String(jsDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (e) {
        console.error('日期解析错误:', e);
        throw new Error(`无法解析日期: "${str}"`);
      }
    }
    
    // 支持多种日期分隔符：- / . 空格
    // 格式：YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD, YYYY MM DD
    const datePattern = /^\d{4}[-/.\s]\d{1,2}[-/.\s]\d{1,2}$/;
    if (datePattern.test(str)) {
      const parts = str.split(/[-/.\s]/);
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // 尝试解析中文日期格式（如：2024年1月1日）
    const chineseDateMatch = str.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (chineseDateMatch) {
      const year = chineseDateMatch[1];
      const month = chineseDateMatch[2].padStart(2, '0');
      const day = chineseDateMatch[3].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // 尝试解析紧凑格式（如：20240101）
    const compactMatch = str.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (compactMatch) {
      const year = compactMatch[1];
      const month = compactMatch[2];
      const day = compactMatch[3];
      return `${year}-${month}-${day}`;
    }
    
    // 尝试解析短格式（如：24.1.1 或 24/1/1）
    const shortYearPattern = /^(\d{2})[-/.\s](\d{1,2})[-/.\s](\d{1,2})$/;
    if (shortYearPattern.test(str)) {
      const parts = str.split(/[-/.\s]/);
      const year = parseInt(parts[0]) >= 50 ? `19${parts[0]}` : `20${parts[0]}`;
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // 无法识别的格式，抛出错误
    throw new Error(`无法识别的日期格式: "${str}"，支持的格式：YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD, YYYY年MM月DD日, YYYYMMDD`);
  };

  // 执行批量导入
  const handleBatchImport = async () => {
    if (importPreviewData.length === 0) {
      toast.error('请先上传文件');
      return;
    }

    setImporting(true);

    try {
      // 第一步：验证所有数据并收集错误
      const validationErrors: string[] = [];
      const validEmployees: any[] = [];

      for (let index = 0; index < importPreviewData.length; index++) {
        const row = importPreviewData[index];
        const rowNumber = index + 1;
        
        try {
          // 打印行数据用于调试
          console.log(`处理第${rowNumber}行数据:`, row);
          
          // 查找公司ID
          const company = companies.find(c => c.name === row['所属公司']);
          if (!company) {
            validationErrors.push(`第${rowNumber}行：找不到公司 "${row['所属公司']}"`);
            continue;
          }

          // 验证必填字段（参保时间改为可选）
          const requiredFields = [
            { key: '姓名', value: row['姓名'] },
            { key: '证件类型', value: row['证件类型'] },
            { key: '性别', value: row['性别'] },
            { key: '出生日期', value: row['出生日期'] },
            { key: '联系电话', value: row['联系电话'] },
            { key: '部门', value: row['部门'] },
            { key: '岗位', value: row['岗位'] },
            { key: '通讯地址', value: row['通讯地址'] },
            { key: '入职日期', value: row['入职日期'] },
            { key: '合同开始日期', value: row['合同开始日期'] },
            { key: '合同结束日期', value: row['合同结束日期'] }
          ];

          const missingFields: string[] = [];
          for (const field of requiredFields) {
            if (!field.value || field.value.toString().trim() === '' || field.value.toString().trim() === '无') {
              missingFields.push(field.key);
            }
          }

          if (missingFields.length > 0) {
            validationErrors.push(`第${rowNumber}行：缺少必填字段 ${missingFields.join('、')}`);
            continue;
          }

          // 转换状态
          let status: EmployeeStatus = 'active';
          if (row['状态'] === '离职') status = 'resigned';
          else if (row['状态'] === '请假') status = 'on_leave';
          else if (row['状态'] === '休假') status = 'vacation';
          else if (row['状态'] === '待岗') status = 'standby';
          else if (row['状态'] === '出差') status = 'business_trip';

          // 构建员工数据
          const employeeData = {
            company_id: company.id,
            name: row['姓名'].toString().trim(),
            id_card_type: row['证件类型'].toString().trim(),
            id_card_number: row['证件号码'] ? row['证件号码'].toString().trim() : '',
            gender: row['性别'].toString().trim(),
            birth_date: parseExcelDate(row['出生日期']),
            phone: row['联系电话'].toString().trim(),
            department: row['部门'].toString().trim(),
            position: row['岗位'].toString().trim(),
            address: row['通讯地址'].toString().trim(),
            insurance_start_date: row['参保时间'] && row['参保时间'].toString().trim() !== '无' ? parseExcelDate(row['参保时间']) : null,
            status,
            hire_date: parseExcelDate(row['入职日期']),
            contract_start_date: parseExcelDate(row['合同开始日期']),
            contract_end_date: parseExcelDate(row['合同结束日期'])
          };

          validEmployees.push(employeeData);
        } catch (error: any) {
          validationErrors.push(`第${rowNumber}行：${error.message}`);
        }
      }

      // 如果所有数据都验证失败，直接返回
      if (validEmployees.length === 0) {
        toast.error(`数据验证失败，共 ${validationErrors.length} 条错误`);
        console.error('验证错误:', validationErrors);
        // 显示前5条错误
        if (validationErrors.length > 0) {
          const errorMsg = validationErrors.slice(0, 5).join('\n');
          toast.error(errorMsg, { duration: 8000 });
        }
        setImporting(false);
        return;
      }

      // 第二步：导入有效数据
      const result = await createEmployeesBatch(validEmployees);
      
      // 合并验证错误和导入错误
      const allErrors = [...validationErrors, ...result.errors];
      
      // 显示结果
      if (result.success > 0) {
        const successMsg = `成功导入 ${result.success} 条数据`;
        const failMsg = allErrors.length > 0 ? `，失败 ${allErrors.length} 条` : '';
        toast.success(successMsg + failMsg, { duration: 5000 });
        
        if (allErrors.length > 0) {
          console.error('导入错误详情:', allErrors);
          // 显示前3条错误
          const errorPreview = allErrors.slice(0, 3).join('\n');
          toast.error(`错误详情：\n${errorPreview}${allErrors.length > 3 ? `\n...还有${allErrors.length - 3}条错误，请查看控制台` : ''}`, { 
            duration: 10000 
          });
        }
        
        loadData();
        setBatchImportDialogOpen(false);
        setImportFile(null);
        setImportPreviewData([]);
      } else {
        toast.error(`导入失败，共 ${allErrors.length} 条错误`);
        if (allErrors.length > 0) {
          console.error('导入错误详情:', allErrors);
          // 显示前5条错误
          const errorPreview = allErrors.slice(0, 5).join('\n');
          toast.error(`错误详情：\n${errorPreview}${allErrors.length > 5 ? `\n...还有${allErrors.length - 5}条错误，请查看控制台` : ''}`, { 
            duration: 10000 
          });
        }
      }
    } catch (error: any) {
      console.error('批量导入失败:', error);
      toast.error(error.message || '批量导入失败');
    } finally {
      setImporting(false);
    }
  };


  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">员工管理</h1>
            <p className="text-muted-foreground mt-2">管理员工信息和状态</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={batchImportDialogOpen} onOpenChange={setBatchImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  批量导入
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>批量导入员工</DialogTitle>
                  <DialogDescription>
                    下载模板，填写员工信息后上传Excel文件进行批量导入
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={handleDownloadTemplate}>
                      <Download className="mr-2 h-4 w-4" />
                      下载Excel模板
                    </Button>
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  {importPreviewData.length > 0 && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">数据预览（共 {importPreviewData.length} 条）</h3>
                      <div className="max-h-96 overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>姓名</TableHead>
                              <TableHead>证件类型</TableHead>
                              <TableHead>证件号码</TableHead>
                              <TableHead>性别</TableHead>
                              <TableHead>出生日期</TableHead>
                              <TableHead>联系电话</TableHead>
                              <TableHead>所属公司</TableHead>
                              <TableHead>部门</TableHead>
                              <TableHead>岗位</TableHead>
                              <TableHead>通讯地址</TableHead>
                              <TableHead>入职日期</TableHead>
                              <TableHead>参保时间</TableHead>
                              <TableHead>状态</TableHead>
                              <TableHead>合同开始</TableHead>
                              <TableHead>合同结束</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {importPreviewData.slice(0, 10).map((row: any, index) => (
                              <TableRow key={index}>
                                <TableCell>{row['姓名']}</TableCell>
                                <TableCell>{row['证件类型']}</TableCell>
                                <TableCell>{row['证件号码'] || '-'}</TableCell>
                                <TableCell>{row['性别']}</TableCell>
                                <TableCell>{row['出生日期']}</TableCell>
                                <TableCell>{row['联系电话']}</TableCell>
                                <TableCell>{row['所属公司']}</TableCell>
                                <TableCell>{row['部门']}</TableCell>
                                <TableCell>{row['岗位']}</TableCell>
                                <TableCell>{row['通讯地址']}</TableCell>
                                <TableCell>{row['入职日期']}</TableCell>
                                <TableCell>{row['参保时间']}</TableCell>
                                <TableCell>{row['状态']}</TableCell>
                                <TableCell>{row['合同开始日期']}</TableCell>
                                <TableCell>{row['合同结束日期']}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {importPreviewData.length > 10 && (
                          <p className="text-sm text-muted-foreground mt-2 text-center">
                            仅显示前10条数据，共 {importPreviewData.length} 条
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setBatchImportDialogOpen(false);
                      setImportFile(null);
                      setImportPreviewData([]);
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    type="button"
                    onClick={handleBatchImport}
                    disabled={importing || importPreviewData.length === 0}
                  >
                    {importing ? '导入中...' : '确认导入'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加员工
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingEmployee ? '编辑员工' : '添加员工'}</DialogTitle>
                  <DialogDescription>
                    {editingEmployee ? '修改员工信息' : '创建新的员工'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_id">所属公司 *</Label>
                    <Popover open={companyPopoverOpen} onOpenChange={setCompanyPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={companyPopoverOpen}
                          className="w-full justify-between"
                        >
                          {formData.company_id
                            ? companies.find((company) => company.id === formData.company_id)?.name
                            : "选择公司"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="搜索公司名称..." />
                          <CommandList>
                            <CommandEmpty>未找到匹配的公司</CommandEmpty>
                            <CommandGroup>
                              {companies.map((company) => (
                                <CommandItem
                                  key={company.id}
                                  value={company.name}
                                  onSelect={() => {
                                    setFormData({ ...formData, company_id: company.id });
                                    setCompanyPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.company_id === company.id ? "opacity-100" : "opacity-0"
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
                    <Label htmlFor="name">姓名 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="请输入姓名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id_card_type">证件类型 *</Label>
                    <Select
                      value={formData.id_card_type}
                      onValueChange={(value) => setFormData({ ...formData, id_card_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="身份证">身份证</SelectItem>
                        <SelectItem value="护照">护照</SelectItem>
                        <SelectItem value="港澳通行证">港澳通行证</SelectItem>
                        <SelectItem value="台湾通行证">台湾通行证</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id_card_number">证件号码</Label>
                    <div className="flex gap-2">
                      <Input
                        id="id_card_number"
                        value={formData.id_card_number}
                        onChange={(e) => {
                          setFormData({ ...formData, id_card_number: e.target.value });
                          setIdCardVerified(null);
                          setIdCardError('');
                        }}
                        onBlur={() => {
                          if (formData.id_card_number) {
                            validateIdCard(formData.id_card_number);
                          }
                        }}
                        placeholder="请输入18位身份证号码"
                        className={cn(
                          idCardVerified === true && "border-green-500",
                          idCardVerified === false && "border-red-500"
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={verifyIdCard}
                        disabled={verifying || !formData.name || !formData.id_card_number}
                        className="shrink-0"
                      >
                        {verifying ? '验证中...' : idCardVerified === true ? '✓ 已验证' : '验证'}
                      </Button>
                    </div>
                    {idCardError && (
                      <p className="text-xs text-red-500">{idCardError}</p>
                    )}
                    {idCardVerified === true && (
                      <p className="text-xs text-green-600">✓ 身份证验证通过</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      输入姓名和身份证号后点击验证按钮
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">性别 *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="男">男</SelectItem>
                        <SelectItem value="女">女</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">出生日期 *</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">手机号 *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        setPhoneError('');
                      }}
                      onBlur={() => {
                        if (formData.phone) {
                          validatePhone(formData.phone);
                        }
                      }}
                      placeholder="请输入11位手机号码"
                      maxLength={11}
                      className={phoneError ? "border-red-500" : ""}
                    />
                    {phoneError && (
                      <p className="text-xs text-red-500">{phoneError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      手机号码必须为11位，以1开头
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">通讯地址 *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="请输入通讯地址"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">部门 *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="请输入部门"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">职位 *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="请输入职位"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">状态 *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as EmployeeStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EMPLOYEE_STATUS_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label as string}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hire_date">入职日期 *</Label>
                    <Input
                      id="hire_date"
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance_start_date">五险参保时间</Label>
                    <Input
                      id="insurance_start_date"
                      type="text"
                      value={formData.insurance_start_date}
                      onChange={(e) => setFormData({ ...formData, insurance_start_date: e.target.value })}
                      placeholder="请输入参保时间（可选）"
                    />
                  </div>
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
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    {editingEmployee ? '保存' : '创建'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>员工列表</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {statusFilter || expiringFilter || companyIdFilter ? '暂无符合条件的员工' : '暂无员工数据'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[1800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] whitespace-nowrap">姓名</TableHead>
                        <TableHead className="w-[200px] whitespace-nowrap">所属公司</TableHead>
                        <TableHead className="w-[100px] whitespace-nowrap">证件类型</TableHead>
                        <TableHead className="w-[150px] whitespace-nowrap">证件号码</TableHead>
                        <TableHead className="w-[80px] whitespace-nowrap">性别</TableHead>
                        <TableHead className="w-[120px] whitespace-nowrap">出生日期</TableHead>
                        <TableHead className="w-[120px] whitespace-nowrap">联系电话</TableHead>
                        <TableHead className="w-[120px] whitespace-nowrap">部门</TableHead>
                        <TableHead className="w-[120px] whitespace-nowrap">职位</TableHead>
                        <TableHead className="w-[150px] whitespace-nowrap">通讯地址</TableHead>
                        <TableHead className="w-[120px] whitespace-nowrap">入职时间</TableHead>
                        <TableHead className="w-[120px] whitespace-nowrap">参保时间</TableHead>
                        <TableHead className="w-[100px] whitespace-nowrap">状态</TableHead>
                        <TableHead className="w-[140px] whitespace-nowrap">合同到期</TableHead>
                        <TableHead className="w-[120px] text-right whitespace-nowrap">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell 
                            className="font-medium whitespace-nowrap text-primary hover:underline cursor-pointer"
                            onClick={() => navigate(`/employees/${employee.id}`)}
                          >
                            {employee.name}
                          </TableCell>
                          <TableCell 
                            className="whitespace-nowrap text-primary hover:underline cursor-pointer"
                            onClick={() => {
                              if (employee.company?.id) {
                                // 跳转到员工管理页面，并筛选该公司的所有员工
                                navigate(`/employees?company_id=${employee.company.id}`);
                              }
                            }}
                          >
                            {employee.company?.name || '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{employee.id_card_type || '身份证'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employee.id_card_number || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employee.gender || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employee.birth_date || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employee.phone || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employee.department || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employee.position || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employee.address || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employee.hire_date || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">{employee.insurance_start_date || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant={getStatusBadgeVariant(employee.status)}>
                              {EMPLOYEE_STATUS_LABELS[employee.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                          {employee.contract_end_date ? (
                            <div className="flex items-center gap-1">
                              {isContractExpiring(employee.contract_end_date) && (
                                <AlertCircle className="h-4 w-4 text-destructive" />
                              )}
                              <span className={isContractExpiring(employee.contract_end_date) ? 'text-destructive' : ''}>
                                {employee.contract_end_date}
                              </span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(employee)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(employee.id)}
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
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
