import { supabase } from './supabase';
import type {
  Profile,
  Company,
  Employee,
  DocumentTemplate,
  SigningRecord,
  SignedDocument,
  Permission,
  Role,
  RolePermission,
  Notification,
  ReminderConfig,
  UserRole,
  CompanyTransfer,
  OperationLog,
  SalaryStructureTemplate,
  SalaryRecord,
  SalaryItem,
  AttendanceRecord,
  SalarySignature,
  SalarySignatureType,
  SalarySignatureStatus,
  AttendanceSignature,
  AttendanceSignatureStatus,
  DocumentCategory,
} from '@/types/types';

// 重新导出类型供其他模块使用
export type {
  Profile,
  Company,
  Employee,
  DocumentTemplate,
  SigningRecord,
  SignedDocument,
  Permission,
  Role,
  RolePermission,
  Notification,
  ReminderConfig,
  CompanyTransfer
};

// ==================== Profiles ====================
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('获取用户资料失败:', error);
    return null;
  }
  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取用户列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// 获取用户的所有下级（包括间接下级）
export async function getSubordinates(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .rpc('get_subordinates', { user_id: userId });

  if (error) {
    console.error('获取下级用户失败:', error);
    return [];
  }
  return Array.isArray(data) ? data.map((item: any) => item.subordinate_id) : [];
}

// 根据用户权限获取可见的用户列表
export async function getVisibleProfiles(currentUserId: string, currentUserRole: UserRole): Promise<Profile[]> {
  if (currentUserRole === 'super_admin') {
    // 超级管理员可以看到所有用户
    return getAllProfiles();
  }

  if (currentUserRole === 'manager') {
    // 管理员可以看到自己和所有下级
    const subordinateIds = await getSubordinates(currentUserId);
    
    if (subordinateIds.length === 0) {
      // 没有下级，只返回自己
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('获取可见用户列表失败:', error);
        return [];
      }
      return Array.isArray(data) ? data : [];
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`id.eq.${currentUserId},id.in.(${subordinateIds.join(',')})`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取可见用户列表失败:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  }

  // 普通员工只能看到自己
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUserId)
    .maybeSingle();

  if (error) {
    console.error('获取用户信息失败:', error);
    return [];
  }
  return data ? [data] : [];
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('更新用户资料失败:', error);
    return false;
  }
  return true;
}

// 创建新用户：走 Edge Function + service_role，避免在已登录管理员的浏览器里调用 auth.signUp
// 导致会话被切换为新用户（邮箱自动确认时常见），从而 profiles 在 RLS 下查不到列表。
export async function createUser(userData: {
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
  role: string;
  role_id?: string;
  manager_id?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanUsername = userData.username.trim().replace(/\s+/g, '');

    const { data, error } = await supabase.functions.invoke<{
      success: boolean;
      error?: string;
    }>('admin-create-user', {
      body: {
        username: cleanUsername,
        password: userData.password,
        full_name: userData.full_name,
        phone: userData.phone,
        role: userData.role,
        role_id: userData.role_id,
        manager_id: userData.manager_id,
      },
    });

    if (error) {
      console.error('创建用户失败(Edge Function):', error);
      return { success: false, error: error.message };
    }

    if (data && data.success === false) {
      return { success: false, error: data.error || '创建用户失败' };
    }

    return { success: true };
  } catch (error) {
    console.error('创建用户异常:', error);
    return { success: false, error: '创建用户时发生异常' };
  }
}

// 删除用户
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('delete_user', { user_id: userId });
    
    if (error) {
      console.error('删除用户失败:', error);
      return { success: false, error: error.message };
    }
    
    if (data && !data.success) {
      return { success: false, error: data.error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('删除用户异常:', error);
    return { success: false, error: '删除用户时发生异常' };
  }
}

// 切换用户状态（暂停/启用）
export async function toggleUserStatus(userId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('toggle_user_status', { 
      user_id: userId,
      new_status: isActive
    });
    
    if (error) {
      console.error('切换用户状态失败:', error);
      return { success: false, error: error.message };
    }
    
    if (data && !data.success) {
      return { success: false, error: data.error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('切换用户状态异常:', error);
    return { success: false, error: '切换用户状态时发生异常' };
  }
}

// 修改用户密码
export async function updateUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('update_user_password', { 
      user_id: userId,
      new_password: newPassword
    });
    
    if (error) {
      console.error('修改密码失败:', error);
      return { success: false, error: error.message };
    }
    
    if (data && !data.success) {
      return { success: false, error: data.error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('修改密码异常:', error);
    return { success: false, error: '修改密码时发生异常' };
  }
}

// ==================== SMS ====================
// 发送短信验证码
export async function sendSMS(mobile: string, sessionId?: string): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: { mobile, sessionId }
    });

    if (error) {
      const errorMsg = await error?.context?.text?.();
      console.error('发送短信失败:', errorMsg || error?.message);
      return { success: false, error: errorMsg || error?.message || '发送短信失败' };
    }

    if (data?.error) {
      return { success: false, error: data.error };
    }

    return { 
      success: true, 
      sessionId: data?.sessionId 
    };
  } catch (error) {
    console.error('发送短信异常:', error);
    return { success: false, error: '发送短信时发生异常' };
  }
}

// 验证短信验证码
export async function verifySMS(mobile: string, sessionId: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-sms', {
      body: { mobile, sessionId, code }
    });

    if (error) {
      const errorMsg = await error?.context?.text?.();
      console.error('验证短信验证码失败:', errorMsg || error?.message);
      return { success: false, error: errorMsg || error?.message || '验证失败' };
    }

    if (data?.error) {
      return { success: false, error: data.error };
    }

    return { success: true };
  } catch (error) {
    console.error('验证短信验证码异常:', error);
    return { success: false, error: '验证短信验证码时发生异常' };
  }
}

/**
 * 爱签 addSigner 单条签署策略项（bizData.signStrategyList[]，与开放平台表格一致）
 * - locationMode=2 坐标签章：必填 signPage、signX、signY；可选 offsetX/offsetY（px）、sealNo、canDrag；勿用 pageNo/x/y
 * - locationMode=3 关键字：必填 signKey
 * - locationMode=4 模板坐标：必填 signKey（仅模板文件）
 * - signType：1 签名/印章（默认），2 时间戳
 */
export type AsignSignStrategyItem = {
  attachNo: number;
  locationMode: number;
  sealNo?: number;
  /** 1 可拖动，其它否 */
  canDrag?: number;
  /** 模式 3、4 必填 */
  signKey?: string;
  /** 策略内：1 签名/印章，2 时间戳 */
  signType?: number;
  /** 坐标签章（mode=2）必填，页码从 1 起 */
  signPage?: number;
  /** 坐标签章（mode=2）必填，相对页面宽度的比例 */
  signX?: number;
  /** 坐标签章（mode=2）必填，相对页面高度的比例 */
  signY?: number;
  /** 像素偏移 X */
  offsetX?: number;
  /** 像素偏移 Y */
  offsetY?: number;
};

/**
 * 爱签 addSigner 单条签署方（与开放平台文档一致）
 * https://{host}/contract/addSigner
 */
export type AsignAddSignerItem = {
  /** 用户唯一标识码（常为手机号或爱签侧用户账号） */
  account: string;
  /** 2 静默签 3 感知签；不传则由 Edge 环境变量 ASIGN_DEFAULT_SIGN_TYPE 决定，默认 3 */
  signType?: number;
  sealNo?: string;
  authSignAccount?: string;
  /** 接收签署链接短信的号码（文档：非签署意愿验证码）；电子签需收短信打开链接签署时应传入，且 isNotice=1 时 Edge 会校验必填 */
  noticeMobile?: string;
  /** 顺序签从 1 起；无序可传 "1" */
  signOrder?: string;
  /** 0 否 1 是 */
  isNotice?: number;
  validateType?: number;
  /** 0 策略指定签位（默认）；1/2 用户拖拽（与开放平台 customSignFlag 一致） */
  customSignFlag?: number;
  /** 标记是否企业签署方（仅供后端注入企业印章编号等默认值） */
  isEnterpriseSigner?: boolean;
  /** 可拖拽时页码选项等，见文档 sealSetting */
  sealSetting?: number;
  /** 签署策略列表（关键字或坐标等，与爱签文档及控制台位置信息一致） */
  signStrategyList?: AsignSignStrategyItem[];
};

/**
 * 爱签 Edge Function add-asign-signatory。
 * - **signers**：多名签署方时传 **数组**；**同一合同仅可调一次** addSigner，Edge 合并为单次请求，bizData 与爱签示例一致为 **JSON 数组根** `[{contractNo,account,...},...]`。
 * - **bizData**：仅 1 名且需完全自定义 bizData 时使用，勿与 signers 同传。
 */
export type AddAsignSignatoryParams = {
  contractNo: string;
  signingRecordId?: string;
  /** 单条：完整 bizData（仅 1 名签署方） */
  bizData?: Record<string, unknown>;
  /** 多条：签署方列表（数组），每人对应一次 addSigner */
  signers?: AsignAddSignerItem[];
};

export async function addAsignSignatory(
  params: AddAsignSignatoryParams
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('add-asign-signatory', {
      body: {
        contractNo: params.contractNo,
        signingRecordId: params.signingRecordId,
        bizData: params.bizData,
        signers: params.signers,
      },
    });

    if (error) {
      let errorMsg: string | undefined;
      try {
        errorMsg = await error?.context?.text?.();
      } catch {
        errorMsg = undefined;
      }
      const fallback = error?.message || '添加签署方失败';
      console.error('[ADD_ASIGN_SIGNATORY] invoke 失败:', errorMsg || fallback);
      return { success: false, error: errorMsg || fallback };
    }

    if (data && typeof data === 'object' && 'error' in data && (data as { error?: string }).error) {
      const msg = (data as { error: string }).error;
      return { success: false, error: msg, data };
    }

    if (data && typeof data === 'object' && 'ok' in data && (data as { ok?: boolean }).ok === false) {
      const d = data as { error?: string; detail?: unknown };
      const msg = d.error || '爱签添加签署方失败';
      return { success: false, error: msg, data };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[ADD_ASIGN_SIGNATORY] 异常:', err);
    return { success: false, error: '添加签署方时发生异常' };
  }
}

