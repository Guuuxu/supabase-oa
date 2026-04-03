# 文书签署状态页面 - 添加撤回功能

## 功能说明
在文书签署状态页面的待签署列表中，为每条待签署记录的操作列添加撤回按钮，允许用户撤回已发起的签署记录。

## 实现内容

### 1. 导入必要的依赖
- 添加 `updateSigningRecord` API 函数导入
- 添加 `Undo2` 图标导入（撤回图标）

### 2. 添加撤回函数
```typescript
const handleRevokeRecord = async (id: string) => {
  if (!confirm('确定要撤回该签署记录吗？')) {
    return;
  }

  const loadingToast = toast.loading('正在撤回签署记录...');
  
  try {
    const success = await updateSigningRecord(id, { 
      status: 'withdrawn'
    });
    
    toast.dismiss(loadingToast);
    
    if (success) {
      toast.success('签署记录已撤回');
      loadData();
    } else {
      toast.error('撤回失败');
    }
  } catch (error) {
    toast.dismiss(loadingToast);
    console.error('撤回失败:', error);
    toast.error('撤回失败');
  }
};
```

### 3. 在操作列添加撤回按钮
在待签署列表的操作列中添加撤回按钮：
- 位置：查看详情按钮和发送短信按钮之间
- 图标：`Undo2`（撤回图标）
- 显示条件：
  - 记录状态为 `pending`（待签署）
  - 用户拥有 `signing_revoke` 权限
- 功能：点击后弹出确认对话框，确认后将签署记录状态更新为 `withdrawn`（已撤回）

### 4. 按钮顺序
操作列按钮从左到右的顺序：
1. 查看详情（Eye 图标）- 所有记录都显示
2. 撤回签署（Undo2 图标）- 仅待签署状态显示
3. 发送短信（Send 图标）- 仅待签署状态显示

## 权限控制
- 撤回按钮需要 `signing_revoke` 权限
- 根据权限配置，主管和超级管理员默认拥有此权限

## 用户体验
1. **二次确认**：点击撤回按钮后会弹出确认对话框，防止误操作
2. **加载提示**：撤回过程中显示 "正在撤回签署记录..." 的加载提示
3. **结果反馈**：
   - 成功：显示 "签署记录已撤回" 并刷新列表
   - 失败：显示 "撤回失败" 错误提示
4. **按钮提示**：鼠标悬停时显示 "撤回签署" 提示文字

## 状态变更
撤回操作会将签署记录的状态从 `pending`（待签署）更新为 `withdrawn`（已撤回）。

已撤回的记录会显示在"已完成"标签页中，状态显示为"已撤回"。

## 注意事项
1. 只有待签署状态（pending）的记录才能撤回
2. 撤回操作不可逆，撤回后需要重新发起签署
3. 撤回后的记录会从待签署列表移到已完成列表
