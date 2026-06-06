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
import { Send, Trash2, Search, FileText, Calendar, Download, Undo2, Eye, CloudDownload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getSalarySignatures,
  deleteSalarySignature,
  deleteAttendanceSignature,
  updateSalarySignature,
  getCompanies,
  getDocumentTemplates,
  getEmployees,
  getSalaryRecords,
  getSalaryItems,
  createSalarySignaturesBatch,
  addAsignSignatory,
  downloadAsignContractAndSyncArchive,
  withdrawAsignContract,
  getAttendanceRecords,
} from '@/db/api';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type {
  SalarySignature,
  AttendanceSignature,
  AttendanceRecord,
  Company,
  SalarySignatureStatus,
  SalarySignatureType,
  DocumentTemplate,
  Employee,
  SalaryStructureField,
} from '@/types/types';
import type { AsignContractFillCompany, AsignContractFillEmployee } from '@/utils/asignFillData';
import { buildAsignFillDataFromAttendanceRecord, buildSalarySigningPeriodFillData } from '@/utils/asignFillData';
import {
  extractAsignCreateContractPreviewUrl,
  buildAsignStrangersForSalarySigning,
  invokeAsignTemplateCreateSigning,
} from '@/utils/asignSalaryInvokeCreateSigning';
import {
  extractAsignTemplateControlHints,
  mergeTemplateDateSignKeysForAddSigner,
  pickAsignPartyBMainSignKey,
  type AsignTemplateControlHints,
} from '@/utils/extractAsignTemplateControlHints';
import { SALARY_SIGNATURE_STATUS_LABELS, ATTENDANCE_SIGNATURE_STATUS_LABELS } from '@/types/types';
import { exportToCSV, formatDateTime } from '@/utils/exportUtils';

/** 统一薪酬签署流程：不再区分考勤/工资条，全部按薪酬签署处理。 */
function inferSalarySignatureTypeFromTemplateName(name: string): SalarySignatureType | null {
  const n = (name || '').trim();
  if (!n) {
    return null;
  }
  return 'salary_slip';
}

function employeeToAsignFill(employee: Employee): AsignContractFillEmployee {
  return {
    name: employee.name || '',
    id_card: employee.id_card_number || '',
    phone: employee.phone || '',
    email: '',
    department: employee.department || '',
    position: employee.position || '',
    hire_date: employee.hire_date || '',
    contract_start_date: employee.contract_start_date || '',
    contract_end_date: employee.contract_end_date || '',
    address: employee.address || '',
    id_card_type: employee.id_card_type || '身份证',
    gender: employee.gender || '',
    birth_date: employee.birth_date || '',
    insurance_start_date: employee.insurance_start_date || '',
  };
}

function companyToAsignFill(company: Company): AsignContractFillCompany {
  return {
    name: company.name || '',
    code: company.credit_no || '',
    address: company.address || '',
    contact_person: company.contact_person || '',
    contact_phone: company.contact_phone || '',
    legal_representative: company.legal_person || '',
    region: company.region || '',
    payday_date: company.payday_date ?? null,
    base_salary: company.base_salary != null ? Number(company.base_salary) : null,
    social_insurance_subsidy:
      company.social_insurance_subsidy != null ? Number(company.social_insurance_subsidy) : null,
  };
}

function toAsignFillString(v: unknown): string {
  if (v === null || v === undefined) {
    return '';
  }
  if (typeof v === 'number') {
    return Number.isFinite(v) ? String(v) : '';
  }
  return String(v).trim();
}

/**
 * 工资条 `item.data` → 爱签 fillData 的「金额与工资项」片段（不含员工/公司主体字段，由 invoke 内 buildAsignFillDataForContract 合并）。
 *
 * 带入规则（按优先级）：
 * 1. **原样写入**：`data` 里每个键都会写入（含 `{{键}}` 变体）。上传工资表时写入的是工资结构里的 **field.code**，故爱签控件 dataKey 与 code 一致时无需配置即可带入。
 * 2. **别名 aliasPairs**：模板 dataKey 与 Excel/code 不一致时，增加一行 `[ '爱签上的键', '工资条里已有的键' ]`；单向 `[ '键' ]` 仅当两名称相同才生效。
 * 3. **考勤**：`出勤/缺勤/迟到…` 等汇总项由 `buildAsignFillDataFromAttendanceRecord` 在页面里与本结果合并；库表无字段的项（如旷工天数）仍须出现在工资条 `data` 或别名字段中。
 *
 * 本函数返回值会作为 `invokeAsignTemplateCreateSigning` 的 `extraFillData` 与员工/公司 fill 合并进 `fillData`（见 `asignSalaryInvokeCreateSigning.ts`）。`aliasPairs` 中若工资条无对应列，仍会写入该键（空字符串），以免爱签报缺键；非空值由考勤或工资条其它列覆盖。
 *
 * `structureFields`：当前工资记录使用的 `salary_structure_templates.fields`。上传工资表时 `data` 的键多为 **field.code**，爱签控件 dataKey 常为 **field.name**（中文），传入后会把同一数值同时写入 name 与 code，避免预览空白。
 */