// 检查合同到期并发送通知
export async function checkContractExpiry(): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('check-contract-expiry', {
      method: 'POST'
    });

    if (error) {
      const errorMsg = await error?.context?.text?.();
      console.error('检查合同到期失败:', errorMsg || error?.message);
      return { success: false, error: errorMsg || error?.message || '检查合同到期失败' };
    }

    if (data?.error) {
      return { success: false, error: data.error };
    }

    return { 
      success: true, 
      count: data?.count || 0
    };
  } catch (error) {
    console.error('检查合同到期异常:', error);
    return { success: false, error: '检查合同到期时发生异常' };
  }
}

// 检查发薪日并发送短信
export async function checkPaydayAndSend(): Promise<{ 
  success: boolean; 
  companies?: number; 
  totalEmployees?: number; 
  totalSent?: number; 
  error?: string 
}> {
  try {
    const { data, error } = await supabase.functions.invoke('check-payday-and-send', {
      method: 'POST'
    });

    if (error) {
      const errorMsg = await error?.context?.text?.();
      console.error('检查发薪日失败:', errorMsg || error?.message);
      return { success: false, error: errorMsg || error?.message || '检查发薪日失败' };
    }

    if (data?.error) {
      return { success: false, error: data.error };
    }

    return { 
      success: true, 
      companies: data?.companies || 0,
      totalEmployees: data?.totalEmployees || 0,
      totalSent: data?.totalSent || 0
    };
  } catch (error) {
    console.error('检查发薪日异常:', error);
    return { success: false, error: '检查发薪日时发生异常' };
  }
}

// ==================== Companies ====================
export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取公司列表失败:', error);
    return [];
  }
  
  const companies = Array.isArray(data) ? data : [];
  
  if (companies.length === 0) {
    return [];
  }

  // 批量获取所有公司的统计数据
  const companyIds = companies.map(c => c.id);

  // 批量获取在职员工数
  const { data: activeEmployees } = await supabase
    .from('employees')
    .select('company_id')
    .in('company_id', companyIds)
    .eq('status', 'active');

  // 批量获取已签署员工
  const { data: signedRecords } = await supabase
    .from('signing_records')
    .select('company_id, employee_id')
    .in('company_id', companyIds)
    .in('status', ['employee_signed', 'company_signed', 'completed']);

  // 批量获取一年内离职员工
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const { data: resignedEmployees } = await supabase
    .from('employees')
    .select('company_id')
    .in('company_id', companyIds)
    .eq('status', 'resigned')
    .gte('updated_at', oneYearAgo.toISOString());

  // 统计每个公司的数据
  const statsMap = new Map<string, {
    active_employees_count: number;
    signed_employees_count: number;
    resigned_employees_count: number;
  }>();

  // 初始化统计数据
  companyIds.forEach(id => {
    statsMap.set(id, {
      active_employees_count: 0,
      signed_employees_count: 0,
      resigned_employees_count: 0
    });
  });

  // 统计在职员工
  activeEmployees?.forEach(emp => {
    const stats = statsMap.get(emp.company_id);
    if (stats) {
      stats.active_employees_count++;
    }
  });

  // 统计已签署员工（去重）
  const signedEmployeesByCompany = new Map<string, Set<string>>();
  signedRecords?.forEach(record => {
    if (!signedEmployeesByCompany.has(record.company_id)) {
      signedEmployeesByCompany.set(record.company_id, new Set());
    }
    signedEmployeesByCompany.get(record.company_id)?.add(record.employee_id);
  });
  signedEmployeesByCompany.forEach((employeeSet, companyId) => {
    const stats = statsMap.get(companyId);
    if (stats) {
      stats.signed_employees_count = employeeSet.size;
    }
  });

  // 统计离职员工
  resignedEmployees?.forEach(emp => {
    const stats = statsMap.get(emp.company_id);
    if (stats) {
      stats.resigned_employees_count++;
    }
  });

  // 合并统计数据到公司信息
  const companiesWithStats = companies.map(company => ({
    ...company,
    ...(statsMap.get(company.id) || {
      active_employees_count: 0,
      signed_employees_count: 0,
      resigned_employees_count: 0
    })
  }));
  
  return companiesWithStats;
}

// 获取公司统计数据
export async function getCompanyStats(companyId: string): Promise<{
  active_employees_count: number;
  signed_employees_count: number;
  resigned_employees_count: number;
}> {
  // 在职员工数
  const { count: activeCount } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('status', 'active');

  // 已签署员工数（统计该公司员工中有签署记录的员工数）
  const { data: signedEmployees } = await supabase
    .from('signing_records')
    .select('employee_id')
    .eq('company_id', companyId)
    .in('status', ['employee_signed', 'company_signed', 'completed']);
  
  const uniqueSignedEmployees = new Set(signedEmployees?.map(r => r.employee_id) || []);

  // 一年内离职员工数
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const { count: resignedCount } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('status', 'resigned')
    .gte('updated_at', oneYearAgo.toISOString());

  return {
    active_employees_count: activeCount || 0,
    signed_employees_count: uniqueSignedEmployees.size,
    resigned_employees_count: resignedCount || 0
  };
}

export async function getCompany(id: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取公司信息失败:', error);
    return null;
  }
  return data;
}

// 生成公司编码：年月日+3位数字（按顺序从001开始）
export async function generateCompanyCode(): Promise<string> {
  // 使用数据库函数原子性地生成编码，避免并发冲突
  const { data, error } = await supabase.rpc('generate_company_code');

  if (error) {
    console.error('生成公司编码失败:', error);
    // 如果数据库函数失败，回退到本地生成（带时间戳避免冲突）
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-3); // 使用时间戳后3位
    return `${year}${month}${day}${timestamp}`;
  }

  return data as string;
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'owner_id'>): Promise<Company | null> {
  // 获取当前用户ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('创建公司失败: 用户未登录');
    return null;
  }

  // 将空字符串转换为null
  const cleanedCompany = {
    ...company,
    contact_person: company.contact_person || null,
    contact_phone: company.contact_phone || null,
    address: company.address || null,
    service_start_date: company.service_start_date || null,
    service_end_date: company.service_end_date || null,
    created_by: user.id, // 自动添加创建者ID
    owner_id: user.id, // 自动添加所有者ID（默认为创建者）
  };

  console.log('准备创建公司，数据:', cleanedCompany);

  const { data, error } = await supabase
    .from('companies')
    .insert(cleanedCompany)
    .select()
    .maybeSingle();

  if (error) {
    console.error('创建公司失败:', error);
    console.error('错误详情:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return null;
  }
  
  if (!data) {
    console.error('创建公司失败: 没有返回数据');
    return null;
  }
  
  console.log('创建公司成功:', data);
  return data;
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<boolean> {
  // 将空字符串转换为null
  const cleanedUpdates: any = { ...updates };
  if ('contact_person' in cleanedUpdates) {
    cleanedUpdates.contact_person = cleanedUpdates.contact_person || null;
  }
  if ('contact_phone' in cleanedUpdates) {
    cleanedUpdates.contact_phone = cleanedUpdates.contact_phone || null;
  }
  if ('address' in cleanedUpdates) {
    cleanedUpdates.address = cleanedUpdates.address || null;
  }
  if ('service_start_date' in cleanedUpdates) {
    cleanedUpdates.service_start_date = cleanedUpdates.service_start_date || null;
  }
  if ('service_end_date' in cleanedUpdates) {
    cleanedUpdates.service_end_date = cleanedUpdates.service_end_date || null;
  }

  console.log('准备更新公司，ID:', id, '数据:', cleanedUpdates);

  const { error } = await supabase
    .from('companies')
    .update(cleanedUpdates)
    .eq('id', id);

  if (error) {
    console.error('更新公司信息失败:', error);
    console.error('错误详情:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return false;
  }
  
  console.log('更新公司成功');
  return true;
}

export async function deleteCompany(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除公司失败:', error);
    return false;
  }
  return true;
}

// ==================== Employees ====================
export async function getEmployees(companyId?: string): Promise<Employee[]> {
  let query = supabase
    .from('employees')
    .select('*, company:companies(*)');

  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('获取员工列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const { data, error } = await supabase
    .from('employees')
    .select('*, company:companies(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取员工信息失败:', error);
    return null;
  }
  return data;
}

export async function createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee | null> {
  const { data, error } = await supabase
    .from('employees')
    .insert(employee)
    .select('*, company:companies(*)')
    .single();

  if (error) {
    console.error('创建员工失败:', error);
    // 抛出错误以便前端捕获并显示友好提示
    throw new Error(error.message || '创建员工失败');
  }
  return data;
}

// 批量创建员工
export async function createEmployeesBatch(employees: Omit<Employee, 'id' | 'created_at' | 'updated_at'>[]): Promise<{ success: number; failed: number; errors: string[] }> {
  // 先尝试批量插入
  const { data, error } = await supabase
    .from('employees')
    .insert(employees)
    .select();

  // 如果批量插入成功，直接返回
  if (!error && data) {
    return { 
      success: data.length, 
      failed: 0, 
      errors: [] 
    };
  }

  // 如果批量插入失败，逐个插入以获取详细错误信息
  console.warn('批量插入失败，开始逐个插入:', error?.message);
  
  let successCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i];
    const { error: individualError } = await supabase
      .from('employees')
      .insert(employee);

    if (individualError) {
      failedCount++;
      // 提取更友好的错误信息
      let errorMsg = individualError.message;
      
      // 处理常见的数据库错误
      if (errorMsg.includes('duplicate key') || errorMsg.includes('unique constraint')) {
        errorMsg = '员工信息已存在';
      } else if (errorMsg.includes('foreign key')) {
        errorMsg = '关联的公司不存在';
      } else if (errorMsg.includes('not-null constraint')) {
        errorMsg = '缺少必填字段';
      } else if (errorMsg.includes('check constraint')) {
        errorMsg = '数据格式不符合要求';
      }
      
      errors.push(`员工 ${employee.name}: ${errorMsg}`);
    } else {
      successCount++;
    }
  }

  return { success: successCount, failed: failedCount, errors };
}


export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<boolean> {
  const { error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('更新员工信息失败:', error);
    return false;
  }
  return true;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除员工失败:', error);
    return false;
  }
  return true;
}

