// 发送短信验证码 Edge Function
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 解析请求体
    const { mobile, sessionId } = await req.json();

    // 验证必填参数
    if (!mobile) {
      return new Response(
        JSON.stringify({ error: '手机号不能为空' }),
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
        JSON.stringify({ error: '短信服务配置错误' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 构建请求体
    const requestBody: { mobile: string; sessionId?: string } = { mobile };
    if (sessionId) {
      requestBody.sessionId = sessionId;
    }

    // 调用第三方短信API
    const response = await fetch(
      'https://app-9yg25rlq3p4x-api-W9z3M74x6ZNL-gateway.appmiaoda.com/v1/code/send_message',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    // 检查API响应状态
    if (data.status !== 0) {
      console.error('短信发送失败:', data);
      return new Response(
        JSON.stringify({ error: data.msg || '短信发送失败' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 返回成功响应
    return new Response(
      JSON.stringify({
        success: true,
        sessionId: data.data?.sessionId,
        message: data.msg || '短信发送成功'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('发送短信异常:', error);
    return new Response(
      JSON.stringify({ error: '发送短信时发生异常' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
