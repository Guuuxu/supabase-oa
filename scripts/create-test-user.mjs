/**
 * 一次性脚本：改下面四项，在项目根执行 node scripts/create-test-user.mjs，用完可删。
 * 勿把含 service_role 的内容提交到 Git。
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://43.226.47.134:28000'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
const username = '15897752509'
const password = '871215'

function usernameToEmail(name) {
  const clean = String(name).trim().replace(/\s+/g, '')
  return `${encodeURIComponent(clean)}@jiutouniao.local`.toLowerCase()
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  const email = usernameToEmail(username)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  console.log('createUser result:', { email, data, error })
}

main()
