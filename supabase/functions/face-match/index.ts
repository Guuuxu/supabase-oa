// 人脸1:1对比 Edge Function
// 比对两张图片中人脸的相似度

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FaceMatchRequest {
  image1: string;
  image2: string;
  image_type?: string;
  face_type1?: string;
  face_type2?: string;
  quality_control?: string;
  liveness_control?: string;
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
    const requestBody: FaceMatchRequest = await req.json();
    
    // 验证请求参数
    if (!requestBody.image1 || !requestBody.image2) {
      return new Response(
        JSON.stringify({ error: '缺少图片参数' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 构建请求数据
    const matchData = [
      {
        image: requestBody.image1,
        image_type: requestBody.image_type || 'BASE64',
        face_type: requestBody.face_type1 || 'LIVE',
        quality_control: requestBody.quality_control || 'LOW',
        liveness_control: requestBody.liveness_control || 'NONE'
      },
      {
        image: requestBody.image2,
        image_type: requestBody.image_type || 'BASE64',
        face_type: requestBody.face_type2 || 'IDCARD',
        quality_control: requestBody.quality_control || 'LOW',
        liveness_control: requestBody.liveness_control || 'NONE'
      }
    ];

    // 调用人脸对比API
    const apiUrl = 'https://app-9yg25rlq3p4x-api-5YrZz81oerkY-gateway.appmiaoda.com/rest/2.0/face/v3/match';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('人脸对比API错误:', errorText);
      return new Response(
        JSON.stringify({ 
          error: '人脸对比API调用失败', 
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
