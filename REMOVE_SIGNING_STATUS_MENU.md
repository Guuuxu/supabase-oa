# 删除"签署状态"二级菜单及相关功能

## 修改说明
根据用户需求，删除文书管理下的"签署状态"二级菜单及其相关功能。

## 删除内容

### 1. 删除侧边栏菜单项
从 `src/components/layouts/Sidebar.tsx` 中删除"签署状态"菜单项：

```typescript
// 删除的菜单项
{
  name: '签署状态',
  path: '/signing-status',
  icon: <BarChart3 className="h-5 w-5" />,
  permission: 'statistics_view'
}
```

**位置**：文书管理分组（第78-115行）
**图标**：BarChart3（柱状图图标）
**权限**：statistics_view

### 2. 删除路由配置
从 `src/routes.tsx` 中删除以下路由配置：

#### 删除的路由
1. **签署情况页面**
   - 路径：`/signing-status`
   - 组件：`SigningStatusPage`
   - 说明：文书签署状态列表页面

2. **签署记录详情页面**
   - 路径：`/signing-status/:id`
   - 组件：`SigningRecordDetailPage`
   - 说明：单个签署记录的详情页面
   - 可见性：`visible: false`（不在菜单中显示）

3. **签署情况详情页面**
   - 路径：`/signing-status-detail`
   - 组件：`SigningStatusDetailPage`
   - 说明：签署统计页面
   - 可见性：`visible: false`（不在菜单中显示）

### 3. 删除导入语句
从 `src/routes.tsx` 中删除以下导入语句：

```typescript
import SigningStatusPage from './pages/SigningStatusPage';
import SigningStatusDetailPage from './pages/SigningStatusDetailPage';
import SigningRecordDetailPage from './pages/SigningRecordDetailPage';
```

## 保留内容

### 保留的路由
1. **文书模板**（`/templates`）
2. **文书签署**（`/signings`）- 包含文书签署状态功能
3. **签署数据调取**（`/signing-data`）
4. **历史记录**（`/employee-document-records`）

### 保留的页面文件
虽然从路由和菜单中删除了引用，但以下页面文件仍保留在项目中，以备将来可能需要：
- `src/pages/SigningStatusPage.tsx`
- `src/pages/SigningStatusDetailPage.tsx`
- `src/pages/SigningRecordDetailPage.tsx`

如果确认不再需要这些文件，可以手动删除。

## 功能影响

### 删除的功能
1. **签署状态列表**：无法通过独立的"签署状态"菜单查看签署记录列表
2. **签署记录详情**：无法通过独立路由查看单个签署记录的详细信息
3. **签署统计**：无法通过独立路由查看签署数据统计

### 替代方案
用户仍可以通过"文书签署"页面查看和管理签署记录，该页面已包含：
- 待签署列表
- 已完成列表
- 搜索功能（支持搜索公司、员工、部门）
- 查看详情功能
- 撤回签署功能
- 文件预览和下载功能

## 菜单结构变化

### 修改前
```
文书管理
├── 文书模板
├── 文书签署
├── 签署状态 ← 删除
├── 档案下载
└── 历史记录
```

### 修改后
```
文书管理
├── 文书模板
├── 文书签署
├── 档案下载
└── 历史记录
```

## 修改文件清单
1. ✅ `src/components/layouts/Sidebar.tsx` - 删除侧边栏菜单项
2. ✅ `src/routes.tsx` - 删除路由配置和导入语句

## 注意事项
1. 删除菜单项和路由后，原有指向 `/signing-status` 的链接将失效
2. 如果其他页面有跳转到签署状态页面的链接，需要更新为跳转到文书签署页面
3. 文书签署页面已包含签署状态功能，可以满足用户查看签署记录的需求
4. 页面文件未删除，如需恢复功能，只需重新添加菜单项、路由配置和导入语句即可

## 验证
- ✅ 侧边栏菜单配置已更新
- ✅ 路由配置已更新
- ✅ 导入语句已删除
- ✅ Lint检查通过，无新增错误
- ✅ 菜单中不再显示"签署状态"选项
