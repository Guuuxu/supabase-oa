import { isSuperAdmin } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  getSigningRecords, 
  getSigningRecord,
  getCompanies, 
  getEmployees, 
  getDocumentTemplates,
  createSigningRecord,
  updateSigningRecord,
  uploadSignedDocument,
  updateSigningRecordFile,
  downloadAsignContractAndSyncArchive,
  addAsignSignatory,
  type AsignAddSignerItem,
  type AsignSignStrategyItem,
} from '@/db/api';
import { SIGNING_STATUS_LABELS, DOCUMENT_CATEGORY_LABELS, DOCUMENT_CATEGORY_LABELS_WITH_UNIVERSAL } from '@/types/types';
import type { SigningRecord, Company, Employee, DocumentTemplate, SigningStatus, SigningMode, DocumentCategory, DocumentCategoryWithUniversal } from '@/types/types';
import { toast } from 'sonner';
import { Plus, Eye, Check, ChevronsUpDown, Download, FileText, X, Search, CloudDownload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/db/supabase';
import { htmlStringToPdfBlob } from '@/utils/htmlToPdf';
import { buildAsignFillDataForContract } from '@/utils/asignFillData';

export default function SigningsPage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const [signings, setSignings] = useState<SigningRecord[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedSigning, setSelectedSigning] = useState<SigningRecord | null>(null);
  const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>(''); // 搜索关键词
  const [uploading, setUploading] = useState(false);
  const [syncingAsignPdf, setSyncingAsignPdf] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState<string>('');
  const [previewFileType, setPreviewFileType] = useState<'pdf' | 'image'>('pdf');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const editableRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    company_id: '',
    employee_ids: [] as string[], // 改为数组支持多选
    department: '__all__', // 部门筛选（可选），默认为"全部部门"
    category: '' as DocumentCategoryWithUniversal | '',
    template_ids: [] as string[],
    signing_mode: 'electronic' as SigningMode, // 签署模式
    notes: ''
  });

  // 员工表单数据（改为数组，支持多员工）
  type EmployeeFormData = {
    id: string; // 员工ID
    name: string;
    id_card: string; // 身份证号码（对应id_card_number）
    phone: string;
    email: string;
    department: string;
    position: string;
    hire_date: string;
    contract_start_date: string;
    contract_end_date: string;
    address: string;
    // 新增字段
    id_card_type: string; // 证件类型
    gender: string; // 性别
    birth_date: string; // 出生日期
    insurance_start_date: string; // 参保时间
  };
  const [employeesFormData, setEmployeesFormData] = useState<EmployeeFormData[]>([]);

  // 公司表单数据
  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    code: '',
    address: '',
    contact_person: '',
    contact_phone: '',
    legal_representative: ''
  });
  
  // 最终使用的公司表单数据（用于单方签署时自动获取）
  const [finalCompanyFormData, setFinalCompanyFormData] = useState({
    name: '',
    code: '',
    address: '',
    contact_person: '',
    contact_phone: '',
    legal_representative: ''
  });


  useEffect(() => {
    loadData();
    // 处理URL参数
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [profile, searchParams]);

  // 监听签署记录变更，局部更新列表，避免整页重拉
  // WS（Realtime）暂不启用：不创建 channel / 不 subscribe，避免握手与页面绑定
  /*
  useEffect(() => {
    const channel = supabase
      .channel('signing-records-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'signing_records',
        },
        (payload) => {
          const next = payload.new as Partial<SigningRecord> & { id?: string };
          const changedId = next.id;
          if (!changedId) {
            return;
          }

          setSignings((prev: SigningRecord[]) => {
            const idx = prev.findIndex((item) => item.id === changedId);
            if (idx < 0) {
              return prev;
            }
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              ...next,
            } as SigningRecord;
            return updated;
          });

          setSelectedSigning((prev: SigningRecord | null) => {
            if (!prev || prev.id !== changedId) {
              return prev;
            }
            return {
              ...prev,
              ...next,
            } as SigningRecord;
          });
        },
      )
      .subscribe(() => {});

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);
  */

  // 自动填充公司信息
  useEffect(() => {
    if (formData.company_id) {
      const company = companies.find(c => c.id === formData.company_id);
      if (company) {
        setCompanyFormData({
          name: company.name || '',
          code: company.credit_no || '',
          address: company.address || '',
          contact_person: company.contact_person || '',
          contact_phone: company.contact_phone || '',
          legal_representative: company.legal_person || ''
        });
      }
    }
  }, [formData.company_id, companies]);

  // 自动填充所有选中员工的信息
  useEffect(() => {
    if (formData.employee_ids.length > 0) {
      const selectedEmployeesData = formData.employee_ids.map(empId => {
        const employee = employees.find(e => e.id === empId);
        if (employee) {
          return {
            id: employee.id,
            name: employee.name || '',
            id_card: employee.id_card_number || '', // 身份证号码
            phone: employee.phone || '',
            email: '', // Employee类型中没有email字段，保持为空
            department: employee.department || '',
            position: employee.position || '',
            hire_date: employee.hire_date || '',
            contract_start_date: employee.contract_start_date || '',
            contract_end_date: employee.contract_end_date || '',
            address: employee.address || '',
            // 新增字段映射
            id_card_type: employee.id_card_type || '身份证',
            gender: employee.gender || '',
            birth_date: employee.birth_date || '',
            insurance_start_date: employee.insurance_start_date || ''
          };
        }
        return null;
      }).filter(Boolean) as EmployeeFormData[];
      
      setEmployeesFormData(selectedEmployeesData);
    } else {
      setEmployeesFormData([]);
    }
  }, [formData.employee_ids, employees]);

  // 初始化编辑器内容
  useEffect(() => {
    if (isEditMode && editableRef.current && editableContent) {
      // 只在内容为空或者取消编辑时更新
      if (!editableRef.current.innerHTML || editableRef.current.innerHTML !== editableContent) {
        editableRef.current.innerHTML = editableContent;
      }
    }
  }, [isEditMode, editableContent]);

  const loadData = async () => {
    setLoading(true);
    const companyId = isSuperAdmin(profile) ? undefined : (profile?.company_id as string | undefined);
    const [signingsData, companiesData, employeesData, templatesData] = await Promise.all([
      getSigningRecords({ companyId: companyId as string | undefined }),
      getCompanies(),
      getEmployees(companyId as string | undefined),
      getDocumentTemplates(companyId as string | undefined)
    ]);
    setSignings(signingsData);
    setCompanies(companiesData);
    setEmployees(employeesData);
    setTemplates(templatesData);
    setLoading(false);
  };
  
  // 当进入编辑模式时，初始化编辑器内容
  useEffect(() => {
    if (isEditMode && editableRef.current && editableContent) {
      editableRef.current.innerHTML = editableContent;
    }
  }, [isEditMode, editableContent]);

  const handleOpenDialog = () => {
    setFormData({
      company_id: (profile?.company_id || '') as string,
      employee_ids: [],
      department: '__all__',
      category: '',
      template_ids: [],
      signing_mode: 'electronic',
      notes: ''
    });
    // 重置表单数据
    setEmployeesFormData([]);
    setCompanyFormData({
      name: '',
      code: '',
      address: '',
      contact_person: '',
      contact_phone: '',
      legal_representative: ''
    });
    // 清理预览URL
    if (previewFileUrl && previewFileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewFileUrl);
    }
    setPreviewFileUrl('');
    setDialogOpen(true);
  };

  // 生成文书模板内容
  const generateTemplateContent = (templateName: string): string => {
    const templates: Record<string, string> = {
      '劳动合同': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>劳动合同</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 24px; margin-bottom: 30px; font-weight: bold; }
    .contract-no { text-align: right; margin-bottom: 20px; font-size: 14px; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .party { margin: 20px 0; }
    .party p { text-indent: 0; }
    .signature { display: flex; justify-content: space-between; margin-top: 60px; }
    .signature-item { text-align: center; width: 45%; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>劳动合同</h1>
  <div class="contract-no">合同编号：__________</div>
  
  <div class="party">
    <p><strong>甲方（用人单位）：</strong><span class="underline">{{公司名称}}</span></p>
    <p><strong>统一社会信用代码：</strong><span class="underline">{{统一信用代码}}</span></p>
    <p><strong>地址：</strong><span class="underline">{{公司地址}}</span></p>
    <p><strong>法定代表人：</strong><span class="underline">{{法定代表人}}</span></p>
    <p><strong>联系电话：</strong><span class="underline">{{联系电话}}</span></p>
  </div>
  
  <div class="party">
    <p><strong>乙方（劳动者）：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>身份证号码：</strong><span class="underline">{{身份证号}}</span></p>
    <p><strong>联系电话：</strong><span class="underline">{{手机号}}</span></p>
    <p><strong>居住地址：</strong><span class="underline">{{地址}}</span></p>
  </div>
  
  <p>根据《中华人民共和国劳动法》、《中华人民共和国劳动合同法》及有关法律法规的规定，甲乙双方遵循合法、公平、平等自愿、协商一致、诚实信用的原则，订立本劳动合同，共同遵守。</p>
  
  <p><strong>第一条 合同期限</strong></p>
  <p>本合同为固定期限劳动合同。合同期限自 <span class="underline">{{合同开始日期}}</span> 起至 <span class="underline">{{合同结束日期}}</span> 止。</p>
  
  <p><strong>第二条 工作内容和工作地点</strong></p>
  <p>1. 乙方同意根据甲方工作需要，担任 <span class="underline">{{岗位}}</span> 岗位工作，所属部门为 <span class="underline">{{部门}}</span>。</p>
  <p>2. 工作地点：<span class="underline">{{公司地址}}</span>。</p>
  
  <p><strong>第三条 工作时间和休息休假</strong></p>
  <p>1. 甲方实行标准工时制度，乙方每日工作时间不超过8小时，每周工作时间不超过40小时。</p>
  <p>2. 乙方享有国家规定的法定节假日、年休假、婚假、产假、丧假等带薪假期。</p>
  
  <p><strong>第四条 劳动报酬</strong></p>
  <p>1. 甲方按月以货币形式支付乙方工资，每月发薪日为次月15日。</p>
  <p>2. 乙方工资标准及调整办法按甲方薪酬管理制度执行。</p>
  
  <p><strong>第五条 社会保险和福利待遇</strong></p>
  <p>1. 甲方按国家和地方有关规定为乙方办理养老、医疗、失业、工伤、生育等社会保险。</p>
  <p>2. 乙方患病或非因工负伤的医疗待遇按国家和地方有关规定执行。</p>
  
  <p><strong>第六条 劳动保护和劳动条件</strong></p>
  <p>甲方根据生产岗位的需要，按照国家有关劳动安全、卫生的规定为乙方配备必要的安全防护措施，发放必要的劳动保护用品。</p>
  
  <p><strong>第七条 劳动纪律</strong></p>
  <p>乙方应遵守甲方依法制定的规章制度；严格遵守劳动安全卫生、生产工艺、操作规程和工作规范；爱护甲方的财产，遵守职业道德。</p>
  
  <p><strong>第八条 合同的变更、解除和终止</strong></p>
  <p>1. 经甲乙双方协商一致，可以变更本合同的相关内容。</p>
  <p>2. 本合同的解除和终止按《劳动合同法》及相关法律法规执行。</p>
  
  <p><strong>第九条 违约责任</strong></p>
  <p>甲乙双方违反本合同约定的，应承担相应的违约责任。</p>
  
  <p><strong>第十条 争议解决</strong></p>
  <p>因履行本合同发生的劳动争议，当事人可以向甲方劳动争议调解委员会申请调解；调解不成的，可以向劳动争议仲裁委员会申请仲裁。</p>
  
  <p><strong>第十一条 其他</strong></p>
  <p>1. 本合同未尽事宜，按国家有关规定执行。</p>
  <p>2. 本合同一式两份，甲乙双方各执一份，具有同等法律效力。</p>
  
  <div class="signature">
    <div class="signature-item">
      <p>甲方（盖章）：</p>
      <p style="margin-top: 40px;">日期：{{当前日期}}</p>
    </div>
    <div class="signature-item">
      <p>乙方（签字）：</p>
      <p style="margin-top: 40px;">日期：{{当前日期}}</p>
    </div>
  </div>
</body>
</html>`,
      '员工手册': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>员工手册</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    h3 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; }
    .info p { text-indent: 0; }
    .signature { margin-top: 60px; text-align: right; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .chapter { margin-top: 40px; }
    ul { margin: 10px 0; padding-left: 2em; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <!-- 员工手册正文 -->
  <h1>{{公司名称}}员工手册</h1>
  
  <div class="chapter">
    <h2>第一章 总则</h2>
    
    <h3>第一条 目的</h3>
    <p>为规范公司管理，明确员工权利和义务，建立和谐的劳动关系，促进公司健康发展，根据《中华人民共和国劳动法》、《中华人民共和国劳动合同法》等相关法律法规，制定本手册。</p>
    
    <h3>第二条 适用范围</h3>
    <p>本手册适用于公司全体员工，包括管理人员、技术人员、业务人员及其他工作人员。</p>
    
    <h3>第三条 效力</h3>
    <p>本手册是劳动合同的重要组成部分，与劳动合同具有同等法律效力。员工签署确认书即表示同意遵守本手册的各项规定。</p>
  </div>
  
  <div class="chapter">
    <h2>第二章 工作时间与考勤管理</h2>
    
    <h3>第四条 工作时间</h3>
    <p>公司实行标准工时制，每日工作8小时，每周工作5天，周六、周日为休息日。具体工作时间为：</p>
    <p>上午：9:00-12:00</p>
    <p>下午：13:30-18:30</p>
    
    <h3>第五条 考勤制度</h3>
    <p>员工应按时上下班，并通过公司考勤系统进行打卡。迟到、早退、旷工按公司相关规定处理。</p>
    
    <h3>第六条 加班管理</h3>
    <p>因工作需要加班的，应事先申请并经部门负责人批准。加班工资按国家规定标准支付。</p>
  </div>
  
  <div class="chapter">
    <h2>第三章 薪酬福利</h2>
    
    <h3>第七条 薪酬构成</h3>
    <p>员工薪酬由基本工资、岗位工资、绩效工资、加班工资及其他补贴构成。</p>
    
    <h3>第八条 工资发放</h3>
    <p>公司每月15日发放上月工资。如遇节假日，发放时间顺延至下一工作日。</p>
    
    <h3>第九条 社会保险</h3>
    <p>公司依法为员工缴纳养老保险、医疗保险、失业保险、工伤保险、生育保险及住房公积金。</p>
    
    <h3>第十条 带薪年假</h3>
    <p>员工工作满一年后，享受带薪年假。具体天数按国家规定执行。</p>
  </div>
  
  <div class="chapter">
    <h2>第四章 行为规范</h2>
    
    <h3>第十一条 职业道德</h3>
    <p>员工应遵守职业道德，诚实守信，爱岗敬业，团结协作，维护公司形象和利益。</p>
    
    <h3>第十二条 保密义务</h3>
    <p>员工对在工作中知悉的公司商业秘密、技术秘密及其他保密信息负有保密义务，不得泄露、使用或允许他人使用。</p>
    
    <h3>第十三条 禁止行为</h3>
    <p>员工不得有以下行为：</p>
    <p>1. 泄露公司商业秘密；</p>
    <p>2. 损害公司利益或声誉；</p>
    <p>3. 接受客户或供应商的贿赂；</p>
    <p>4. 在工作时间从事与工作无关的活动；</p>
    <p>5. 其他违反法律法规或公司规定的行为。</p>
  </div>
  
  <div class="chapter">
    <h2>第五章 奖惩制度</h2>
    
    <h3>第十四条 奖励</h3>
    <p>对工作表现优秀、为公司做出突出贡献的员工，公司给予表彰和奖励，包括但不限于：通报表扬、奖金、晋升等。</p>
    
    <h3>第十五条 处分</h3>
    <p>员工违反公司规章制度的，根据情节轻重给予相应处分：警告、记过、降职、降薪、解除劳动合同等。</p>
  </div>
  
  <div class="chapter">
    <h2>第六章 附则</h2>
    
    <h3>第十六条 解释权</h3>
    <p>本手册由公司人力资源部负责解释。</p>
    
    <h3>第十七条 修订</h3>
    <p>本手册如需修订，由公司人力资源部提出，经公司管理层批准后实施，并及时通知全体员工。</p>
    
    <h3>第十八条 生效日期</h3>
    <p>本手册自{{当前日期}}起生效实施。</p>
  </div>
  
  <!-- 分页符 -->
  <div style="page-break-after: always;"></div>
  
  <!-- 员工手册确认书 -->
  <h1 style="margin-top: 40px;">员工手册确认书</h1>
  
  <div class="info">
    <p><strong>员工姓名：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>身份证号：</strong><span class="underline">{{身份证号}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
  </div>
  
  <p>本人已收到《{{公司名称}}员工手册》，并已认真阅读和理解手册中的所有内容。</p>
  
  <p>本人理解并同意遵守员工手册中规定的各项规章制度，包括但不限于：</p>
  
  <p>1. 工作时间和考勤制度；</p>
  <p>2. 行为规范和职业道德要求；</p>
  <p>3. 薪酬福利制度；</p>
  <p>4. 奖惩制度；</p>
  <p>5. 保密和知识产权保护规定；</p>
  <p>6. 其他相关管理制度。</p>
  
  <p>本人承诺严格遵守员工手册的各项规定，如有违反，愿意接受公司依据员工手册和相关法律法规作出的处理。</p>
  
  <div class="signature">
    <p>员工签字：__________</p>
    <p style="margin-top: 20px;">日期：{{当前日期}}</p>
  </div>
</body>
</html>`,
      '规章制度': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>规章制度</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    h3 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; }
    .info p { text-indent: 0; }
    .signature { margin-top: 60px; text-align: right; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .chapter { margin-top: 40px; }
  </style>
</head>
<body>
  <!-- 规章制度正文 -->
  <h1>{{公司名称}}规章制度</h1>
  
  <div class="chapter">
    <h2>一、劳动纪律</h2>
    
    <h3>1. 考勤管理</h3>
    <p>（1）员工应严格遵守公司作息时间，按时上下班打卡；</p>
    <p>（2）迟到或早退15分钟以内，每次扣款50元；超过15分钟按旷工半天处理；</p>
    <p>（3）无故旷工一天扣除三天工资，连续旷工三天或累计旷工五天，公司有权解除劳动合同；</p>
    <p>（4）请假需提前申请并经批准，事假按日扣除工资，病假需提供医院证明。</p>
    
    <h3>2. 工作纪律</h3>
    <p>（1）服从工作安排，按时完成工作任务；</p>
    <p>（2）工作时间不得擅自离岗、串岗；</p>
    <p>（3）不得在工作时间从事与工作无关的活动；</p>
    <p>（4）保持工作场所整洁有序。</p>
  </div>
  
  <div class="chapter">
    <h2>二、行为规范</h2>
    
    <h3>1. 职业操守</h3>
    <p>（1）诚实守信，忠于职守；</p>
    <p>（2）维护公司形象和声誉；</p>
    <p>（3）不得损害公司利益；</p>
    <p>（4）不得接受客户或供应商的贿赂、回扣。</p>
    
    <h3>2. 保密义务</h3>
    <p>（1）对公司商业秘密、技术秘密负有保密义务；</p>
    <p>（2）不得泄露客户信息和业务数据；</p>
    <p>（3）离职后继续履行保密义务。</p>
    
    <h3>3. 禁止行为</h3>
    <p>（1）禁止在公司内吸烟、酗酒、赌博；</p>
    <p>（2）禁止打架斗殴、辱骂他人；</p>
    <p>（3）禁止传播不实信息、散布谣言；</p>
    <p>（4）禁止私自使用公司资源从事个人业务。</p>
  </div>
  
  <div class="chapter">
    <h2>三、安全管理</h2>
    
    <h3>1. 安全责任</h3>
    <p>（1）遵守安全操作规程；</p>
    <p>（2）正确使用劳动保护用品；</p>
    <p>（3）发现安全隐患及时报告；</p>
    <p>（4）参加公司组织的安全培训。</p>
    
    <h3>2. 消防安全</h3>
    <p>（1）熟悉消防设施位置和使用方法；</p>
    <p>（2）不得堵塞消防通道；</p>
    <p>（3）发现火情立即报警并组织扑救。</p>
  </div>
  
  <div class="chapter">
    <h2>四、奖惩制度</h2>
    
    <h3>1. 奖励</h3>
    <p>对有下列情形之一的员工，公司给予奖励：</p>
    <p>（1）工作成绩突出，为公司创造显著效益；</p>
    <p>（2）提出合理化建议被采纳并取得良好效果；</p>
    <p>（3）维护公司利益，避免重大损失；</p>
    <p>（4）其他应予奖励的情形。</p>
    
    <h3>2. 处分</h3>
    <p>员工违反规章制度的，根据情节轻重给予以下处分：</p>
    <p>（1）警告：口头或书面警告，记入个人档案；</p>
    <p>（2）记过：扣除当月绩效工资，影响年度考核；</p>
    <p>（3）记大过：扣除当月全部绩效工资，取消年度评优资格；</p>
    <p>（4）降职降薪：调整岗位和薪资待遇；</p>
    <p>（5）解除劳动合同：严重违反规章制度的，公司有权解除劳动合同。</p>
  </div>
  
  <div class="chapter">
    <h2>五、附则</h2>
    
    <p>1. 本规章制度经公司职工代表大会讨论通过，报劳动行政部门备案。</p>
    <p>2. 本规章制度由公司人力资源部负责解释。</p>
    <p>3. 本规章制度自{{当前日期}}起施行。</p>
  </div>
  
  <!-- 分页符 -->
  <div style="page-break-after: always;"></div>
  
  <!-- 规章制度确认书 -->
  <h1 style="margin-top: 40px;">规章制度确认书</h1>
  
  <div class="info">
    <p><strong>员工姓名：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>身份证号：</strong><span class="underline">{{身份证号}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
  </div>
  
  <p>本人已收到并认真阅读了《{{公司名称}}规章制度》，充分理解其中的各项规定和要求。</p>
  
  <p>本人承诺：</p>
  
  <p>1. 严格遵守公司的各项规章制度；</p>
  <p>2. 服从公司的工作安排和管理；</p>
  <p>3. 维护公司的合法权益和良好形象；</p>
  <p>4. 如有违反规章制度的行为，愿意接受公司的相应处理。</p>
  
  <p>本人理解，公司规章制度是劳动合同的重要组成部分，对本人具有约束力。</p>
  
  <div class="signature">
    <p>员工签字：__________</p>
    <p style="margin-top: 20px;">日期：{{当前日期}}</p>
  </div>
</body>
</html>`,
      '考勤确认': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>考勤管理制度</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    h3 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; }
    .info p { text-indent: 0; margin: 8px 0; }
    .signature { margin-top: 60px; text-align: right; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .chapter { margin-top: 40px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #000; padding: 8px; text-align: center; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>
  <!-- 考勤管理制度正文 -->
  <h1>{{公司名称}}考勤管理制度</h1>
  
  <div class="chapter">
    <h2>第一条 目的</h2>
    <p>为加强公司考勤管理，规范员工出勤行为，维护正常的工作秩序，根据国家有关法律法规，结合公司实际情况，制定本制度。</p>
  </div>
  
  <div class="chapter">
    <h2>第二条 适用范围</h2>
    <p>本制度适用于公司全体员工。</p>
  </div>
  
  <div class="chapter">
    <h2>第三条 工作时间</h2>
    <p>公司实行标准工时制，每日工作8小时，每周工作5天。具体工作时间为：</p>
    <p>上午：9:00-12:00</p>
    <p>下午：13:30-18:30</p>
    <p>周六、周日为休息日。</p>
  </div>
  
  <div class="chapter">
    <h2>第四条 考勤方式</h2>
    <p>1. 员工应通过公司考勤系统进行上下班打卡；</p>
    <p>2. 上班时间开始后30分钟内和下班时间前30分钟内必须完成打卡；</p>
    <p>3. 因公外出无法打卡的，应填写《外出申请单》并经部门负责人批准；</p>
    <p>4. 忘记打卡的，应在当日内填写《补卡申请单》并经部门负责人批准，每月补卡不得超过2次。</p>
  </div>
  
  <div class="chapter">
    <h2>第五条 迟到与早退</h2>
    <p>1. 迟到：上班时间开始后到达工作岗位的；</p>
    <p>2. 早退：下班时间前离开工作岗位的；</p>
    <p>3. 处理标准：</p>
    <p>（1）迟到或早退15分钟以内，每次扣款50元；</p>
    <p>（2）迟到或早退15-30分钟，每次扣款100元；</p>
    <p>（3）迟到或早退超过30分钟，按旷工半天处理；</p>
    <p>（4）当月累计迟到或早退3次以上的，取消当月全勤奖。</p>
  </div>
  
  <div class="chapter">
    <h2>第六条 请假管理</h2>
    
    <h3>1. 请假类型</h3>
    <p>（1）事假：因私事需要请假的；</p>
    <p>（2）病假：因疾病需要治疗休息的，需提供医院证明；</p>
    <p>（3）年假：工作满一年的员工享受带薪年假；</p>
    <p>（4）婚假：符合法定结婚年龄的员工结婚时享受；</p>
    <p>（5）产假、陪产假：按国家规定执行；</p>
    <p>（6）丧假：直系亲属去世时享受。</p>
    
    <h3>2. 请假流程</h3>
    <p>（1）请假1天以内的，需提前向部门负责人申请；</p>
    <p>（2）请假1-3天的，需提前向部门负责人和人力资源部申请；</p>
    <p>（3）请假3天以上的，需提前向部门负责人、人力资源部和分管领导申请；</p>
    <p>（4）紧急情况无法提前请假的，应在当日内电话或短信告知并补办请假手续。</p>
    
    <h3>3. 工资计算</h3>
    <p>（1）事假：按日扣除工资，不享受全勤奖；</p>
    <p>（2）病假：按基本工资的80%发放；</p>
    <p>（3）年假、婚假、产假、陪产假、丧假：按正常出勤计算工资。</p>
  </div>
  
  <div class="chapter">
    <h2>第七条 旷工处理</h2>
    <p>1. 旷工定义：未经批准擅自不到岗的；请假未获批准而不到岗的；假期已满未续假或续假未获批准而不到岗的。</p>
    <p>2. 处理标准：</p>
    <p>（1）旷工1天，扣除3天工资，并给予警告处分；</p>
    <p>（2）旷工2天，扣除6天工资，并给予记过处分；</p>
    <p>（3）连续旷工3天或一年内累计旷工5天的，公司有权解除劳动合同，不支付经济补偿金。</p>
  </div>
  
  <div class="chapter">
    <h2>第八条 加班管理</h2>
    <p>1. 加班需事先申请并经部门负责人批准；</p>
    <p>2. 加班工资计算标准：</p>
    <p>（1）工作日加班：按工资的150%支付；</p>
    <p>（2）休息日加班：按工资的200%支付或安排补休；</p>
    <p>（3）法定节假日加班：按工资的300%支付。</p>
  </div>
  
  <div class="chapter">
    <h2>第九条 考勤统计</h2>
    <p>1. 人力资源部负责每月考勤统计，并于次月5日前公布考勤结果；</p>
    <p>2. 员工对考勤结果有异议的，应在公布后3个工作日内提出，逾期不予受理；</p>
    <p>3. 考勤结果作为工资发放、绩效考核、评优评先的重要依据。</p>
  </div>
  
  <div class="chapter">
    <h2>第十条 附则</h2>
    <p>1. 本制度由人力资源部负责解释；</p>
    <p>2. 本制度自{{当前日期}}起施行。</p>
  </div>
  
  <!-- 分页符 -->
  <div style="page-break-after: always;"></div>
  
  <!-- 考勤确认表 -->
  <h1 style="margin-top: 40px;">考勤确认表</h1>
  
  <div class="info">
    <p><strong>员工姓名：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
    <p><strong>考勤月份：</strong><span class="underline">____年____月</span></p>
  </div>
  
  <table>
    <tr>
      <th>项目</th>
      <th>天数/小时</th>
      <th>备注</th>
    </tr>
    <tr>
      <td>应出勤天数</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>实际出勤天数</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>迟到次数</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>早退次数</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>请假天数</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>加班小时</td>
      <td></td>
      <td></td>
    </tr>
  </table>
  
  <p style="text-indent: 2em; margin-top: 20px;">本人已确认以上考勤记录真实准确，如有异议请在签字前提出。</p>
  
  <div class="signature">
    <p>员工签字：__________</p>
    <p style="margin-top: 20px;">日期：{{当前日期}}</p>
  </div>
</body>
</html>`,
      '绩效考核确认': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>绩效考核管理制度</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    h3 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; }
    .info p { text-indent: 0; margin: 8px 0; }
    .signature { margin-top: 60px; text-align: right; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .chapter { margin-top: 40px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #000; padding: 8px; text-align: center; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>
  <!-- 绩效考核管理制度正文 -->
  <h1>{{公司名称}}绩效考核管理制度</h1>
  
  <div class="chapter">
    <h2>第一条 目的</h2>
    <p>为建立科学合理的绩效考核体系，客观评价员工工作表现，激励员工提升工作绩效，促进公司战略目标的实现，制定本制度。</p>
  </div>
  
  <div class="chapter">
    <h2>第二条 适用范围</h2>
    <p>本制度适用于公司全体员工（试用期员工、新入职不满3个月员工除外）。</p>
  </div>
  
  <div class="chapter">
    <h2>第三条 考核原则</h2>
    <p>1. 公平公正原则：考核标准统一，过程公开透明；</p>
    <p>2. 客观真实原则：以事实和数据为依据，避免主观臆断；</p>
    <p>3. 及时反馈原则：及时沟通考核结果，帮助员工改进；</p>
    <p>4. 结果应用原则：考核结果与薪酬调整、晋升发展挂钩。</p>
  </div>
  
  <div class="chapter">
    <h2>第四条 考核周期</h2>
    <p>1. 月度考核：每月进行一次，主要考核当月工作完成情况；</p>
    <p>2. 季度考核：每季度进行一次，综合评价季度工作表现；</p>
    <p>3. 年度考核：每年12月进行，全面评价年度工作业绩。</p>
  </div>
  
  <div class="chapter">
    <h2>第五条 考核内容</h2>
    
    <h3>1. 工作业绩（权重40%）</h3>
    <p>（1）工作任务完成情况；</p>
    <p>（2）工作质量和效率；</p>
    <p>（3）工作创新和改进；</p>
    <p>（4）关键绩效指标（KPI）达成情况。</p>
    
    <h3>2. 工作能力（权重30%）</h3>
    <p>（1）专业知识和技能；</p>
    <p>（2）学习能力和适应能力；</p>
    <p>（3）问题分析和解决能力；</p>
    <p>（4）沟通协调能力。</p>
    
    <h3>3. 工作态度（权重20%）</h3>
    <p>（1）工作积极性和主动性；</p>
    <p>（2）责任心和敬业精神；</p>
    <p>（3）遵守规章制度情况；</p>
    <p>（4）出勤和纪律表现。</p>
    
    <h3>4. 团队协作（权重10%）</h3>
    <p>（1）团队合作精神；</p>
    <p>（2）跨部门协作能力；</p>
    <p>（3）对团队的贡献；</p>
    <p>（4）人际关系处理。</p>
  </div>
  
  <div class="chapter">
    <h2>第六条 考核等级</h2>
    <p>考核结果分为五个等级：</p>
    <p>1. 优秀（90分以上）：工作表现突出，超额完成目标；</p>
    <p>2. 良好（80-89分）：工作表现良好，全面完成目标；</p>
    <p>3. 合格（70-79分）：工作表现一般，基本完成目标；</p>
    <p>4. 待改进（60-69分）：工作表现欠佳，部分目标未完成；</p>
    <p>5. 不合格（60分以下）：工作表现差，大部分目标未完成。</p>
  </div>
  
  <div class="chapter">
    <h2>第七条 考核流程</h2>
    <p>1. 目标设定：每个考核周期初，员工与直接上级共同制定工作目标；</p>
    <p>2. 过程跟踪：直接上级定期跟踪员工工作进展，及时指导；</p>
    <p>3. 自我评价：考核期末，员工进行自我评价并提交工作总结；</p>
    <p>4. 上级评价：直接上级根据员工表现进行评分；</p>
    <p>5. 结果确认：上级与员工沟通考核结果，员工签字确认；</p>
    <p>6. 结果应用：人力资源部汇总考核结果，作为薪酬调整、晋升等依据。</p>
  </div>
  
  <div class="chapter">
    <h2>第八条 考核结果应用</h2>
    
    <h3>1. 绩效工资</h3>
    <p>（1）优秀：绩效工资系数1.2；</p>
    <p>（2）良好：绩效工资系数1.0；</p>
    <p>（3）合格：绩效工资系数0.8；</p>
    <p>（4）待改进：绩效工资系数0.5；</p>
    <p>（5）不合格：无绩效工资。</p>
    
    <h3>2. 晋升发展</h3>
    <p>（1）年度考核优秀者，优先考虑晋升；</p>
    <p>（2）连续两年考核良好以上，可申请晋升；</p>
    <p>（3）考核不合格者，不得晋升。</p>
    
    <h3>3. 培训发展</h3>
    <p>（1）根据考核结果，制定针对性培训计划；</p>
    <p>（2）考核优秀者，优先参加高级培训和外部学习。</p>
    
    <h3>4. 劳动合同</h3>
    <p>（1）连续两次考核不合格，公司有权调整岗位或降薪；</p>
    <p>（2）年度考核不合格，公司有权不续签劳动合同。</p>
  </div>
  
  <div class="chapter">
    <h2>第九条 申诉机制</h2>
    <p>1. 员工对考核结果有异议的，可在收到考核结果后5个工作日内向人力资源部提出书面申诉；</p>
    <p>2. 人力资源部应在收到申诉后10个工作日内进行调查并给予答复；</p>
    <p>3. 对申诉结果仍有异议的，可向公司管理层申请复核。</p>
  </div>
  
  <div class="chapter">
    <h2>第十条 附则</h2>
    <p>1. 本制度由人力资源部负责解释；</p>
    <p>2. 本制度自{{当前日期}}起施行。</p>
  </div>
  
  <!-- 分页符 -->
  <div style="page-break-after: always;"></div>
  
  <!-- 绩效考核确认表 -->
  <h1 style="margin-top: 40px;">绩效考核确认表</h1>
  
  <div class="info">
    <p><strong>员工姓名：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
    <p><strong>考核周期：</strong><span class="underline">____年____月至____年____月</span></p>
  </div>
  
  <table>
    <tr>
      <th>考核项目</th>
      <th>权重</th>
      <th>得分</th>
      <th>备注</th>
    </tr>
    <tr>
      <td>工作业绩</td>
      <td>40%</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>工作能力</td>
      <td>30%</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>工作态度</td>
      <td>20%</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>团队协作</td>
      <td>10%</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td colspan="2"><strong>总分</strong></td>
      <td colspan="2"></td>
    </tr>
  </table>
  
  <p style="text-indent: 2em; margin-top: 20px;">本人已确认以上绩效考核结果，如有异议请在签字前提出。</p>
  
  <div class="signature">
    <p>员工签字：__________</p>
    <p style="margin-top: 20px;">日期：{{当前日期}}</p>
  </div>
</body>
</html>`,
      '工资条确认': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>薪酬管理制度</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    h3 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; }
    .info p { text-indent: 0; margin: 8px 0; }
    .signature { margin-top: 60px; text-align: right; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .chapter { margin-top: 40px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #000; padding: 8px; }
    th { background: #f5f5f5; text-align: center; }
    td { text-align: right; }
    td:first-child { text-align: left; }
  </style>
</head>
<body>
  <!-- 薪酬管理制度正文 -->
  <h1>{{公司名称}}薪酬管理制度</h1>
  
  <div class="chapter">
    <h2>第一条 目的</h2>
    <p>为建立科学合理的薪酬体系，充分发挥薪酬的激励作用，吸引和保留优秀人才，促进公司持续发展，根据国家有关法律法规，结合公司实际情况，制定本制度。</p>
  </div>
  
  <div class="chapter">
    <h2>第二条 适用范围</h2>
    <p>本制度适用于公司全体员工。</p>
  </div>
  
  <div class="chapter">
    <h2>第三条 薪酬原则</h2>
    <p>1. 公平性原则：同工同酬，按劳分配；</p>
    <p>2. 竞争性原则：薪酬水平具有市场竞争力；</p>
    <p>3. 激励性原则：薪酬与绩效挂钩，奖优罚劣；</p>
    <p>4. 合法性原则：符合国家法律法规要求；</p>
    <p>5. 保密性原则：员工薪酬信息严格保密。</p>
  </div>
  
  <div class="chapter">
    <h2>第四条 薪酬结构</h2>
    
    <h3>1. 基本工资</h3>
    <p>根据员工岗位、职级确定，是薪酬的固定部分，按月发放。</p>
    
    <h3>2. 岗位工资</h3>
    <p>根据岗位价值、工作难度、责任大小确定，体现岗位差异。</p>
    
    <h3>3. 绩效工资</h3>
    <p>根据员工绩效考核结果确定，体现工作业绩和贡献，是薪酬的浮动部分。</p>
    
    <h3>4. 加班工资</h3>
    <p>员工加班按国家规定标准支付加班工资：</p>
    <p>（1）工作日加班：按工资的150%支付；</p>
    <p>（2）休息日加班：按工资的200%支付或安排补休；</p>
    <p>（3）法定节假日加班：按工资的300%支付。</p>
    
    <h3>5. 津贴补贴</h3>
    <p>（1）交通补贴：根据岗位级别发放；</p>
    <p>（2）通讯补贴：根据岗位需要发放；</p>
    <p>（3）餐费补贴：按出勤天数发放；</p>
    <p>（4）高温补贴：夏季高温期间发放；</p>
    <p>（5）其他补贴：根据公司规定发放。</p>
  </div>
  
  <div class="chapter">
    <h2>第五条 工资发放</h2>
    
    <h3>1. 发放时间</h3>
    <p>公司每月15日发放上月工资。如遇节假日或休息日，发放时间顺延至下一工作日。</p>
    
    <h3>2. 发放方式</h3>
    <p>工资通过银行转账方式发放至员工个人工资卡。</p>
    
    <h3>3. 工资条</h3>
    <p>公司每月向员工提供工资条，详细列明工资构成和扣款项目。员工应妥善保管工资条，如有疑问应及时向人力资源部咨询。</p>
  </div>
  
  <div class="chapter">
    <h2>第六条 工资扣除</h2>
    
    <h3>1. 法定扣除</h3>
    <p>（1）社会保险个人缴纳部分（养老、医疗、失业）；</p>
    <p>（2）住房公积金个人缴纳部分；</p>
    <p>（3）个人所得税。</p>
    
    <h3>2. 其他扣除</h3>
    <p>（1）事假扣款：按日工资标准扣除；</p>
    <p>（2）迟到早退扣款：按考勤制度规定扣除；</p>
    <p>（3）旷工扣款：按考勤制度规定扣除；</p>
    <p>（4）违纪罚款：按规章制度规定扣除；</p>
    <p>（5）其他扣款：经员工同意的其他扣款项目。</p>
  </div>
  
  <div class="chapter">
    <h2>第七条 薪酬调整</h2>
    
    <h3>1. 定期调薪</h3>
    <p>公司每年进行一次薪酬调整，根据公司经营状况、市场薪酬水平、员工绩效表现等因素综合确定调薪幅度。</p>
    
    <h3>2. 晋升调薪</h3>
    <p>员工晋升后，薪酬按新岗位标准调整，自晋升次月起执行。</p>
    
    <h3>3. 绩效调薪</h3>
    <p>年度考核优秀者，可获得额外的薪酬调整；连续两年考核不合格者，公司有权降低其薪酬。</p>
    
    <h3>4. 市场调薪</h3>
    <p>根据市场薪酬水平变化，公司可对部分岗位或人员进行薪酬调整。</p>
  </div>
  
  <div class="chapter">
    <h2>第八条 特殊情况工资发放</h2>
    
    <h3>1. 试用期工资</h3>
    <p>试用期工资不低于正式工资的80%，且不低于当地最低工资标准。</p>
    
    <h3>2. 病假工资</h3>
    <p>病假期间按基本工资的80%发放，但不低于当地最低工资标准的80%。</p>
    
    <h3>3. 产假工资</h3>
    <p>产假期间按生育津贴标准发放，不足部分由公司补足。</p>
    
    <h3>4. 停工待岗工资</h3>
    <p>因公司原因停工待岗的，第一个月按正常工资发放，第二个月起按当地最低工资标准的80%发放。</p>
  </div>
  
  <div class="chapter">
    <h2>第九条 年终奖金</h2>
    <p>1. 公司根据年度经营业绩和员工个人表现发放年终奖金；</p>
    <p>2. 年终奖金发放对象为当年12月31日在职且工作满6个月的员工；</p>
    <p>3. 年终奖金金额根据公司效益和员工绩效考核结果确定；</p>
    <p>4. 年度考核不合格者，不发放年终奖金。</p>
  </div>
  
  <div class="chapter">
    <h2>第十条 保密义务</h2>
    <p>1. 员工薪酬信息属于公司机密，员工应严格保密，不得向他人透露；</p>
    <p>2. 员工不得私下打听、传播他人薪酬信息；</p>
    <p>3. 违反保密规定的，公司有权给予纪律处分。</p>
  </div>
  
  <div class="chapter">
    <h2>第十一条 附则</h2>
    <p>1. 本制度由人力资源部负责解释；</p>
    <p>2. 本制度自{{当前日期}}起施行。</p>
  </div>
  
  <!-- 分页符 -->
  <div style="page-break-after: always;"></div>
  
  <!-- 工资条确认表 -->
  <h1 style="margin-top: 40px;">工资条确认表</h1>
  
  <div class="info">
    <p><strong>员工姓名：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
    <p><strong>工资月份：</strong><span class="underline">____年____月</span></p>
  </div>
  
  <table>
    <tr>
      <th>项目</th>
      <th>金额（元）</th>
    </tr>
    <tr>
      <td>基本工资</td>
      <td></td>
    </tr>
    <tr>
      <td>岗位工资</td>
      <td></td>
    </tr>
    <tr>
      <td>绩效工资</td>
      <td></td>
    </tr>
    <tr>
      <td>加班工资</td>
      <td></td>
    </tr>
    <tr>
      <td>其他补贴</td>
      <td></td>
    </tr>
    <tr>
      <td><strong>应发工资合计</strong></td>
      <td><strong></strong></td>
    </tr>
    <tr>
      <td>社保个人部分</td>
      <td></td>
    </tr>
    <tr>
      <td>公积金个人部分</td>
      <td></td>
    </tr>
    <tr>
      <td>个人所得税</td>
      <td></td>
    </tr>
    <tr>
      <td>其他扣款</td>
      <td></td>
    </tr>
    <tr>
      <td><strong>实发工资</strong></td>
      <td><strong></strong></td>
    </tr>
  </table>
  
  <p style="text-indent: 2em; margin-top: 20px;">本人已确认以上工资明细真实准确，如有异议请在签字前提出。</p>
  
  <div class="signature">
    <p>员工签字：__________</p>
    <p style="margin-top: 20px;">日期：{{当前日期}}</p>
  </div>
</body>
</html>`,
      '岗位职责': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>岗位职责说明书</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    h3 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; }
    .info p { text-indent: 0; margin: 8px 0; }
    .signature { margin-top: 60px; text-align: right; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .section { margin-top: 30px; }
    ul { margin: 10px 0; padding-left: 2em; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <!-- 岗位职责正文 -->
  <h1>{{公司名称}}岗位职责说明书</h1>
  
  <div class="info">
    <p><strong>岗位名称：</strong><span class="underline">{{岗位}}</span></p>
    <p><strong>所属部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>直接上级：</strong><span class="underline">部门经理</span></p>
    <p><strong>下属人数：</strong><span class="underline">____人</span></p>
  </div>
  
  <div class="section">
    <h2>一、岗位目的</h2>
    <p>根据公司战略目标和部门工作计划，完成本岗位的各项工作任务，为公司发展做出贡献。</p>
  </div>
  
  <div class="section">
    <h2>二、主要职责</h2>
    
    <h3>1. 日常工作</h3>
    <ul>
      <li>按时完成上级安排的各项工作任务；</li>
      <li>遵守公司各项规章制度，维护公司形象；</li>
      <li>做好本岗位的日常管理和协调工作；</li>
      <li>及时向上级汇报工作进展和问题。</li>
    </ul>
    
    <h3>2. 专业工作</h3>
    <ul>
      <li>熟练掌握本岗位所需的专业知识和技能；</li>
      <li>按照工作流程和标准完成专业工作；</li>
      <li>不断提升专业能力，改进工作方法；</li>
      <li>参与部门的专业培训和学习活动。</li>
    </ul>
    
    <h3>3. 团队协作</h3>
    <ul>
      <li>积极配合团队成员完成协作任务；</li>
      <li>主动分享工作经验和专业知识；</li>
      <li>维护良好的团队氛围和工作关系；</li>
      <li>参与团队建设和文化活动。</li>
    </ul>
    
    <h3>4. 持续改进</h3>
    <ul>
      <li>发现工作中的问题并提出改进建议；</li>
      <li>参与流程优化和制度完善工作；</li>
      <li>学习新知识新技能，提升工作效率；</li>
      <li>总结工作经验，形成最佳实践。</li>
    </ul>
  </div>
  
  <div class="section">
    <h2>三、任职资格</h2>
    
    <h3>1. 学历要求</h3>
    <p>大专及以上学历，相关专业优先。</p>
    
    <h3>2. 工作经验</h3>
    <p>具有____年以上相关工作经验。</p>
    
    <h3>3. 专业技能</h3>
    <ul>
      <li>熟练掌握本岗位所需的专业知识；</li>
      <li>具备良好的沟通协调能力；</li>
      <li>熟练使用办公软件和专业工具；</li>
      <li>具备一定的问题分析和解决能力。</li>
    </ul>
    
    <h3>4. 个人素质</h3>
    <ul>
      <li>责任心强，工作认真负责；</li>
      <li>具有良好的职业道德和团队精神；</li>
      <li>学习能力强，能够快速适应工作要求；</li>
      <li>抗压能力强，能够承受一定的工作压力。</li>
    </ul>
  </div>
  
  <div class="section">
    <h2>四、考核标准</h2>
    <p>1. 工作任务完成情况：按时保质完成各项工作任务；</p>
    <p>2. 工作质量：工作成果符合质量标准和要求；</p>
    <p>3. 工作态度：工作积极主动，责任心强；</p>
    <p>4. 团队协作：与团队成员配合良好，协作顺畅；</p>
    <p>5. 持续改进：不断学习提升，改进工作方法。</p>
  </div>
  
  <!-- 分页符 -->
  <div style="page-break-after: always;"></div>
  
  <!-- 岗位职责确认书 -->
  <h1 style="margin-top: 40px;">岗位职责确认书</h1>
  
  <div class="info">
    <p><strong>员工姓名：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>身份证号：</strong><span class="underline">{{身份证号}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
  </div>
  
  <p>本人已收到并认真阅读了《{{公司名称}}岗位职责说明书》，充分理解本岗位的工作职责、任职要求和考核标准。</p>
  
  <p>本人承诺：</p>
  
  <p>1. 严格按照岗位职责要求履行工作职责；</p>
  <p>2. 不断提升专业能力，提高工作质量和效率；</p>
  <p>3. 遵守公司各项规章制度，维护公司利益；</p>
  <p>4. 服从工作安排，完成上级交办的各项任务；</p>
  <p>5. 积极参与团队协作，营造良好的工作氛围。</p>
  
  <div class="signature">
    <p>员工签字：__________</p>
    <p style="margin-top: 20px;">日期：{{当前日期}}</p>
  </div>
</body>
</html>`,
      '保密协议': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>保密协议</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; }
    .info p { text-indent: 0; margin: 8px 0; }
    .signature { display: flex; justify-content: space-between; margin-top: 60px; }
    .signature-item { text-align: center; width: 45%; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .section { margin-top: 30px; }
  </style>
</head>
<body>
  <h1>保密协议</h1>
  
  <div class="info">
    <p><strong>甲方（用人单位）：</strong><span class="underline">{{公司名称}}</span></p>
    <p><strong>地址：</strong><span class="underline">{{公司地址}}</span></p>
    <p><strong>法定代表人：</strong><span class="underline">{{法定代表人}}</span></p>
  </div>
  
  <div class="info">
    <p><strong>乙方（员工）：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>身份证号：</strong><span class="underline">{{身份证号}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
  </div>
  
  <p>鉴于乙方在甲方工作期间，可能知悉、接触或掌握甲方的商业秘密和保密信息，为保护甲方的合法权益，根据《中华人民共和国劳动合同法》、《中华人民共和国反不正当竞争法》等法律法规，甲乙双方在平等自愿、协商一致的基础上，就保密事宜达成如下协议：</p>
  
  <div class="section">
    <h2>第一条 保密信息的范围</h2>
    <p>本协议所称保密信息，是指甲方拥有的、不为公众所知悉的、能为甲方带来经济利益、具有实用性并经甲方采取保密措施的技术信息和经营信息，包括但不限于：</p>
    <p>1. 技术信息：技术方案、工程设计、电路设计、制造方法、配方、工艺流程、技术指标、计算机软件、数据库、研究开发记录、技术报告、检测报告、实验数据、试验结果、图纸、样品、样机、模型、模具等；</p>
    <p>2. 经营信息：客户名单、营销计划、采购资料、定价政策、财务资料、进货渠道、产销策略、招投标中的标底及标书内容等；</p>
    <p>3. 其他信息：甲方明确标注为保密信息的其他技术信息、经营信息及与知识产权有关的信息。</p>
  </div>
  
  <div class="section">
    <h2>第二条 乙方的保密义务</h2>
    <p>1. 乙方应对在工作期间知悉、接触或掌握的甲方保密信息严格保密，未经甲方书面同意，不得向任何第三方披露、泄露或允许第三方使用；</p>
    <p>2. 乙方不得将保密信息用于甲方业务以外的任何目的，不得利用保密信息为自己或他人谋取利益；</p>
    <p>3. 乙方应妥善保管载有保密信息的文件、资料、图纸、数据等，不得擅自复制、摘抄或带离工作场所；</p>
    <p>4. 乙方离职时，应将所有载有保密信息的文件、资料、图纸、数据、样品等归还甲方，不得保留任何形式的复制品；</p>
    <p>5. 乙方不得教唆、引诱或协助他人侵犯甲方的保密信息。</p>
  </div>
  
  <div class="section">
    <h2>第三条 保密期限</h2>
    <p>乙方的保密义务自本协议签订之日起生效，至该保密信息公开之日或甲方书面通知解除保密义务之日止。乙方离职后，保密义务继续有效。</p>
  </div>
  
  <div class="section">
    <h2>第四条 违约责任</h2>
    <p>1. 乙方违反本协议约定，泄露甲方保密信息的，应立即停止侵权行为，并赔偿甲方因此遭受的全部经济损失；</p>
    <p>2. 乙方违反保密义务给甲方造成损失的，甲方有权要求乙方支付违约金人民币____元；违约金不足以弥补甲方损失的，乙方应继续赔偿；</p>
    <p>3. 乙方违反保密义务构成犯罪的，甲方有权依法追究其刑事责任。</p>
  </div>
  
  <div class="section">
    <h2>第五条 争议解决</h2>
    <p>因本协议引起的或与本协议有关的任何争议，双方应友好协商解决；协商不成的，任何一方均可向甲方所在地人民法院提起诉讼。</p>
  </div>
  
  <div class="section">
    <h2>第六条 其他</h2>
    <p>1. 本协议是劳动合同的组成部分，与劳动合同具有同等法律效力；</p>
    <p>2. 本协议一式两份，甲乙双方各执一份，具有同等法律效力；</p>
    <p>3. 本协议自双方签字盖章之日起生效。</p>
  </div>
  
  <div class="signature">
    <div class="signature-item">
      <p><strong>甲方（盖章）：</strong></p>
      <p style="margin-top: 40px;">__________</p>
      <p style="margin-top: 20px;">日期：{{当前日期}}</p>
    </div>
    <div class="signature-item">
      <p><strong>乙方（签字）：</strong></p>
      <p style="margin-top: 40px;">__________</p>
      <p style="margin-top: 20px;">日期：{{当前日期}}</p>
    </div>
  </div>
</body>
</html>`,
      '竞业禁止协议': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>竞业限制协议</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; }
    .info p { text-indent: 0; margin: 8px 0; }
    .signature { display: flex; justify-content: space-between; margin-top: 60px; }
    .signature-item { text-align: center; width: 45%; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .section { margin-top: 30px; }
  </style>
</head>
<body>
  <h1>竞业限制协议</h1>
  
  <div class="info">
    <p><strong>甲方（用人单位）：</strong><span class="underline">{{公司名称}}</span></p>
    <p><strong>地址：</strong><span class="underline">{{公司地址}}</span></p>
    <p><strong>法定代表人：</strong><span class="underline">{{法定代表人}}</span></p>
  </div>
  
  <div class="info">
    <p><strong>乙方（员工）：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>身份证号：</strong><span class="underline">{{身份证号}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
  </div>
  
  <p>鉴于乙方在甲方工作期间，知悉甲方的商业秘密和与知识产权相关的保密事项，为保护甲方的合法权益，根据《中华人民共和国劳动合同法》等法律法规，甲乙双方在平等自愿、协商一致的基础上，就竞业限制事宜达成如下协议：</p>
  
  <div class="section">
    <h2>第一条 竞业限制的范围</h2>
    <p>1. 乙方在竞业限制期限内，不得到与甲方生产或者经营同类产品、从事同类业务的有竞争关系的其他用人单位工作；</p>
    <p>2. 乙方不得自己开业生产或者经营与甲方同类的产品、从事同类的业务；</p>
    <p>3. 乙方不得以任何方式为与甲方有竞争关系的单位或个人提供咨询、顾问等服务；</p>
    <p>4. 乙方不得以任何方式投资于与甲方有竞争关系的企业。</p>
  </div>
  
  <div class="section">
    <h2>第二条 竞业限制期限</h2>
    <p>竞业限制期限自乙方离职之日起计算，期限为____年（不超过二年）。</p>
  </div>
  
  <div class="section">
    <h2>第三条 竞业限制补偿</h2>
    <p>1. 在竞业限制期限内，甲方按月向乙方支付竞业限制补偿金，补偿金标准为乙方离职前十二个月平均工资的____％（不低于30%）；</p>
    <p>2. 竞业限制补偿金于每月____日前支付至乙方指定的银行账户；</p>
    <p>3. 甲方未按时支付竞业限制补偿金超过三个月的，乙方有权解除本协议。</p>
  </div>
  
  <div class="section">
    <h2>第四条 乙方的义务</h2>
    <p>1. 乙方应严格遵守竞业限制约定，不得从事竞业限制范围内的活动；</p>
    <p>2. 乙方应如实向甲方报告竞业限制期间的就业情况，包括工作单位、工作岗位、工作内容等；</p>
    <p>3. 乙方变更工作单位的，应提前十五日书面通知甲方；</p>
    <p>4. 乙方应配合甲方对竞业限制履行情况的监督检查。</p>
  </div>
  
  <div class="section">
    <h2>第五条 违约责任</h2>
    <p>1. 乙方违反竞业限制约定的，应立即停止违约行为，并一次性向甲方支付违约金人民币____元；</p>
    <p>2. 乙方违反竞业限制约定的，应返还甲方已支付的全部竞业限制补偿金；</p>
    <p>3. 违约金和返还的补偿金不足以弥补甲方损失的，乙方应继续赔偿甲方的实际损失；</p>
    <p>4. 乙方违反竞业限制约定构成犯罪的，甲方有权依法追究其刑事责任。</p>
  </div>
  
  <div class="section">
    <h2>第六条 协议的解除</h2>
    <p>1. 甲方可以在竞业限制期限内提前解除本协议，但应提前三十日书面通知乙方，并额外支付乙方三个月的竞业限制补偿金；</p>
    <p>2. 乙方违反竞业限制约定的，甲方有权单方解除本协议，且不再支付竞业限制补偿金。</p>
  </div>
  
  <div class="section">
    <h2>第七条 争议解决</h2>
    <p>因本协议引起的或与本协议有关的任何争议，双方应友好协商解决；协商不成的，任何一方均可向甲方所在地人民法院提起诉讼。</p>
  </div>
  
  <div class="section">
    <h2>第八条 其他</h2>
    <p>1. 本协议是劳动合同的组成部分，与劳动合同具有同等法律效力；</p>
    <p>2. 本协议一式两份，甲乙双方各执一份，具有同等法律效力；</p>
    <p>3. 本协议自双方签字盖章之日起生效。</p>
  </div>
  
  <div class="signature">
    <div class="signature-item">
      <p><strong>甲方（盖章）：</strong></p>
      <p style="margin-top: 40px;">__________</p>
      <p style="margin-top: 20px;">日期：{{当前日期}}</p>
    </div>
    <div class="signature-item">
      <p><strong>乙方（签字）：</strong></p>
      <p style="margin-top: 40px;">__________</p>
      <p style="margin-top: 20px;">日期：{{当前日期}}</p>
    </div>
  </div>
</body>
</html>`,
      '员工承诺书': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>员工承诺书</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 18px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #1890ff; }
    .info p { text-indent: 0; margin: 8px 0; }
    .commitment-list { margin: 20px 0; padding-left: 2em; }
    .commitment-list li { margin: 15px 0; line-height: 1.8; }
    .signature { margin-top: 60px; text-align: right; }
    .signature p { text-indent: 0; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>员工承诺书</h1>
  
  <div class="info">
    <p><strong>员工姓名：</strong>{{员工姓名}}</p>
    <p><strong>身份证号：</strong>{{身份证号}}</p>
    <p><strong>所属公司：</strong>{{公司名称}}</p>
    <p><strong>所属部门：</strong>{{部门}}</p>
    <p><strong>岗位职务：</strong>{{岗位}}</p>
  </div>
  
  <p>本人郑重承诺：</p>
  
  <ol class="commitment-list">
    <li><strong>遵守法律法规：</strong>严格遵守国家法律法规和公司规章制度，不从事任何违法违规行为。</li>
    
    <li><strong>诚实守信：</strong>在求职和工作过程中提供的所有信息（包括学历、工作经历、资格证书等）真实准确，如有虚假，愿承担一切法律责任，并同意公司立即解除劳动合同。</li>
    
    <li><strong>保守秘密：</strong>严格保守公司商业秘密、技术秘密和其他保密信息，不向任何第三方泄露，离职后继续履行保密义务。</li>
    
    <li><strong>忠诚履职：</strong>忠实履行工作职责，服从工作安排，不利用职务之便谋取私利，不从事与公司利益冲突的活动。</li>
    
    <li><strong>廉洁自律：</strong>不收受客户、供应商或其他业务往来单位的贿赂、回扣或其他不正当利益，不利用职权为自己或他人谋取私利。</li>
    
    <li><strong>保护资产：</strong>爱护公司财产，合理使用公司资源，不侵占、挪用或损坏公司财物。</li>
    
    <li><strong>知识产权：</strong>在职期间完成的工作成果、发明创造等知识产权归公司所有，不擅自对外发表或转让。</li>
    
    <li><strong>竞业限制：</strong>在职期间不得在其他与公司有竞争关系的单位兼职或从事竞争性业务；离职后按照竞业限制协议履行相关义务。</li>
    
    <li><strong>信息安全：</strong>妥善保管工作账号密码，不泄露公司内部信息系统的访问权限，不将工作资料存储在个人设备或外部网络。</li>
    
    <li><strong>职业道德：</strong>遵守职业道德规范，维护公司声誉和形象，不做有损公司利益和形象的事情。</li>
  </ol>
  
  <h2>违约责任</h2>
  <p>本人理解并同意，如违反上述承诺，将承担相应的法律责任和违约责任，包括但不限于：</p>
  <p>1. 公司有权立即解除劳动合同，且无需支付经济补偿；</p>
  <p>2. 赔偿因违约给公司造成的一切经济损失；</p>
  <p>3. 承担相应的法律责任。</p>
  
  <h2>声明</h2>
  <p>本人已充分理解上述承诺的内容和法律后果，系本人真实意思表示，自愿作出上述承诺并严格遵守。</p>
  
  <div class="signature">
    <p><strong>承诺人（签字）：</strong>__________</p>
    <p style="margin-top: 20px;"><strong>日期：</strong>{{当前日期}}</p>
  </div>
</body>
</html>`,
      '培训协议': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>培训协议</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 20px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; }
    .info p { text-indent: 0; margin: 8px 0; }
    .signature { display: flex; justify-content: space-between; margin-top: 60px; }
    .signature-item { text-align: center; width: 45%; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .section { margin-top: 30px; }
  </style>
</head>
<body>
  <h1>培训协议</h1>
  
  <div class="info">
    <p><strong>甲方（用人单位）：</strong><span class="underline">{{公司名称}}</span></p>
    <p><strong>地址：</strong><span class="underline">{{公司地址}}</span></p>
    <p><strong>法定代表人：</strong><span class="underline">{{法定代表人}}</span></p>
  </div>
  
  <div class="info">
    <p><strong>乙方（员工）：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>身份证号：</strong><span class="underline">{{身份证号}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
  </div>
  
  <p>鉴于甲方为提高乙方的专业技能和综合素质，决定为乙方提供专项培训，根据《中华人民共和国劳动合同法》等法律法规，甲乙双方在平等自愿、协商一致的基础上，就培训事宜达成如下协议：</p>
  
  <div class="section">
    <h2>第一条 培训内容</h2>
    <p>1. 培训项目：____________________；</p>
    <p>2. 培训地点：____________________；</p>
    <p>3. 培训时间：自____年____月____日至____年____月____日，共计____天；</p>
    <p>4. 培训方式：____________________。</p>
  </div>
  
  <div class="section">
    <h2>第二条 培训费用</h2>
    <p>1. 本次培训费用总计人民币____元，包括培训费、教材费、考试费、差旅费、住宿费等；</p>
    <p>2. 上述培训费用由甲方全额承担；</p>
    <p>3. 培训期间，乙方的工资、福利待遇按正常出勤标准发放。</p>
  </div>
  
  <div class="section">
    <h2>第三条 服务期</h2>
    <p>1. 乙方接受甲方提供的专项培训后，应为甲方服务满____年，服务期自培训结束之日起计算；</p>
    <p>2. 服务期内，乙方应认真履行工作职责，不得无故离职；</p>
    <p>3. 服务期与劳动合同期限不一致的，以较长期限为准。</p>
  </div>
  
  <div class="section">
    <h2>第四条 乙方的义务</h2>
    <p>1. 乙方应珍惜培训机会，认真参加培训，遵守培训纪律；</p>
    <p>2. 乙方应努力学习，通过培训考核，取得相应的证书或资格；</p>
    <p>3. 乙方应将培训所学知识和技能应用于工作实践，提高工作绩效；</p>
    <p>4. 乙方应履行服务期约定，不得提前离职。</p>
  </div>
  
  <div class="section">
    <h2>第五条 违约责任</h2>
    <p>1. 乙方违反服务期约定的，应按照以下标准向甲方支付违约金：</p>
    <p>（1）服务期未满即离职的，应按照培训费用总额×（服务期未履行月数÷服务期总月数）的标准支付违约金；</p>
    <p>（2）违约金总额不超过甲方为乙方支付的培训费用总额；</p>
    <p>（3）甲方要求乙方支付的违约金不得超过服务期尚未履行部分所应分摊的培训费用。</p>
    <p>2. 乙方因个人原因未能通过培训考核的，应返还甲方已支付的培训费用的50%；</p>
    <p>3. 乙方因违纪被甲方解除劳动合同的，应返还甲方已支付的全部培训费用。</p>
  </div>
  
  <div class="section">
    <h2>第六条 免责条款</h2>
    <p>有下列情形之一的，乙方无需支付违约金：</p>
    <p>1. 甲方未按照劳动合同约定提供劳动条件或劳动保护的；</p>
    <p>2. 甲方未及时足额支付劳动报酬的；</p>
    <p>3. 甲方未依法为乙方缴纳社会保险费的；</p>
    <p>4. 甲方的规章制度违反法律、法规的规定，损害乙方权益的；</p>
    <p>5. 甲方以欺诈、胁迫的手段或者乘人之危，使乙方在违背真实意思的情况下订立或者变更劳动合同的；</p>
    <p>6. 法律、法规规定的其他情形。</p>
  </div>
  
  <div class="section">
    <h2>第七条 争议解决</h2>
    <p>因本协议引起的或与本协议有关的任何争议，双方应友好协商解决；协商不成的，任何一方均可向甲方所在地人民法院提起诉讼。</p>
  </div>
  
  <div class="section">
    <h2>第八条 其他</h2>
    <p>1. 本协议是劳动合同的组成部分，与劳动合同具有同等法律效力；</p>
    <p>2. 本协议一式两份，甲乙双方各执一份，具有同等法律效力；</p>
    <p>3. 本协议自双方签字盖章之日起生效。</p>
  </div>
  
  <div class="signature">
    <div class="signature-item">
      <p><strong>甲方（盖章）：</strong></p>
      <p style="margin-top: 40px;">__________</p>
      <p style="margin-top: 20px;">日期：{{当前日期}}</p>
    </div>
    <div class="signature-item">
      <p><strong>乙方（签字）：</strong></p>
      <p style="margin-top: 40px;">__________</p>
      <p style="margin-top: 20px;">日期：{{当前日期}}</p>
    </div>
  </div>
</body>
</html>`,
      '求职登记表': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>求职登记表</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #000; padding: 12px 8px; font-size: 14px; }
    th { background: #f5f5f5; text-align: center; width: 25%; font-weight: bold; }
    td { text-align: left; }
    .section-title { background: #e6f7ff; font-weight: bold; text-align: center; padding: 10px; }
    .signature { margin-top: 60px; display: flex; justify-content: space-between; }
    .signature-item { text-align: center; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .note { margin-top: 30px; font-size: 12px; color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <h1>{{公司名称}}求职登记表</h1>
  
  <table>
    <tr>
      <td colspan="4" class="section-title">基本信息</td>
    </tr>
    <tr>
      <th>姓名</th>
      <td>{{员工姓名}}</td>
      <th>性别</th>
      <td></td>
    </tr>
    <tr>
      <th>出生日期</th>
      <td></td>
      <th>年龄</th>
      <td></td>
    </tr>
    <tr>
      <th>民族</th>
      <td></td>
      <th>政治面貌</th>
      <td></td>
    </tr>
    <tr>
      <th>身份证号</th>
      <td colspan="3">{{身份证号}}</td>
    </tr>
    <tr>
      <th>手机号码</th>
      <td>{{手机号}}</td>
      <th>电子邮箱</th>
      <td>{{邮箱}}</td>
    </tr>
    <tr>
      <th>户籍地址</th>
      <td colspan="3">{{地址}}</td>
    </tr>
    <tr>
      <th>现居住地址</th>
      <td colspan="3"></td>
    </tr>
    <tr>
      <th>婚姻状况</th>
      <td></td>
      <th>健康状况</th>
      <td></td>
    </tr>
    
    <tr>
      <td colspan="4" class="section-title">教育背景</td>
    </tr>
    <tr>
      <th>最高学历</th>
      <td></td>
      <th>学位</th>
      <td></td>
    </tr>
    <tr>
      <th>毕业院校</th>
      <td colspan="3"></td>
    </tr>
    <tr>
      <th>所学专业</th>
      <td></td>
      <th>毕业时间</th>
      <td></td>
    </tr>
    <tr>
      <th>外语水平</th>
      <td></td>
      <th>计算机水平</th>
      <td></td>
    </tr>
    
    <tr>
      <td colspan="4" class="section-title">工作经历</td>
    </tr>
    <tr>
      <th>工作年限</th>
      <td colspan="3"></td>
    </tr>
    <tr>
      <th>上一家单位</th>
      <td colspan="3"></td>
    </tr>
    <tr>
      <th>担任职务</th>
      <td></td>
      <th>离职原因</th>
      <td></td>
    </tr>
    
    <tr>
      <td colspan="4" class="section-title">应聘信息</td>
    </tr>
    <tr>
      <th>应聘部门</th>
      <td>{{部门}}</td>
      <th>应聘岗位</th>
      <td>{{岗位}}</td>
    </tr>
    <tr>
      <th>期望薪资</th>
      <td></td>
      <th>到岗时间</th>
      <td></td>
    </tr>
    
    <tr>
      <td colspan="4" class="section-title">紧急联系人</td>
    </tr>
    <tr>
      <th>联系人姓名</th>
      <td></td>
      <th>与本人关系</th>
      <td></td>
    </tr>
    <tr>
      <th>联系电话</th>
      <td colspan="3"></td>
    </tr>
  </table>
  
  <div class="note">
    <p><strong>声明：</strong></p>
    <p>本人保证以上所填信息真实准确，如有虚假，愿承担一切后果，并同意公司因此解除劳动关系。</p>
  </div>
  
  <div class="signature">
    <div class="signature-item">
      <p>应聘者签名：__________</p>
      <p style="margin-top: 20px;">日期：{{当前日期}}</p>
    </div>
    <div class="signature-item">
      <p>人事部门审核：__________</p>
      <p style="margin-top: 20px;">日期：__________</p>
    </div>
  </div>
</body>
</html>`,
      '入职登记表': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>入职登记表</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 40px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #000; padding: 12px 8px; font-size: 14px; }
    th { background: #f5f5f5; text-align: center; width: 25%; }
    td { text-align: left; }
    .signature { margin-top: 60px; text-align: right; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
    .note { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <h1>{{公司名称}}入职登记表</h1>
  
  <table>
    <tr>
      <th>姓名</th>
      <td>{{员工姓名}}</td>
      <th>性别</th>
      <td></td>
    </tr>
    <tr>
      <th>出生日期</th>
      <td></td>
      <th>民族</th>
      <td></td>
    </tr>
    <tr>
      <th>身份证号</th>
      <td colspan="3">{{身份证号}}</td>
    </tr>
    <tr>
      <th>手机号码</th>
      <td>{{手机号}}</td>
      <th>电子邮箱</th>
      <td>{{邮箱}}</td>
    </tr>
    <tr>
      <th>户籍地址</th>
      <td colspan="3">{{地址}}</td>
    </tr>
    <tr>
      <th>现居住地址</th>
      <td colspan="3"></td>
    </tr>
    <tr>
      <th>紧急联系人</th>
      <td></td>
      <th>关系</th>
      <td></td>
    </tr>
    <tr>
      <th>紧急联系电话</th>
      <td colspan="3"></td>
    </tr>
    <tr>
      <th>最高学历</th>
      <td></td>
      <th>毕业院校</th>
      <td></td>
    </tr>
    <tr>
      <th>所学专业</th>
      <td></td>
      <th>毕业时间</th>
      <td></td>
    </tr>
    <tr>
      <th>入职部门</th>
      <td>{{部门}}</td>
      <th>入职岗位</th>
      <td>{{岗位}}</td>
    </tr>
    <tr>
      <th>入职日期</th>
      <td>{{入职日期}}</td>
      <th>试用期</th>
      <td>____个月</td>
    </tr>
    <tr>
      <th>银行卡号</th>
      <td colspan="3">（用于工资发放）</td>
    </tr>
    <tr>
      <th>开户银行</th>
      <td colspan="3"></td>
    </tr>
  </table>
  
  <div class="note">
    <p><strong>注意事项：</strong></p>
    <p>1. 请如实填写以上信息，如有虚假，公司有权解除劳动合同；</p>
    <p>2. 请在入职当日提交以下材料：身份证复印件、学历证书复印件、离职证明、体检报告、一寸照片2张；</p>
    <p>3. 本表一式两份，公司人力资源部和员工本人各执一份。</p>
  </div>
  
  <div class="signature">
    <p>员工签字：__________</p>
    <p style="margin-top: 20px;">日期：{{当前日期}}</p>
  </div>
</body>
</html>`
    };

    // 如果有预定义模板则返回，否则返回通用模板
    return templates[templateName] || `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${templateName}</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 24px; margin-bottom: 30px; font-weight: bold; }
    .info { margin: 20px 0; line-height: 2; }
    .info p { text-indent: 0; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 0 5px; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>${templateName}</h1>
  <div class="info">
    <p><strong>员工姓名：</strong><span class="underline">{{员工姓名}}</span></p>
    <p><strong>身份证号：</strong><span class="underline">{{身份证号}}</span></p>
    <p><strong>部门：</strong><span class="underline">{{部门}}</span></p>
    <p><strong>岗位：</strong><span class="underline">{{岗位}}</span></p>
    <p><strong>公司名称：</strong><span class="underline">{{公司名称}}</span></p>
    <p><strong>日期：</strong><span class="underline">{{当前日期}}</span></p>
  </div>
  <p style="margin-top: 40px; text-indent: 2em;">本文书内容待完善...</p>
</body>
</html>`;
  };

  // 替换模板中的占位符
  const replacePlaceholders = (template: string, employeeData: EmployeeFormData, companyData = companyFormData): string => {
    const currentDate = new Date().toLocaleDateString('zh-CN');
    
    return template
      .replace(/{{员工姓名}}/g, employeeData.name || '')
      .replace(/{{身份证号}}/g, employeeData.id_card || '')
      .replace(/{{手机号}}/g, employeeData.phone || '')
      .replace(/{{邮箱}}/g, employeeData.email || '未填写')
      .replace(/{{部门}}/g, employeeData.department || '')
      .replace(/{{岗位}}/g, employeeData.position || '')
      .replace(/{{入职日期}}/g, employeeData.hire_date || '')
      .replace(/{{合同开始日期}}/g, employeeData.contract_start_date || '')
      .replace(/{{合同结束日期}}/g, employeeData.contract_end_date || '')
      .replace(/{{地址}}/g, employeeData.address || '')
      .replace(/{{公司名称}}/g, companyData.name || '')
      .replace(/{{统一信用代码}}/g, companyData.code || '')
      .replace(/{{公司地址}}/g, companyData.address || '')
      .replace(/{{联系人}}/g, companyData.contact_person || '')
      .replace(/{{联系电话}}/g, companyData.contact_phone || '')
      .replace(/{{法定代表人}}/g, companyData.legal_representative || '')
      .replace(/{{当前日期}}/g, currentDate);
  };

  // 生成签署确认书
  const generateConfirmationLetter = (templateNames: string[], employeeData: EmployeeFormData, companyData = companyFormData): string => {
    const currentDate = new Date().toLocaleDateString('zh-CN');
    const currentDateTime = new Date().toLocaleString('zh-CN');
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>签署确认书</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 24px; margin-bottom: 40px; font-weight: bold; }
    h2 { font-size: 18px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
    p { text-indent: 2em; margin: 15px 0; font-size: 14px; }
    .info { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #1890ff; }
    .info p { text-indent: 0; margin: 8px 0; }
    .doc-list { margin: 20px 0; padding-left: 2em; }
    .doc-list li { margin: 10px 0; font-size: 14px; }
    .signature { margin-top: 60px; }
    .signature-item { margin: 30px 0; }
    .signature-item p { text-indent: 0; }
    .underline { border-bottom: 1px solid #000; display: inline-block; min-width: 200px; padding: 0 5px; }
    strong { font-weight: bold; }
    .statement { margin: 30px 0; padding: 20px; background: #fffbe6; border: 1px solid #ffe58f; border-radius: 4px; }
    .statement p { text-indent: 0; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>文书签署确认书</h1>
  
  <div class="info">
    <p><strong>员工姓名：</strong>${employeeData.name || ''}</p>
    <p><strong>身份证号：</strong>${employeeData.id_card || ''}</p>
    <p><strong>联系电话：</strong>${employeeData.phone || ''}</p>
    <p><strong>所属公司：</strong>${companyData.name || ''}</p>
    <p><strong>所属部门：</strong>${employeeData.department || ''}</p>
    <p><strong>岗位职务：</strong>${employeeData.position || ''}</p>
  </div>
  
  <h2>一、签署文书清单</h2>
  <p>本人确认已收到并仔细阅读以下文书，对文书内容完全理解并同意：</p>
  <ul class="doc-list">
    ${templateNames.map((name, i) => `<li>${i + 1}. ${name}</li>`).join('\n    ')}
  </ul>
  
  <h2>二、确认声明</h2>
  <div class="statement">
    <p>本人郑重声明：</p>
    <p>1. 本人已完整阅读上述所有文书的全部内容，对文书中的各项条款、权利义务、法律后果等均已充分理解；</p>
    <p>2. 本人对上述文书的内容无异议，自愿签署并承诺严格遵守文书中的各项规定；</p>
    <p>3. 本人确认签署行为系本人真实意思表示，不存在被欺诈、胁迫或重大误解的情形；</p>
    <p>4. 本人理解并同意，本确认书与上述文书具有同等法律效力，对本人具有约束力。</p>
  </div>
  
  <h2>三、签署信息</h2>
  <div class="signature">
    <div class="signature-item">
      <p><strong>签署人（员工）：</strong><span style="color: transparent;">sign_2</span><span class="underline"></span></p>
    </div>
    <div class="signature-item">
      <p><strong>签署日期：</strong><span class="underline">${currentDate}</span></p>
    </div>
    <div class="signature-item">
      <p><strong>签署时间：</strong><span class="underline">${currentDateTime}</span></p>
    </div>
  </div>
  
  <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
    <p style="text-indent: 0;">本确认书由${companyData.name || ''}人事部门存档备查</p>
    <p style="text-indent: 0;">生成时间：${currentDateTime}</p>
  </div>
</body>
</html>`;
  };

  // 更新特定员工的表单数据
  const updateEmployeeFormData = (employeeId: string, field: keyof EmployeeFormData, value: string) => {
    setEmployeesFormData(prev => 
      prev.map(emp => 
        emp.id === employeeId ? { ...emp, [field]: value } : emp
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company_id || formData.employee_ids.length === 0 || formData.template_ids.length === 0) {
      toast.error('请填写必填项并选择至少一个员工和一个文书');
      return;
    }

    // 判断是否有需要公司签署的文书
    const selectedTemplates = templates.filter(t => formData.template_ids.includes(t.id));
    const requiresCompanySignature = selectedTemplates.some(t => t.requires_company_signature);

    // 验证所有员工的表单数据（除邮箱外都是必填）
    const invalidEmployees = employeesFormData.filter(emp => 
      !emp.name || !emp.id_card || !emp.phone ||
      !emp.department || !emp.position || !emp.hire_date ||
      !emp.contract_start_date || !emp.contract_end_date || !emp.address
    );
    
    if (invalidEmployees.length > 0) {
      toast.error(`请填写完整的员工信息（邮箱除外），有 ${invalidEmployees.length} 个员工信息不完整`);
      return;
    }

    // 只有在需要公司签署时才验证公司信息
    let tempFinalCompanyFormData = companyFormData;
    if (requiresCompanySignature) {
      if (!companyFormData.name || !companyFormData.code || !companyFormData.address ||
          !companyFormData.contact_person || !companyFormData.contact_phone || !companyFormData.legal_representative) {
        toast.error('请填写完整的公司信息');
        return;
      }
    } else {
      // 如果不需要公司签署，但文书中可能需要显示公司名称，从companies列表中获取
      const selectedCompany = companies.find(c => c.id === formData.company_id);
      if (selectedCompany) {
        tempFinalCompanyFormData = {
          name: selectedCompany.name || '',
          code: selectedCompany.credit_no || '',
          address: selectedCompany.address || '',
          contact_person: selectedCompany.contact_person || '',
          contact_phone: selectedCompany.contact_phone || '',
          legal_representative: selectedCompany.legal_person || ''
        };
      }
    }
    
    // 保存到state供后续使用
    setFinalCompanyFormData(tempFinalCompanyFormData);

    // 获取选中的文书模板名称列表
    const selectedTemplateNames = selectedTemplates.map(t => t.name);

    // 为每个员工生成独立的文书集合
    const allEmployeesDocuments = employeesFormData.map((employeeData, empIndex) => {
      // 生成该员工的所有文书HTML内容
      const documentsHtml = selectedTemplateNames.map((templateName, index) => {
        const templateContent = generateTemplateContent(templateName);
        const filledContent = replacePlaceholders(templateContent, employeeData, tempFinalCompanyFormData);
        
        // 为每个文书添加分页符（除了最后一个）
        const pageBreak = index < selectedTemplateNames.length - 1 
          ? '<div style="page-break-after: always;"></div>' 
          : '';
        
        return filledContent + pageBreak;
      }).join('\n');

      // 如果是员工单方签署，生成签署确认书
      let confirmationLetterHtml = '';
      if (!requiresCompanySignature) {
        confirmationLetterHtml = generateConfirmationLetter(selectedTemplateNames, employeeData, tempFinalCompanyFormData);
        // 在确认书前添加分页符
        confirmationLetterHtml = '<div style="page-break-after: always;"></div>\n' + confirmationLetterHtml;
      }

      // 如果有多个文书，添加目录页
      const tocHtml = selectedTemplateNames.length > 1 ? `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文书目录</title>
  <style>
    body { font-family: "SimSun", "宋体", serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 50px; font-weight: bold; }
    .toc { list-style: none; padding: 0; }
    .toc li { padding: 15px; margin: 10px 0; border-left: 4px solid #1890ff; background: #f5f5f5; font-size: 18px; }
    .info { margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 4px; }
    .info p { margin: 8px 0; }
  </style>
</head>
<body>
  <h1>签署文书目录</h1>
  <div class="info">
    <p><strong>员工：</strong>${employeeData.name}</p>
    ${requiresCompanySignature ? `<p><strong>公司：</strong>${tempFinalCompanyFormData.name}</p>` : ''}
    <p><strong>生成时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
  </div>
  <ul class="toc">
    ${selectedTemplateNames.map((name, i) => `<li>${i + 1}. ${name}</li>`).join('\n    ')}
  </ul>
</body>
</html>
<div style="page-break-after: always;"></div>
` : '';

      // 组合完整的HTML内容（文书正文 + 签署确认书）
      const htmlContent = tocHtml + documentsHtml + confirmationLetterHtml;

      // 如果有多个员工，在每个员工的文书集合前添加分隔页
      const separatorPage = empIndex > 0 ? `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: "SimSun", "宋体", serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
    .separator { text-align: center; padding: 60px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 32px; color: #1890ff; margin-bottom: 20px; }
    p { font-size: 18px; color: #666; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="separator">
    <h1>员工文书分隔页</h1>
    <p><strong>员工姓名：</strong>${employeeData.name}</p>
    <p><strong>身份证号：</strong>${employeeData.id_card}</p>
    <p><strong>文书数量：</strong>${selectedTemplateNames.length} 份</p>
  </div>
</body>
</html>
<div style="page-break-after: always;"></div>
` : '';

      return {
        employeeId: employeeData.id,
        employeeName: employeeData.name,
        content: separatorPage  + htmlContent
      };
    });

    // 合并所有员工的文书
    const combinedHtmlContent = allEmployeesDocuments.map(doc => doc.content).join('\n');

    // 保存原始内容和可编辑内容
    setOriginalContent(combinedHtmlContent);
    setEditableContent(combinedHtmlContent);
    setIsEditMode(false); // 默认非编辑模式

    // 创建Blob并生成URL
    const blob = new Blob([combinedHtmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // 设置预览URL，在信息确认对话框中显示
    setPreviewFileUrl(url);
    setPreviewFileType('pdf'); // HTML也用iframe显示

    // 提示用户
    toast.success(`已为 ${employeesFormData.length} 名员工生成文书，正在预览`);
    
    // 不在这里创建签署记录，而是在用户点击"立即发起"按钮时创建
  };

  const blobToBase64 = async (blob: Blob) => {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  /**
   * 从 createContract（create-signing）返回里取首个附件 attachNo，须与 addSigner.signStrategyList[].attachNo 一致。
   * invokeCreateSigning 传入的是整段响应体 { asign: 爱签JSON, signing? }，contractFiles 常在 asign / asign.data 下，需向下解析。
   */
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
        if (child !== undefined && child !== null) {
          const got = tryNode(child, depth + 1);
          if (got !== null) {
            return got;
          }
        }
      }
      return null;
    };

    return tryNode(asignRoot, 0) ?? 1;
  };

  /**
   * create-signing 返回体里可能带 effectiveContractNo；若无则从 asign 成功响应中解析。
   * 与爱签侧合同号不一致时 addSigner 会报泛化「参数异常」。
   */
  const extractContractNoFromCreateSigningResponse = (
    invokePayload: unknown,
    clientContractNo: string,
  ): string => {
    if (!invokePayload || typeof invokePayload !== 'object') {
      return clientContractNo;
    }
    const env = invokePayload as Record<string, unknown>;
    const server = env.effectiveContractNo;
    if (typeof server === 'string' && server.trim()) {
      return server.trim();
    }
    const tryNode = (node: unknown): string | null => {
      if (!node || typeof node !== 'object') {
        return null;
      }
      const o = node as Record<string, unknown>;
      const inner = o.data;
      if (inner && typeof inner === 'object') {
        const d = inner as Record<string, unknown>;
        for (const k of ['contractNo', 'contract_no', 'contractNO']) {
          const v = d[k];
          if (typeof v === 'string' && v.trim()) {
            return v.trim();
          }
        }
      }
      for (const k of ['contractNo', 'contract_no', 'contractNO']) {
        const v = o[k];
        if (typeof v === 'string' && v.trim()) {
          return v.trim();
        }
      }
      return null;
    };
    const roots: unknown[] = [env.asign, invokePayload];
    for (const r of roots) {
      const got = tryNode(r);
      if (got) {
        return got;
      }
    }
    return clientContractNo;
  };

  /**
   * 爱签 contract/addSigner 请求体（bizData）逐条参数。
   * account：按当前对接规则固定为 `ASIGN` + 身份证号（员工）。
   * noticeMobile：须传员工手机号，用于接收签署链接短信（与文档一致，非意愿验证码）；电子签仅包含有手机号的员工。
   * signType：3 感知签（非静默）；isNotice：1 发短信签署链接。
   * validateType：个人手写+短信常用 7；6=逐字手写识别+短信（prev/test 常未开通会报「参数异常」）。可用 .env 的 VITE_ASIGN_VALIDATE_TYPE_INDIVIDUAL 覆盖。企业勿用 6/7，常用 16（或 VITE_ASIGN_VALIDATE_TYPE_ENTERPRISE）。
   * signStrategyList：坐标签章 locationMode=2 须用 signPage、signX、signY；模板坐标 locationMode=4 须用 signKey（与模板内签署位关键字一致）；attachNo 与 create 返回 contractFiles 序号一致。
   */
  const buildAsignAddSignerItemsForEmployees = (
    employeeRows: EmployeeFormData[],
    options?: {
      appendCompany?: typeof finalCompanyFormData;
      contractAttachNo?: number;
    }
  ): AsignAddSignerItem[] => {
    const attachNo = options?.contractAttachNo ?? 1;

    const parseSigningEnvInt = (raw: string | undefined, fallback: number): number => {
      if (raw === undefined || String(raw).trim() === '') return fallback;
      const n = parseInt(String(raw), 10);
      return Number.isFinite(n) && n > 0 ? n : fallback;
    };
    /** 默认 7：手写+短信；prev 对 6（逐字识别）易报参数异常，开通后再设环境变量为 6 */
    const validateTypeIndividualHandwriteSms = parseSigningEnvInt(
      import.meta.env.VITE_ASIGN_VALIDATE_TYPE_INDIVIDUAL,
      7,
    );
    // 100773: 认证意愿合一仅支持企业陌生用户。默认改为 1（短信）以兼容已存在企业用户；可用环境变量覆盖。
    const validateTypeEnterprise = parseSigningEnvInt(
      import.meta.env.VITE_ASIGN_VALIDATE_TYPE_ENTERPRISE,
      1,
    );

    /** 甲方：模板坐标 locationMode=4，signKey 须与爱签模板中甲方签署位关键字一致 */
    const strategyPartyA: AsignSignStrategyItem[] = [
      {
        attachNo,
        locationMode: 4,
        signType: 1,
        signKey: '甲方',
      },
    ];
    /** 乙方（员工/个人）：模板坐标 locationMode=4，signKey 须与模板中乙方签署位关键字一致 */
    /**
     * 爱签 addSigner 会校验 signKey 必须在模板中存在；多传不存在的 key 会报 100617。
     * 默认只传「当前日期」；若某模板日期位 key 不同，在 .env 设置 VITE_ASIGN_DATE_SIGN_KEYS=签署日期,签约日期（逗号分隔）。
     * 若模板还有其它个人侧签署位，用 VITE_ASIGN_PARTY_B_EXTRA_SIGN_KEYS（逗号分隔，且模板须真实存在）。
     */
    const dateSignKeysFromEnv = (import.meta.env.VITE_ASIGN_DATE_SIGN_KEYS ?? '当前日期')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const dateSignKeysBase = dateSignKeysFromEnv.length > 0 ? dateSignKeysFromEnv : ['当前日期'];
    const dateSignKeys = Array.from(new Set(dateSignKeysBase));
    /**
     * 个人侧「除签名、日期外」的额外签署位（如模板里单独放了手写抄录区），须与模板 signKey 完全一致。
     * 默认不传；需要时在 .env 设置 VITE_ASIGN_PARTY_B_EXTRA_SIGN_KEYS=乙方,身份证号（逗号分隔）。
     */
    const extraPartyBSignKeysRaw = (import.meta.env.VITE_ASIGN_PARTY_B_EXTRA_SIGN_KEYS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const extraPartyBSignKeys = Array.from(new Set(extraPartyBSignKeysRaw));
    const strategyPartyB: AsignSignStrategyItem[] = [
      {
        attachNo,
        locationMode: 4,
        signType: 1,
        signKey: '个人',
      },
      ...dateSignKeys.map((key) => ({
        attachNo,
        locationMode: 4 as const,
        signType: 2 as const,
        signKey: key,
      })),
      ...extraPartyBSignKeys.map((key) => ({
        attachNo,
        locationMode: 4 as const,
        signType: 1 as const,
        signKey: key,
      })),
    ];

    const employeeItems: AsignAddSignerItem[] = [];
    for (const emp of employeeRows) {
      const mobile = (emp.phone || '').trim().replace(/\s/g, '');
      if (!mobile) {
        continue;
      }
      const idCard = (emp.id_card || '').trim().replace(/\s/g, '').toUpperCase();
      if (!idCard) {
        throw new Error(`电子签署要求员工身份证号，用于生成 account（规则：ASIGN+身份证号）。缺失员工：${emp.name || emp.id}`);
      }
      const account = `ASIGN${idCard}`;
      employeeItems.push({
        account,
        signType: 3,
        validateType: validateTypeIndividualHandwriteSms,
        noticeMobile: mobile,
        signOrder: '1',
        isNotice: 1,
        signStrategyList: strategyPartyB.map((s) => ({ ...s })),
      });
    }

    const company = options?.appendCompany;
    let companyItem: AsignAddSignerItem | null = null;
    if (company && (company.name || '').trim()) {
      const credit = (company.code || '').trim().replace(/\s/g, '');
      const contactMobile = (company.contact_phone || '').trim().replace(/\s/g, '');
      const companyAccountRaw = (credit || contactMobile).toUpperCase();
      const companyAccount = companyAccountRaw ? `ASIGN${companyAccountRaw}` : '';
      if (companyAccount && contactMobile) {
        const nextCompanyItem: AsignAddSignerItem = {
          account: companyAccount,
          signType: 3,
          validateType: validateTypeEnterprise,
          noticeMobile: contactMobile,
          signOrder: '1',
          isNotice: 1,
          isEnterpriseSigner: true,
          signStrategyList: strategyPartyA.map((s) => ({ ...s })),
        };
        companyItem = nextCompanyItem;
      }
    }

    const ordered: AsignAddSignerItem[] = [];
    if (companyItem) {
      ordered.push(companyItem);
    }
    ordered.push(...employeeItems);

    let order = 0;
    for (const item of ordered) {
      order += 1;
      item.signOrder = String(order);
    }

    return ordered;
  };

  /**
   * 与爱签 v2/user/addStranger 对齐：userType 1=企业、2=个人（以开放平台为准）；account 与 addSigner 一致。
   */
  const buildAsignStrangersForCreateSigning = (
    employeeRows: EmployeeFormData[],
    appendCompany?: typeof finalCompanyFormData,
  ): Array<{
    account: string;
    userType: 1 | 2;
    name?: string;
    idCard?: string;
    mobile?: string;
    companyName?: string;
    creditCode?: string;
  }> => {
    const out: Array<{
      account: string;
      userType: 1 | 2;
      name?: string;
      idCard?: string;
      mobile?: string;
      companyName?: string;
      creditCode?: string;
    }> = [];

    const company = appendCompany;
    if (company && (company.name || '').trim()) {
      const credit = (company.code || '').trim().replace(/\s/g, '');
      const contactMobile = (company.contact_phone || '').trim().replace(/\s/g, '');
      const companyAccountRaw = (credit || contactMobile).toUpperCase();
      const account = companyAccountRaw ? `ASIGN${companyAccountRaw}` : '';
      if (account && contactMobile) {
        const companyName = (company.name || '').trim();
        const legalName =
          (company.legal_representative || '').trim() ||
          (company.contact_person || '').trim();
        out.push({
          account,
          userType: 1,
          mobile: contactMobile,
          ...(companyName ? { companyName } : {}),
          ...(credit ? { creditCode: credit } : {}),
          ...(legalName ? { name: legalName } : {}),
        });
      }
    }

    for (const emp of employeeRows) {
      const mobile = (emp.phone || '').trim().replace(/\s/g, '');
      if (!mobile) {
        continue;
      }
      const idCard = (emp.id_card || '').trim().replace(/\s/g, '').toUpperCase();
      if (!idCard) {
        throw new Error(
          `电子签署要求员工身份证号，用于生成 account（规则：ASIGN+身份证号）。缺失员工：${emp.name || emp.id}`,
        );
      }
      const account = `ASIGN${idCard}`;
      const name = (emp.name || '').trim();
      out.push({
        account,
        userType: 2,
        idCard,
        mobile,
        ...(name ? { name } : {}),
      });
    }

    return out;
  };

  /** 发起签署用的 HTML：编辑中与 iframe 预览保持一致（未保存的 edits 从 contentEditable 取） */
  const getHtmlForSigningPdf = async (): Promise<string> => {
    if (isEditMode && editableRef.current) {
      const fragment = editableRef.current.innerHTML;
      return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>
body{margin:0;padding:16px;font-family:"SimSun","宋体",serif;line-height:1.8;font-size:14px;}
</style></head><body>${fragment}</body></html>`;
    }
    const res = await fetch(previewFileUrl);
    if (!res.ok) {
      throw new Error('无法读取预览 HTML');
    }
    return res.text();
  };

  const invokeCreateSigning = async (opts?: {
    /** addStranger：userType 1=企业 2=个人 */
    strangers?: Array<{
      account: string;
      userType: 1 | 2;
      name?: string;
      idCard?: string;
      mobile?: string;
      companyName?: string;
      creditCode?: string;
    }>;
  }) => {
    const selectedForAsign = templates.filter((t) => formData.template_ids.includes(t.id));
    const hasAsignIdent = (t: DocumentTemplate) => Boolean((t.asign_template_ident || '').trim());
    const allAsignTemplateMode =
      selectedForAsign.length > 0 && selectedForAsign.every(hasAsignIdent);
    const someAsignNotAll =
      selectedForAsign.some(hasAsignIdent) && !allAsignTemplateMode;

    if (someAsignNotAll) {
      throw new Error(
        '所选文书不能混用「爱签模板」（已填模板编号）与普通文书，请只选一类后再发起。',
      );
    }
    if (allAsignTemplateMode && selectedForAsign.length > 1) {
      throw new Error(
        '使用爱签模板创建合同时，暂仅支持选择一份文书；请去掉多余模板或分多次发起。',
      );
    }
    if (allAsignTemplateMode && employeesFormData.length > 1) {
      throw new Error(
        '使用爱签模板创建合同时，暂仅支持一次选择一名员工；请分批发起。',
      );
    }

    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    const timeStr = `${hh}${mi}${ss}${ms}`;
    const employeeNames = employeesFormData
      .map((e) => (e.name || '').trim())
      .filter(Boolean)
      .join('_') || '未命名员工';
    const userId = profile?.id ?? 'unknown';
    const ASIGN_CONTRACT_NO_MAX = 40;
    const uuidCompact = String(userId).replace(/-/g, '');
    const contractNoBase = `U_${dateStr}_${timeStr}`;
    let contractNo: string;
    if (contractNoBase.length + 1 + 8 > ASIGN_CONTRACT_NO_MAX) {
      contractNo = contractNoBase.slice(0, ASIGN_CONTRACT_NO_MAX);
    } else {
      const suffixBudget = ASIGN_CONTRACT_NO_MAX - contractNoBase.length - 1;
      const suffix = uuidCompact.slice(0, Math.max(4, suffixBudget));
      contractNo = `${contractNoBase}_${suffix}`;
      if (contractNo.length > ASIGN_CONTRACT_NO_MAX) {
        contractNo = contractNo.slice(0, ASIGN_CONTRACT_NO_MAX);
      }
    }
    const fullName = typeof (profile as any)?.full_name === 'string' ? (profile as any).full_name : '';
    const username = typeof (profile as any)?.username === 'string' ? (profile as any).username : '';
    const displayName = (fullName || username || 'unknown').trim();
    /** 爱签 contractName 最长 120，超长会报参数异常 */
    const ASIGN_CONTRACT_NAME_MAX = 120;
    const normalizeContractName = (raw: string) =>
      raw.replace(/[\\/:*?"<>|]/g, '_').slice(0, ASIGN_CONTRACT_NAME_MAX);

    let contractName: string;
    let invokeBody: Record<string, unknown>;

    if (allAsignTemplateMode && selectedForAsign.length === 1 && employeesFormData.length === 1) {
      const docTemplate = selectedForAsign[0];
      const emp = employeesFormData[0];
      const fillData = buildAsignFillDataForContract(emp, finalCompanyFormData);
      const rawName = (docTemplate.name || '文书').trim();
      const fileName = rawName
        .replace(/\.(pdf|docx?|doc)$/i, '')
        .replace(/[\\/:*?"<>|]/g, '_')
        .slice(0, 200);
      const contractNameRaw = `爱签模板_${rawName}_${emp.name || '员工'}_${displayName}_${userId}_${dateStr}`;
      contractName = normalizeContractName(contractNameRaw);
      invokeBody = {
        contractNo,
        contractName,
        ...(opts?.strangers?.length ? { strangers: opts.strangers } : {}),
        templates: [
          {
            templateNo: String(docTemplate.asign_template_ident).trim(),
            fileName: fileName || '文书',
            fillData,
          },
        ],
      };
      toast.info('正在通过爱签模板创建待签署文件…');
    } else {
      if (!previewFileUrl) {
        throw new Error('缺少预览文件，无法发起签署');
      }
      const htmlText = await getHtmlForSigningPdf();
      toast.info('正在生成签署文件，请稍候…');
      let pdfBlob: Blob;
      try {
        pdfBlob = await htmlStringToPdfBlob(htmlText);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`文书转 PDF 失败：${msg}`);
      }
      const base64 = await blobToBase64(pdfBlob);
      const filenameRaw = `签署文书_${employeeNames}_${dateStr}.pdf`;
      const filename = filenameRaw.replace(/[\\/:*?"<>|]/g, '_');
      const contractNameRaw = `${filename}_${displayName}_${userId}_${dateStr}`;
      contractName = normalizeContractName(contractNameRaw);
      invokeBody = {
        contractNo,
        contractName,
        ...(opts?.strangers?.length ? { strangers: opts.strangers } : {}),
        contractFiles: [
          {
            filename,
            contentType: 'application/pdf',
            base64,
          },
        ],
      };
    }

    const { data, error } = await supabase.functions.invoke('create-signing', {
      body: invokeBody,
    });

    if (error) {
      throw error;
    }

    const payload = data as Record<string, unknown> | null;
    if (payload && payload.ok === false) {
      const detail = payload.detail as { msg?: string; code?: string } | undefined;
      const debug = payload.debug as { note?: string; phase?: string } | undefined;
      const msg =
        debug?.note ??
        detail?.msg ??
        (typeof payload.error === 'string' ? payload.error : '') ??
        'create-signing 失败';
      throw new Error(msg);
    }

    const effectiveContractNo = extractContractNoFromCreateSigningResponse(data, contractNo);

    return { contractNo, effectiveContractNo, contractName, asign: data };
  };

  const handleViewDetail = (signing: SigningRecord) => {
    setSelectedSigning(signing);
    setDetailDialogOpen(true);
  };

  // 撤回签署
  const handleWithdrawSigning = async (signing: SigningRecord) => {
    // 确认对话框
    if (!confirm(`确定要撤回该签署吗？\n\n员工：${signing.employee_name}\n文书数量：${signing.document_count}份\n\n撤回后该签署将被标记为已撤回状态。`)) {
      return;
    }

    try {
      // 更新签署记录状态为已撤回
      const success = await updateSigningRecord(signing.id, {
        status: 'withdrawn'
      });

      if (success) {
        toast.success('签署已撤回');
        // 重新加载数据
        await loadData();
      } else {
        toast.error('撤回失败，请重试');
      }
    } catch (error) {
      console.error('撤回签署失败:', error);
      toast.error('撤回失败，请重试');
    }
  };

  // 预览文件
  const handlePreviewFile = (signing: SigningRecord) => {
    if (!signing.signed_file_url) {
      toast.error('该记录没有可预览的文件');
      return;
    }

    // 判断文件类型
    const url = signing.signed_file_url.toLowerCase();
    if (url.endsWith('.pdf')) {
      setPreviewFileType('pdf');
    } else if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) {
      setPreviewFileType('image');
    } else {
      // 默认尝试作为PDF预览
      setPreviewFileType('pdf');
    }

    setPreviewFileUrl(signing.signed_file_url);
    setIsEditMode(false); // 查看已有文件时不可编辑
    setPreviewDialogOpen(true);
  };

  // 进入编辑模式
  const handleEnterEditMode = () => {
    setIsEditMode(true);
    toast.info('已进入编辑模式，可以修改文书内容');
  };

  // 处理内容变化（避免光标跳动）
  const handleContentChange = () => {
    if (editableRef.current) {
      setEditableContent(editableRef.current.innerHTML);
    }
  };

  // 保存编辑
  const handleSaveEdit = () => {
    // 更新预览URL
    const blob = new Blob([editableContent], { type: 'text/html;charset=utf-8' });
    const newUrl = URL.createObjectURL(blob);
    
    // 释放旧的URL
    if (previewFileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewFileUrl);
    }
    
    setPreviewFileUrl(newUrl);
    setOriginalContent(editableContent); // 更新原始内容
    setIsEditMode(false);
    toast.success('编辑已保存');
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditableContent(originalContent); // 恢复原始内容
    setIsEditMode(false);
    toast.info('已取消编辑');
  };

  // 下载已签署文件
  const handleDownloadFile = (signing: SigningRecord) => {
    if (!signing.signed_file_url) {
      toast.error('该记录没有可下载的文件');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = signing.signed_file_url;
      link.download = `签署文件_${signing.id.slice(0, 8)}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.pdf`;
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

  // 上传已签署文档
  const handleUploadFile = async (signingId: string, file: File) => {
    if (!file) {
      toast.error('请选择文件');
      return;
    }

    // 验证文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
      toast.error('文件大小不能超过10MB');
      return;
    }

    // 验证文件类型
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('只支持PDF、JPG、PNG格式的文件');
      return;
    }

    setUploading(true);
    try {
      // 上传文件
      const fileUrl = await uploadSignedDocument(file, signingId);
      if (!fileUrl) {
        toast.error('上传文件失败');
        return;
      }

      // 更新签署记录
      const success = await updateSigningRecordFile(
        signingId,
        fileUrl,
        (profile?.id as string) || '',
        file.size,
      );
      if (success) {
        toast.success('上传成功');
        loadData();
        setDetailDialogOpen(false);
      } else {
        toast.error('更新记录失败');
      }
    } catch (error) {
      console.error('上传文件异常:', error);
      toast.error('上传文件失败');
    } finally {
      setUploading(false);
    }
  };

  /** 爱签 downloadContract → Storage → signing_records / signed_documents（与 notify 回调无关） */
  const handlePullAsignContractPdf = async (signing: SigningRecord, force: 0 | 1) => {
    if (!signing.third_party_contract_no?.trim()) {
      toast.error('该记录无爱签合同号，无法从爱签下载');
      return;
    }
    if (signing.status !== 'completed') {
      toast.error('签署未完成（未入库）时禁止同步，请待状态为已完成后再操作');
      return;
    }
    if (force === 1) {
      const confirmed = confirm(
        '强制拉取（force=1）：适用于爱签侧状态与本地不一致等场景。确定继续吗？',
      );
      if (!confirmed) return;
    }
    setSyncingAsignPdf(true);
    try {
      const result = await downloadAsignContractAndSyncArchive({
        signingRecordId: signing.id,
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
        console.error('[ASIGN_SYNC] 拉取失败', result);
        return;
      }
      toast.success(
        `已从爱签同步 PDF，共更新 ${result.updatedRecordCount} 条相关签署档案`,
      );
      await loadData();
      const fresh = await getSigningRecord(signing.id);
      if (fresh) {
        setSelectedSigning(fresh);
      }
    } catch (e) {
      console.error('[ASIGN_SYNC] 异常', e);
      toast.error('同步失败');
    } finally {
      setSyncingAsignPdf(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: SigningStatus) => {
    const updates: any = { status };
    
    if (status === 'employee_signed') {
      const now = new Date().toISOString();
      updates.employee_signed_at = now;

      // 如果当前签署记录选用的模板满足 requires_company_signature=true，
      // 则“不需要公司签署”（requires_company_signature=false），员工签署后直接置为 completed。
      const signing = signings.find(s => s.id === id);
      if (signing) {
        const selectedTemplates = templates.filter(t => signing.template_ids.includes(t.id));
        const requiresCompanySignature = selectedTemplates.some(t => t.requires_company_signature);
        if (!requiresCompanySignature) {
          updates.status = 'completed';
          updates.completed_at = now;
        }
      }
    } else if (status === 'company_signed' || status === 'completed') {
      const now = new Date().toISOString();
      updates.company_signed_at = now;
      updates.status = 'completed';
      updates.completed_at = now;
    }

    const success = await updateSigningRecord(id, updates);
    if (success) {
      toast.success('状态更新成功');
      loadData();
      setDetailDialogOpen(false);
    } else {
      toast.error('状态更新失败');
    }
  };

  const getStatusBadgeVariant = (status: SigningStatus) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'withdrawn':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getFilteredTemplates = () => {
    if (!formData.category) return [];
    
    // 如果选择的是"通用模板"分类，只返回通用模板
    if (formData.category === 'universal') {
      return templates.filter(t => t.company_id === null);
    }
    
    // 否则返回该分类下的公司模板和通用模板
    return templates.filter(t => 
      t.category === formData.category && 
      (t.company_id === formData.company_id || t.company_id === null)
    );
  };

  const getFilteredEmployees = () => {
    if (!formData.company_id) return [];
    let filtered = employees.filter(e => e.company_id === formData.company_id);
    
    // 如果选择了部门（且不是"全部部门"），则按部门筛选
    if (formData.department && formData.department !== '__all__') {
      filtered = filtered.filter(e => e.department === formData.department);
    }
    
    return filtered;
  };

  // 获取选中公司的所有部门列表
  const getDepartments = () => {
    if (!formData.company_id) return [];
    const companyEmployees = employees.filter(e => e.company_id === formData.company_id);
    const departments = [...new Set(companyEmployees.map(e => e.department).filter(Boolean))];
    return departments.sort();
  };

  const getTemplateNames = (templateIds: string[]) => {
    return templateIds
      .map(id => templates.find(t => t.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  // 根据URL参数筛选签署记录
  const getFilteredSignings = () => {
    if (!statusFilter) return signings;
    return signings.filter(signing => signing.status === statusFilter);
  };

  const filteredSignings = getFilteredSignings();

  // 根据搜索关键词筛选签署记录
  const getSearchFilteredSignings = (records: SigningRecord[]) => {
    if (!searchKeyword.trim()) return records;
    
    const keyword = searchKeyword.toLowerCase().trim();
    return records.filter(signing => {
      const companyName = signing.company?.name?.toLowerCase() || '';
      const employeeName = signing.employee?.name?.toLowerCase() || '';
      const department = signing.employee?.department?.toLowerCase() || '';
      
      return companyName.includes(keyword) || 
             employeeName.includes(keyword) || 
             department.includes(keyword);
    });
  };

  // 待签署记录（带搜索筛选）
  const pendingRecords = getSearchFilteredSignings(
    signings.filter(s => s.status === 'pending' || s.status === 'employee_signed' || s.status === 'company_signed')
  );

  // 已完成记录（带搜索筛选）
  const completedRecords = getSearchFilteredSignings(
    signings.filter(s => s.status === 'completed' || s.status === 'rejected' || s.status === 'withdrawn')
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">文书签署管理</h1>
            <p className="text-muted-foreground mt-2">发起和管理文书签署流程</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog}>
                <Plus className="mr-2 h-4 w-4" />
                发起签署
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>发起签署</DialogTitle>
                  <DialogDescription>
                    {(() => {
                      const selectedTemplates = templates.filter(t => formData.template_ids.includes(t.id));
                      const requiresCompanySignature = selectedTemplates.some(t => t.requires_company_signature);
                      return requiresCompanySignature 
                        ? '确认员工和公司信息，生成签署文书' 
                        : '确认员工信息，生成签署文书';
                    })()}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
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
                      <PopoverContent className="w-[500px] p-0">
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
                                    setFormData({ ...formData, company_id: company.id, employee_ids: [], department: '__all__', category: '', template_ids: [] });
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

                  {/* 签署模式选择 */}
                  <div className="space-y-2">
                    <Label htmlFor="signing_mode">签署模式 *</Label>
                    <Select
                      value={formData.signing_mode}
                      onValueChange={(value: SigningMode) => setFormData({ ...formData, signing_mode: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择签署模式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronic">电子签署（在线签署）</SelectItem>
                        <SelectItem value="offline">线下签署（上传附件）</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {formData.signing_mode === 'electronic' 
                        ? '员工将收到短信通知，在线完成签署，系统自动更新状态' 
                        : '员工线下签署纸质版后，需上传已签署附件并手动更新状态'}
                    </p>
                  </div>
                  
                  {/* 部门筛选（可选） */}
                  <div className="space-y-2">
                    <Label htmlFor="department">部门（可选）</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value, employee_ids: [] })}
                      disabled={!formData.company_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="全部部门" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">全部部门</SelectItem>
                        {getDepartments().map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>员工 * (可多选)</Label>
                      {formData.company_id && getFilteredEmployees().length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            已选 {formData.employee_ids.length}/{getFilteredEmployees().length}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const allEmployeeIds = getFilteredEmployees().map(e => e.id);
                              setFormData({ 
                                ...formData, 
                                employee_ids: formData.employee_ids.length === allEmployeeIds.length ? [] : allEmployeeIds 
                              });
                            }}
                          >
                            {formData.employee_ids.length === getFilteredEmployees().length ? '取消全选' : '全选'}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="border border-border rounded-md p-3 max-h-60 overflow-y-auto space-y-2">
                      {!formData.company_id ? (
                        <p className="text-sm text-muted-foreground text-center py-4">请先选择公司</p>
                      ) : getFilteredEmployees().length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">该公司暂无员工</p>
                      ) : (
                        getFilteredEmployees().map((employee) => (
                          <div key={employee.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`employee-${employee.id}`}
                              checked={formData.employee_ids.includes(employee.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({ ...formData, employee_ids: [...formData.employee_ids, employee.id] });
                                } else {
                                  setFormData({ ...formData, employee_ids: formData.employee_ids.filter(id => id !== employee.id) });
                                }
                              }}
                            />
                            <label
                              htmlFor={`employee-${employee.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {employee.name}
                              {employee.department && <span className="text-muted-foreground ml-2">- {employee.department}</span>}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">文书分类 *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as DocumentCategoryWithUniversal, template_ids: [] })}
                      disabled={!formData.company_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择文书分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DOCUMENT_CATEGORY_LABELS_WITH_UNIVERSAL).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label as string}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>选择文书 * (可多选)</Label>
                    <div className="border border-border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                      {formData.category ? (
                        getFilteredTemplates().length > 0 ? (
                          getFilteredTemplates().map((template) => (
                            <div key={template.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={template.id}
                                checked={formData.template_ids.includes(template.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData({
                                      ...formData,
                                      template_ids: [...formData.template_ids, template.id]
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      template_ids: formData.template_ids.filter(id => id !== template.id)
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={template.id} className="cursor-pointer flex-1">
                                {template.name}
                                {template.requires_company_signature && (
                                  <Badge variant="outline" className="ml-2">双方签署</Badge>
                                )}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            该分类下暂无可用模板
                          </p>
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          请先选择文书分类
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">备注</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="请输入备注信息"
                      rows={3}
                    />
                  </div>

                  {/* 员工和公司信息填写 */}
                  {formData.employee_ids.length > 0 && (() => {
                    const selectedTemplates = templates.filter(t => formData.template_ids.includes(t.id));
                    const requiresCompanySignature = selectedTemplates.some(t => t.requires_company_signature);
                    
                    return (
                      <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">文书信息填写</h3>
                          <p className="text-sm text-muted-foreground">
                            以下信息将自动填入文书，您可以手动编辑
                          </p>
                        </div>
                        
                        {requiresCompanySignature ? (
                          <Tabs defaultValue="employee" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="employee">员工信息</TabsTrigger>
                              <TabsTrigger value="company">公司信息</TabsTrigger>
                            </TabsList>
                        
                        <TabsContent value="employee" className="space-y-4 mt-4">
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                              已选择 {employeesFormData.length} 名员工，请确认或编辑每位员工的信息
                            </p>
                          </div>
                          <Accordion type="single" collapsible className="w-full" defaultValue={employeesFormData[0]?.id}>
                            {employeesFormData.map((employee, index) => (
                              <AccordionItem key={employee.id} value={employee.id}>
                                <AccordionTrigger className="hover:no-underline">
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline">{index + 1}</Badge>
                                    <span className="font-medium">{employee.name || '未填写姓名'}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {employee.id_card || '未填写身份证'}
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_name_${employee.id}`}>姓名 *</Label>
                                      <Input
                                        id={`emp_name_${employee.id}`}
                                        value={employee.name}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'name', e.target.value)}
                                        placeholder="员工姓名"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_id_card_${employee.id}`}>身份证号 *</Label>
                                      <Input
                                        id={`emp_id_card_${employee.id}`}
                                        value={employee.id_card}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'id_card', e.target.value)}
                                        placeholder="身份证号码"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_phone_${employee.id}`}>手机号 *</Label>
                                      <Input
                                        id={`emp_phone_${employee.id}`}
                                        value={employee.phone}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'phone', e.target.value)}
                                        placeholder="手机号码"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_email_${employee.id}`}>邮箱</Label>
                                      <Input
                                        id={`emp_email_${employee.id}`}
                                        value={employee.email}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'email', e.target.value)}
                                        placeholder="电子邮箱（可选）"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_department_${employee.id}`}>部门 *</Label>
                                      <Input
                                        id={`emp_department_${employee.id}`}
                                        value={employee.department}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'department', e.target.value)}
                                        placeholder="所属部门"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_position_${employee.id}`}>岗位 *</Label>
                                      <Input
                                        id={`emp_position_${employee.id}`}
                                        value={employee.position}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'position', e.target.value)}
                                        placeholder="岗位名称"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_hire_date_${employee.id}`}>入职日期 *</Label>
                                      <Input
                                        id={`emp_hire_date_${employee.id}`}
                                        type="date"
                                        value={employee.hire_date}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'hire_date', e.target.value)}
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_contract_start_${employee.id}`}>合同开始日期 *</Label>
                                      <Input
                                        id={`emp_contract_start_${employee.id}`}
                                        type="date"
                                        value={employee.contract_start_date}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'contract_start_date', e.target.value)}
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_contract_end_${employee.id}`}>合同结束日期 *</Label>
                                      <Input
                                        id={`emp_contract_end_${employee.id}`}
                                        type="date"
                                        value={employee.contract_end_date}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'contract_end_date', e.target.value)}
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_address_${employee.id}`}>地址 *</Label>
                                      <Input
                                        id={`emp_address_${employee.id}`}
                                        value={employee.address}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'address', e.target.value)}
                                        placeholder="居住地址"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_id_card_type_${employee.id}`}>证件类型</Label>
                                      <Input
                                        id={`emp_id_card_type_${employee.id}`}
                                        value={employee.id_card_type}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'id_card_type', e.target.value)}
                                        placeholder="身份证"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_gender_${employee.id}`}>性别</Label>
                                      <Input
                                        id={`emp_gender_${employee.id}`}
                                        value={employee.gender}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'gender', e.target.value)}
                                        placeholder="性别"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_birth_date_${employee.id}`}>出生日期</Label>
                                      <Input
                                        id={`emp_birth_date_${employee.id}`}
                                        type="date"
                                        value={employee.birth_date}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'birth_date', e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`emp_insurance_start_${employee.id}`}>参保时间</Label>
                                      <Input
                                        id={`emp_insurance_start_${employee.id}`}
                                        type="text"
                                        value={employee.insurance_start_date}
                                        onChange={(e) => updateEmployeeFormData(employee.id, 'insurance_start_date', e.target.value)}
                                        placeholder="请输入参保时间"
                                      />
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </TabsContent>
                        
                        <TabsContent value="company" className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="comp_name">公司名称 *</Label>
                              <Input
                                id="comp_name"
                                value={companyFormData.name}
                                onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                                placeholder="公司全称"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="comp_code">统一信用代码 *</Label>
                              <Input
                                id="comp_code"
                                value={companyFormData.code}
                                onChange={(e) => setCompanyFormData({ ...companyFormData, code: e.target.value })}
                                placeholder="统一社会信用代码"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="comp_address">公司地址 *</Label>
                              <Input
                                id="comp_address"
                                value={companyFormData.address}
                                onChange={(e) => setCompanyFormData({ ...companyFormData, address: e.target.value })}
                                placeholder="公司注册地址"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="comp_contact">联系人 *</Label>
                              <Input
                                id="comp_contact"
                                value={companyFormData.contact_person}
                                onChange={(e) => setCompanyFormData({ ...companyFormData, contact_person: e.target.value })}
                                placeholder="联系人姓名"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="comp_phone">联系电话 *</Label>
                              <Input
                                id="comp_phone"
                                value={companyFormData.contact_phone}
                                onChange={(e) => setCompanyFormData({ ...companyFormData, contact_phone: e.target.value })}
                                placeholder="联系电话"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="comp_legal">法定代表人 *</Label>
                              <Input
                                id="comp_legal"
                                value={companyFormData.legal_representative}
                                onChange={(e) => setCompanyFormData({ ...companyFormData, legal_representative: e.target.value })}
                                placeholder="法定代表人姓名"
                                required
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      // 只显示员工信息，不需要Tabs
                      <div className="space-y-4 mt-4">
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">
                            已选择 {employeesFormData.length} 名员工，请确认或编辑每位员工的信息
                          </p>
                        </div>
                        <Accordion type="single" collapsible className="w-full" defaultValue={employeesFormData[0]?.id}>
                          {employeesFormData.map((employee, index) => (
                            <AccordionItem key={employee.id} value={employee.id}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline">{index + 1}</Badge>
                                  <span className="font-medium">{employee.name || '未填写姓名'}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {employee.id_card || '未填写身份证'}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_name_solo_${employee.id}`}>姓名 *</Label>
                                    <Input
                                      id={`emp_name_solo_${employee.id}`}
                                      value={employee.name}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'name', e.target.value)}
                                      placeholder="员工姓名"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_id_card_solo_${employee.id}`}>身份证号 *</Label>
                                    <Input
                                      id={`emp_id_card_solo_${employee.id}`}
                                      value={employee.id_card}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'id_card', e.target.value)}
                                      placeholder="身份证号码"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_phone_solo_${employee.id}`}>手机号 *</Label>
                                    <Input
                                      id={`emp_phone_solo_${employee.id}`}
                                      value={employee.phone}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'phone', e.target.value)}
                                      placeholder="手机号码"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_email_solo_${employee.id}`}>邮箱</Label>
                                    <Input
                                      id={`emp_email_solo_${employee.id}`}
                                      type="email"
                                      value={employee.email}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'email', e.target.value)}
                                      placeholder="电子邮箱（可选）"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_department_solo_${employee.id}`}>部门 *</Label>
                                    <Input
                                      id={`emp_department_solo_${employee.id}`}
                                      value={employee.department}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'department', e.target.value)}
                                      placeholder="所属部门"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_position_solo_${employee.id}`}>岗位 *</Label>
                                    <Input
                                      id={`emp_position_solo_${employee.id}`}
                                      value={employee.position}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'position', e.target.value)}
                                      placeholder="岗位名称"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_hire_date_solo_${employee.id}`}>入职日期 *</Label>
                                    <Input
                                      id={`emp_hire_date_solo_${employee.id}`}
                                      type="date"
                                      value={employee.hire_date}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'hire_date', e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_contract_start_solo_${employee.id}`}>合同开始日期 *</Label>
                                    <Input
                                      id={`emp_contract_start_solo_${employee.id}`}
                                      type="date"
                                      value={employee.contract_start_date}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'contract_start_date', e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_contract_end_solo_${employee.id}`}>合同结束日期 *</Label>
                                    <Input
                                      id={`emp_contract_end_solo_${employee.id}`}
                                      type="date"
                                      value={employee.contract_end_date}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'contract_end_date', e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-2">
                                    <Label htmlFor={`emp_address_solo_${employee.id}`}>地址 *</Label>
                                    <Input
                                      id={`emp_address_solo_${employee.id}`}
                                      value={employee.address}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'address', e.target.value)}
                                      placeholder="居住地址"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_id_card_type_solo_${employee.id}`}>证件类型</Label>
                                    <Input
                                      id={`emp_id_card_type_solo_${employee.id}`}
                                      value={employee.id_card_type}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'id_card_type', e.target.value)}
                                      placeholder="身份证"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_gender_solo_${employee.id}`}>性别</Label>
                                    <Input
                                      id={`emp_gender_solo_${employee.id}`}
                                      value={employee.gender}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'gender', e.target.value)}
                                      placeholder="性别"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_birth_date_solo_${employee.id}`}>出生日期</Label>
                                    <Input
                                      id={`emp_birth_date_solo_${employee.id}`}
                                      type="date"
                                      value={employee.birth_date}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'birth_date', e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`emp_insurance_start_solo_${employee.id}`}>参保时间</Label>
                                    <Input
                                      id={`emp_insurance_start_solo_${employee.id}`}
                                      type="text"
                                      value={employee.insurance_start_date}
                                      onChange={(e) => updateEmployeeFormData(employee.id, 'insurance_start_date', e.target.value)}
                                      placeholder="请输入参保时间"
                                    />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}
                    </div>
                  );
                  })()}
                </div>
                
                {/* 文书预览区域 */}
                {previewFileUrl && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-4">文书预览</h3>
                    <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                      {isEditMode ? (
                        <div
                          ref={editableRef}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={handleContentChange}
                          className="w-full h-full overflow-auto p-4 bg-white"
                          style={{ 
                            fontFamily: '"SimSun", "宋体", serif',
                            lineHeight: '1.8',
                            fontSize: '14px'
                          }}
                        />
                      ) : (
                        <iframe
                          src={previewFileUrl}
                          className="w-full h-full"
                          title="文书预览"
                        />
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (isEditMode) {
                            // 保存编辑
                            setOriginalContent(editableContent);
                            setIsEditMode(false);
                            toast.success('编辑已保存');
                          } else {
                            // 进入编辑模式
                            setIsEditMode(true);
                          }
                        }}
                      >
                        {isEditMode ? '保存编辑' : '编辑'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = previewFileUrl;
                          link.download = `文书_${new Date().getTime()}.html`;
                          link.click();
                        }}
                      >
                        下载文件
                      </Button>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setDialogOpen(false);
                    // 清理预览URL
                    if (previewFileUrl && previewFileUrl.startsWith('blob:')) {
                      URL.revokeObjectURL(previewFileUrl);
                      setPreviewFileUrl('');
                    }
                  }}>
                    取消
                  </Button>
                  {!previewFileUrl ? (
                    <Button type="submit">
                      发起签署
                    </Button>
                  ) : (
                    <Button type="button" onClick={async () => {
                      try {
                        // 电子签署：先调用后端函数创建第三方签署合同（拿到 signUrl / contractId 等）
                        // 线下签署：不走第三方
                        let thirdPartyContractNo: string | undefined;
                        let thirdPartyContractName: string | undefined;
                        let thirdPartySigningId: string | undefined;

                        if (formData.signing_mode === 'electronic') {
                          const selectedTemplatesForAsign = templates.filter((t) =>
                            formData.template_ids.includes(t.id)
                          );
                          const needsCompanySigner = selectedTemplatesForAsign.some(
                            (t) => t.requires_company_signature
                          );

                          const employeesWithoutPhone = employeesFormData.filter(
                            (e) => !(e.phone || '').trim().replace(/\s/g, '')
                          );
                          if (employeesWithoutPhone.length > 0) {
                            const names = employeesWithoutPhone
                              .map((e) => e.name || e.id)
                              .filter(Boolean)
                              .join('、');
                            throw new Error(
                              `电子签署须填写每位员工手机号，用于接收签署链接短信（noticeMobile）${
                                names ? `，未填写：${names}` : ''
                              }`
                            );
                          }
                          if (needsCompanySigner) {
                            const companyPhone = (finalCompanyFormData.contact_phone || '')
                              .trim()
                              .replace(/\s/g, '');
                            if (!companyPhone) {
                              throw new Error(
                                '所选模板需要企业盖章时，请填写企业联系电话，用于接收签署链接短信（noticeMobile）'
                              );
                            }
                          }

                          const strangers = buildAsignStrangersForCreateSigning(
                            employeesFormData,
                            needsCompanySigner ? finalCompanyFormData : undefined,
                          );
                          const result = await invokeCreateSigning({ strangers });
                          const contractNoForAsign = result.effectiveContractNo;
                          thirdPartyContractNo = contractNoForAsign;
                          thirdPartyContractName = result.contractName;
                          // 兼容不同返回结构：优先找常见字段
                          const asignData: any = result.asign;
                          thirdPartySigningId =
                            asignData?.contractId ??
                            asignData?.contract_id ??
                            asignData?.data?.contractId ??
                            asignData?.data?.contract_id ??
                            asignData?.asign?.contractId ??
                            asignData?.asign?.contract_id ??
                            undefined;

                          const contractAttachNo = getAsignCreateContractAttachNo(result.asign);

                          const signers = buildAsignAddSignerItemsForEmployees(employeesFormData, {
                            appendCompany: needsCompanySigner ? finalCompanyFormData : undefined,
                            contractAttachNo,
                          });
                          if (signers.length === 0) {
                            throw new Error(
                              '无法添加签署方：请确认员工手机号与企业联系电话已填写（noticeMobile）'
                            );
                          }
                          // signers 为数组：企业方 + 员工等须一次传齐；Edge 单次 addSigner，bizData 内为签署方数组（合同仅可调一次该接口）
                          const addSignRes = await addAsignSignatory({
                            contractNo: contractNoForAsign,
                            signers,
                          });
                          if (!addSignRes.success) {
                            throw new Error(addSignRes.error || '添加签署方失败');
                          }
                        }

                        // 为每个员工创建签署记录
                        const createPromises = employeesFormData.map(employeeData => {
                          const submitData = {
                            company_id: formData.company_id,
                            employee_id: employeeData.id,
                            template_ids: formData.template_ids,
                            status: 'pending' as SigningStatus,
                            signing_mode: formData.signing_mode,
                            third_party_contract_no: thirdPartyContractNo,
                            third_party_contract_name: thirdPartyContractName,
                            third_party_signing_id: thirdPartySigningId,
                            notes: formData.notes || null,
                            created_by: profile?.id,
                            employee_form_data: employeeData,
                            company_form_data: finalCompanyFormData
                          };
                          return createSigningRecord(submitData);
                        });

                        const results = await Promise.all(createPromises);
                        const failedCount = results.filter((r: unknown) => !r).length;
                        if (failedCount > 0) {
                          throw new Error(
                            `签署流程未全部完成：${failedCount} 条签署记录创建失败。仅当创建待签署文件、添加签署人、并为每个员工创建记录都成功时才算发起成功。`
                          );
                        }

                        toast.success(
                          `签署发起成功！已为 ${results.length} 名员工创建签署记录。`,
                          {
                            description: formData.signing_mode === 'electronic'
                              ? '员工将收到短信通知，可在线完成签署。'
                              : '请打印文书并完成线下签署。',
                            duration: 5000
                          }
                        );
                        
                        // 重新加载数据
                        await loadData();
                        
                        // 关闭对话框
                        setDialogOpen(false);
                        // 清理预览URL
                        if (previewFileUrl && previewFileUrl.startsWith('blob:')) {
                          URL.revokeObjectURL(previewFileUrl);
                          setPreviewFileUrl('');
                        }
                      } catch (error) {
                        // 捕获异常错误
                        console.error('签署发起失败:', error);
                        toast.error(
                          '签署发起失败！',
                          {
                            description: error instanceof Error 
                              ? `错误信息：${error.message}` 
                              : '发生未知错误，请稍后重试或联系管理员。',
                            duration: 5000
                          }
                        );
                      }
                    }}>
                      立即发起
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 文书签署状态 */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              待签署 ({pendingRecords.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              已完成 ({completedRecords.length})
            </TabsTrigger>
          </TabsList>

          {/* 待签署列表 */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>待签署列表</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="搜索公司、员工或部门..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full bg-muted" />
                    <Skeleton className="h-12 w-full bg-muted" />
                    <Skeleton className="h-12 w-full bg-muted" />
                  </div>
                ) : pendingRecords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    {searchKeyword ? '未找到匹配的记录' : '暂无待签署记录'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>公司名称</TableHead>
                          <TableHead>员工姓名</TableHead>
                          <TableHead>部门</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>发送时间</TableHead>
                          <TableHead>签署时间</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingRecords.map((signing) => (
                          <TableRow key={signing.id}>
                            <TableCell className="whitespace-nowrap">
                              {signing.company?.name || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {signing.employee?.name || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {signing.employee?.department || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant="outline">
                                {getTemplateNames(signing.template_ids) || '未知'}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={getStatusBadgeVariant(signing.status)}>
                                {SIGNING_STATUS_LABELS[signing.status]}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {signing.created_at ? new Date(signing.created_at).toLocaleString('zh-CN') : '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {signing.employee_signed_at ? new Date(signing.employee_signed_at).toLocaleString('zh-CN') : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetail(signing)}
                                  title="查看详情"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {signing.status === 'pending' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleWithdrawSigning(signing)}
                                    title="撤回签署"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 已完成列表 */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>已完成列表</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="搜索公司、员工或部门..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full bg-muted" />
                    <Skeleton className="h-12 w-full bg-muted" />
                    <Skeleton className="h-12 w-full bg-muted" />
                  </div>
                ) : completedRecords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    {searchKeyword ? '未找到匹配的记录' : '暂无已完成记录'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>公司名称</TableHead>
                          <TableHead>员工姓名</TableHead>
                          <TableHead>部门</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>发送时间</TableHead>
                          <TableHead>签署时间</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedRecords.map((signing) => (
                          <TableRow key={signing.id}>
                            <TableCell className="whitespace-nowrap">
                              {signing.company?.name || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {signing.employee?.name || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {signing.employee?.department || '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant="outline">
                                {getTemplateNames(signing.template_ids) || '未知'}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={getStatusBadgeVariant(signing.status)}>
                                {SIGNING_STATUS_LABELS[signing.status]}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {signing.created_at ? new Date(signing.created_at).toLocaleString('zh-CN') : '-'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {signing.employee_signed_at ? new Date(signing.employee_signed_at).toLocaleString('zh-CN') : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetail(signing)}
                                  title="查看详情"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {signing.signed_file_url && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handlePreviewFile(signing)}
                                      title="预览文件"
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownloadFile(signing)}
                                      title="下载文件"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 详情对话框 */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>签署详情</DialogTitle>
            </DialogHeader>
            {selectedSigning && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">员工</Label>
                    <p className="font-medium">{selectedSigning.employee?.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">公司</Label>
                    <p className="font-medium">{selectedSigning.company?.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">状态</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusBadgeVariant(selectedSigning.status)}>
                        {SIGNING_STATUS_LABELS[selectedSigning.status]}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">创建时间</Label>
                    <p>{new Date(selectedSigning.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">文书列表</Label>
                  <p className="mt-1">{getTemplateNames(selectedSigning.template_ids)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">签署模式</Label>
                  <p className="mt-1">
                    {selectedSigning.signing_mode === 'electronic' ? '电子签署' : '线下签署'}
                  </p>
                </div>
                {selectedSigning.notes && (
                  <div>
                    <Label className="text-muted-foreground">备注</Label>
                    <p className="mt-1">{selectedSigning.notes}</p>
                  </div>
                )}

                {selectedSigning.signing_mode === 'electronic' &&
                  selectedSigning.status === 'completed' &&
                  selectedSigning.third_party_contract_no && (
                    <div className="border-t pt-4 space-y-2">
                      <Label className="text-muted-foreground">爱签档案同步</Label>
                      <p className="text-sm text-muted-foreground">
                        调用下载合同接口将 PDF 写入档案表与 Storage（不影响异步回调逻辑，可作补拉）。
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={syncingAsignPdf}
                          onClick={() => handlePullAsignContractPdf(selectedSigning, 0)}
                        >
                          <CloudDownload className="h-4 w-4 mr-1" />
                          {syncingAsignPdf ? '同步中…' : '从爱签同步 PDF'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={syncingAsignPdf}
                          onClick={() => handlePullAsignContractPdf(selectedSigning, 1)}
                        >
                          强制拉取
                        </Button>
                        <span className="text-xs text-muted-foreground font-mono break-all">
                          {selectedSigning.third_party_contract_no}
                        </span>
                      </div>
                    </div>
                  )}
                
                {/* 线下签署模式：显示上传附件功能 */}
                {selectedSigning.signing_mode === 'offline' && selectedSigning.status === 'pending' && (
                  <div className="border-t pt-4">
                    <Label htmlFor="file-upload">上传已签署文档</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      支持PDF、JPG、PNG格式，文件大小不超过10MB
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadFile(selectedSigning.id, file);
                        }
                      }}
                      disabled={uploading}
                    />
                    {uploading && (
                      <p className="text-sm text-muted-foreground mt-2">上传中...</p>
                    )}
                  </div>
                )}
                
                {/* 显示已上传的文件 */}
                {selectedSigning.signed_file_url && (
                  <div className="border-t pt-4">
                    <Label className="text-muted-foreground">已签署文档</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewFile(selectedSigning)}
                      >
                        预览文件
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadFile(selectedSigning)}
                      >
                        下载文件
                      </Button>
                      {selectedSigning.uploaded_at && (
                        <p className="text-sm text-muted-foreground">
                          上传于 {new Date(selectedSigning.uploaded_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 电子签署模式：显示签署按钮 */}
                {selectedSigning.signing_mode === 'electronic' && selectedSigning.status === 'pending' && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleUpdateStatus(selectedSigning.id, 'employee_signed')}
                      className="flex-1"
                    >
                      员工签署
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedSigning.id, 'rejected')}
                    >
                      拒绝
                    </Button>
                  </div>
                )}
                
                {/* 线下签署模式：上传后显示完成按钮 */}
                {selectedSigning.signing_mode === 'offline' && selectedSigning.signed_file_url && selectedSigning.status === 'pending' && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleUpdateStatus(selectedSigning.id, 'completed')}
                      className="flex-1"
                    >
                      标记为已完成
                    </Button>
                  </div>
                )}
                
                {/* 电子签署模式：员工已签署后显示公司签署按钮 */}
                {selectedSigning.signing_mode === 'electronic' && selectedSigning.status === 'employee_signed' && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleUpdateStatus(selectedSigning.id, 'completed')}
                      className="flex-1"
                    >
                      公司签署完成
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 文件预览对话框 */}
        <Dialog open={previewDialogOpen} onOpenChange={(open) => {
          setPreviewDialogOpen(open);
          if (!open) {
            setIsEditMode(false);
            if (previewFileUrl.startsWith('blob:')) {
              URL.revokeObjectURL(previewFileUrl);
            }
          }
        }}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>文书信息预览 {isEditMode && <span className="text-sm text-primary">(编辑模式)</span>}</DialogTitle>
              <DialogDescription>
                {isEditMode ? '可以直接修改文书内容，修改后点击保存' : '请确认文书信息，确认无误后可下载保存'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto border rounded-md">
              {isEditMode ? (
                <div
                  ref={editableRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="w-full h-[calc(80vh-150px)] p-4 focus:outline-none"
                  onInput={handleContentChange}
                  style={{
                    fontFamily: '"SimSun", "宋体", serif',
                    lineHeight: '1.8',
                    fontSize: '14px'
                  }}
                />
              ) : previewFileType === 'pdf' ? (
                <iframe
                  src={previewFileUrl}
                  className="w-full h-[calc(80vh-150px)] border-0"
                  title="文书预览"
                />
              ) : (
                <div className="flex items-center justify-center h-[calc(80vh-150px)]">
                  <img
                    src={previewFileUrl}
                    alt="文件预览"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {isEditMode ? '✏️ 编辑模式：可直接修改文书内容' : '💡 提示：文书信息已保存，可随时在签署记录中查看'}
              </div>
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      取消
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                    >
                      保存编辑
                    </Button>
                  </>
                ) : (
                  <>
                    {originalContent && (
                      <Button
                        variant="outline"
                        onClick={handleEnterEditMode}
                      >
                        编辑
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => window.open(previewFileUrl, '_blank')}
                    >
                      在新标签页打开
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = previewFileUrl;
                        const employeeNames = employeesFormData.map(e => e.name).join('_');
                        link.download = `签署文书_${employeeNames}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.html`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success('文件下载成功');
                      }}
                    >
                      下载文件
                    </Button>
                    <Button
                      onClick={() => {
                        setPreviewDialogOpen(false);
                        if (previewFileUrl.startsWith('blob:')) {
                          URL.revokeObjectURL(previewFileUrl);
                        }
                      }}
                    >
                      立即发起
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
