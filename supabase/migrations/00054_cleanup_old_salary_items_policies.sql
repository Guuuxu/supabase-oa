-- 删除salary_items表的旧策略
DROP POLICY IF EXISTS "用户可以查看所属公司的工资条" ON salary_items;
DROP POLICY IF EXISTS "用户可以创建工资条" ON salary_items;
DROP POLICY IF EXISTS "用户可以更新工资条" ON salary_items;
DROP POLICY IF EXISTS "用户可以删除工资条" ON salary_items;