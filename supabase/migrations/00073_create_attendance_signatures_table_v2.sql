-- 创建考勤签署记录表
CREATE TABLE IF NOT EXISTS attendance_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  attendance_record_id UUID NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'rejected')),
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  sign_token TEXT,
  sign_token_expires_at TIMESTAMPTZ,
  signature_data TEXT,
  reject_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_attendance_signatures_company ON attendance_signatures(company_id);
CREATE INDEX IF NOT EXISTS idx_attendance_signatures_employee ON attendance_signatures(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_signatures_status ON attendance_signatures(status);
CREATE INDEX IF NOT EXISTS idx_attendance_signatures_year_month ON attendance_signatures(year, month);

-- 启用RLS
ALTER TABLE attendance_signatures ENABLE ROW LEVEL SECURITY;

-- RLS策略：查看权限
CREATE POLICY "attendance_signatures_select" ON attendance_signatures
  FOR SELECT
  USING (
    has_permission(uid(), 'attendance_sign_view')
    OR has_permission(uid(), 'attendance_sign_send')
    OR has_permission(uid(), 'attendance_sign_manage')
  );

-- RLS策略：插入权限
CREATE POLICY "attendance_signatures_insert" ON attendance_signatures
  FOR INSERT
  WITH CHECK (
    has_permission(uid(), 'attendance_sign_send')
    OR has_permission(uid(), 'attendance_sign_manage')
  );

-- RLS策略：更新权限
CREATE POLICY "attendance_signatures_update" ON attendance_signatures
  FOR UPDATE
  USING (
    has_permission(uid(), 'attendance_sign_manage')
    OR has_permission(uid(), 'attendance_sign_send')
  );

-- RLS策略：删除权限
CREATE POLICY "attendance_signatures_delete" ON attendance_signatures
  FOR DELETE
  USING (
    has_permission(uid(), 'attendance_sign_manage')
  );