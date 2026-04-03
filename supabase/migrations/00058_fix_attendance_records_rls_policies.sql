-- 删除旧的RLS策略
DROP POLICY IF EXISTS "用户可以创建所属公司的考勤记录" ON attendance_records;
DROP POLICY IF EXISTS "用户可以查看所属公司的考勤记录" ON attendance_records;
DROP POLICY IF EXISTS "用户可以更新所属公司的考勤记录" ON attendance_records;
DROP POLICY IF EXISTS "用户可以删除所属公司的考勤记录" ON attendance_records;

-- 创建新的INSERT策略
CREATE POLICY "用户可以创建考勤记录"
ON attendance_records
FOR INSERT
TO public
WITH CHECK (
  is_super_admin(uid()) 
  OR can_access_company_data(uid(), company_id)
);

-- 创建新的SELECT策略
CREATE POLICY "用户可以查看考勤记录"
ON attendance_records
FOR SELECT
TO public
USING (
  is_super_admin(uid()) 
  OR can_access_company_data(uid(), company_id)
);

-- 创建新的UPDATE策略
CREATE POLICY "用户可以更新考勤记录"
ON attendance_records
FOR UPDATE
TO public
USING (
  is_super_admin(uid()) 
  OR can_access_company_data(uid(), company_id)
)
WITH CHECK (
  is_super_admin(uid()) 
  OR can_access_company_data(uid(), company_id)
);

-- 创建新的DELETE策略
CREATE POLICY "用户可以删除考勤记录"
ON attendance_records
FOR DELETE
TO public
USING (
  is_super_admin(uid()) 
  OR can_access_company_data(uid(), company_id)
);