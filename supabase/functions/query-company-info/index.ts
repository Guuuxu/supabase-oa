import md5 from 'https://esm.sh/md5@2.3.0';
import { corsHeaders } from '../_shared/cors.ts';

/** 企查查 Token：MD5(Key + Timespan + SecretKey)，32 位大写 */
function buildQccToken(appKey: string, timespanSec: string, secretKey: string): string {
  return md5(appKey + timespanSec + secretKey).toUpperCase();
}

/** 官方返回：顶层 Status（如 "200"）、Message、Result（企业照面字段） */
function parseQccResultPayload(raw: unknown): Record<string, unknown> | null {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }
  return null;
}

function qccRequestSucceeded(data: Record<string, unknown>): boolean {
  const s = data.Status ?? data.status;
  return s === '200' || s === 200;
}

function pickStr(obj: Record<string, unknown>, key: string): string {
  const v = obj[key];
  return typeof v === 'string' ? v : '';
}

function formatQccCapital(r: Record<string, unknown>): string {
  const regist = pickStr(r, 'RegistCapi');
  if (regist.trim()) return regist;
  const cap = pickStr(r, 'RegisteredCapital');
  const unit = pickStr(r, 'RegisteredCapitalUnit');
  const ccy = pickStr(r, 'RegisteredCapitalCCY');
  return [cap, unit, ccy].filter(Boolean).join('');
}

