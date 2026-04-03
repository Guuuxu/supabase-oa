// 文心文本生成大模型 Edge Function
// 用于调用文心API进行文本对话

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  enable_thinking?: boolean;
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
    const requestBody: ChatRequest = await req.json();
    
    // 验证请求参数
    if (!requestBody.messages || !Array.isArray(requestBody.messages)) {
      return new Response(
        JSON.stringify({ error: '缺少messages参数或格式错误' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 验证messages内容
    for (const msg of requestBody.messages) {
      if (!msg.role || !msg.content) {
        return new Response(
          JSON.stringify({ error: 'messages中的每条消息必须包含role和content字段' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // 调用文心API
    const apiUrl = 'https://app-9yg25rlq3p4x-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: requestBody.messages,
        enable_thinking: requestBody.enable_thinking || false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('文心API错误:', errorText);
      return new Response(
        JSON.stringify({ 
          error: '文心API调用失败', 
          details: errorText 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 流式转发响应
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }

            // 解码并转发数据
            const chunk = decoder.decode(value, { stream: true });
            
            // 转发SSE格式的数据
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error('流式传输错误:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

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