// 获取合同即将到期的员工
export async function getExpiringContractEmployees(days: number = 30): Promise<Employee[]> {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  
  const { data, error } = await supabase
    .from('employees')
    .select('*, company:companies(*)')
    .lte('contract_end_date', targetDate.toISOString().split('T')[0])
    .eq('status', 'active')
    .order('contract_end_date', { ascending: true });

  if (error) {
    console.error('获取即将到期员工失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// ==================== Document Templates ====================
export async function getDocumentTemplates(companyId?: string): Promise<DocumentTemplate[]> {
  let query = supabase
    .from('document_templates')
    .select('*, company:companies(*)');

  if (companyId) {
    // 获取公司专属模板和通用模板（company_id为NULL）
    query = query.or(`company_id.eq.${companyId},company_id.is.null`);
  }

  const { data, error } = await query
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('获取文书模板列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getDocumentTemplate(id: string): Promise<DocumentTemplate | null> {
  const { data, error } = await supabase
    .from('document_templates')
    .select('*, company:companies(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取文书模板失败:', error);
    return null;
  }
  return data;
}

export async function createDocumentTemplate(template: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<DocumentTemplate | null> {
  console.log('API: 开始创建文书模板:', {
    name: template.name,
    category: template.category,
    company_id: template.company_id,
    has_content: !!template.content
  });

  const { data, error } = await supabase
    .from('document_templates')
    .insert(template)
    .select('*, company:companies(*)')
    .single();

  if (error) {
    console.error('API: 创建文书模板失败:', {
      error_code: error.code,
      error_message: error.message,
      error_details: error.details,
      error_hint: error.hint
    });
    return null;
  }

  console.log('API: 文书模板创建成功:', data.id);
  return data;
}

export async function updateDocumentTemplate(id: string, updates: Partial<DocumentTemplate>): Promise<boolean> {
  const { error } = await supabase
    .from('document_templates')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('更新文书模板失败:', error);
    return false;
  }
  return true;
}

export async function deleteDocumentTemplate(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('document_templates')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('删除文书模板失败:', error);
    return false;
  }
  return true;
}

export type SyncAsignTemplatesResult =
  | {
      ok: true;
      inserted: number;
      updated: number;
      skipped: number;
      errors: string[];
      has_more_errors?: boolean;
      /** 服务端在 0 条或 debug 时返回，便于核对爱签实际 JSON 结构 */
      diagnostic?: Record<string, unknown>;
    }
  | { ok: false; error: string; detail?: unknown };

/** Edge sync-asign-templates：拉取爱签 template/list 并写入 document_templates */
export async function syncAsignTemplatesToDocumentTemplates(params: {
  company_id: string | null;
  category?: DocumentCategory;
  rows_per_page?: number;
  max_pages?: number;
  /** 爱签 bizData.templateIdent，只同步指定模板编号 */
  template_ident?: string;
  /** 为 true 时响应中始终带 diagnostic */
  debug?: boolean;
}): Promise<SyncAsignTemplatesResult> {
  const { data, error } = await supabase.functions.invoke('sync-asign-templates', {
    body: {
      company_id: params.company_id,
      category: params.category,
      rows_per_page: params.rows_per_page,
      max_pages: params.max_pages,
      template_ident: params.template_ident?.trim() || undefined,
      debug: params.debug === true,
    },
  });

  if (error) {
    console.error('[ASIGN_TPL_SYNC] invoke 失败:', error.message);
    return { ok: false, error: error.message };
  }

  const payload = data as Record<string, unknown> | null;
  if (!payload || payload.ok !== true) {
    const errMsg =
      payload && typeof payload.error === 'string' ? payload.error : '爱签模板同步失败';
    return { ok: false, error: errMsg, detail: payload };
  }

  const diag = payload.diagnostic;
  return {
    ok: true,
    inserted: Number(payload.inserted) || 0,
    updated: Number(payload.updated) || 0,
    skipped: Number(payload.skipped) || 0,
    errors: Array.isArray(payload.errors) ? (payload.errors as string[]) : [],
    has_more_errors: Boolean(payload.has_more_errors),
    diagnostic:
      diag && typeof diag === 'object' && !Array.isArray(diag)
        ? (diag as Record<string, unknown>)
        : undefined,
  };
}

export type OpenAsignTemplateResult =
  | { ok: true; open_url?: string; data?: unknown }
  | { ok: false; error: string; detail?: unknown; debug?: unknown };

/** Edge open-asign-template：调用爱签 template/open，返回在线制作链接 */
export async function openAsignTemplateDesigner(params?: {
  template_ident?: string;
  redirect_url?: string;
  notify_url?: string;
  hidden_basic?: 0 | 1;
}): Promise<OpenAsignTemplateResult> {
  const { data, error } = await supabase.functions.invoke('open-asign-template', {
    body: {
      template_ident: params?.template_ident?.trim() || undefined,
      redirect_url: params?.redirect_url?.trim() || undefined,
      notify_url: params?.notify_url?.trim() || undefined,
      hidden_basic: params?.hidden_basic,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  const payload = data as Record<string, unknown> | null;
  if (!payload || payload.ok !== true) {
    const errMsg = payload && typeof payload.error === 'string' ? payload.error : '打开爱签模板页面失败';
    return {
      ok: false,
      error: errMsg,
      detail: payload?.detail,
      debug: payload?.debug,
    };
  }
  const openUrl = typeof payload.open_url === 'string' ? payload.open_url : undefined;
  return { ok: true, open_url: openUrl, data: payload.data };
}

export type GetAsignTemplateDataResult =
  | { ok: true; data: unknown; template_ident: string }
  | { ok: false; error: string; detail?: unknown; debug?: unknown };

/** Edge get-asign-template-data：爱签 template/getTemplateData，用于配置前查看控件 key */
export async function getAsignTemplateData(params: {
  template_ident: string;
}): Promise<GetAsignTemplateDataResult> {
  const template_ident = (params.template_ident ?? '').trim();
  if (!template_ident) {
    return { ok: false, error: '缺少爱签模板编号' };
  }
  const { data, error } = await supabase.functions.invoke('get-asign-template-data', {
    body: { template_ident },
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  const payload = data as Record<string, unknown> | null;
  if (!payload || payload.ok !== true) {
    const errMsg =
      payload && typeof payload.error === 'string' ? payload.error : '获取爱签模板控件信息失败';
    return {
      ok: false,
      error: errMsg,
      detail: payload?.detail,
      debug: payload?.debug,
    };
  }
  return {
    ok: true,
    data: payload.data,
    template_ident: typeof payload.template_ident === 'string' ? payload.template_ident : template_ident,
  };
}

// ==================== Signing Records ====================
export async function getSigningRecords(filters?: {
  companyId?: string;
  employeeId?: string;
  status?: string;
}): Promise<SigningRecord[]> {
  let query = supabase
    .from('signing_records')
    .select('*, company:companies(*), employee:employees(*)');

  if (filters?.companyId) {
    query = query.eq('company_id', filters.companyId);
  }
  if (filters?.employeeId) {
    query = query.eq('employee_id', filters.employeeId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('获取签署记录失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getSigningRecord(id: string): Promise<SigningRecord | null> {
  const { data, error } = await supabase
    .from('signing_records')
    .select('*, company:companies(*), employee:employees(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取签署记录失败:', error);
    return null;
  }
  return data;
}

export async function createSigningRecord(record: Omit<SigningRecord, 'id' | 'created_at' | 'updated_at'>): Promise<SigningRecord | null> {
  // 创建签署记录
  const { data, error } = await supabase
    .from('signing_records')
    .insert(record)
    .select('*, company:companies(*), employee:employees(*)')
    .single();

  if (error) {
    console.error('创建签署记录失败:', error);
    return null;
  }

  // 为每个模板创建signed_documents记录
  if (data && record.template_ids && record.template_ids.length > 0) {
    try {
      // 获取模板信息
      const { data: templates, error: templateError } = await supabase
        .from('document_templates')
        .select('id, name')
        .in('id', record.template_ids);

      if (templateError) {
        console.error('获取模板信息失败:', templateError);
      } else if (templates && templates.length > 0) {
        // 为每个模板创建signed_documents记录
        const signedDocuments = templates.map(template => ({
          signing_record_id: data.id,
          template_id: template.id,
          template_name: template.name,
          file_url: null, // 初始状态没有文件
          file_size: null,
          signed_at: null, // 初始状态未签署
          completed_at: null // 初始状态未完成
        }));

        const { error: docsError } = await supabase
          .from('signed_documents')
          .insert(signedDocuments);

        if (docsError) {
          console.error('创建签署文件记录失败:', docsError);
        }
      }
    } catch (err) {
      console.error('创建签署文件记录异常:', err);
    }
  }

  return data;
}

export async function updateSigningRecord(id: string, updates: Partial<SigningRecord>): Promise<boolean> {
  // 如果状态更新为已完成且没有提供完成时间，则自动填充
  if (updates.status === 'completed' && !updates.completed_at) {
    updates.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('signing_records')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('更新签署记录失败:', error);
    return false;
  }

  // 如果状态更新为已完成，同步更新 signed_documents 的 completed_at
  if (updates.status === 'completed') {
    const completedAt = updates.completed_at;
    const { error: docError } = await supabase
      .from('signed_documents')
      .update({ completed_at: completedAt })
      .eq('signing_record_id', id);

    if (docError) {
      console.error('同步更新 signed_documents.completed_at 失败:', docError);
    }
  }

  return true;
}

/**
 * 发送文书签署短信
 */
export async function sendSigningSMS(recordId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 获取签署记录详情
    const { data: record, error: fetchError } = await supabase
      .from('signing_records')
      .select(`
        *,
        employee:employees(id, name, phone),
        company:companies(id, name)
      `)
      .eq('id', recordId)
      .single();

    if (fetchError || !record) {
      return { success: false, error: '签署记录不存在' };
    }

    if (!record.employee?.phone) {
      return { success: false, error: '员工手机号为空' };
    }

    // 生成签署链接（使用记录ID作为token）
    const signatureUrl = `${window.location.origin}/employee-sign/${recordId}`;

    // 获取文书名称
    const templateNames = record.template_names?.join('、') || '文书';

    // 发送短信
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        mobile: record.employee.phone,
        message: `【九头鸟人事托管】您有${templateNames}待签署，请点击链接查看并签署：${signatureUrl}`
      }
    });

    if (error) {
      const errorMsg = await error?.context?.text?.();
      console.error('发送短信失败:', errorMsg || error?.message);
      return { success: false, error: errorMsg || error?.message || '发送短信失败' };
    }

    if (data?.error) {
      return { success: false, error: data.error };
    }

    // 更新签署记录的发送时间（如果需要的话）
    // 注意：signing_records表可能没有sent_at字段，这里先注释掉
    // const { error: updateError } = await supabase
    //   .from('signing_records')
    //   .update({
    //     sent_at: new Date().toISOString()
    //   })
    //   .eq('id', recordId);

    return { success: true };
  } catch (error) {
    console.error('发送签署短信失败:', error);
    return { success: false, error: '发送短信失败' };
  }
}

/**
 * 上传已签署文档
 */
function normalizePublicFileUrl(rawUrl: string): string {
  const input = String(rawUrl || '').trim();
  if (!input) return input;
  const base = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
  if (!base) return input;
  if (!input.includes('://')) return input;
  try {
    const u = new URL(input);
    const host = u.host.toLowerCase();
    if (host !== 'kong:8000' && host !== 'kong' && host !== 'localhost:8000' && host !== '127.0.0.1:8000') {
      return input;
    }
    const b = new URL(base);
    return `${b.protocol}//${b.host}${u.pathname}${u.search}`;
  } catch {
    return input;
  }
}

export async function uploadSignedDocument(file: File, signingRecordId: string): Promise<string | null> {
  try {
    // 生成文件名
    const fileExt = file.name.split('.').pop();
    const fileName = `${signingRecordId}_${Date.now()}.${fileExt}`;
    const filePath = `signed/${fileName}`;

    // 上传文件到Storage
    const { data, error } = await supabase.storage
      .from('signed-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('上传文件失败:', error);
      return null;
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from('signed-documents')
      .getPublicUrl(filePath);

    return normalizePublicFileUrl(urlData.publicUrl);
  } catch (error) {
    console.error('上传文件异常:', error);
    return null;
  }
}

/**
 * 更新签署记录的附件URL和上传信息，并同步该记录下所有 signed_documents 的 file_url
 */
export async function updateSigningRecordFile(
  id: string,
  fileUrl: string,
  uploadedBy: string,
  fileSize?: number | null
): Promise<boolean> {
  const now = new Date().toISOString();
  const normalizedUrl = normalizePublicFileUrl(fileUrl);

  const { error } = await supabase
    .from('signing_records')
    .update({
      signed_file_url: normalizedUrl,
      uploaded_at: now,
      uploaded_by: uploadedBy,
      completed_at: now,
    })
    .eq('id', id);

  if (error) {
    console.error('更新签署记录文件失败:', error);
    return false;
  }

  const docPatch: Record<string, unknown> = {
    file_url: normalizedUrl,
    signed_at: now,
    completed_at: now,
  };
  if (fileSize != null && Number.isFinite(fileSize)) {
    docPatch.file_size = Math.round(fileSize);
  }

  const { error: docError } = await supabase
    .from('signed_documents')
    .update(docPatch)
    .eq('signing_record_id', id);

  if (docError) {
    console.error('同步 signed_documents 失败:', docError);
    return false;
  }

  return true;
}

/** 调用 Edge download-asign-contract：爱签 downloadContract 拉 PDF 并写入 signing_records / signed_documents */
export type DownloadAsignContractSyncResult =
  | { ok: true; publicUrl: string; updatedRecordCount: number; fallback?: string }
  | { ok: false; error: string; detail?: unknown; debug?: unknown };

export async function downloadAsignContractAndSyncArchive(params: {
  signingRecordId?: string;
  contractNo?: string;
  force?: 0 | 1;
}): Promise<DownloadAsignContractSyncResult> {
  const base64ToPdfFile = (base64: string, fileName: string): File => {
    const normalized = base64.replace(/\s/g, '');
    const bin = atob(normalized);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) {
      bytes[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    return new File([blob], fileName, { type: 'application/pdf' });
  };
  try {
    const { data: authData } = await supabase.auth.getSession();
    const accessToken = authData?.session?.access_token ?? '';
    let tokenRole = '';
    let tokenExp = '';
    if (accessToken) {
      const parts = accessToken.split('.');
      if (parts.length >= 2) {
        try {
          const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
          const payload = JSON.parse(payloadJson) as Record<string, unknown>;
          const roleVal = payload.role;
          if (typeof roleVal === 'string') {
            tokenRole = roleVal;
          }
          const expVal = payload.exp;
          if (typeof expVal === 'number') {
            tokenExp = new Date(expVal * 1000).toISOString();
          }
        } catch (e) {
          console.warn('[ASIGN_SYNC] token payload 解析失败', e);
        }
      }
    }
    console.log('[ASIGN_SYNC] invoke download-asign-contract', {
      hasAccessToken: Boolean(accessToken),
      tokenRole,
      tokenExp,
      signingRecordId: params.signingRecordId,
      contractNo: params.contractNo,
      force: params.force ?? 0,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    });
  } catch (e) {
    console.warn('[ASIGN_SYNC] 调用前日志失败', e);
  }

  const { data, error } = await supabase.functions.invoke('download-asign-contract', {
    body: {
      signing_record_id: params.signingRecordId,
      contract_no: params.contractNo,
      force: params.force ?? 0,
    },
  });

  if (error) {
    console.error('[ASIGN_SYNC] invoke 失败:', {
      name: error.name,
      message: error.message,
      context: (error as any).context,
    });
    (window as any).__LAST_ASIGN_SYNC__ = {
      ok: false,
      invokeError: {
        name: error.name,
        message: error.message,
        context: (error as any).context,
      },
    };
    return { ok: false, error: error.message };
  }

  const payload = data as Record<string, unknown> | null;
  (window as any).__LAST_ASIGN_SYNC__ = payload;
  console.log('[ASIGN_SYNC] invoke 返回', payload);
  try {
    console.log('[ASIGN_SYNC] invoke 返回完整JSON', JSON.stringify(payload ?? {}, null, 2));
  } catch (e) {
    console.warn('[ASIGN_SYNC] 返回JSON序列化失败', e);
  }
  if (payload && payload.ok === true && typeof payload.publicUrl === 'string') {
    return {
      ok: true,
      publicUrl: payload.publicUrl,
      updatedRecordCount: Number(payload.updatedRecordCount) || 0,
      fallback: typeof payload.fallback === 'string' ? payload.fallback : undefined,
    };
  }

  // 函数侧下载成功但服务端 storage 上传失败：回退到前端上传
  if (
    payload &&
    payload.ok === true &&
    payload.need_client_upload === true &&
    typeof payload.pdf_base64 === 'string'
  ) {
    const signingRecordIdFromServer =
      typeof payload.signing_record_id === 'string' ? payload.signing_record_id : '';
    const effectiveSigningRecordId = signingRecordIdFromServer || params.signingRecordId || '';
    if (!effectiveSigningRecordId) {
      return { ok: false, error: '缺少 signingRecordId，无法执行前端上传兜底' };
    }

    const fallbackFileName =
      typeof payload.file_name === 'string' && payload.file_name.trim()
        ? payload.file_name.trim()
        : `asign_${effectiveSigningRecordId}.pdf`;
    const pdfFile = base64ToPdfFile(payload.pdf_base64, fallbackFileName);
    const fileUrl = await uploadSignedDocument(pdfFile, effectiveSigningRecordId);
    if (!fileUrl) {
      return { ok: false, error: '前端上传兜底失败：上传文件失败' };
    }

    const { data: authData } = await supabase.auth.getUser();
    const uploadedBy = authData.user?.id ?? '';
    const syncOk = await updateSigningRecordFile(
      effectiveSigningRecordId,
      fileUrl,
      uploadedBy,
      pdfFile.size,
    );
    if (!syncOk) {
      return { ok: false, error: '前端上传兜底失败：更新签署记录失败' };
    }

    return {
      ok: true,
      publicUrl: fileUrl,
      updatedRecordCount: 1,
      fallback: 'client_upload_from_base64',
    };
  }

  const errMsg =
    payload && typeof payload.error === 'string' ? payload.error : '爱签同步失败';
  return {
    ok: false,
    error: errMsg,
    detail: payload?.detail,
    debug: payload?.debug,
  };
}

// ==================== Permissions ====================
export async function getPermissions(): Promise<Permission[]> {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .order('code', { ascending: true });

  if (error) {
    console.error('获取权限列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

/** 解析用于拉取 role_permissions 的 roles.id（菜单、usePermissions 共用） */
export async function resolveEffectiveRoleIdForPermissions(userId: string): Promise<string | null> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role_id, role')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('获取用户资料失败:', profileError);
    return null;
  }
  if (!profile) return null;

  const typed = profile as { role_id?: string | null; role?: string };
  if (typed.role_id) return typed.role_id;

  // 历史数据：profiles.role = manager 但未绑定自定义角色时，按系统预设「主管」角色的权限
  if (typed.role === 'manager') {
    const { data: managerRole, error: roleErr } = await supabase
      .from('roles')
      .select('id')
      .eq('name', '主管')
      .eq('is_system_role', true)
      .maybeSingle();
    if (roleErr) {
      console.error('解析主管预设角色失败:', roleErr);
      return null;
    }
    return managerRole?.id ?? null;
  }

  return null;
}

// 获取当前用户的权限列表（与侧边栏菜单 permission 字段对应）
export async function getCurrentUserPermissions(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const roleId = await resolveEffectiveRoleIdForPermissions(user.id);
  if (!roleId) return [];

  const { data: rolePermissions, error: permError } = await supabase
    .from('role_permissions')
    .select(`
      permission_id,
      permissions!permission_id(code)
    `)
    .eq('role_id', roleId);

  if (permError) {
    console.error('获取角色权限失败:', permError);
    return [];
  }

  const permissions: string[] = [];
  if (Array.isArray(rolePermissions)) {
    rolePermissions.forEach((rp: any) => {
      if (rp.permissions && rp.permissions.code) {
        permissions.push(rp.permissions.code);
      }
    });
  }

  return permissions;
}

// ==================== Roles ====================
export async function getRoles(companyId?: string): Promise<Role[]> {
  let query = supabase
    .from('roles')
    .select('*');

  if (companyId) {
    query = query.or(`company_id.eq.${companyId},is_system_role.eq.true`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('获取角色列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getRole(id: string): Promise<Role | null> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取角色信息失败:', error);
    return null;
  }
  return data;
}

export async function createRole(role: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<Role | null> {
  const { data, error } = await supabase
    .from('roles')
    .insert(role)
    .select()
    .single();

  if (error) {
    console.error('创建角色失败:', error);
    return null;
  }
  return data;
}

export async function updateRole(id: string, updates: Partial<Role>): Promise<boolean> {
  const { error } = await supabase
    .from('roles')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('更新角色失败:', error);
    return false;
  }
  return true;
}

export async function deleteRole(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除角色失败:', error);
    return false;
  }
  return true;
}

// ==================== Role Permissions ====================
export async function getRolePermissions(roleId: string): Promise<Permission[]> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('permission:permissions(*)')
    .eq('role_id', roleId);

  if (error) {
    console.error('获取角色权限失败:', error);
    return [];
  }
  return Array.isArray(data) ? data.map(item => item.permission) : [];
}

export async function setRolePermissions(roleId: string, permissionIds: string[]): Promise<boolean> {
  // 先删除现有权限
  const { error: deleteError } = await supabase
    .from('role_permissions')
    .delete()
    .eq('role_id', roleId);

  if (deleteError) {
    console.error('删除角色权限失败:', deleteError);
    return false;
  }

  // 添加新权限
  if (permissionIds.length > 0) {
    const rolePermissions: RolePermission[] = permissionIds.map(permissionId => ({
      role_id: roleId,
      permission_id: permissionId
    }));

    const { error: insertError } = await supabase
      .from('role_permissions')
      .insert(rolePermissions);

    if (insertError) {
      console.error('添加角色权限失败:', insertError);
      return false;
    }
  }

  return true;
}

// ==================== Notifications ====================
export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('获取通知列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('获取未读通知数失败:', error);
    return 0;
  }
  return count || 0;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    console.error('标记通知为已读失败:', error);
    return false;
  }
  return true;
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('标记所有通知为已读失败:', error);
    return false;
  }
  return true;
}

export async function createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification | null> {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single();

  if (error) {
    console.error('创建通知失败:', error);
    return null;
  }
  return data;
}

// 创建员工入职通知
export async function createEmployeeOnboardingNotification(userId: string, employeeName: string, companyName: string): Promise<void> {
  await createNotification({
    user_id: userId,
    type: 'employee_onboarding',
    title: '新员工入职提醒',
    content: `员工 ${employeeName} 已加入 ${companyName}，请及时办理入职手续。`,
    is_read: false
  });
}

// 创建合同到期通知
export async function createContractExpiryNotification(userId: string, employeeName: string, daysLeft: number): Promise<void> {
  await createNotification({
    user_id: userId,
    type: 'contract_expiry',
    title: '劳动合同即将到期',
    content: `员工 ${employeeName} 的劳动合同将在 ${daysLeft} 天后到期，请及时处理续签事宜。`,
    is_read: false
  });
}

// 创建文书签署通知
export async function createDocumentSigningNotification(userId: string, documentName: string, employeeName: string): Promise<void> {
  await createNotification({
    user_id: userId,
    type: 'document_signing',
    title: '文书签署提醒',
    content: `员工 ${employeeName} 有文书《${documentName}》等待签署。`,
    is_read: false
  });
}

// 创建系统通知
export async function createSystemNotification(userId: string, title: string, content: string): Promise<void> {
  await createNotification({
    user_id: userId,
    type: 'system',
    title,
    content,
    is_read: false
  });
}

// ==================== Reminder Configs ====================
export async function getReminderConfig(companyId: string): Promise<ReminderConfig | null> {
  const { data, error } = await supabase
    .from('reminder_configs')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle();

  if (error) {
    console.error('获取提醒配置失败:', error);
    return null;
  }
  return data;
}

export async function upsertReminderConfig(config: Omit<ReminderConfig, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
  const { error } = await supabase
    .from('reminder_configs')
    .upsert(config, { onConflict: 'company_id' });

  if (error) {
    console.error('保存提醒配置失败:', error);
    return false;
  }
  return true;
}

// ==================== Dashboard Statistics ====================
export async function getDashboardStats(companyId?: string, userId?: string) {
  const stats = {
    totalCompanies: 0,
    activeEmployees: 0,
    pendingSignings: 0,
    expiringContracts: 0,
    expiringCompanies: 0,
    expiredCompanies: 0,
    // 薪酬管理统计
    totalSalaryRecords: 0,
    pendingSalarySignatures: 0,
    totalAttendanceRecords: 0,
    pendingAttendanceSignatures: 0
  };

  // 获取公司总数
  let companyQuery = supabase
    .from('companies')
    .select('*', { count: 'exact', head: true });
  
  // 如果指定了userId，只统计该用户的公司
  if (userId) {
    companyQuery = companyQuery.eq('owner_id', userId);
  }
  
  const { count: companyCount } = await companyQuery;
  
  stats.totalCompanies = companyCount || 0;

  // 获取在职员工数
  let activeQuery = supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  if (companyId) {
    activeQuery = activeQuery.eq('company_id', companyId);
  } else if (userId) {
    // 如果指定了userId，需要通过公司关联查询
    const { data: userCompanies } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', userId);
    
    if (userCompanies && userCompanies.length > 0) {
      const companyIds = userCompanies.map(c => c.id);
      activeQuery = activeQuery.in('company_id', companyIds);
    } else {
      // 如果用户没有公司，返回0
      stats.activeEmployees = 0;
      stats.pendingSignings = 0;
      stats.expiringContracts = 0;
      stats.expiringCompanies = 0;
      stats.expiredCompanies = 0;
      return stats;
    }
  }

  const { count: activeCount } = await activeQuery;
  stats.activeEmployees = activeCount || 0;

  // 获取待签署记录数
  let signingQuery = supabase
    .from('signing_records')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (companyId) {
    signingQuery = signingQuery.eq('company_id', companyId);
  } else if (userId) {
    const { data: userCompanies } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', userId);
    
    if (userCompanies && userCompanies.length > 0) {
      const companyIds = userCompanies.map(c => c.id);
      signingQuery = signingQuery.in('company_id', companyIds);
    }
  }

  const { count: signingCount } = await signingQuery;
  stats.pendingSignings = signingCount || 0;

  // 获取即将到期合同数（30天内）
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  let expiringQuery = supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .lte('contract_end_date', targetDate.toISOString().split('T')[0])
    .eq('status', 'active');

  if (companyId) {
    expiringQuery = expiringQuery.eq('company_id', companyId);
  } else if (userId) {
    const { data: userCompanies } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', userId);
    
    if (userCompanies && userCompanies.length > 0) {
      const companyIds = userCompanies.map(c => c.id);
      expiringQuery = expiringQuery.in('company_id', companyIds);
    }
  }

  const { count: expiringCount } = await expiringQuery;
  stats.expiringContracts = expiringCount || 0;

  // 获取3个月内即将到期的公司数
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const today = new Date().toISOString().split('T')[0];

  let expiringCompaniesQuery = supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .gte('service_end_date', today)
    .lte('service_end_date', threeMonthsLater.toISOString().split('T')[0])
    .eq('service_status', true);

  if (userId) {
    expiringCompaniesQuery = expiringCompaniesQuery.eq('owner_id', userId);
  }

  const { count: expiringCompaniesCount } = await expiringCompaniesQuery;
  stats.expiringCompanies = expiringCompaniesCount || 0;

  // 获取已到期的公司数
  let expiredCompaniesQuery = supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .lt('service_end_date', today)
    .eq('service_status', true);

  if (userId) {
    expiredCompaniesQuery = expiredCompaniesQuery.eq('owner_id', userId);
  }

  const { count: expiredCompaniesCount } = await expiredCompaniesQuery;
  stats.expiredCompanies = expiredCompaniesCount || 0;

  // 获取工资记录总数
  let salaryRecordsQuery = supabase
    .from('salary_records')
    .select('*', { count: 'exact', head: true });

  if (companyId) {
    salaryRecordsQuery = salaryRecordsQuery.eq('company_id', companyId);
  } else if (userId) {
    const { data: userCompanies } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', userId);
    
    if (userCompanies && userCompanies.length > 0) {
      const companyIds = userCompanies.map(c => c.id);
      salaryRecordsQuery = salaryRecordsQuery.in('company_id', companyIds);
    }
  }

  const { count: salaryRecordsCount } = await salaryRecordsQuery;
  stats.totalSalaryRecords = salaryRecordsCount || 0;

  // 获取待签署的工资条数量
  let pendingSalaryQuery = supabase
    .from('salary_signatures')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (companyId) {
    pendingSalaryQuery = pendingSalaryQuery.eq('company_id', companyId);
  } else if (userId) {
    const { data: userCompanies } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', userId);
    
    if (userCompanies && userCompanies.length > 0) {
      const companyIds = userCompanies.map(c => c.id);
      pendingSalaryQuery = pendingSalaryQuery.in('company_id', companyIds);
    }
  }

  const { count: pendingSalaryCount } = await pendingSalaryQuery;
  stats.pendingSalarySignatures = pendingSalaryCount || 0;

  // 获取考勤记录总数
  let attendanceRecordsQuery = supabase
    .from('attendance_records')
    .select('*', { count: 'exact', head: true });

  if (companyId) {
    attendanceRecordsQuery = attendanceRecordsQuery.eq('company_id', companyId);
  } else if (userId) {
    const { data: userCompanies } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', userId);
    
    if (userCompanies && userCompanies.length > 0) {
      const companyIds = userCompanies.map(c => c.id);
      attendanceRecordsQuery = attendanceRecordsQuery.in('company_id', companyIds);
    }
  }

  const { count: attendanceRecordsCount } = await attendanceRecordsQuery;
  stats.totalAttendanceRecords = attendanceRecordsCount || 0;

  // 获取待签署的考勤确认表数量
  let pendingAttendanceQuery = supabase
    .from('attendance_signatures')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (companyId) {
    pendingAttendanceQuery = pendingAttendanceQuery.eq('company_id', companyId);
  } else if (userId) {
    const { data: userCompanies } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', userId);
    
    if (userCompanies && userCompanies.length > 0) {
      const companyIds = userCompanies.map(c => c.id);
      pendingAttendanceQuery = pendingAttendanceQuery.in('company_id', companyIds);
    }
  }

  const { count: pendingAttendanceCount } = await pendingAttendanceQuery;
  stats.pendingAttendanceSignatures = pendingAttendanceCount || 0;

  return stats;
}

// ==================== 签署文件管理 ====================

/**
 * 获取签署记录的所有签署文件
 */
export async function getSignedDocuments(signingRecordId: string): Promise<SignedDocument[]> {
  const { data, error } = await supabase
    .from('signed_documents')
    .select('*')
    .eq('signing_record_id', signingRecordId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('获取签署文件失败:', error);
    throw error;
  }

  return data || [];
}

/**
 * 创建签署文件记录
 */
export async function createSignedDocument(document: Omit<SignedDocument, 'id' | 'created_at' | 'updated_at'>): Promise<SignedDocument> {
  const { data, error } = await supabase
    .from('signed_documents')
    .insert(document)
    .select()
    .single();

  if (error) {
    console.error('创建签署文件失败:', error);
    throw error;
  }

  return data;
}

/**
 * 批量创建签署文件记录
 */
export async function createSignedDocuments(documents: Omit<SignedDocument, 'id' | 'created_at' | 'updated_at'>[]): Promise<SignedDocument[]> {
  const { data, error } = await supabase
    .from('signed_documents')
    .insert(documents)
    .select();

  if (error) {
    console.error('批量创建签署文件失败:', error);
    throw error;
  }

  return data || [];
}

/**
 * 更新签署文件
 */
export async function updateSignedDocument(
  id: string,
  updates: Partial<Omit<SignedDocument, 'id' | 'created_at' | 'updated_at'>>
): Promise<SignedDocument> {
  const { data, error } = await supabase
    .from('signed_documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('更新签署文件失败:', error);
    throw error;
  }

  return data;
}

/**
 * 删除签署文件
 */
export async function deleteSignedDocument(id: string): Promise<void> {
  const { error } = await supabase
    .from('signed_documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除签署文件失败:', error);
    throw error;
  }
}

// ==================== 公司流转 ====================

/**
 * 流转公司
 */
export async function transferCompany(
  companyId: string,
  toUserId: string,
  reason?: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('transfer_company', {
    p_company_id: companyId,
    p_to_user_id: toUserId,
    p_reason: reason || null
  });

  if (error) {
    console.error('流转公司失败:', error);
    throw error;
  }

  return data as boolean;
}

/**
 * 获取公司流转历史
 */
export async function getCompanyTransferHistory(companyId: string): Promise<CompanyTransfer[]> {
  const { data, error } = await supabase
    .from('company_transfer_history')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取公司流转历史失败:', error);
    return [];
  }

  return data || [];
}

/**
 * 获取用户的所有流转记录（作为发起方或接收方）
 */
export async function getUserTransferHistory(userId: string): Promise<CompanyTransfer[]> {
  const { data, error } = await supabase
    .from('company_transfer_history')
    .select('*')
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取用户流转历史失败:', error);
    return [];
  }

  return data || [];
}

// ==================== 操作日志相关 ====================

/**
 * 记录操作日志
 */
export async function logOperation(
  operationType: string,
  operationDetail: string,
  targetType?: string,
  targetId?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string | null> {
  const { data, error } = await supabase.rpc('log_operation', {
    p_operation_type: operationType,
    p_operation_detail: operationDetail,
    p_target_type: targetType || null,
    p_target_id: targetId || null,
    p_ip_address: ipAddress || null,
    p_user_agent: userAgent || null
  });

  if (error) {
    console.error('记录操作日志失败:', error);
    return null;
  }

  return data as string;
}

/**
 * 获取操作日志列表
 */
export async function getOperationLogs(params?: {
  userId?: string;
  operationType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<OperationLog[]> {
  let query = supabase
    .from('operation_logs')
    .select(`
      *,
      profiles!user_id(full_name, username)
    `)
    .order('created_at', { ascending: false });

  if (params?.userId) {
    query = query.eq('user_id', params.userId);
  }

  if (params?.operationType) {
    query = query.eq('operation_type', params.operationType);
  }

  if (params?.startDate) {
    query = query.gte('created_at', params.startDate);
  }

  if (params?.endDate) {
    query = query.lte('created_at', params.endDate);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取操作日志失败:', error);
    return [];
  }

  // 处理返回数据，添加user_name字段
  return (data || []).map((log: any) => ({
    ...log,
    user_name: log.profiles?.full_name || log.profiles?.username || '未知用户'
  }));
}

/**
 * 获取操作日志统计
 */
export async function getOperationLogStats(params?: {
  userId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ operation_type: string; count: number }[]> {
  let query = supabase
    .from('operation_logs')
    .select('operation_type', { count: 'exact' });

  if (params?.userId) {
    query = query.eq('user_id', params.userId);
  }

  if (params?.startDate) {
    query = query.gte('created_at', params.startDate);
  }

  if (params?.endDate) {
    query = query.lte('created_at', params.endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取操作日志统计失败:', error);
    return [];
  }

  // 统计每种操作类型的数量
  const stats: Record<string, number> = {};
  (data || []).forEach((log: any) => {
    stats[log.operation_type] = (stats[log.operation_type] || 0) + 1;
  });

  return Object.entries(stats).map(([operation_type, count]) => ({
    operation_type,
    count
  }));
}

// ==================== 公司详情相关 ====================

/**
 * 根据ID获取公司信息（别名函数，与getCompany一致）
 */
export async function getCompanyById(id: string): Promise<Company | null> {
  return getCompany(id);
}

/**
 * 获取公司的所有员工
 */
export async function getEmployeesByCompany(companyId: string): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取公司员工失败:', error);
    return [];
  }

  return data || [];
}

/**
 * 获取公司的所有文书模板
 */
export async function getTemplatesByCompany(companyId: string): Promise<DocumentTemplate[]> {
  // 获取公司专属模板和通用模板（company_id为NULL）
  const { data, error } = await supabase
    .from('document_templates')
    .select('*')
    .or(`company_id.eq.${companyId},company_id.is.null`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取公司文书模板失败:', error);
    return [];
  }

  return data || [];
}

/**
 * 获取所有通用模板
 */
export async function getUniversalTemplates(): Promise<DocumentTemplate[]> {
  const { data, error } = await supabase
    .from('document_templates')
    .select('*')
    .is('company_id', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取通用模板失败:', error);
    return [];
  }

  return data || [];
}

/**
 * 获取公司的所有签署记录
 */
export async function getSigningRecordsByCompany(companyId: string): Promise<SigningRecord[]> {
  const { data, error } = await supabase
    .from('signing_records')
    .select(`
      *,
      employees!employee_id(name)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取公司签署记录失败:', error);
    return [];
  }

  // 添加员工姓名
  return (data || []).map((record: any) => ({
    ...record,
    employee_name: record.employees?.name || '未知员工'
  }));
}

/**
 * 根据ID获取员工信息
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      companies!company_id(name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取员工信息失败:', error);
    return null;
  }

  if (!data) return null;

  // 添加公司名称
  return {
    ...data,
    company_name: data.companies?.name || '未知公司'
  };
}

/**
 * 获取员工的所有签署记录
 */
export async function getSigningRecordsByEmployee(employeeId: string): Promise<SigningRecord[]> {
  const { data, error } = await supabase
    .from('signing_records')
    .select(`
      *,
      companies!company_id(name)
    `)
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取员工签署记录失败:', error);
    return [];
  }

  // 添加公司名称
  return (data || []).map((record: any) => ({
    ...record,
    company_name: record.companies?.name || '未知公司'
  }));
}

// ==================== 薪酬管理 ====================

// 获取工资结构模板列表
export async function getSalaryStructureTemplates(companyId?: string): Promise<SalaryStructureTemplate[]> {
  let query = supabase
    .from('salary_structure_templates')
    .select('*')
    .order('created_at', { ascending: false });

  // 如果指定了公司ID，返回该公司的模板和所有通用模板
  if (companyId) {
    query = query.or(`company_id.eq.${companyId},is_universal.eq.true`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取工资结构模板失败:', error);
    return [];
  }

  return data || [];
}

// 获取单个工资结构模板
export async function getSalaryStructureTemplate(id: string): Promise<SalaryStructureTemplate | null> {
  const { data, error } = await supabase
    .from('salary_structure_templates')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取工资结构模板失败:', error);
    return null;
  }

  return data;
}

// 创建工资结构模板
export async function createSalaryStructureTemplate(template: Partial<SalaryStructureTemplate>): Promise<SalaryStructureTemplate | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('salary_structure_templates')
    .insert({
      ...template,
      created_by: user?.id
    })
    .select()
    .single();

  if (error) {
    console.error('创建工资结构模板失败:', error);
    throw error;
  }

  return data;
}

// 更新工资结构模板
export async function updateSalaryStructureTemplate(id: string, updates: Partial<SalaryStructureTemplate>): Promise<SalaryStructureTemplate | null> {
  const { data, error } = await supabase
    .from('salary_structure_templates')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('更新工资结构模板失败:', error);
    throw error;
  }

  return data;
}

// 删除工资结构模板
export async function deleteSalaryStructureTemplate(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('salary_structure_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除工资结构模板失败:', error);
    throw error;
  }

  return true;
}

// 获取工资记录列表
export async function getSalaryRecords(companyId?: string, year?: number, month?: number): Promise<SalaryRecord[]> {
  let query = supabase
    .from('salary_records')
    .select(`
      *,
      template:salary_structure_templates(*)
    `)
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (companyId) {
    query = query.eq('company_id', companyId);
  }
  if (year) {
    query = query.eq('year', year);
  }
  if (month) {
    query = query.eq('month', month);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取工资记录失败:', error);
    return [];
  }

  return data || [];
}

// 获取单个工资记录
export async function getSalaryRecord(id: string): Promise<SalaryRecord | null> {
  const { data, error } = await supabase
    .from('salary_records')
    .select(`
      *,
      template:salary_structure_templates(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取工资记录失败:', error);
    return null;
  }

  return data;
}

// 创建工资记录
export async function createSalaryRecord(record: Partial<SalaryRecord>): Promise<SalaryRecord | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('salary_records')
    .insert({
      ...record,
      uploaded_by: user?.id
    })
    .select()
    .single();

  if (error) {
    console.error('创建工资记录失败:', error);
    throw error;
  }

  return data;
}

// 更新工资记录
export async function updateSalaryRecord(id: string, updates: Partial<SalaryRecord>): Promise<SalaryRecord | null> {
  const { data, error } = await supabase
    .from('salary_records')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('更新工资记录失败:', error);
    throw error;
  }

  return data;
}

// 删除工资记录
export async function deleteSalaryRecord(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('salary_records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除工资记录失败:', error);
    throw error;
  }

  return true;
}

// 获取工资条列表
export async function getSalaryItems(salaryRecordId?: string, employeeId?: string): Promise<SalaryItem[]> {
  let query = supabase
    .from('salary_items')
    .select(`
      *,
      salary_record:salary_records(*)
    `)
    .order('created_at', { ascending: false });

  if (salaryRecordId) {
    query = query.eq('salary_record_id', salaryRecordId);
  }
  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取工资条失败:', error);
    return [];
  }

  return data || [];
}

// 批量创建工资条
export async function createSalaryItems(items: Partial<SalaryItem>[]): Promise<SalaryItem[]> {
  const { data, error } = await supabase
    .from('salary_items')
    .insert(items)
    .select();

  if (error) {
    console.error('批量创建工资条失败:', error);
    throw error;
  }

  return data || [];
}

// 更新工资条
export async function updateSalaryItem(id: string, updates: Partial<SalaryItem>): Promise<SalaryItem | null> {
  const { data, error } = await supabase
    .from('salary_items')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('更新工资条失败:', error);
    throw error;
  }

  return data;
}

