// 企业三要素认证 Edge Function
// 验证企业名称、统一社会信用代码、法人姓名是否一致

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompanyVerifyRequest {
  companyName: string;
  creditNo: string;
  legalPerson: string;
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
    const requestBody: CompanyVerifyRequest = await req.json();
    
    // 验证请求参数
    if (!requestBody.companyName || !requestBody.creditNo || !requestBody.legalPerson) {
      return new Response(
        JSON.stringify({ error: '缺少公司名称、统一社会信用代码或法人姓名参数' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 调用企业三要素认证API
    const apiUrl = `https://app-9yg25rlq3p4x-api-Aa2PZnjE80BL-gateway.appmiaoda.com/company_three/get?companyName=${encodeURIComponent(requestBody.companyName)}&creditNo=${encodeURIComponent(requestBody.creditNo)}&legalPerson=${encodeURIComponent(requestBody.legalPerson)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('企业三要素认证API错误:', errorText);
      return new Response(
        JSON.stringify({ 
          error: '企业三要素认证API调用失败', 
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
