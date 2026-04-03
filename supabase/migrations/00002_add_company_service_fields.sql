-- 为公司表添加服务相关字段
ALTER TABLE companies 
ADD COLUMN service_start_date DATE,
ADD COLUMN service_end_date DATE,
ADD COLUMN service_status BOOLEAN DEFAULT true;

-- 添加注释
COMMENT ON COLUMN companies.service_start_date IS '服务开始日期';
COMMENT ON COLUMN companies.service_end_date IS '服务结束日期';
COMMENT ON COLUMN companies.service_status IS '服务状态：true=开启，false=关停';