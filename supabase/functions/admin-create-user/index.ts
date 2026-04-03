// 管理员创建系统用户：使用 service_role + auth.admin.createUser，
// 避免前端 signUp 在「自动确认邮箱」场景下把当前登录会话切换为新用户（导致 RLS 下看不到用户列表）。
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

type Body = {
  username?: string;
  password?: string;
  full_name?: string;
  phone?: string;
  role?: string;
  role_id?: string;
  manager_id?: string;
};

function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ success: false, error: '仅支持 POST' });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ success: false, error: '未登录或缺少有效凭证' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) {
    console.error('[admin-create-user] 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
    return json({ success: false, error: '服务端配置错误' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: userData, error: authErr } = await admin.auth.getUser(token);
  if (authErr || !userData?.user) {
    console.error('[admin-create-user] getUser:', authErr);
    return json({ success: false, error: '会话无效或已过期' });
  }

  const callerId = userData.user.id;

  const { data: isSuper, error: superErr } = await admin.rpc('is_super_admin', { uid: callerId });
  if (superErr) {
    console.error('[admin-create-user] is_super_admin:', superErr);
    return json({ success: false, error: '权限校验失败' });
  }

  const { data: canUserView, error: permErr } = await admin.rpc('has_permission', {
    user_id: callerId,
    permission_code: 'user_view',
  });
  if (permErr) {
    console.error('[admin-create-user] has_permission:', permErr);
    return json({ success: false, error: '权限校验失败' });
  }

  if (!isSuper && !canUserView) {
    return json({ success: false, error: '无权创建用户' });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ success: false, error: '请求体不是合法 JSON' });
  }

  const cleanUsername = (body.username ?? '').trim().replace(/\s+/g, '');
  const password = body.password ?? '';

  if (!cleanUsername || !password) {
    return json({ success: false, error: '请填写用户名和密码' });
  }

  if (password.length < 6) {
    return json({ success: false, error: '密码长度至少6位' });
  }

  const encodedUsername = encodeURIComponent(cleanUsername);
  const email = `${encodedUsername}@jiutouniao.local`.toLowerCase();

  const role = body.role ?? 'employee';
  const managerId =
    body.manager_id === undefined || body.manager_id === '' || body.manager_id === 'none'
      ? null
      : body.manager_id;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      username: cleanUsername,
      full_name: body.full_name ?? null,
      phone: body.phone ?? null,
      role,
      role_id: body.role_id ?? null,
      manager_id: managerId,
    },
  });

  if (createErr || !created?.user?.id) {
    console.error('[admin-create-user] admin.createUser:', createErr);
    return json({
      success: false,
      error: createErr?.message ?? '创建用户失败',
    });
  }

  const { error: profileError } = await admin
    .from('profiles')
    .update({
      username: cleanUsername,
      full_name: body.full_name ?? null,
      phone: body.phone ?? null,
      role,
      role_id: body.role_id ?? null,
      manager_id: managerId,
    })
    .eq('id', created.user.id);

  if (profileError) {
    console.error('[admin-create-user] profiles update:', profileError);
    return json({
      success: false,
      error: profileError.message || '已创建账号但同步资料失败，请联系管理员处理',
    });
  }

  return json({ success: true });
});
