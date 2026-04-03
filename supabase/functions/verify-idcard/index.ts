import { corsHeaders } from '../_shared/cors.ts';

// 身份证二要素实名认证Edge Function
Deno.serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 获取请求参数
    const url = new URL(req.url);
    const idcard = url.searchParams.get('idcard');
    const name = url.searchParams.get('name');

    if (!idcard || !name) {
      return new Response(
        JSON.stringify({ error: '请提供身份证号码和姓名' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 前置验证：身份证号码格式
    const idcardRegex = /^\d{17}[\dXx]$/;
    if (!idcardRegex.test(idcard)) {
      return new Response(
        JSON.stringify({ 
          error: '身份证号码格式不正确',
          details: '身份证号码应为18位，最后一位可以是数字或X'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 获取API密钥
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      console.error('INTEGRATIONS_API_KEY未配置');
      return new Response(
        JSON.stringify({ error: '系统配置错误，请联系管理员' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 调用身份证二要素实名认证API
    const apiUrl = `https://app-9yg25rlq3p4x-api-oLpZ74noWOMa-gateway.appmiaoda.com/idcard?idcard=${encodeURIComponent(idcard)}&name=${encodeURIComponent(name)}`;
    
    console.log('验证身份证二要素 - 姓名:', name, '身份证号:', idcard.substring(0, 6) + '****');
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
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

    const data = await response.json();
    console.log('API返回数据:', JSON.stringify(data).substring(0, 300));

    // 检查外层响应
    if (data.showapi_res_code !== 0) {
      console.error('API外层错误:', data.showapi_res_error);
      return new Response(
        JSON.stringify({ 
          error: data.showapi_res_error || 'API调用失败'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 检查业务层响应
    const body = data.showapi_res_body;
    if (!body || body.ret_code !== 0) {
      console.error('API业务层错误:', body?.msg);
      return new Response(
        JSON.stringify({ 
          error: body?.msg || '验证失败'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 验证结果判断
    const result = {
      matched: body.code === 0, // 0=匹配, 1=不匹配, 2=无此身份证号码
      code: body.code,
      message: body.msg,
      sex: body.sex, // M=男性, F=女性
      birthday: body.birthday,
      province: body.province,
      city: body.city,
      county: body.county,
      address: body.address
    };

    console.log('验证结果:', result.matched ? '匹配' : '不匹配', '- 消息:', result.message);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('身份证二要素验证失败:', error);
    return new Response(
      JSON.stringify({ 
        error: '验证失败，请稍后重试',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
