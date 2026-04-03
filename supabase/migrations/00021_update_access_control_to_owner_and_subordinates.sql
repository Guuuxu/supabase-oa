-- ============================================
-- 更新访问控制：用户只能查看自己和下级的数据
-- ============================================

-- 1. 创建递归函数：获取用户的所有下级ID（包括下级的下级）
CREATE OR REPLACE FUNCTION get_all_subordinate_ids(user_id UUID)
RETURNS TABLE(subordinate_id UUID)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  WITH RECURSIVE subordinates AS (
    -- 基础情况：直接下级
    SELECT id FROM profiles WHERE manager_id = user_id
    UNION
    -- 递归情况：下级的下级
    SELECT p.id 
    FROM profiles p
    INNER JOIN subordinates s ON p.manager_id = s.id
  )
  SELECT id FROM subordinates;
$$;

-- 2. 更新can_access_company_data函数：用户可以访问自己和下级的公司
CREATE OR REPLACE FUNCTION can_access_company_data(user_id UUID, target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  company_owner UUID;
BEGIN
  -- 超级管理员可以访问所有公司
  IF is_super_admin(user_id) THEN
    RETURN TRUE;
  END IF;
  
  -- 获取公司的当前所有者
  SELECT owner_id INTO company_owner FROM companies WHERE id = target_company_id;
  
  IF company_owner IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- 如果是所有者本人
  IF company_owner = user_id THEN
    RETURN TRUE;
  END IF;
  
  -- 如果所有者是当前用户的下级（递归）
  IF EXISTS(
    SELECT 1 FROM get_all_subordinate_ids(user_id) WHERE subordinate_id = company_owner
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- 3. 更新companies表的SELECT策略
DROP POLICY IF EXISTS "用户可以查看自己拥有的公司和下属拥有的公司" ON companies;

CREATE POLICY "用户可以查看自己和下级拥有的公司"
ON companies
FOR SELECT
USING (
  -- 超级管理员可以查看所有
  is_super_admin(auth.uid())
  OR
  -- 所有者是自己
  owner_id = auth.uid()
  OR
  -- 所有者是自己的下级（递归）
  owner_id IN (
    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())
  )
);

-- 4. 更新companies表的UPDATE策略
DROP POLICY IF EXISTS "用户可以更新自己拥有的公司" ON companies;

CREATE POLICY "用户可以更新自己和下级拥有的公司"
ON companies
FOR UPDATE
USING (
  -- 超级管理员可以更新所有
  is_super_admin(auth.uid())
  OR
  -- 所有者是自己
  owner_id = auth.uid()
  OR
  -- 所有者是自己的直接下级（只允许直接下级，不递归）
  owner_id IN (
    SELECT id FROM profiles WHERE manager_id = auth.uid()
  )
)
WITH CHECK (
  -- 更新后仍然满足条件
  is_super_admin(auth.uid())
  OR
  owner_id = auth.uid()
  OR
  owner_id IN (
    SELECT id FROM profiles WHERE manager_id = auth.uid()
  )
);

-- 5. 更新companies表的DELETE策略
DROP POLICY IF EXISTS "用户可以删除自己拥有的公司" ON companies;

CREATE POLICY "用户可以删除自己拥有的公司"
ON companies
FOR DELETE
USING (
  -- 超级管理员可以删除所有
  is_super_admin(auth.uid())
  OR
  -- 只有所有者本人可以删除
  owner_id = auth.uid()
);

-- 6. 更新transfer_company函数：只有所有者和直接上级可以流转
CREATE OR REPLACE FUNCTION transfer_company(
  p_company_id UUID,
  p_to_user_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_from_user_id UUID;
  v_current_user_id UUID;
  v_can_transfer BOOLEAN;
BEGIN
  -- 获取当前用户ID
  v_current_user_id := auth.uid();
  
  -- 获取公司的当前所有者
  SELECT owner_id INTO v_from_user_id FROM companies WHERE id = p_company_id;
  
  IF v_from_user_id IS NULL THEN
    RAISE EXCEPTION '公司不存在';
  END IF;
  
  -- 检查权限：所有者本人、所有者的直接上级、超级管理员
  v_can_transfer := (
    v_from_user_id = v_current_user_id  -- 所有者本人
    OR is_super_admin(v_current_user_id)  -- 超级管理员
    OR EXISTS(  -- 所有者的直接上级
      SELECT 1 FROM profiles
      WHERE id = v_from_user_id AND manager_id = v_current_user_id
    )
  );
  
  IF NOT v_can_transfer THEN
    RAISE EXCEPTION '没有权限流转此公司';
  END IF;
  
  -- 检查目标用户是否存在
  IF NOT EXISTS(SELECT 1 FROM profiles WHERE id = p_to_user_id) THEN
    RAISE EXCEPTION '目标用户不存在';
  END IF;
  
  -- 更新公司所有者
  UPDATE companies 
  SET owner_id = p_to_user_id, updated_at = NOW()
  WHERE id = p_company_id;
  
  -- 记录流转历史
  INSERT INTO company_transfers (
    company_id, from_user_id, to_user_id, transferred_by, reason
  ) VALUES (
    p_company_id, v_from_user_id, p_to_user_id, v_current_user_id, p_reason
  );
  
  RETURN TRUE;
END;
$$;

-- 添加注释
COMMENT ON FUNCTION get_all_subordinate_ids IS '递归获取用户的所有下级ID（包括下级的下级）';
COMMENT ON POLICY "用户可以查看自己和下级拥有的公司" ON companies IS '用户只能查看owner_id为自己或下级的公司';
COMMENT ON POLICY "用户可以更新自己和下级拥有的公司" ON companies IS '用户可以更新自己和直接下级拥有的公司';
COMMENT ON POLICY "用户可以删除自己拥有的公司" ON companies IS '只有所有者本人可以删除公司';