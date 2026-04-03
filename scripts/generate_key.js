// generate_key.js
import jwt from 'jsonwebtoken';

// 从 supabase-auth 容器里拿到的 JWT secret
const JWT_SECRET = 'IdMQOp0BRFgRXKE4md21WdAo0dlctCeq';

const serviceRoleToken = jwt.sign(
  { role: 'service_role' },
  JWT_SECRET,
  { expiresIn: '365d' }  // 有效期一年
);

console.log('生成的 Service Role Key:');
console.log(serviceRoleToken);