// 标记工资条为已发送
export async function markSalaryItemsAsSent(salaryRecordId: string): Promise<boolean> {
  const { error } = await supabase
    .from('salary_items')
    .update({
      is_sent: true,
      sent_at: new Date().toISOString()
    })
    .eq('salary_record_id', salaryRecordId);

  if (error) {
    console.error('标记工资条为已发送失败:', error);
    throw error;
  }

  return true;
}

// ==================== 考勤记录管理 ====================

/**
 * 获取考勤记录列表
 */
export async function getAttendanceRecords(companyId?: string, month?: string): Promise<AttendanceRecord[]> {
  let query = supabase
    .from('attendance_records')
    .select(`
      *,
      employee:employees(
        id, 
        name,
        company_id,
        company:companies(id, name)
      ),
      company:companies(id, name)
    `)
    .order('month', { ascending: false })
    .order('created_at', { ascending: false });

  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  if (month) {
    query = query.eq('month', month);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取考勤记录失败:', error);
    throw error;
  }

  return (data || []) as AttendanceRecord[];
}

/**
 * 根据员工ID获取考勤记录
 */
export async function getAttendanceRecordsByEmployee(employeeId: string): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from('attendance_records')
    .select(`
      *,
      employee:employees(
        id, 
        name,
        company_id,
        company:companies(id, name)
      ),
      company:companies(id, name)
    `)
    .eq('employee_id', employeeId)
    .order('month', { ascending: false });

  if (error) {
    console.error('获取员工考勤记录失败:', error);
    throw error;
  }

  return (data || []) as AttendanceRecord[];
}