// 企业工商信息查询Edge Function
Deno.serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 获取请求参数
    const url = new URL(req.url);
    const keyword = url.searchParams.get('keyword');

    if (!keyword) {
      return new Response(
        JSON.stringify({ error: '请提供公司名称关键字' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const qccKey = (Deno.env.get('QICHACHA_KEY') ?? '').trim();
    const qccSecret = (Deno.env.get('QICHACHA_SECRET_KEY') ?? '').trim();
    if (!qccKey || !qccSecret) {
      console.error('QICHACHA_KEY 或 QICHACHA_SECRET_KEY 未配置');
      return new Response(
        JSON.stringify({ error: '系统配置错误，请联系管理员' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const timespan = String(Math.floor(Date.now() / 1000));
    const token = buildQccToken(qccKey, timespan, qccSecret);
    const apiUrl =
      `https://api.qichacha.com/ECIV4/GetBasicDetailsByName?key=${encodeURIComponent(qccKey)}&keyword=${encodeURIComponent(keyword)}`;

    console.log('查询企业工商信息 - 关键字:', keyword);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Token: token,
        Timespan: timespan,
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    console.log('API响应状态:', response.status);
    
    // 检查API响应状态
    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: 'API调用频率超限，请稍后再试' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'API余额不足，请联系管理员' }),
        { 
          status: 402, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = (await response.json()) as Record<string, unknown>;
    console.log('API返回数据:', JSON.stringify(data).substring(0, 500));

    if (!qccRequestSucceeded(data)) {
      const msg =
        pickStr(data, 'Message') ||
        pickStr(data, 'message') ||
        pickStr(data, 'msg') ||
        '查询失败，请检查公司名称是否正确';
      console.error('qcc-query 企查查业务失败:', data.Status, msg);
      return new Response(
        JSON.stringify({
          error: msg,
          details: '建议使用公司全称进行查询',
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const base = parseQccResultPayload(data.Result);
    if (!base || !pickStr(base, 'Name')) {
      console.error('qcc-query Result 无有效企业数据:', JSON.stringify(data).substring(0, 800));
      return new Response(
        JSON.stringify({
          error: '未找到该企业的工商信息',
          suggestion: '请确认公司名称是否完整正确，建议使用营业执照上的完整名称',
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // 智能提取所在地域（从地址中提取城市）
    const extractRegion = (address: string): string => {
      if (!address) return '其他';
      
      // 匹配直辖市：北京、上海、天津、重庆
      const directCityMatch = address.match(/(北京|上海|天津|重庆)/);
      if (directCityMatch) {
        return directCityMatch[1] + '市';
      }
      
      // 匹配省市格式：XX省XX市、XX市、XX自治区XX市等
      // 优先匹配"省+市"格式，提取市名（不含省名）
      const provinceAndCityMatch = address.match(/[\u4e00-\u9fa5]{2,}省([\u4e00-\u9fa5]{2,}市)/);
      if (provinceAndCityMatch) {
        return provinceAndCityMatch[1]; // 只返回市名，如"黄石市"
      }
      
      // 匹配自治区+市格式
      const autonomousRegionAndCityMatch = address.match(/[\u4e00-\u9fa5]{2,}自治区([\u4e00-\u9fa5]{2,}市)/);
      if (autonomousRegionAndCityMatch) {
        return autonomousRegionAndCityMatch[1]; // 只返回市名
      }
      
      // 匹配单独的市名（没有省份前缀）
      const cityMatch = address.match(/([\u4e00-\u9fa5]{2,}市)/);
      if (cityMatch) {
        return cityMatch[1];
      }
      
      // 匹配自治州
      const autonomousStateMatch = address.match(/([\u4e00-\u9fa5]{2,}州)/);
      if (autonomousStateMatch) {
        return autonomousStateMatch[1];
      }
      
      return '其他';
    };
    
    // 智能提取所属行业（从企业类型和经营范围中提取）
    const extractIndustry = (companyType: string, businessScope: string): string => {
      const text = (companyType + ' ' + businessScope).toLowerCase();
      
      // 行业关键词映射（与前端选项保持一致）
      const industryMap: { [key: string]: string[] } = {
        '制造业': ['制造', '生产', '加工', '机械', '设备', '电子', '化工', '五金'],
        '信息技术': ['软件', '信息技术', '互联网', '计算机', '网络', '科技', '技术服务', '数据', '信息咨询', '技术咨询', '技术开发'],
        '金融服务': ['金融', '投资', '基金', '证券', '保险', '银行', '财务咨询', '税务'],
        '教育培训': ['教育', '培训', '学校', '教学'],
        '医疗健康': ['医疗', '卫生', '健康', '养老', '医药'],
        '零售批发': ['批发', '零售', '贸易', '销售', '商贸', '商业'],
        '建筑工程': ['建筑', '工程', '施工', '装饰', '装修', '建设'],
        '餐饮服务': ['餐饮', '酒店', '宾馆', '住宿', '食品'],
        '物流运输': ['运输', '物流', '仓储', '快递', '货运'],
        '其他': ['租赁', '商务服务', '咨询', '人力资源', '劳务', '企业管理', '市场营销', '会议', '展览', '法律咨询', '代理记账', '房地产', '物业', '文化', '体育', '娱乐', '传媒', '广告', '农业', '林业', '畜牧', '渔业']
      };
      
      // 遍历行业映射，查找匹配的关键词
      for (const [industry, keywords] of Object.entries(industryMap)) {
        for (const keyword of keywords) {
          if (text.includes(keyword)) {
            return industry;
          }
        }
      }
      
      return '其他';
    };
    
    const orgNo = pickStr(base, 'OrgNo');
    const regNo = pickStr(base, 'No');
    const result = {
      companyName: pickStr(base, 'Name'),
      creditNo: pickStr(base, 'CreditCode'),
      legalPerson: pickStr(base, 'OperName'),
      companyAddress: pickStr(base, 'Address'),
      region: extractRegion(pickStr(base, 'Address')),
      industry: extractIndustry(pickStr(base, 'EconKind'), pickStr(base, 'Scope')),
      companyCode: orgNo || regNo,
      establishDate: pickStr(base, 'StartDate'),
      companyStatus: pickStr(base, 'Status'),
      capital: formatQccCapital(base),
      companyType: pickStr(base, 'EconKind'),
      businessScope: pickStr(base, 'Scope'),
    };

    console.log('查询成功:', result.companyName);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('查询企业工商信息失败:', error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: '查询失败，请稍后重试',
        details: message,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