function buildSalaryExtraFillData(
  data: Record<string, number | string> | undefined,
  structureFields?: SalaryStructureField[] | null,
): Record<string, string> {
  /** 无工资条 data 时仍参与别名占位，便于与考勤/期间 fill 合并后爱签能收到完整键名 */
  const row = data ?? {};
  const out: Record<string, string> = {};
  const add = (key: string, value: unknown) => {
    const normalized = toAsignFillString(value);
    out[key] = normalized;
    out[`{{${key}}}`] = normalized;
  };

  for (const [k, v] of Object.entries(row)) {
    add(k, v);
  }

  const aliasPairs: Array<[string, string] | [string]> = [
    ['月份'],
    ['出勤工资', '基本工资'],
    ['position_salary', '岗位工资'],
    ['绩效工资', '绩效奖金'],
    [ '年休假工资'],
    ['加班', '加班小时'],
    ['平时加班工资', '加班费'],
    ['周末加班工资', '周末加班费'],
    ['节假日加班工资', '节假日加班费'],
    ['交通补贴', '交通补贴'],
    ['餐补', '餐补'],
    ['通讯补贴', '通讯补贴'],
    ['应发工资', '应发合计'],
    ['经济补偿金'],
    [ '社会保险补贴'],
    ['公积金补贴'],
    ['高温低温补贴'],
    ['保密补贴'],
    ['竞业补贴'],
    ['岗位补贴'],
    ['失业待遇补贴'],
    ['住房扣款', '住房扣款'],
    ['伙食扣款'],
    ['借款抵扣'],
    ['社保个人部分','个人社会保险扣款'],
    ['公积金个人部分','个人公积金扣款'],
    ['个人所得税', '个人所得税扣款'],
    ['预支工资'],
    ['个人借款'],
    ['其它扣除', '其他扣除'],
    ['应扣合计'],
    ['实发工资', '实发工资'],
    ['出勤', '出勤天数'],
    ['缺勤天数', '缺勤'],
    ['节假日加班', '节假日加班费'],
    ['迟到', '迟到次数'],
    ['早退', '早退天数'],
    ['旷工', '旷工天数'],
    ['请假', '请假天数'],
    ['病假'],
    ['事假'],
    ['年假'],
    ['婚假'],
    ['产假'],
    ['陪产假'],
    ['丧假'],
    ['旷工'],
    ['调休'],
    ['备注']
  ];

  for (const pair of aliasPairs) {
    const code = pair[0];
    if (code === undefined || code === '') {
      continue;
    }
    const label = pair.length >= 2 && pair[1] !== undefined ? pair[1] : code;
    const codeValue = row[code];
    const labelValue = row[label];
    if (codeValue !== undefined) {
      add(code, codeValue);
      if (label !== code) {
        add(label, codeValue);
      }
    } else if (labelValue !== undefined) {
      add(code, labelValue);
      if (label !== code) {
        add(label, labelValue);
      }
    } else {
      /** 工资条中无对应列时仍写入键（空串），避免爱签报「缺少模板参数」；后续 extraFillData 里考勤/期间可覆盖 */
      if (!(code in out)) {
        add(code, '');
      }
      if (label !== code && !(label in out)) {
        add(label, '');
      }
    }
  }

  /** 按工资结构模板定义，把 row[code] 同步到爱签常用的中文 dataKey（field.name） */
  if (Array.isArray(structureFields) && structureFields.length > 0) {
    for (const f of structureFields) {
      const name = (f.name || '').trim();
      const code = (f.code || '').trim();
      if (!name && !code) {
        continue;
      }
      let picked: number | string | undefined;
      if (code && row[code] !== undefined && row[code] !== null && row[code] !== '') {
        picked = row[code] as number | string;
      } else if (name && row[name] !== undefined && row[name] !== null && row[name] !== '') {
        picked = row[name] as number | string;
      }
      if (picked === undefined) {
        continue;
      }
      if (name) {
        add(name, picked);
      }
      if (code && code !== name) {
        add(code, picked);
      }
    }
  }

  const socialValue = row.social_insurance_personal ?? row['社保个人部分'] ?? row['社保个人'];
  if (socialValue !== undefined) {
    add('社保个人', socialValue);
    add('社保个人部分', socialValue);
  }
  const housingValue = row.housing_fund_personal ?? row['公积金个人部分'] ?? row['公积金个人'];
  if (housingValue !== undefined) {
    add('公积金个人', housingValue);
    add('公积金个人部分', housingValue);
  }

  return out;
}