/**
 * 创建考勤记录
 */
export async function createAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>): Promise<AttendanceRecord> {
  const { data: userData } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('attendance_records')
    .insert({
      ...record,
      created_by: userData.user?.id
    })
    .select()
    .single();

  if (error) {
    console.error('创建考勤记录失败:', error);
    throw error;
  }

  return data as AttendanceRecord;
}

/**
 * 批量创建考勤记录
 */
export async function createAttendanceRecordsBatch(records: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>[]): Promise<AttendanceRecord[]> {
  const { data: userData } = await supabase.auth.getUser();
  
  const recordsWithCreator = records.map(record => ({
    ...record,
    created_by: userData.user?.id
  }));

  const { data, error } = await supabase
    .from('attendance_records')
    .upsert(recordsWithCreator, {
      onConflict: 'company_id,employee_id,month',
      ignoreDuplicates: false
    })
    .select();

  if (error) {
    console.error('批量创建考勤记录失败:', error);
    throw error;
  }

  return (data || []) as AttendanceRecord[];
}

/**
 * 更新考勤记录
 */
export async function updateAttendanceRecord(id: string, updates: Partial<AttendanceRecord>): Promise<boolean> {
  const { error } = await supabase
    .from('attendance_records')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('更新考勤记录失败:', error);
    throw error;
  }

  return true;
}

