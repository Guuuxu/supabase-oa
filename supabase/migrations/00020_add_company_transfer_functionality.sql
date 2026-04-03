-- ============================================
-- 公司流转功能
-- ============================================

-- 1. 在companies表添加owner_id字段（当前所有者）
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- 2. 为现有公司设置owner_id = created_by
UPDATE companies 
SET owner_id = created_by
WHERE owner_id IS NULL;

-- 3. 设置owner_id为NOT NULL
ALTER TABLE companies 
ALTER COLUMN owner_id SET NOT NULL;

-- 4. 添加索引
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id);

-- 5. 创建公司流转历史表
CREATE TABLE IF NOT EXISTS company_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES auth.users(id),
  to_user_id UUID NOT NULL REFERENCES auth.users(id),
  transferred_by UUID NOT NULL REFERENCES auth.users(id), -- 操作人
  reason TEXT, -- 流转原因
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 添加索引
CREATE INDEX IF NOT EXISTS idx_company_transfers_company_id ON company_transfers(company_id);
CREATE INDEX IF NOT EXISTS idx_company_transfers_from_user ON company_transfers(from_user_id);
CREATE INDEX IF NOT EXISTS idx_company_transfers_to_user ON company_transfers(to_user_id);

-- 7. 更新can_access_company_data函数，基于owner_id而不是created_by
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
  
  -- 如果是所有者的上级（在上级链中）
  IF EXISTS(
    SELECT 1 FROM get_manager_chain(company_owner) WHERE manager_id = user_id
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- 8. 创建公司流转函数
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
  
  -- 检查权限：所有者本人、所有者的上级、超级管理员
  v_can_transfer := (
    v_from_user_id = v_current_user_id  -- 所有者本人
    OR is_super_admin(v_current_user_id)  -- 超级管理员
    OR EXISTS(  -- 所有者的上级
      SELECT 1 FROM get_manager_chain(v_from_user_id) 
      WHERE manager_id = v_current_user_id
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

-- 9. 更新companies表的RLS策略（基于owner_id）
DROP POLICY IF EXISTS "用户可以查看自己创建的公司和下属创建的公司" ON companies;

CREATE POLICY "用户可以查看自己拥有的公司和下属拥有的公司"
ON companies
FOR SELECT
USING (
  -- 超级管理员可以查看所有
  is_super_admin(auth.uid())
  OR
  -- 所有者可以查看
  owner_id = auth.uid()
  OR
  -- 所有者的上级可以查看（递归）
  EXISTS(
    SELECT 1 FROM get_manager_chain(owner_id) WHERE manager_id = auth.uid()
  )
);

-- 更新UPDATE策略
DROP POLICY IF EXISTS "用户可以更新自己创建的公司" ON companies;

CREATE POLICY "用户可以更新自己拥有的公司"
ON companies
FOR UPDATE
USING (
  -- 超级管理员可以更新所有
  is_super_admin(auth.uid())
  OR
  -- 所有者可以更新
  owner_id = auth.uid()
  OR
  -- 所有者的直接上级可以更新
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

-- 更新DELETE策略
DROP POLICY IF EXISTS "用户可以删除自己创建的公司" ON companies;

CREATE POLICY "用户可以删除自己拥有的公司"
ON companies
FOR DELETE
USING (
  -- 超级管理员可以删除所有
  is_super_admin(auth.uid())
  OR
  -- 所有者可以删除
  owner_id = auth.uid()
  OR
  -- 有delete权限且是所有者的直接上级
  (
    has_permission(auth.uid(), 'company_delete')
    AND owner_id IN (
      SELECT id FROM profiles WHERE manager_id = auth.uid()
    )
  )
);

-- 10. 为company_transfers表创建RLS策略
ALTER TABLE company_transfers ENABLE ROW LEVEL SECURITY;

-- 查看流转历史：公司的所有者和上级可以查看
CREATE POLICY "用户可以查看相关公司的流转历史"
ON company_transfers
FOR SELECT
USING (
  -- 超级管理员可以查看所有
  is_super_admin(auth.uid())
  OR
  -- 可以查看有权访问的公司的流转历史
  company_id IN (
    SELECT id FROM companies WHERE can_access_company_data(auth.uid(), id)
  )
  OR
  -- 流转的参与者可以查看
  from_user_id = auth.uid()
  OR
  to_user_id = auth.uid()
);

-- 创建流转记录：通过transfer_company函数创建，不需要直接INSERT权限
CREATE POLICY "禁止直接插入流转记录"
ON company_transfers
FOR INSERT
WITH CHECK (false);

-- 添加注释
COMMENT ON COLUMN companies.owner_id IS '公司当前所有者ID';
COMMENT ON TABLE company_transfers IS '公司流转历史记录表';
COMMENT ON FUNCTION transfer_company IS '公司流转函数，用于将公司从一个用户流转给另一个用户';

-- 11. 创建视图：公司流转历史（带用户信息）
CREATE OR REPLACE VIEW company_transfer_history AS
SELECT 
  ct.id,
  ct.company_id,
  c.name as company_name,
  c.code as company_code,
  ct.from_user_id,
  pf.username as from_username,
  pf.full_name as from_full_name,
  ct.to_user_id,
  pt.username as to_username,
  pt.full_name as to_full_name,
  ct.transferred_by,
  pb.username as transferred_by_username,
  pb.full_name as transferred_by_full_name,
  ct.reason,
  ct.created_at
FROM company_transfers ct
INNER JOIN companies c ON ct.company_id = c.id
LEFT JOIN profiles pf ON ct.from_user_id = pf.id
LEFT JOIN profiles pt ON ct.to_user_id = pt.id
LEFT JOIN profiles pb ON ct.transferred_by = pb.id;

-- 为视图添加RLS（继承company_transfers的策略）
ALTER VIEW company_transfer_history SET (security_invoker = true);