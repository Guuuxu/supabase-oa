# 文书签署管理页面 - 添加搜索功能

## 功能说明
在文书签署管理页面的待签署和已完成列表中添加搜索框，支持通过关键词快速查找公司、员工或部门。

## 实现内容

### 1. 添加搜索状态
在组件状态中添加 `searchKeyword` 状态，用于存储用户输入的搜索关键词。

```typescript
const [searchKeyword, setSearchKeyword] = useState<string>(''); // 搜索关键词
```

### 2. 实现搜索筛选函数
创建 `getSearchFilteredSignings` 函数，根据搜索关键词筛选签署记录：

```typescript
const getSearchFilteredSignings = (records: SigningRecord[]) => {
  if (!searchKeyword.trim()) return records;
  
  const keyword = searchKeyword.toLowerCase().trim();
  return records.filter(signing => {
    const companyName = signing.company?.name?.toLowerCase() || '';
    const employeeName = signing.employee?.name?.toLowerCase() || '';
    const department = signing.employee?.department?.toLowerCase() || '';
    
    return companyName.includes(keyword) || 
           employeeName.includes(keyword) || 
           department.includes(keyword);
  });
};
```

**搜索范围**：
- 公司名称
- 员工姓名
- 部门名称

**搜索特性**：
- 不区分大小写
- 自动去除首尾空格
- 支持模糊匹配
- 空关键词时返回所有记录

### 3. 应用搜索筛选
将搜索筛选应用到待签署和已完成记录：

```typescript
// 待签署记录（带搜索筛选）
const pendingRecords = getSearchFilteredSignings(
  signings.filter(s => s.status === 'pending' || s.status === 'employee_signed' || s.status === 'company_signed')
);

// 已完成记录（带搜索筛选）
const completedRecords = getSearchFilteredSignings(
  signings.filter(s => s.status === 'completed' || s.status === 'rejected' || s.status === 'withdrawn')
);
```

### 4. 添加搜索框UI组件

#### 待签署列表搜索框
在待签署列表的CardHeader中添加搜索框：

```tsx
<CardHeader>
  <div className="flex items-center justify-between gap-4">
    <CardTitle>待签署列表</CardTitle>
    <div className="relative w-64">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="搜索公司、员工或部门..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="pl-9"
      />
    </div>
  </div>
</CardHeader>
```

#### 已完成列表搜索框
在已完成列表的CardHeader中添加相同的搜索框，两个列表共享同一个搜索关键词状态。

### 5. 更新空状态提示
根据搜索关键词是否存在，显示不同的空状态提示：

```tsx
{searchKeyword ? '未找到匹配的记录' : '暂无待签署记录'}
```

### 6. 更新数据源
- 将待签署列表的数据源从原始筛选改为使用 `pendingRecords`
- 将已完成列表的数据源从原始筛选改为使用 `completedRecords`
- 更新标签页标题的数量统计，使用筛选后的记录数量

### 7. 导入Search图标
从 `lucide-react` 导入 `Search` 图标组件。

## UI设计

### 搜索框样式
- **位置**：CardHeader右侧，与CardTitle并排
- **宽度**：固定宽度 `w-64`（256px）
- **图标**：左侧显示Search图标，灰色
- **占位符**：显示"搜索公司、员工或部门..."
- **输入框**：左侧留出图标空间 `pl-9`

### 布局结构
```
CardHeader
├── CardTitle (左侧)
└── 搜索框 (右侧)
    ├── Search图标 (绝对定位，左侧)
    └── Input输入框
```

## 用户体验

### 1. 实时搜索
用户输入关键词后，列表立即更新显示匹配的记录，无需点击搜索按钮。

### 2. 跨字段搜索
支持同时搜索公司名称、员工姓名和部门名称，只要任一字段匹配即显示该记录。

### 3. 智能提示
- 有搜索关键词但无匹配结果时，显示"未找到匹配的记录"
- 无搜索关键词且列表为空时，显示"暂无待签署记录"或"暂无已完成记录"

### 4. 数量统计
标签页标题显示筛选后的记录数量，用户可以直观了解搜索结果数量。

### 5. 共享搜索状态
待签署和已完成两个标签页共享同一个搜索关键词，切换标签页时搜索条件保持不变。

## 技术实现

### 搜索算法
- 使用 `toLowerCase()` 实现不区分大小写搜索
- 使用 `trim()` 去除首尾空格
- 使用 `includes()` 实现模糊匹配
- 使用逻辑或 `||` 实现多字段搜索

### 性能优化
- 搜索在客户端进行，无需请求服务器
- 使用计算属性缓存筛选结果
- 输入框使用受控组件，实时响应用户输入

### 响应式设计
- 搜索框固定宽度，适配桌面端
- 使用flex布局，标题和搜索框自动对齐
- 搜索框与标题之间有适当间距 `gap-4`

## 注意事项
1. 搜索关键词为空时，显示所有记录
2. 搜索不区分大小写，提高用户体验
3. 搜索支持模糊匹配，无需输入完整关键词
4. 两个标签页共享搜索状态，切换标签页时搜索条件保持
5. 搜索结果实时更新，无需手动刷新