/**
 * 删除考勤记录
 */
export async function deleteAttendanceRecord(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('attendance_records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除考勤记录失败:', error);
    throw error;
  }

  return true;
}

/**
 * 批量删除考勤记录
 */
export async function deleteAttendanceRecordsBatch(ids: string[]): Promise<boolean> {
  const { error } = await supabase
    .from('attendance_records')
    .delete()
    .in('id', ids);

  if (error) {
    console.error('批量删除考勤记录失败:', error);
    throw error;
  }

  return true;
}

// ==================== 薪酬签署 ====================

/**
 * 获取薪酬签署记录列表
 */
export async function getSalarySignatures(): Promise<SalarySignature[]> {
  const { data, error } = await supabase
    .from('salary_signatures')
    .select(`
      *,
      employee:employees(id, name, phone, department),
      company:companies(id, name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取薪酬签署记录失败:', error);
    return [];
  }

  return data || [];
}

/**
 * 创建薪酬签署记录
 */
export async function createSalarySignature(signature: Omit<SalarySignature, 'id' | 'created_at' | 'updated_at'>): Promise<SalarySignature | null> {
  const { data, error } = await supabase
    .from('salary_signatures')
    .insert(signature)
    .select()
    .single();

  if (error) {
    console.error('创建薪酬签署记录失败:', error);
    return null;
  }

  return data;
}

/**
 * 批量创建薪酬签署记录
 */
export async function createSalarySignaturesBatch(signatures: Omit<SalarySignature, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
  const { error } = await supabase
    .from('salary_signatures')
    .insert(signatures);

  if (error) {
    console.error('批量创建薪酬签署记录失败:', error);
    return false;
  }

  return true;
}

/**
 * 更新薪酬签署记录
 */
export async function updateSalarySignature(id: string, updates: Partial<SalarySignature>): Promise<boolean> {
  const { error } = await supabase
    .from('salary_signatures')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('更新薪酬签署记录失败:', error);
    return false;
  }

  return true;
}

/**
 * 发送薪酬签署短信
 */
export async function sendSalarySignatureSMS(signatureId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 生成签署token
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('update_sign_token', { signature_id: signatureId });

    if (tokenError || !tokenData) {
      console.error('生成签署token失败:', tokenError);
      return { success: false, error: '生成签署链接失败' };
    }

    // 获取签署记录详情
    const { data: signature, error: fetchError } = await supabase
      .from('salary_signatures')
      .select(`
        *,
        employee:employees(id, name, phone),
        company:companies(id, name)
      `)
      .eq('id', signatureId)
      .single();

    if (fetchError || !signature) {
      return { success: false, error: '签署记录不存在' };
    }

    if (!signature.employee?.phone) {
      return { success: false, error: '员工手机号为空' };
    }

    // 生成签署链接
    const signatureUrl = `${window.location.origin}/sign/${tokenData}`;

    // 发送短信
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        mobile: signature.employee.phone,
        message: `【九头鸟人事托管】您有一份${signature.type === 'salary_slip' ? '工资条' : '考勤确认表'}待签署，请点击链接查看并签署：${signatureUrl}`
      }
    });

    if (error) {
      const errorMsg = await error?.context?.text?.();
      console.error('发送短信失败:', errorMsg || error?.message);
      return { success: false, error: errorMsg || error?.message || '发送短信失败' };
    }

    if (data?.error) {
      return { success: false, error: data.error };
    }

    // 更新签署记录状态为已发送，并记录发送时间
    const { error: updateError } = await supabase
      .from('salary_signatures')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', signatureId);

    if (updateError) {
      console.error('更新签署状态失败:', updateError);
      // 即使更新失败，短信已经发送成功，仍然返回成功
    }

    return { success: true };
  } catch (error: any) {
    console.error('发送薪酬签署短信异常:', error);
    return { success: false, error: error.message || '发送短信时发生异常' };
  }
}

/**
 * 删除薪酬签署记录
 */
export async function deleteSalarySignature(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('salary_signatures')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('删除薪酬签署记录失败:', error);
    return false;
  }

  return true;
}

/**
 * 批量删除薪酬签署记录
 */
export async function deleteSalarySignaturesBatch(ids: string[]): Promise<boolean> {
  const { error } = await supabase
    .from('salary_signatures')
    .delete()
    .in('id', ids);

  if (error) {
    console.error('批量删除薪酬签署记录失败:', error);
    return false;
  }

  return true;
}

/**
 * 批量撤回薪酬签署记录
 */
export async function revokeSalarySignaturesBatch(ids: string[]): Promise<boolean> {
  const { error } = await supabase
    .from('salary_signatures')
    .update({
      status: 'revoked',
      sent_at: null
    })
    .in('id', ids)
    .in('status', ['pending', 'sent']);

  if (error) {
    console.error('批量撤回薪酬签署记录失败:', error);
    return false;
  }

  return true;
}

/**
 * 批量发送薪酬签署短信
 */
export async function batchSendSalarySignatureSMS(signatureIds: string[]): Promise<{ success: boolean; successCount: number; failCount: number; errors: string[] }> {
  try {
    // 批量生成签署token
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('batch_generate_sign_tokens', { signature_ids: signatureIds });

    if (tokenError) {
      console.error('批量生成签署token失败:', tokenError);
      return { success: false, successCount: 0, failCount: signatureIds.length, errors: ['生成签署链接失败'] };
    }

    // 获取所有签署记录详情
    const { data: signatures, error: fetchError } = await supabase
      .from('salary_signatures')
      .select(`
        *,
        employee:employees(id, name, phone),
        company:companies(id, name)
      `)
      .in('id', signatureIds);

    if (fetchError || !signatures) {
      return { success: false, successCount: 0, failCount: signatureIds.length, errors: ['获取签署记录失败'] };
    }

    // 创建token映射
    const tokenMap = new Map(tokenData.map((item: any) => [item.id, item.sign_token]));

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    // 批量发送短信
    for (const signature of signatures) {
      if (!signature.employee?.phone) {
        failCount++;
        errors.push(`${signature.employee?.name || '未知员工'}：手机号为空`);
        continue;
      }

      const token = tokenMap.get(signature.id);
      if (!token) {
        failCount++;
        errors.push(`${signature.employee.name}：未生成签署链接`);
        continue;
      }

      const signatureUrl = `${window.location.origin}/sign/${token}`;

      try {
        const { data, error } = await supabase.functions.invoke('send-sms', {
          body: {
            mobile: signature.employee.phone,
            message: `【九头鸟人事托管】您有一份${signature.type === 'salary_slip' ? '工资条' : '考勤确认表'}待签署，请点击链接查看并签署：${signatureUrl}`
          }
        });

        if (error || data?.error) {
          failCount++;
          errors.push(`${signature.employee.name}：${data?.error || error?.message || '发送失败'}`);
        } else {
          // 发送成功，更新签署记录状态
          await supabase
            .from('salary_signatures')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', signature.id);
          successCount++;
        }
      } catch (err: any) {
        failCount++;
        errors.push(`${signature.employee.name}：${err.message || '发送异常'}`);
      }
    }

    return {
      success: successCount > 0,
      successCount,
      failCount,
      errors
    };
  } catch (error: any) {
    console.error('批量发送薪酬签署短信异常:', error);
    return {
      success: false,
      successCount: 0,
      failCount: signatureIds.length,
      errors: [error.message || '批量发送时发生异常']
    };
  }
}

/**
 * 通过token获取签署记录详情（公开访问）
 */
export async function getSalarySignatureByToken(token: string): Promise<SalarySignature | null> {
  const { data, error } = await supabase
    .from('salary_signatures')
    .select(`
      *,
      employee:employees(id, name, department, position),
      company:companies(id, name)
    `)
    .eq('sign_token', token)
    .gt('sign_token_expires_at', new Date().toISOString())
    .single();

  if (error) {
    console.error('获取签署记录失败:', error);
    return null;
  }

  return data;
}

/**
 * 员工签署确认
 */
export async function confirmSalarySignature(
  token: string,
  signatureData?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 验证token并获取签署记录
    const signature = await getSalarySignatureByToken(token);
    
    if (!signature) {
      return { success: false, error: '签署链接无效或已过期' };
    }

    if (signature.status === 'signed') {
      return { success: false, error: '该文件已签署，无需重复签署' };
    }

    // 更新签署状态
    const { error } = await supabase
      .from('salary_signatures')
      .update({
        status: 'signed',
        signed_at: new Date().toISOString(),
        signature_data: signatureData,
        updated_at: new Date().toISOString()
      })
      .eq('sign_token', token);

    if (error) {
      console.error('更新签署状态失败:', error);
      return { success: false, error: '签署失败，请重试' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('签署确认异常:', error);
    return { success: false, error: error.message || '签署时发生异常' };
  }
}

/**
 * 员工拒签
 */
export async function rejectSalarySignature(
  token: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 验证token并获取签署记录
    const signature = await getSalarySignatureByToken(token);
    
    if (!signature) {
      return { success: false, error: '签署链接无效或已过期' };
    }

    if (signature.status === 'signed') {
      return { success: false, error: '该文件已签署，无法拒签' };
    }

    // 更新签署状态
    const { error } = await supabase
      .from('salary_signatures')
      .update({
        status: 'rejected',
        reject_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('sign_token', token);

    if (error) {
      console.error('更新拒签状态失败:', error);
      return { success: false, error: '拒签失败，请重试' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('拒签异常:', error);
    return { success: false, error: error.message || '拒签时发生异常' };
  }
}

/**
 * 根据reference_id和employee_id更新签署记录的原始文件URL
 */
export async function updateSalarySignatureFileUrl(
  referenceId: string,
  employeeId: string,
  fileUrl: string,
  type: 'salary_slip' | 'attendance_record' = 'salary_slip'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('salary_signatures')
      .update({ original_file_url: fileUrl })
      .eq('reference_id', referenceId)
      .eq('employee_id', employeeId)
      .eq('type', type);

    if (error) {
      console.error('更新签署记录文件URL失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('更新签署记录文件URL异常:', error);
    return false;
  }
}

// ==================== 考勤签署管理 ====================

/**
 * 获取考勤签署记录列表
 */
export async function getAttendanceSignatures(): Promise<AttendanceSignature[]> {
  try {
    const { data, error } = await supabase
      .from('attendance_signatures')
      .select(`
        *,
        employee:employees!attendance_signatures_employee_id_fkey(id, name, phone, department),
        company:companies!attendance_signatures_company_id_fkey(id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('获取考勤签署记录失败:', error);
    return [];
  }
}

/**
 * 创建考勤签署记录
 */
export async function createAttendanceSignature(
  signature: Omit<AttendanceSignature, 'id' | 'created_at' | 'updated_at'>
): Promise<AttendanceSignature | null> {
  try {
    const { data, error } = await supabase
      .from('attendance_signatures')
      .insert(signature)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('创建考勤签署记录失败:', error);
    return null;
  }
}

/**
 * 批量创建考勤签署记录
 */
export async function createAttendanceSignaturesBatch(
  signatures: Omit<AttendanceSignature, 'id' | 'created_at' | 'updated_at'>[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('attendance_signatures')
      .insert(signatures);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('批量创建考勤签署记录失败:', error);
    return false;
  }
}

/**
 * 更新考勤签署记录
 */
export async function updateAttendanceSignature(
  id: string,
  updates: Partial<AttendanceSignature>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('attendance_signatures')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('更新考勤签署记录失败:', error);
    return false;
  }
}