export default function SalarySignaturesPage() {
  const { profile } = useAuth();
  const [signatures, setSignatures] = useState<SalarySignature[]>([]);
  const [salaryStatusTab, setSalaryStatusTab] = useState<'unfinished' | 'finished'>('unfinished');
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
  const [salaryDetailDialogOpen, setSalaryDetailDialogOpen] = useState(false);
  const [selectedSalarySignature, setSelectedSalarySignature] = useState<SalarySignature | null>(null);
  // 批量选择相关状态
  const [selectedSalaryIds, setSelectedSalaryIds] = useState<string[]>([]);
  const [selectedAttendanceIds, setSelectedAttendanceIds] = useState<string[]>([]);
  
  // 分页相关状态
  const [salaryCurrentPage, setSalaryCurrentPage] = useState(1);
  const [attendanceCurrentPage, setAttendanceCurrentPage] = useState(1);
  const pageSize = 15; // 每页显示15条
  
  // 批量发起（爱签预览）相关状态
  const [batchSendDialogOpen, setBatchSendDialogOpen] = useState(false);
  const [batchSendCompany, setBatchSendCompany] = useState<string>('');
  const [batchSendYearMonth, setBatchSendYearMonth] = useState<string>('');
  const [compensationTemplates, setCompensationTemplates] = useState<DocumentTemplate[]>([]);
  const [batchSendTemplateIds, setBatchSendTemplateIds] = useState<string[]>([]);
  const [batchSendEmployees, setBatchSendEmployees] = useState<Employee[]>([]);
  const [batchSendEmployeeIds, setBatchSendEmployeeIds] = useState<string[]>([]);
  const [isCreatingSalaryAsignPreview, setIsCreatingSalaryAsignPreview] = useState(false);
  const [batchSendProgress, setBatchSendProgress] = useState({ current: 0, total: 0 });

  const [salaryPreviewFileUrl, setSalaryPreviewFileUrl] = useState('');
  const [salaryBatchPreviewItems, setSalaryBatchPreviewItems] = useState<
    Array<{ key: string; label: string; previewUrl: string }>
  >([]);
  const [salarySelectedBatchPreviewKey, setSalarySelectedBatchPreviewKey] = useState<string | null>(null);
  const [salaryLaunchDrafts, setSalaryLaunchDrafts] = useState<
    Array<{
      key: string;
      signaturePayload: Omit<SalarySignature, 'id' | 'created_at' | 'updated_at'>;
      employee: Employee;
      template: DocumentTemplate;
      contractNo: string;
      asignRaw: unknown;
      asignTemplateHints?: AsignTemplateControlHints;
      companyFill: AsignContractFillCompany;
      extraFillData?: Record<string, string>;
    }>
  >([]);
  const [launchingSalarySigning, setLaunchingSalarySigning] = useState(false);
  const [syncingSalarySignatureId, setSyncingSalarySignatureId] = useState<string | null>(null);

  useEffect(() => {
    if (salaryBatchPreviewItems.length <= 1) {
      setSalarySelectedBatchPreviewKey(null);
      return;
    }
    setSalarySelectedBatchPreviewKey((prev) =>
      prev != null && salaryBatchPreviewItems.some((x) => x.key === prev)
        ? prev
        : salaryBatchPreviewItems[0].key,
    );
  }, [salaryBatchPreviewItems]);

  useEffect(() => {
    if (!batchSendDialogOpen || !batchSendCompany) {
      setCompensationTemplates([]);
      setBatchSendTemplateIds([]);
      setBatchSendEmployees([]);
      setBatchSendEmployeeIds([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const [all, employees] = await Promise.all([
        getDocumentTemplates(batchSendCompany),
        getEmployees(batchSendCompany),
      ]);
      if (cancelled) {
        return;
      }
      const comp = all.filter((t) => t.category === 'compensation' && t.is_active);
      setCompensationTemplates(comp);
      setBatchSendTemplateIds([]);
      setBatchSendEmployees(employees);
      setBatchSendEmployeeIds([]);
    })();
    return () => {
      cancelled = true;
    };
  }, [batchSendDialogOpen, batchSendCompany]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [signaturesData, companiesData] = await Promise.all([
      getSalarySignatures(),
      getCompanies()
    ]);
    setSignatures(signaturesData);
    setAttendanceSignatures([]);
    setCompanies(companiesData);
    setLoading(false);
  };

  const withdrawContractIfNeeded = async (signature: SalarySignature): Promise<boolean> => {
    const contractNo = String(signature.third_party_contract_no ?? '').trim();
    if (!contractNo) {
      return true;
    }
    const withdrawRes = await withdrawAsignContract({
      contractNo,
      withdrawReason: '业务侧撤回薪酬签署记录',
      isNoticeSignUser: false,
    });
    if (!withdrawRes.ok) {
      let detailText = '';
      if (withdrawRes.detail !== undefined) {
        if (typeof withdrawRes.detail === 'string') {
          detailText = withdrawRes.detail;
        } else {
          detailText = JSON.stringify(withdrawRes.detail);
        }
      }
      toast.error('撤回爱签合同失败', detailText ? { description: detailText.slice(0, 220) } : undefined);
      return false;
    }
    return true;
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

    try {
      const withdrawSuccess = await withdrawContractIfNeeded(signature);
      if (!withdrawSuccess) {
        return;
      }

      const success = await updateSalarySignature(signature.id, {
        status: 'revoked',
        sent_at: undefined
      });

      if (success) {
        toast.success('撤回成功');
        loadData();
      } else {
        toast.error('撤回失败');
      }
    } catch (error) {
      console.error('撤回签署失败:', error);
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

  const handleOpenSalaryDetail = (signature: SalarySignature) => {
    setSelectedSalarySignature(signature);
    setSalaryDetailDialogOpen(true);
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
        const withdrawSuccess = await withdrawContractIfNeeded(signature);
        if (!withdrawSuccess) {
          failCount++;
          continue;
        }
        const success = await updateSalarySignature(id, {
          status: 'revoked',
          sent_at: undefined
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
        employee_name: signature.employee?.name || '',
        company_name: signature.company?.name || '',
        year_month: `${signature.year}年${signature.month}月`,
        status: SALARY_SIGNATURE_STATUS_LABELS[signature.status] || signature.status,
        created_at: formatDateTime(signature.created_at),
        signed_at: formatDateTime(signature.signed_at),
        employee_phone: signature.employee?.phone || '',
        department: signature.employee?.department || ''
      }));

      const headers = [
        { key: 'employee_name' as const, label: '员工姓名' },
        { key: 'company_name' as const, label: '公司名称' },
        { key: 'year_month' as const, label: '年月' },
        { key: 'status' as const, label: '状态' },
        { key: 'created_at' as const, label: '创建时间' },
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
        employee_name: signature.employee?.name || '',
        company_name: signature.company?.name || '',
        year_month: `${signature.year}年${signature.month}月`,
        status: ATTENDANCE_SIGNATURE_STATUS_LABELS[signature.status] || signature.status,
        created_at: formatDateTime(signature.created_at),
        signed_at: formatDateTime(signature.signed_at),
        employee_phone: signature.employee?.phone || '',
        department: signature.employee?.department || ''
      }));

      const headers = [
        { key: 'employee_name' as const, label: '员工姓名' },
        { key: 'company_name' as const, label: '公司名称' },
        { key: 'year_month' as const, label: '年月' },
        { key: 'status' as const, label: '状态' },
        { key: 'created_at' as const, label: '创建时间' },
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
   * 集成流程（爱签等）：发起签署、员工完成签署后，由电子签回调或同步更新
   * salary_signatures.signed_file_url，用户即可通过此功能下载/查看已签署文件。
   */
  const handleDownloadSignedFile = async (signature: SalarySignature) => {
    if (!signature.signed_file_url) {
      toast.error('签署文件不存在');
      return;
    }
    
    // 检查URL是否为示例URL
    if (signature.signed_file_url.includes('example.com')) {
      toast.error('这是示例数据，真实文件URL需要在签署完成后由电子签系统返回');
      return;
    }
    
    // 强制下载：先拉取二进制，再用 blob URL 触发浏览器下载
    try {
      const response = await fetch(signature.signed_file_url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `薪资签署文件_${signature.id.slice(0, 8)}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success('开始下载签署文件');
    } catch (error) {
      console.error('下载文件失败:', error);
      toast.error('下载文件失败，请检查文件URL是否有效');
    }
  };

  /** 新标签页预览已签署文件（与「下载」区分） */
  const handlePreviewSignedFile = (signature: SalarySignature) => {
    if (!signature.signed_file_url) {
      toast.error('签署文件不存在');
      return;
    }
    if (signature.signed_file_url.includes('example.com')) {
      toast.error('这是示例数据，真实文件URL需要在签署完成后由电子签系统返回');
      return;
    }
    try {
      window.open(signature.signed_file_url, '_blank', 'noopener,noreferrer');
      toast.success('正在打开文件预览…');
    } catch (error) {
      console.error('预览文件失败:', error);
      toast.error('预览文件失败');
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
      setSelectedSalarySignature((prev) => {
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
      console.error('[SALARY_SIGN_SYNC] 同步失败', error);
      toast.error('同步失败');
    } finally {
      setSyncingSalarySignatureId(null);
    }
  };

  // 下载已签署的考勤文件
  const handleDownloadAttendanceFile = (signature: AttendanceSignature) => {
    const signedFileUrl = (signature as AttendanceSignature & { signed_file_url?: string }).signed_file_url;
    if (!signedFileUrl) {
      toast.error('签署文件不存在');
      return;
    }
    
    // 检查URL是否为示例URL
    if (signedFileUrl.includes('example.com')) {
      toast.error('这是示例数据，真实文件URL需要在签署完成后由电子签系统返回');
      return;
    }
    
    // 打开新窗口查看/下载文件
    try {
      window.open(signedFileUrl, '_blank');
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
  const statusFilteredSalarySignatures = filteredSalarySignatures.filter((s) => {
    if (salaryStatusTab === 'unfinished') {
      return s.status === 'pending' || s.status === 'sent';
    }
    return s.status === 'signed' || s.status === 'rejected' || s.status === 'revoked';
  });

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
  const salaryTotalPages = Math.ceil(statusFilteredSalarySignatures.length / pageSize);
  const salaryStartIndex = (salaryCurrentPage - 1) * pageSize;
  const salaryEndIndex = salaryStartIndex + pageSize;
  const paginatedSalarySignatures = statusFilteredSalarySignatures.slice(salaryStartIndex, salaryEndIndex);

  const attendanceTotalPages = Math.ceil(filteredAttendanceSignatures.length / pageSize);
  const attendanceStartIndex = (attendanceCurrentPage - 1) * pageSize;
  const attendanceEndIndex = attendanceStartIndex + pageSize;
  const paginatedAttendanceSignatures = filteredAttendanceSignatures.slice(attendanceStartIndex, attendanceEndIndex);

  // 打开批量发起对话框
  const handleOpenBatchSend = () => {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setBatchSendYearMonth(yearMonth);
    setBatchSendCompany('');
    setCompensationTemplates([]);
    setBatchSendTemplateIds([]);
    setBatchSendEmployees([]);
    setBatchSendEmployeeIds([]);
    setBatchSendProgress({ current: 0, total: 0 });
    setSalaryLaunchDrafts([]);
    setBatchSendDialogOpen(true);
  };

  const tryCloseBatchSendDialog = () => {
    if (isCreatingSalaryAsignPreview) {
      toast.error('正在处理中，请稍候...');
      return;
    }
    setSalaryLaunchDrafts([]);
    setBatchSendDialogOpen(false);
  };

  const handleBatchSendDialogOpenChange = (open: boolean) => {
    if (!open) {
      tryCloseBatchSendDialog();
    }
  };

  const handleCompensationTemplateToggle = (templateId: string) => {
    setBatchSendTemplateIds((prev) => {
      if (prev.includes(templateId)) {
        return prev.filter((id) => id !== templateId);
      }
      return [...prev, templateId];
    });
  };

  const handleBatchSendEmployeeToggle = (employeeId: string) => {
    setBatchSendEmployeeIds((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      }
      return [...prev, employeeId];
    });
  };

  const handleBatchSendEmployeeToggleAll = () => {
    const allIds = batchSendEmployees.map((e) => e.id);
    setBatchSendEmployeeIds((prev) => {
      if (prev.length === allIds.length) {
        return [];
      }
      return allIds;
    });
  };

  /** 第一步：通过 create-signing 生成爱签待签文件并预览（不落库签署记录） */
  const handleBatchSendConfirm = async () => {
    if (!batchSendCompany) {
      toast.error('请选择公司');
      return;
    }

    if (!batchSendYearMonth) {
      toast.error('请选择年月');
      return;
    }

    if (batchSendTemplateIds.length === 0) {
      toast.error('请至少选择一种待签署文件类型（文书模板）');
      return;
    }
    if (batchSendEmployeeIds.length === 0) {
      toast.error('请至少选择一名员工');
      return;
    }

    const selectedTemplates = compensationTemplates.filter((t) => batchSendTemplateIds.includes(t.id));
    const missingAsign = selectedTemplates.filter((t) => !(t.asign_template_ident || '').trim());
    console.group('[SALARY_SIGN_TRACE] batchSend template check');
    console.log('[SALARY_SIGN_TRACE] selectedTemplateIds', batchSendTemplateIds);
    console.log(
      '[SALARY_SIGN_TRACE] compensationTemplates',
      compensationTemplates.map((t) => ({
        id: t.id,
        name: t.name,
        asign_template_ident: t.asign_template_ident || '',
      })),
    );
    console.log(
      '[SALARY_SIGN_TRACE] selectedTemplates',
      selectedTemplates.map((t) => ({
        id: t.id,
        name: t.name,
        asign_template_ident: t.asign_template_ident || '',
      })),
    );
    console.log(
      '[SALARY_SIGN_TRACE] missingAsignTemplates',
      missingAsign.map((t) => ({
        id: t.id,
        name: t.name,
      })),
    );
    console.groupEnd();
    if (missingAsign.length > 0) {
      toast.error(
        `以下文书未配置爱签模板编号，无法创建预览：${missingAsign.map((t) => t.name).join('、')}`,
      );
      return;
    }

    const typeByTemplate = new Map<string, SalarySignatureType>();
    for (const t of selectedTemplates) {
      const st = inferSalarySignatureTypeFromTemplateName(t.name);
      if (!st) {
        toast.error(
          `文书「${t.name}」无法匹配签署类型，请将模板名称包含「工资」「薪」「绩效」或「考勤」之一。`,
        );
        return;
      }
      typeByTemplate.set(t.id, st);
    }

    const [year, month] = batchSendYearMonth.split('-').map(Number);
    const employees = batchSendEmployees;
    const empById = new Map(employees.map((e) => [e.id, e]));
    const selectedEmployeeIdSet = new Set(batchSendEmployeeIds);
    const existingMonthRecords = signatures.filter((sig) => {
      if (sig.company_id !== batchSendCompany) {
        return false;
      }
      if (sig.year !== year || sig.month !== month) {
        return false;
      }
      return selectedEmployeeIdSet.has(sig.employee_id);
    });
    if (existingMonthRecords.length > 0) {
      const existedEmployeeNames = Array.from(
        new Set(
          existingMonthRecords.map((sig) => {
            const localEmployee = empById.get(sig.employee_id);
            if (localEmployee && localEmployee.name) {
              return localEmployee.name;
            }
            if (sig.employee && sig.employee.name) {
              return sig.employee.name;
            }
            return sig.employee_id;
          }),
        ),
      );
      const previewNames = existedEmployeeNames.slice(0, 8).join('、');
      const moreCount = existedEmployeeNames.length - 8;
      const tailText = moreCount > 0 ? ` 等${moreCount}人` : '';
      toast.error(
        `${year}年${month}月已存在薪酬签署记录：${previewNames}${tailText}。请先处理已有记录后再创建。`,
      );
      return;
    }
    const sourceUnits: Array<{
      employee_id: string;
      type: SalarySignatureType;
      reference_id: string;
      salaryData?: Record<string, number | string>;
      structureFields?: SalaryStructureField[];
    }> = [];
    const sourceKeySet = new Set<string>();

    const salaryRecords = await getSalaryRecords(batchSendCompany, year, month);
    for (const record of salaryRecords) {
      const items = await getSalaryItems(record.id);
      for (const item of items) {
        if (!selectedEmployeeIdSet.has(item.employee_id)) {
          continue;
        }
        const key = `${item.employee_id}_salary_slip`;
        if (sourceKeySet.has(key)) {
          continue;
        }
        const fields = record.template?.fields;
        const structureFields = Array.isArray(fields) ? fields : undefined;
        sourceUnits.push({
          employee_id: item.employee_id,
          type: 'salary_slip',
          reference_id: record.id,
          salaryData: item.data,
          structureFields,
        });
        sourceKeySet.add(key);
      }
    }

    if (sourceUnits.length === 0) {
      toast.error('未找到可用于创建待签文件的数据源（薪酬数据）');
      return;
    }

    const batchMonthStr = `${year}-${String(month).padStart(2, '0')}`;
    const attendanceByEmployeeId = new Map<string, AttendanceRecord>();
    try {
      const attendanceRows = await getAttendanceRecords(batchSendCompany, batchMonthStr);
      for (const r of attendanceRows) {
        if (!attendanceByEmployeeId.has(r.employee_id)) {
          attendanceByEmployeeId.set(r.employee_id, r);
        }
      }
    } catch (e) {
      console.warn('[SalarySignFill] 拉取考勤表用于 fillData 失败', e);
    }

    const company = companies.find((c) => c.id === batchSendCompany);
    if (!company) {
      toast.error('公司信息无效');
      return;
    }

    const needsCompanySigner = selectedTemplates.some((t) => t.requires_company_signature);
    const companyFill = companyToAsignFill(company);
    if (needsCompanySigner) {
      if (
        !companyFill.name ||
        !companyFill.code ||
        !companyFill.address ||
        !companyFill.contact_person ||
        !companyFill.contact_phone ||
        !companyFill.legal_representative
      ) {
        toast.error(
          '所选文书需要企业签署，请先在「公司」档案中补全名称、统一社会信用代码、地址、联系人、电话、法定代表人',
        );
        return;
      }
    }

    type WorkUnit = {
      source: {
        employee_id: string;
        type: SalarySignatureType;
        reference_id: string;
        salaryData?: Record<string, number | string>;
        structureFields?: SalaryStructureField[];
      };
      template: DocumentTemplate;
    };
    const workUnits: WorkUnit[] = [];
    for (const template of selectedTemplates) {
      const st = typeByTemplate.get(template.id);
      if (!st) {
        continue;
      }
      for (const src of sourceUnits) {
        if (src.type !== st) {
          continue;
        }
        workUnits.push({ source: src, template });
      }
    }

    if (workUnits.length === 0) {
      toast.error('没有可生成预览的「模板 × 待签记录」组合');
      return;
    }

    const fullName = typeof profile?.full_name === 'string' ? profile.full_name : '';
    const username = typeof profile?.username === 'string' ? profile.username : '';
    const displayName = (fullName || username || 'unknown').trim();
    const userId = profile?.id ?? 'unknown';

    setIsCreatingSalaryAsignPreview(true);
    setBatchSendProgress({ current: 0, total: workUnits.length });

    try {
      const previewItems: Array<{ key: string; label: string; previewUrl: string }> = [];
      const launchDrafts: Array<{
        key: string;
        signaturePayload: Omit<SalarySignature, 'id' | 'created_at' | 'updated_at'>;
        employee: Employee;
        template: DocumentTemplate;
        contractNo: string;
        asignRaw: unknown;
        asignTemplateHints?: AsignTemplateControlHints;
        companyFill: AsignContractFillCompany;
        extraFillData?: Record<string, string>;
      }> = [];
      let idx = 0;
      for (const unit of workUnits) {
        idx += 1;
        const emp = empById.get(unit.source.employee_id);
        if (!emp) {
          toast.error(`找不到员工档案：${unit.source.employee_id}`);
          return;
        }
        const fillEmp = employeeToAsignFill(emp);
        const idCard = (fillEmp.id_card || '').trim();
        const mobile = (fillEmp.phone || '').trim();
        if (!idCard || !mobile) {
          toast.error(`员工「${fillEmp.name || emp.id}」缺少身份证号或手机号，无法创建爱签预览`);
          return;
        }

        const needsCo = unit.template.requires_company_signature;
        const strang = buildAsignStrangersForSalarySigning(
          fillEmp,
          needsCo ? companyFill : undefined,
        );
        if (strang.length === 0) {
          toast.error('爱签签署方列表为空，请检查员工手机号与（如需）企业盖章信息');
          return;
        }

        toast.info(`正在创建爱签合同（${idx}/${workUnits.length}）…`);
        const result = await invokeAsignTemplateCreateSigning(supabase, {
          docTemplate: unit.template,
          fillEmployee: fillEmp,
          companyForFill: companyFill,
          strangers: strang,
          extraFillData: {
            ...buildSalaryExtraFillData(unit.source.salaryData, unit.source.structureFields),
            ...buildAsignFillDataFromAttendanceRecord(
              attendanceByEmployeeId.get(unit.source.employee_id) ?? null,
            ),
            ...buildSalarySigningPeriodFillData(year, month),
          },
          contractNoNonce: `sx${idx}`,
          displayName,
          userId,
          suppressTemplateCreateToast: true,
        });
        const previewUrl = extractAsignCreateContractPreviewUrl(
          result.asign,
          result.effectiveContractNo,
        );
        if (!previewUrl) {
          throw new Error('创建签署文件未返回预览地址（previewUrl），请稍后重试或联系管理员。');
        }
        previewItems.push({
          key: `${unit.source.employee_id}_${unit.source.type}_${unit.template.id}_${idx}`,
          label: `${idx}. ${fillEmp.name || emp.id} · ${unit.template.name}`,
          previewUrl,
        });
        launchDrafts.push({
          key: `${unit.source.employee_id}_${unit.source.type}_${unit.template.id}_${idx}`,
          signaturePayload: {
            company_id: batchSendCompany,
            employee_id: unit.source.employee_id,
            type: unit.source.type,
            document_template_id: unit.template.id,
            document_name: unit.template.name,
            reference_id: unit.source.reference_id,
            year,
            month,
            status: 'pending',
            third_party_contract_no: result.effectiveContractNo,
          },
          employee: emp,
          template: unit.template,
          contractNo: result.effectiveContractNo,
          asignRaw: result.asign,
          asignTemplateHints: result.asignTemplateHints,
          companyFill,
          extraFillData: {
            ...buildSalaryExtraFillData(unit.source.salaryData, unit.source.structureFields),
            ...buildAsignFillDataFromAttendanceRecord(
              attendanceByEmployeeId.get(unit.source.employee_id) ?? null,
            ),
            ...buildSalarySigningPeriodFillData(year, month),
          },
        });
        setBatchSendProgress({ current: idx, total: workUnits.length });
      }

      setSalaryLaunchDrafts(launchDrafts);
      setSalaryBatchPreviewItems(previewItems);
      const firstUrl = previewItems[0]?.previewUrl || '';
      setSalaryPreviewFileUrl(firstUrl);
      toast.success('已创建待签文件，请预览后点击「立即发起」。');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('创建爱签预览失败', { description: msg, duration: 6000 });
    } finally {
      setIsCreatingSalaryAsignPreview(false);
    }
  };

  /** 第二步：添加签署人并创建签署记录 */
  const handleLaunchSalarySigning = async () => {
    const getAsignCreateContractAttachNo = (asignRoot: unknown): number => {
      const parseFirstAttachNo = (files: unknown): number | null => {
        if (!Array.isArray(files) || files.length === 0) {
          return null;
        }
        const first = files[0] as Record<string, unknown>;
        const n = first?.attachNo ?? first?.attachmentNo;
        if (typeof n === 'number' && Number.isFinite(n) && n > 0) {
          return n;
        }
        const parsed = parseInt(String(n ?? ''), 10);
        if (Number.isFinite(parsed) && parsed > 0) {
          return parsed;
        }
        return null;
      };
      const tryNode = (node: unknown, depth: number): number | null => {
        if (depth > 10 || node === null || typeof node !== 'object') {
          return null;
        }
        const o = node as Record<string, unknown>;
        const direct = parseFirstAttachNo(o.contractFiles);
        if (direct !== null) {
          return direct;
        }
        const drillKeys = ['data', 'asign', 'result'] as const;
        for (const k of drillKeys) {
          const child = o[k];
          if (child === undefined || child === null) {
            continue;
          }
          const got = tryNode(child, depth + 1);
          if (got !== null) {
            return got;
          }
        }
        return null;
      };
      return tryNode(asignRoot, 0) ?? 1;
    };

    if (salaryLaunchDrafts.length === 0) {
      toast.error('没有可发起的待签文件，请先创建预览');
      return;
    }

    setLaunchingSalarySigning(true);
    try {
      const payloadKeySet = new Set(
        signatures
          .filter((sig) => sig.company_id === batchSendCompany)
          .map((sig) => `${sig.employee_id}_${sig.type}_${sig.reference_id}`),
      );
      const signaturePayloads: Omit<SalarySignature, 'id' | 'created_at' | 'updated_at'>[] = [];
      let signerAddedCount = 0;

      let step = 0;
      for (const draft of salaryLaunchDrafts) {
        step += 1;
        toast.info(`正在添加签署人并发起（${step}/${salaryLaunchDrafts.length}）…`);
        const fillEmp = employeeToAsignFill(draft.employee);
        const strangers = buildAsignStrangersForSalarySigning(
          fillEmp,
          draft.template.requires_company_signature ? draft.companyFill : undefined,
        );
        const attachNo = getAsignCreateContractAttachNo(draft.asignRaw);
        const hintsFromTemplate = draft.asignTemplateHints;
        const hintsFromCreate = extractAsignTemplateControlHints(draft.asignRaw);
        let hints: AsignTemplateControlHints;
        if (hintsFromTemplate && hintsFromTemplate.signKeys.length > 0) {
          hints = hintsFromTemplate;
        } else {
          hints = hintsFromCreate;
        }
        const signKeysArr = hints.signKeys.map((s) => s.trim()).filter(Boolean);
        const signKeySet = new Set(signKeysArr);

        let mainBSignKey = pickAsignPartyBMainSignKey(signKeysArr);
        let useTemplateSignKeysForEmployee = signKeysArr.length > 0 && Boolean(mainBSignKey);

        if (!mainBSignKey) {
          const envMain = String(import.meta.env.VITE_ASIGN_SALARY_MAIN_SIGN_KEY ?? '').trim();
          if (signKeysArr.length === 0) {
            mainBSignKey = envMain || '个人';
            useTemplateSignKeysForEmployee = false;
          } else if (envMain && signKeySet.has(envMain)) {
            mainBSignKey = envMain;
            useTemplateSignKeysForEmployee = true;
          } else {
            throw new Error(
              `爱签 addSigner 要求 signKey 与模板签署控件 dataKey 完全一致；当前模板中不存在「个人」。解析到的签署位：${signKeysArr.join('、')}。请在 .env 设置 VITE_ASIGN_SALARY_MAIN_SIGN_KEY 为上述之一，或在爱签控制台将员工签署位 dataKey 改为「个人」/「乙方」等常见名。`,
            );
          }
        }

        let employeeSignStrategyList: Array<{
          attachNo: number;
          locationMode: number;
          signType: number;
          signKey: string;
        }>;
        if (useTemplateSignKeysForEmployee) {
          const dateSignKeys = mergeTemplateDateSignKeysForAddSigner({
            signKeys: signKeysArr,
            mainPartyBSignKey: mainBSignKey,
            timestampSignKeys: hints.timestampSignKeys,
          });
          employeeSignStrategyList = [
            { attachNo, locationMode: 4, signType: 1, signKey: mainBSignKey },
            ...dateSignKeys.map((key) => ({
              attachNo,
              locationMode: 4,
              signType: 2,
              signKey: key,
            })),
          ];
        } else {
          employeeSignStrategyList = [
            { attachNo, locationMode: 4, signType: 1, signKey: mainBSignKey },
          ];
        }

        const companySignStrategyList = [{ attachNo, locationMode: 4, signType: 1, signKey: '甲方' }];

        const signers = strangers.map((s, index) => {
          const isCompanySigner = s.userType === 1;
          if (isCompanySigner && draft.template.requires_company_signature && !signKeySet.has('甲方')) {
            throw new Error(
              `所选文书需要企业盖章，但爱签模板中未找到「甲方」签署位。模板签署位：${hints.signKeys.join('、')}`,
            );
          }
          return {
            account: s.account,
            noticeMobile: s.mobile,
            signType: 3,
            isNotice: 1, // 测试阶段不发签署链接短信；正式环境改回 1 并传 noticeMobile
            signOrder: String(index + 1),
            signStrategyList: isCompanySigner ? companySignStrategyList : employeeSignStrategyList,
          };
        });
        const addRes = await addAsignSignatory({
          contractNo: draft.contractNo,
          signers,
        });
        if (!addRes.success) {
          throw new Error(addRes.error || `合同 ${draft.contractNo} 添加签署方失败`);
        }
        signerAddedCount += 1;

        const k = `${draft.signaturePayload.employee_id}_${draft.signaturePayload.type}_${draft.signaturePayload.reference_id}`;
        if (!payloadKeySet.has(k)) {
          signaturePayloads.push(draft.signaturePayload);
          payloadKeySet.add(k);
        }
      }

      if (signaturePayloads.length > 0) {
        const ok = await createSalarySignaturesBatch(signaturePayloads);
        if (!ok) {
          throw new Error('创建签署记录失败');
        }
      }
      const createdCount = signaturePayloads.length;
      const skippedCount = Math.max(0, salaryLaunchDrafts.length - createdCount);

      await loadData();
      setBatchSendDialogOpen(false);
      setSalaryBatchPreviewItems([]);
      setSalaryPreviewFileUrl('');
      setSalaryLaunchDrafts([]);
      toast.success(
        `发起成功：已添加签署人 ${signerAddedCount} 份，新增签署记录 ${createdCount} 条，跳过已存在 ${skippedCount} 条`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('立即发起失败', { description: msg, duration: 6000 });
    } finally {
      setLaunchingSalarySigning(false);
    }
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
              <Tabs
                value={salaryStatusTab}
                onValueChange={(value) => {
                  if (value === 'unfinished' || value === 'finished') {
                    setSalaryStatusTab(value);
                    setSalaryCurrentPage(1);
                    setSelectedSalaryIds([]);
                  }
                }}
                className="w-full"
              >
                <TabsList className="inline-flex w-auto flex-nowrap">
                  <TabsTrigger value="unfinished" className="whitespace-nowrap">未完成</TabsTrigger>
                  <TabsTrigger value="finished" className="whitespace-nowrap">已完成</TabsTrigger>
                </TabsList>

                <div className="space-y-4">
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
                    {/* <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDeleteSalary}
                      disabled={selectedSalaryIds.length === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      批量删除 {selectedSalaryIds.length > 0 && `(${selectedSalaryIds.length})`}
                    </Button> */}
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchDownloadSalary}
                      disabled={selectedSalaryIds.length === 0}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      批量下载 {selectedSalaryIds.length > 0 && `(${selectedSalaryIds.length})`}
                    </Button> */}
                  </div>

                  {/* 统计卡片 */}
                  {/* <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
                  </div> */}

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
                          <TableHead className="whitespace-nowrap">年月</TableHead>
                          <TableHead className="whitespace-nowrap">状态</TableHead>
                          <TableHead className="whitespace-nowrap">创建时间</TableHead>
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
                              <TableCell className="text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                  {signature.status === 'pending' && (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => handleRevoke(signature)}
                                    >
                                      撤回
                                    </Button>
                                  )}
                                  {signature.status === 'sent' && (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => handleRevoke(signature)}
                                    >
                                      撤回
                                    </Button>
                                  )}
                                  {signature.status === 'signed' && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenSalaryDetail(signature)}
                                        title="查看详情"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      {signature.signed_file_url && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDownloadSignedFile(signature)}
                                          title="下载文件"
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </>
                                  )}
                                  {/* <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClick(signature)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    删除
                                  </Button> */}
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
                        共 {statusFilteredSalarySignatures.length} 条记录，第 {salaryCurrentPage} / {salaryTotalPages} 页
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
                </div>

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
                    {/* <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDeleteAttendance}
                      disabled={selectedAttendanceIds.length === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      批量删除 {selectedAttendanceIds.length > 0 && `(${selectedAttendanceIds.length})`}
                    </Button> */}
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchDownloadAttendance}
                      disabled={selectedAttendanceIds.length === 0}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      批量下载 {selectedAttendanceIds.length > 0 && `(${selectedAttendanceIds.length})`}
                    </Button> */}
                  </div>

                  {/* 统计卡片 */}
                  {/* <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
                  </div> */}

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
                          <TableHead className="whitespace-nowrap">创建时间</TableHead>
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
                                {signature.created_at
                                  ? new Date(signature.created_at).toLocaleString('zh-CN')
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

      <Dialog
        open={salaryDetailDialogOpen}
        onOpenChange={(open) => {
          if (!open && syncingSalarySignatureId) {
            toast.error('正在同步，请稍候…');
            return;
          }
          setSalaryDetailDialogOpen(open);
          if (!open) {
            setSelectedSalarySignature(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>签署详情</DialogTitle>
          </DialogHeader>
          {selectedSalarySignature && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">员工</Label>
                  <p className="font-medium">{selectedSalarySignature.employee?.name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">公司</Label>
                  <p className="font-medium">{selectedSalarySignature.company?.name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">状态</Label>
                  <p className="mt-1">
                    <Badge variant={getStatusBadgeVariant(selectedSalarySignature.status)}>
                      {SALARY_SIGNATURE_STATUS_LABELS[selectedSalarySignature.status]}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">创建时间</Label>
                  <p className="font-medium">
                    {selectedSalarySignature.created_at
                      ? new Date(selectedSalarySignature.created_at).toLocaleString('zh-CN')
                      : '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">年月</Label>
                  <p className="font-medium">{selectedSalarySignature.year}年{selectedSalarySignature.month}月</p>
                </div>
              </div>
              {selectedSalarySignature.third_party_contract_no && (
                <div className="border-t pt-4 space-y-2">
                  <Label className="text-muted-foreground">爱签档案同步</Label>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={syncingSalarySignatureId === selectedSalarySignature.id}
                      onClick={() => handleSyncSalarySignedFile(selectedSalarySignature)}
                    >
                      <CloudDownload className="h-4 w-4 mr-1" />
                      {syncingSalarySignatureId === selectedSalarySignature.id ? '同步中…' : '从爱签同步 PDF'}
                    </Button>
                    <span className="text-xs text-muted-foreground font-mono break-all">
                      {selectedSalarySignature.third_party_contract_no}
                    </span>
                  </div>
                </div>
              )}
              {selectedSalarySignature.signed_file_url && (
                <div className="border-t pt-4">
                  <Label className="text-muted-foreground">签署文件</Label>
                  <div className="mt-2 flex gap-2">
                    <Button type="button" variant="outline" onClick={() => handlePreviewSignedFile(selectedSalarySignature)}>
                      <Eye className="h-4 w-4 mr-1" />
                      查看文件
                    </Button>
                    <Button type="button" onClick={() => handleDownloadSignedFile(selectedSalarySignature)}>
                      <Download className="h-4 w-4 mr-1" />
                      下载文件
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 批量发起：爱签 create-signing 预览 */}
      <Dialog open={batchSendDialogOpen} onOpenChange={handleBatchSendDialogOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>一键发起薪酬签署</DialogTitle>
            <DialogDescription>
              选择公司、年月及「薪酬管理」文书模板；系统将调用爱签生成待签文件供预览确认。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batch-company">所属公司 *</Label>
              <Select
                value={batchSendCompany}
                onValueChange={setBatchSendCompany}
                disabled={isCreatingSalaryAsignPreview}
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
                disabled={isCreatingSalaryAsignPreview}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>员工 * (可多选)</Label>
                {batchSendCompany && batchSendEmployees.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      已选 {batchSendEmployeeIds.length}/{batchSendEmployees.length}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleBatchSendEmployeeToggleAll}
                      disabled={isCreatingSalaryAsignPreview}
                    >
                      {batchSendEmployeeIds.length === batchSendEmployees.length ? '取消全选' : '全选'}
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                {!batchSendCompany ? (
                  <p className="text-sm text-muted-foreground text-center py-4">请先选择公司</p>
                ) : null}
                {batchSendCompany && batchSendEmployees.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">该公司暂无员工</p>
                ) : null}
                {batchSendCompany && batchSendEmployees.length > 0
                  ? batchSendEmployees.map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`salary-employee-${employee.id}`}
                          checked={batchSendEmployeeIds.includes(employee.id)}
                          onCheckedChange={() => handleBatchSendEmployeeToggle(employee.id)}
                          disabled={isCreatingSalaryAsignPreview}
                        />
                        <label
                          htmlFor={`salary-employee-${employee.id}`}
                          className="text-sm font-medium leading-snug cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {employee.name}
                          {employee.department ? (
                            <span className="ml-2 text-muted-foreground">- {employee.department}</span>
                          ) : null}
                        </label>
                      </div>
                    ))
                  : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label>待签署文件类型 *</Label>
              {/* <p className="text-xs text-muted-foreground">
                来自文书模板中「薪酬管理」分类；模板名称需含「工资/薪/绩效」或「考勤」以对应系统中的工资条或考勤待签记录。
              </p> */}
              {!batchSendCompany ? (
                <p className="text-sm text-muted-foreground">请先选择公司以加载模板</p>
              ) : compensationTemplates.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  该公司暂无启用的薪酬管理文书模板，请先在「文书模板」中维护（分类选薪酬管理）。
                </p>
              ) : (
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                  {compensationTemplates.map((tpl) => (
                    <div key={tpl.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`salary-tpl-${tpl.id}`}
                        
                        onCheckedChange={() => handleCompensationTemplateToggle(tpl.id)}
                        disabled={isCreatingSalaryAsignPreview}
                      />
                      <label
                        htmlFor={`salary-tpl-${tpl.id}`}
                        className="text-sm font-medium leading-snug cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tpl.name}
                        {!(tpl.asign_template_ident || '').trim() ? (
                          <span className="ml-2 text-xs text-destructive">（未配爱签模板编号）</span>
                        ) : null}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {salaryLaunchDrafts.length > 0 && (
              <div className="space-y-3 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <Label>待签文件预览</Label>
                  <div className="text-xs text-muted-foreground">
                    已生成 {salaryLaunchDrafts.length} 份
                  </div>
                </div>
                {salaryBatchPreviewItems.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {salaryBatchPreviewItems.map((item) => {
                      const activeKey =
                        salarySelectedBatchPreviewKey ?? salaryBatchPreviewItems[0]?.key ?? '';
                      const isActive = item.key === activeKey;
                      return (
                        <Button
                          key={item.key}
                          type="button"
                          size="sm"
                          variant={isActive ? 'default' : 'outline'}
                          onClick={() => {
                            setSalarySelectedBatchPreviewKey(item.key);
                            setSalaryPreviewFileUrl(item.previewUrl);
                          }}
                          disabled={launchingSalarySigning}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                )}
                <div className="h-[420px] overflow-hidden rounded-md border">
                  {salaryPreviewFileUrl ? (
                    <iframe
                      key={
                        salaryBatchPreviewItems.length > 1
                          ? `${salarySelectedBatchPreviewKey ?? salaryBatchPreviewItems[0]?.key ?? 'batch'}:${salaryPreviewFileUrl}`
                          : salaryPreviewFileUrl
                      }
                      src={salaryPreviewFileUrl}
                      className="h-full w-full border-0"
                      title="爱签预览"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      无预览地址
                    </div>
                  )}
                </div>
              </div>
            )}

            {isCreatingSalaryAsignPreview && batchSendProgress.total > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>创建预览进度</span>
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
          </div>
          <DialogFooter>
            {salaryLaunchDrafts.length > 0 ? (
              <Button
                onClick={handleLaunchSalarySigning}
                disabled={launchingSalarySigning}
              >
                {launchingSalarySigning ? '发起中…' : '立即发起'}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={tryCloseBatchSendDialog}
                  disabled={isCreatingSalaryAsignPreview}
                >
                  取消
                </Button>
                <Button
                  onClick={handleBatchSendConfirm}
                  disabled={isCreatingSalaryAsignPreview || launchingSalarySigning}
                >
                  {isCreatingSalaryAsignPreview ? '创建预览中…' : '生成待签预览'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
