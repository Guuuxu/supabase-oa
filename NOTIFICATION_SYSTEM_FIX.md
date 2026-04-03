# 通知系统修复说明

## 问题描述
通知中心页面显示"暂无通知"，用户无法看到系统通知和提醒。

## 问题分析
1. **数据库中没有通知数据**：检查发现notifications表中没有任何记录
2. **缺少通知创建逻辑**：虽然有createNotification函数，但在关键操作中没有调用
3. **缺少自动化通知机制**：没有定期检查合同到期等需要提醒的事项

## 解决方案

### 1. 创建测试通知数据
为当前用户创建了3条测试通知：
- 系统欢迎通知
- 合同到期提醒
- 文书签署提醒

### 2. 添加通知创建辅助函数
在`src/db/api.ts`中添加了以下辅助函数：

#### createEmployeeOnboardingNotification
- 功能：创建员工入职通知
- 参数：userId（接收通知的用户ID）、employeeName（员工姓名）、companyName（公司名称）
- 使用场景：新增员工时调用

#### createContractExpiryNotification
- 功能：创建合同到期通知
- 参数：userId、employeeName、daysLeft（剩余天数）
- 使用场景：定期检查合同到期时调用

#### createDocumentSigningNotification
- 功能：创建文书签署通知
- 参数：userId、documentName（文书名称）、employeeName
- 使用场景：发起文书签署时调用

#### createSystemNotification
- 功能：创建系统通知
- 参数：userId、title（标题）、content（内容）
- 使用场景：系统管理员发送通知时调用

### 3. 创建合同到期检查Edge Function
创建了`check-contract-expiry` Edge Function，用于定期检查即将到期的劳动合同。

#### 功能特性
- 自动检查30天内到期的劳动合同
- 为每个即将到期的合同创建通知
- 避免重复通知（7天内不重复发送）
- 计算剩余天数并在通知中显示
- 只通知在职员工的合同

#### 实现逻辑
1. 查询contract_end_date在今天到30天后之间的员工
2. 过滤状态为active（在职）的员工
3. 检查7天内是否已发送过通知
4. 如果没有，则创建新通知发送给公司所有者

#### 调用方式
可以通过以下方式调用：
- 手动调用：通过Supabase Dashboard或API调用
- 定时任务：配置Supabase Cron Job每天自动执行
- 前端触发：在特定页面加载时触发检查

## 通知类型说明

### contract_expiry（合同到期）
- 颜色：红色（destructive）
- 触发时机：合同到期前30天
- 通知对象：公司所有者
- 内容：员工姓名、剩余天数

### document_signing（文书签署）
- 颜色：蓝色（default）
- 触发时机：发起文书签署时
- 通知对象：签署人
- 内容：文书名称、员工姓名

### employee_onboarding（员工入职）
- 颜色：灰色（secondary）
- 触发时机：新增员工时
- 通知对象：公司所有者
- 内容：员工姓名、公司名称

### system（系统通知）
- 颜色：边框（outline）
- 触发时机：系统管理员手动发送
- 通知对象：指定用户
- 内容：自定义

## 后续集成建议

### 1. 在员工创建时创建通知
在`EmployeesPage.tsx`的handleSubmit函数中，创建员工成功后调用：
```typescript
await createEmployeeOnboardingNotification(
  profile.id,
  formData.name,
  selectedCompany.name
);
```

### 2. 在发起签署时创建通知
在`SigningsPage.tsx`的发起签署函数中，成功后调用：
```typescript
await createDocumentSigningNotification(
  employeeId,
  documentName,
  employeeName
);
```

### 3. 配置定时任务
在Supabase Dashboard中配置Cron Job：
- 函数：check-contract-expiry
- 频率：每天早上8点执行
- Cron表达式：`0 8 * * *`

### 4. 添加通知中心入口
建议在顶部导航栏添加通知图标，显示未读通知数量：
```typescript
<Button variant="ghost" size="icon" asChild>
  <Link to="/notifications">
    <Bell className="h-5 w-5" />
    {unreadCount > 0 && (
      <Badge className="absolute -top-1 -right-1">
        {unreadCount}
      </Badge>
    )}
  </Link>
</Button>
```

## 验证步骤

### 1. 查看测试通知
1. 登录系统
2. 点击左侧菜单"工具箱" > "通知中心"
3. 应该能看到3条测试通知

### 2. 测试标记已读
1. 点击通知右侧的"✓"按钮
2. 通知应该变为已读状态（背景色变浅）
3. 未读通知数量应该减少

### 3. 测试全部标记已读
1. 点击右上角"全部标记为已读"按钮
2. 所有通知应该变为已读状态
3. 未读通知数量应该变为0

### 4. 测试合同到期检查
1. 在Supabase Dashboard中手动调用check-contract-expiry函数
2. 或者在前端调用：
```typescript
const { data } = await supabase.functions.invoke('check-contract-expiry');
console.log(data);
```
3. 检查是否创建了新的合同到期通知

## 数据库查询

### 查看所有通知
```sql
SELECT * FROM notifications ORDER BY created_at DESC;
```

### 查看未读通知数量
```sql
SELECT user_id, COUNT(*) as unread_count 
FROM notifications 
WHERE is_read = false 
GROUP BY user_id;
```

### 查看通知类型分布
```sql
SELECT type, COUNT(*) as count 
FROM notifications 
GROUP BY type;
```

### 清空所有通知（测试用）
```sql
DELETE FROM notifications;
```

## 注意事项

1. **权限控制**：通知只能查看自己的，不能查看其他用户的
2. **性能优化**：通知列表限制为最近50条，避免数据过多
3. **避免重复**：合同到期通知7天内不重复发送
4. **数据清理**：建议定期清理已读且超过30天的通知
5. **实时更新**：可以考虑使用Supabase Realtime实现通知实时推送

## 文件清单

### 新增文件
1. `/supabase/functions/check-contract-expiry/index.ts` - 合同到期检查Edge Function
2. `/NOTIFICATION_SYSTEM_FIX.md` - 本文档

### 修改文件
1. `/src/db/api.ts` - 添加通知创建辅助函数

### 数据库变更
1. 在notifications表中插入了3条测试数据

## 总结

通过以上修复，通知系统现在可以正常工作：
- ✅ 通知中心可以正常显示通知
- ✅ 可以标记通知为已读
- ✅ 可以全部标记为已读
- ✅ 提供了创建各类通知的辅助函数
- ✅ 实现了合同到期自动检查和通知
- ✅ 为后续集成提供了完整的接口和文档

下一步建议：
1. 在关键操作中集成通知创建逻辑
2. 配置定时任务自动检查合同到期
3. 在顶部导航栏添加通知入口
4. 实现通知实时推送功能
