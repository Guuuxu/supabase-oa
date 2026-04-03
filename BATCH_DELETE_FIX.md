# 批量删除功能修复说明

## 问题描述
薪酬签署页面的批量删除功能显示"删除成功"，但实际上记录并没有被删除。

## 问题原因
数据库的RLS（行级安全）删除策略配置不正确：
- 旧策略：只检查用户是否为超级管理员 `is_super_admin(auth.uid())`
- 问题：虽然用户是超级管理员，但策略执行时可能存在权限检查问题

## 解决方案
修改删除策略，改为同时支持角色检查和权限检查：

### 1. 薪酬签署删除策略
```sql
CREATE POLICY salary_signatures_delete_policy ON salary_signatures
  FOR DELETE
  USING (
    is_super_admin(auth.uid()) 
    OR has_permission(auth.uid(), 'salary_signing_delete')
  );
```

### 2. 考勤签署删除策略
```sql
CREATE POLICY attendance_signatures_delete_policy ON attendance_signatures
  FOR DELETE
  USING (
    is_super_admin(auth.uid()) 
    OR has_permission(auth.uid(), 'attendance_signing_delete')
  );
```

## 修复内容
1. 删除旧的 `salary_signatures_delete_policy` 策略
2. 创建新的删除策略，同时支持超级管理员角色和 `salary_signing_delete` 权限
3. 删除旧的 `attendance_signatures_delete_policy` 策略
4. 创建新的删除策略，同时支持超级管理员角色和 `attendance_signing_delete` 权限

## 测试验证
- ✅ 使用超级管理员账号成功删除了一条已撤回的薪酬签署记录
- ✅ 删除策略已应用到数据库

## 相关权限
- `salary_signing_delete`: 工资条签署删除权限
- `attendance_signing_delete`: 考勤签署删除权限

这两个权限已在权限配置中定义，主管角色默认拥有这些权限。

## 注意事项
1. 删除操作不可撤销，建议在删除前进行二次确认
2. 只有超级管理员或拥有相应删除权限的用户才能执行删除操作
3. 批量删除会逐条删除记录，如果某些记录删除失败，会在提示中显示失败数量
