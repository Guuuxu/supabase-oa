import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecruitmentRequest {
  keyword: string;
  type: 'overview' | 'statistics';
}

Deno.serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 验证用户身份
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: '未授权访问' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: '用户认证失败' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 解析请求参数
    const requestData: RecruitmentRequest = await req.json();
    const { keyword, type } = requestData;

    if (!keyword) {
      return new Response(
        JSON.stringify({ error: '企业名称不能为空' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 获取API密钥
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API密钥未配置' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 根据类型选择API端点
    let apiUrl: string;
    if (type === 'overview') {
      apiUrl = 'https://app-9yg25rlq3p4x-api-Aa2PZ2MejdoL-gateway.appmiaoda.com/enterprise/hire-overview';
    } else if (type === 'statistics') {
      apiUrl = 'https://app-9yg25rlq3p4x-api-zYkZzErqJg4L-gateway.appmiaoda.com/enterprise/hire-statistics';
    } else {
      return new Response(
        JSON.stringify({ error: '无效的查询类型' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 调用第三方API
    const formData = new URLSearchParams();
    formData.append('keyword', keyword);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const responseData = await response.json();

    // 检查API响应
    if (!response.ok || !responseData.success) {
      return new Response(
        JSON.stringify({
          error: responseData.msg || '查询失败',
          code: responseData.code,
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 返回成功响应
    return new Response(
      JSON.stringify(responseData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('企业招聘数据查询错误:', error);
    return new Response(
      JSON.stringify({ error: error.message || '服务器内部错误' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
