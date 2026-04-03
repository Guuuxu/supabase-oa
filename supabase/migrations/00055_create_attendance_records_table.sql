-- 创建考勤记录表
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- 考勤月份 YYYY-MM
  work_days NUMERIC DEFAULT 0, -- 出勤天数
  absent_days NUMERIC DEFAULT 0, -- 缺勤天数
  late_times NUMERIC DEFAULT 0, -- 迟到次数
  leave_days NUMERIC DEFAULT 0, -- 请假天数
  overtime_hours NUMERIC DEFAULT 0, -- 加班小时数
  remarks TEXT, -- 备注
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, employee_id, month) -- 同一公司同一员工同一月份只能有一条记录
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_attendance_records_company ON attendance_records(company_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_employee ON attendance_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_month ON attendance_records(month);

-- 创建更新时间触发器
CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 启用RLS
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "用户可以查看所属公司的考勤记录"
ON attendance_records
FOR SELECT
TO public
USING (
  company_id IN (
    SELECT p.company_id 
    FROM profiles p
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "用户可以创建所属公司的考勤记录"
ON attendance_records
FOR INSERT
TO public
WITH CHECK (
  company_id IN (
    SELECT p.company_id 
    FROM profiles p
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "用户可以更新所属公司的考勤记录"
ON attendance_records
FOR UPDATE
TO public
USING (
  company_id IN (
    SELECT p.company_id 
    FROM profiles p
    WHERE p.id = auth.uid()
  )
);

CREATE POLICY "用户可以删除所属公司的考勤记录"
ON attendance_records
FOR DELETE
TO public
USING (
  company_id IN (
    SELECT p.company_id 
    FROM profiles p
    WHERE p.id = auth.uid()
  )
);

-- 添加审计触发器
CREATE TRIGGER attendance_records_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();