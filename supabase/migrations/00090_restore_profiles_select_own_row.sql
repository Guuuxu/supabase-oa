-- 00027 用「user_view / 超管」统一 SELECT profiles 时删除了「查看自己」策略，
-- 导致无 user_view 的普通用户无法读取自己的 profiles 行，登录后 getProfile、is_active 检查等全部失败。
-- 与现有策略叠加：PostgreSQL RLS 对多条 SELECT 策略取 OR，故不影响 user_view 查看全员。

CREATE POLICY "用户可以查看自己的资料"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());
