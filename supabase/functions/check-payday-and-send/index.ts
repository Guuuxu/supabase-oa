import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 获取当前日期（几号）
    const today = new Date();
    const dayOfMonth = today.getDate();

    console.log(`检查发薪日: 今天是${today.getFullYear()}-${today.getMonth() + 1}-${dayOfMonth}号`);

    // 查询今天是发薪日的公司
    const { data: companies, error: companiesError } = await supabaseClient
      .from('companies')
      .select('id, name, payday_date')
      .eq('payday_date', dayOfMonth)
      .eq('service_status', true);

    if (companiesError) {
      console.error('查询公司失败:', companiesError);
      return new Response(
        JSON.stringify({ error: '查询公司失败', details: companiesError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!companies || companies.length === 0) {
      console.log('今天没有公司发薪');
      return new Response(
        JSON.stringify({ message: '今天没有公司发薪', date: dayOfMonth }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`找到${companies.length}家公司今天发薪:`, companies.map(c => c.name).join(', '));

    let totalEmployees = 0;
    let totalSent = 0;
    const results = [];

    // 查询薪酬类文书模板
    const { data: templates, error: templatesError } = await supabaseClient
      .from('document_templates')
      .select('id, name, category')
      .eq('category', 'compensation')
      .eq('is_active', true);

    if (templatesError || !templates || templates.length === 0) {
      console.error('未找到薪酬类文书模板');
      return new Response(
        JSON.stringify({ error: '未找到薪酬类文书模板，请先创建考勤确认、绩效考核确认、工资条确认等模板' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`找到${templates.length}个薪酬类文书模板:`, templates.map(t => t.name).join(', '));

    // 为每个公司处理
    for (const company of companies) {
      // 查询该公司的所有在职员工
      const { data: employees, error: employeesError } = await supabaseClient
        .from('employees')
        .select('id, name, phone, company_id')
        .eq('company_id', company.id)
        .eq('status', 'active');

      if (employeesError) {
        console.error(`查询${company.name}的员工失败:`, employeesError);
        results.push({
          company: company.name,
          success: false,
          error: employeesError.message
        });
        continue;
      }

      if (!employees || employees.length === 0) {
        console.log(`${company.name}没有在职员工`);
        results.push({
          company: company.name,
          success: true,
          employees: 0,
          sent: 0
        });
        continue;
      }

      totalEmployees += employees.length;
      console.log(`${company.name}有${employees.length}名在职员工`);

      let companySent = 0;

      // 为每个员工创建签署记录并发送短信
      for (const employee of employees) {
        if (!employee.phone) {
          console.log(`员工${employee.name}没有手机号，跳过`);
          continue;
        }

        // 创建签署记录
        const { data: signingRecord, error: signingError } = await supabaseClient
          .from('signing_records')
          .insert({
            company_id: company.id,
            employee_id: employee.id,
            template_ids: templates.map(t => t.id),
            status: 'pending',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (signingError) {
          console.error(`为员工${employee.name}创建签署记录失败:`, signingError);
          continue;
        }

        // 生成签署链接（简化版，实际应该生成真实的签署链接）
        const signingUrl = `${Deno.env.get('SUPABASE_URL')}/signing/${signingRecord.id}`;

        // 发送短信
        const smsContent = `【九头鸟人事】您好${employee.name}，今天是发薪日，请点击链接签署薪酬文书：${signingUrl}`;
        
        // 调用短信发送接口（这里简化处理，实际应该调用真实的短信API）
        console.log(`发送短信给${employee.name}(${employee.phone}): ${smsContent}`);
        
        // 创建通知记录
        await supabaseClient
          .from('notifications')
          .insert({
            user_id: employee.id,
            type: 'document_signing',
            title: '薪酬文书签署提醒',
            content: `今天是发薪日，请签署${templates.map(t => t.name).join('、')}`,
            is_read: false,
            created_at: new Date().toISOString()
          });

        companySent++;
        totalSent++;
      }

      results.push({
        company: company.name,
        success: true,
        employees: employees.length,
        sent: companySent
      });
    }

    console.log(`发薪日检查完成: 共${companies.length}家公司，${totalEmployees}名员工，发送${totalSent}条短信`);

    return new Response(
      JSON.stringify({
        success: true,
        message: '发薪日检查完成',
        date: dayOfMonth,
        companies: companies.length,
        totalEmployees,
        totalSent,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('发薪日检查失败:', error);
    return new Response(
      JSON.stringify({ error: '发薪日检查失败', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
