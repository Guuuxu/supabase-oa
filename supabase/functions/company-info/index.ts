// 企业工商信息查询 Edge Function
// 查询企业的工商基本信息、分支机构、变更记录等全维度数据

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompanyInfoRequest {
  keyword: string;
}

Deno.serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 获取API密钥
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('INTEGRATIONS_API_KEY未配置');
    }

    // 解析请求体
    const requestBody: CompanyInfoRequest = await req.json();
    
    // 验证请求参数
    if (!requestBody.keyword) {
      return new Response(
        JSON.stringify({ error: '缺少关键字参数' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 调用工商信息查询API
    const apiUrl = `https://app-9yg25rlq3p4x-api-e94GZ5j0Kxja-gateway.appmiaoda.com/business4/get?keyword=${encodeURIComponent(requestBody.keyword)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('工商信息查询API错误:', errorText);
      return new Response(
        JSON.stringify({ 
          error: '工商信息查询API调用失败', 
          details: errorText 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Edge Function错误:', error);
    return new Response(
      JSON.stringify({ 
        error: '服务器内部错误', 
        message: error instanceof Error ? error.message : '未知错误' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
