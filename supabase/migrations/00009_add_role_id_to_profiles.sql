
-- 添加role_id字段到profiles表，关联到roles表
ALTER TABLE profiles ADD COLUMN role_id UUID REFERENCES roles(id);

-- 添加索引
CREATE INDEX idx_profiles_role_id ON profiles(role_id);

-- 添加注释
COMMENT ON COLUMN profiles.role_id IS '用户角色ID，关联到roles表，用于自定义角色';

-- 注意：保留原有的role字段用于向后兼容
-- 未来可以逐步迁移到使用role_id