/**
 * 删除考勤签署记录
 */
export async function deleteAttendanceSignature(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('attendance_signatures')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('删除考勤签署记录失败:', error);
    return false;
  }
}

/**
 * 批量删除考勤签署记录
 */
export async function deleteAttendanceSignaturesBatch(ids: string[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('attendance_signatures')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('批量删除考勤签署记录失败:', error);
    return false;
  }
}

/**
 * 批量撤回考勤签署记录
 */
export async function revokeAttendanceSignaturesBatch(ids: string[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('attendance_signatures')
      .update({
        status: 'revoked',
        sent_at: null
      })
      .in('id', ids)
      .in('status', ['pending', 'sent']);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('批量撤回考勤签署记录失败:', error);
    return false;
  }
}

// ==================== 劳动合同历史记录管理 ====================

/**
 * 获取员工的劳动合同历史记录
 */
export async function getLaborContractHistory(employeeId: string) {
  const { data, error } = await supabase
    .from('labor_contract_history')
    .select(`
      *,
      employee:employees(*),
      company:companies(*)
    `)
    .eq('employee_id', employeeId)
    .order('contract_number', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * 创建劳动合同历史记录
 */
export async function createLaborContractHistory(data: {
  employee_id: string;
  company_id: string;
  contract_number: number;
  start_date: string;
  end_date?: string;
  contract_type: string;
  notes?: string;
}) {
  const { data: result, error } = await supabase
    .from('labor_contract_history')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * 更新劳动合同历史记录
 */
export async function updateLaborContractHistory(id: string, data: {
  start_date?: string;
  end_date?: string;
  contract_type?: string;
  notes?: string;
}) {
  const { data: result, error } = await supabase
    .from('labor_contract_history')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * 删除劳动合同历史记录
 */
export async function deleteLaborContractHistory(id: string) {
  const { error } = await supabase
    .from('labor_contract_history')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * 更新员工的劳动合同签订次数
 */
export async function updateEmployeeContractCount(employeeId: string, count: number) {
  // @ts-ignore
  const { error } = await supabase
    .from('employees')
    .update({ contract_count: count })
    .eq('id', employeeId);

  if (error) throw error;
  return true;
}

// ==================== 员工文书签署记录管理 ====================

/**
 * 获取员工文书签署记录
 */
export async function getEmployeeDocumentRecords(filters?: {
  employee_id?: string;
  company_id?: string;
  document_type?: string;
  signed_year?: number;
}) {
  let query = supabase
    .from('employee_document_records')
    .select(`
      *,
      employee:employees(*),
      company:companies(*)
    `);

  if (filters?.employee_id) {
    query = query.eq('employee_id', filters.employee_id);
  }
  if (filters?.company_id) {
    query = query.eq('company_id', filters.company_id);
  }
  if (filters?.document_type) {
    query = query.eq('document_type', filters.document_type);
  }
  if (filters?.signed_year) {
    query = query.eq('signed_year', filters.signed_year);
  }

  query = query.order('signed_at', { ascending: false, nullsFirst: false });

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * 创建员工文书签署记录
 */
export async function createEmployeeDocumentRecord(data: {
  employee_id: string;
  company_id: string;
  document_type: string;
  document_name: string;
  template_category?: string;
  signed_at?: string;
  signed_year?: number;
  file_url?: string;
  signing_record_id?: string;
  expiry_time?: string;
}) {
  const { data: result, error } = await supabase
    .from('employee_document_records')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * 批量创建员工文书签署记录
 */
export async function batchCreateEmployeeDocumentRecords(records: Array<{
  employee_id: string;
  company_id: string;
  document_type: string;
  document_name: string;
  template_category?: string;
  signed_at?: string;
  signed_year?: number;
  file_url?: string;
  signing_record_id?: string;
  expiry_time?: string;
}>) {
  const { data, error } = await supabase
    .from('employee_document_records')
    .insert(records)
    .select();

  if (error) throw error;
  return data || [];
}

/**
 * 删除员工文书签署记录
 */
export async function deleteEmployeeDocumentRecord(id: string) {
  const { error } = await supabase
    .from('employee_document_records')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
