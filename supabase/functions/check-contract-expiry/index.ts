import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Employee {
  id: string;
  name: string;
  company_id: string;
  contract_start_date?: string;
  contract_end_date?: string;
  company?: {
    name: string;
    owner_id: string;
  };
}

Deno.serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 创建 Supabase 客户端
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 计算30天后的日期
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);

    // 查询即将到期的合同（30天内到期）
    const { data: employees, error: queryError } = await supabase
      .from('employees')
      .select('id, name, company_id, contract_start_date, contract_end_date, company:companies(name, owner_id)')
      .not('contract_end_date', 'is', null)
      .lte('contract_end_date', thirtyDaysLater.toISOString().split('T')[0])
      .gte('contract_end_date', today.toISOString().split('T')[0])
      .eq('status', 'active');

    if (queryError) {
      throw queryError;
    }

    let notificationCount = 0;

    // 为每个即将到期的合同创建通知
    if (employees && employees.length > 0) {
      for (const employee of employees as Employee[]) {
        if (!employee.contract_end_date || !employee.company?.owner_id) continue;

        // 计算剩余天数
        const endDate = new Date(employee.contract_end_date);
        const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // 检查是否已经发送过通知（避免重复）
        const { data: existingNotifications } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', employee.company.owner_id)
          .eq('type', 'contract_expiry')
          .ilike('content', `%${employee.name}%`)
          .gte('created_at', new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()); // 7天内

        // 如果7天内没有发送过通知，则创建新通知
        if (!existingNotifications || existingNotifications.length === 0) {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              user_id: employee.company.owner_id,
              type: 'contract_expiry',
              title: '劳动合同即将到期',
              content: `员工 ${employee.name} 的劳动合同将在 ${daysLeft} 天后到期，请及时处理续签事宜。`,
              is_read: false
            });

          if (!notificationError) {
            notificationCount++;
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `检查完成，创建了 ${notificationCount} 条通知`,
        expiringContracts: employees?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
