# 步骤104：实现两种签署流程（电子签署和线下签署）

## 需求描述
根据实际业务场景，系统需要支持两种签署流程：
1. **电子签署流程**：系统发起 → 调用电子签API → 员工收到短信 → 在线签署 → 自动回传数据 → 自动更新状态
2. **线下签署流程**：系统发起 → 调用电子签API → 员工收到短信 → 线下签署纸质版 → 上传附件 → 手动更新状态

## 功能说明

### 1. 签署模式选择
- 发起签署时可选择签署模式：
  - **电子签署（在线签署）**：员工将收到短信通知，在线完成签署，系统自动更新状态
  - **线下签署（上传附件）**：员工线下签署纸质版后，需上传已签署附件并手动更新状态
- 默认为电子签署模式
- 签署模式一旦选定不可更改

### 2. 电子签署流程
**流程步骤**：
1. 主管在系统中发起签署，选择"电子签署"模式
2. 系统调用第三方电子签API创建签署任务
3. 员工收到短信通知，包含签署链接
4. 员工点击链接，在线完成签署
5. 电子签系统自动回传签署结果
6. 系统自动更新签署状态：pending → employee_signed → company_signed → completed

**状态流转**：
- pending（待签署）→ employee_signed（员工已签署）→ company_signed（公司已签署）→ completed（已完成）
- 任何阶段都可以拒绝：rejected（已拒绝）

**操作按钮**：
- 待签署状态：显示"员工签署"和"拒绝"按钮
- 员工已签署状态：显示"公司签署完成"按钮
- 已完成状态：只能查看，不能操作

### 3. 线下签署流程
**流程步骤**：
1. 主管在系统中发起签署，选择"线下签署"模式
2. 系统调用第三方电子签API发送通知（可选）
3. 员工收到短信通知
4. 员工线下签署纸质版文书
5. 员工或主管将已签署的文书拍照或扫描
6. 在系统中上传已签署附件（PDF、JPG、PNG格式）
7. 主管手动标记为"已完成"

**状态流转**：
- pending（待签署）→ uploaded（已上传附件）→ completed（已完成）
- 上传附件后自动记录上传时间和上传人

**操作按钮**：
- 待签署状态：显示"上传已签署文档"功能
- 已上传附件状态：显示"标记为已完成"按钮
- 已完成状态：只能查看和下载附件

### 4. 附件上传功能
**上传限制**：
- 支持格式：PDF、JPG、JPEG、PNG
- 文件大小：不超过10MB
- 单个签署记录只能上传一个附件（后上传的会覆盖前面的）

**上传流程**：
1. 点击"上传已签署文档"
2. 选择本地文件
3. 系统验证文件格式和大小
4. 上传到Supabase Storage的signed-documents bucket
5. 保存文件URL到签署记录的signed_file_url字段
6. 记录上传时间（uploaded_at）和上传人（uploaded_by）

**附件管理**：
- 上传成功后显示"已签署文档"区域
- 显示上传时间
- 提供"下载文件"按钮
- 支持预览（在新标签页打开）

## 数据库变更

### 1. 新增字段
```sql
-- signing_records表新增字段
signing_mode signing_mode DEFAULT 'electronic'  -- 签署模式：electronic=电子签，offline=线下签署
uploaded_at TIMESTAMPTZ DEFAULT NULL            -- 附件上传时间
uploaded_by TEXT DEFAULT NULL                   -- 附件上传人ID
```

### 2. 新增枚举类型
```sql
CREATE TYPE signing_mode AS ENUM ('electronic', 'offline');
```

### 3. Storage Bucket
- 创建signed-documents bucket用于存储已签署文档
- 设置为public bucket，允许公开访问
- 策略：
  - 认证用户可以上传文件
  - 所有人可以查看文件
  - 认证用户可以删除自己上传的文件

## 前端实现

### 1. 类型定义更新
```typescript
// types/types.ts
export type SigningMode = 'electronic' | 'offline';

export interface SigningRecord {
  // ... 其他字段
  signing_mode: SigningMode;
  uploaded_at?: string;
  uploaded_by?: string;
}
```

### 2. 发起签署对话框
- 在公司选择之后添加"签署模式"选择器
- 使用Select组件，两个选项：
  - 电子签署（在线签署）
  - 线下签署（上传附件）
- 显示说明文字，根据选择的模式动态变化
- 提交时将signing_mode保存到数据库

### 3. 签署记录列表
- 添加"签署模式"列
- 使用Badge组件显示：
  - 电子签署：default variant（蓝色）
  - 线下签署：secondary variant（灰色）

### 4. 签署详情对话框
**显示信息**：
- 基本信息：员工、公司、状态、创建时间
- 文书列表
- 签署模式
- 备注

**电子签署模式**：
- 待签署状态：显示"员工签署"和"拒绝"按钮
- 员工已签署状态：显示"公司签署完成"按钮
- 不显示上传功能

**线下签署模式**：
- 待签署状态：显示"上传已签署文档"功能
  - Input type="file"，accept=".pdf,.jpg,.jpeg,.png"
  - 选择文件后自动上传
  - 显示上传进度
- 已上传附件：显示"已签署文档"区域
  - 显示上传时间
  - 提供"下载文件"按钮
  - 显示"标记为已完成"按钮

### 5. API函数
```typescript
// db/api.ts

// 上传已签署文档
export async function uploadSignedDocument(
  file: File, 
  signingRecordId: string
): Promise<string | null>

// 更新签署记录的附件URL和上传信息
export async function updateSigningRecordFile(
  id: string, 
  fileUrl: string, 
  uploadedBy: string
): Promise<boolean>
```

## 用户体验优化

### 1. 智能提示
- 选择签署模式时显示说明文字
- 上传文件时显示格式和大小限制
- 上传中显示"上传中..."提示
- 上传成功显示成功提示并刷新列表

### 2. 错误处理
- 文件格式不正确：提示"只支持PDF、JPG、PNG格式的文件"
- 文件过大：提示"文件大小不能超过10MB"
- 上传失败：提示"上传文件失败"并保留原状态
- 更新记录失败：提示"更新记录失败"

### 3. 状态反馈
- 上传按钮在上传中禁用
- 上传成功后自动关闭对话框并刷新列表
- 显示上传时间和上传人信息
- 已上传的文件可以下载和预览

### 4. 操作便捷性
- 选择文件后自动上传，无需额外点击
- 上传成功后自动更新状态
- 一键标记为已完成
- 支持下载和预览附件

## 应用场景

### 1. 电子签署场景
**适用情况**：
- 员工有智能手机和网络
- 需要快速完成签署
- 需要法律效力的电子签名
- 需要自动化流程

**典型场景**：
- 劳动合同签署
- 保密协议签署
- 竞业禁止协议签署
- 培训协议签署

### 2. 线下签署场景
**适用情况**：
- 员工不方便在线签署
- 需要纸质存档
- 特殊文书要求纸质签署
- 补录历史签署记录

**典型场景**：
- 补录历史合同
- 特殊岗位纸质合同
- 需要盖章的文书
- 多方签署的复杂文书

## 技术要点

### 1. 文件上传
- 使用Supabase Storage存储文件
- 生成唯一文件名：`${signingRecordId}_${timestamp}.${ext}`
- 文件路径：`signed/${fileName}`
- 获取公开URL并保存到数据库

### 2. 文件验证
- 前端验证：文件类型、文件大小
- 使用file.type检查MIME类型
- 使用file.size检查文件大小
- 验证失败立即提示，不上传

### 3. 状态管理
- 使用uploading状态控制上传按钮
- 上传中禁用文件选择
- 上传成功后刷新列表
- 上传失败保持原状态

### 4. 权限控制
- 只有认证用户可以上传文件
- 所有人可以查看已上传的文件
- 用户只能删除自己上传的文件
- Storage策略自动控制权限

## 数据流程

### 电子签署流程
1. 用户选择"电子签署"模式 → 提交表单
2. 创建签署记录，signing_mode='electronic'
3. 调用第三方电子签API（预留接口）
4. 员工收到短信，点击链接签署
5. 电子签系统回传结果（预留webhook）
6. 系统自动更新状态：pending → employee_signed → company_signed → completed

### 线下签署流程
1. 用户选择"线下签署"模式 → 提交表单
2. 创建签署记录，signing_mode='offline'
3. 发送短信通知员工（可选）
4. 员工线下签署纸质版
5. 用户在详情页上传附件 → 调用uploadSignedDocument
6. 上传成功 → 调用updateSigningRecordFile更新记录
7. 保存文件URL、上传时间、上传人
8. 用户点击"标记为已完成" → 更新状态为completed

## 文件变更

### 数据库
1. 迁移：add_signing_mode_and_upload_fields
   - 创建signing_mode枚举类型
   - 添加signing_mode字段（默认electronic）
   - 添加uploaded_at字段
   - 添加uploaded_by字段
   - 创建索引

2. 迁移：create_signed_documents_bucket_v3
   - 创建signed-documents bucket
   - 设置为public bucket
   - 创建上传策略
   - 创建查看策略
   - 创建删除策略

### 前端
1. types/types.ts
   - 添加SigningMode类型
   - 更新SigningRecord接口

2. db/api.ts
   - 添加uploadSignedDocument函数
   - 添加updateSigningRecordFile函数

3. pages/SigningsPage.tsx
   - 导入SigningMode类型
   - 导入上传相关API函数
   - formData添加signing_mode字段
   - 添加uploading状态
   - handleOpenDialog重置signing_mode
   - handleSubmit提交signing_mode
   - 添加handleUploadFile函数
   - 发起签署对话框添加签署模式选择器
   - 签署记录列表添加签署模式列
   - 详情对话框添加签署模式显示
   - 详情对话框添加上传功能（线下签署模式）
   - 详情对话框添加已签署文档显示
   - 根据签署模式显示不同的操作按钮

## 验证结果
- ✅ 数据库迁移成功
- ✅ 签署模式枚举类型创建成功
- ✅ Storage bucket创建成功
- ✅ 发起签署时可以选择签署模式
- ✅ 签署记录列表显示签署模式
- ✅ 详情对话框显示签署模式
- ✅ 线下签署模式显示上传功能
- ✅ 文件上传功能正常
- ✅ 文件验证功能正常
- ✅ 上传成功后显示已签署文档
- ✅ 可以下载已上传的文件
- ✅ 根据签署模式显示不同的操作按钮
- ✅ TypeScript类型检查通过
- ✅ Lint检查通过：0个错误

## 后续优化建议

### 1. 第三方电子签集成
- 实现电子签API调用
- 实现webhook接收签署结果
- 自动更新签署状态
- 自动下载已签署文件

### 2. 短信通知
- 发起签署时发送短信通知
- 包含签署链接（电子签）
- 包含上传提醒（线下签署）
- 签署完成后发送通知

### 3. 文件预览
- 支持PDF在线预览
- 支持图片在线预览
- 支持文件缩略图
- 支持文件批注

### 4. 批量操作
- 批量发起签署
- 批量上传附件
- 批量标记完成
- 批量下载文件

### 5. 审计日志
- 记录签署发起人
- 记录状态变更历史
- 记录文件上传历史
- 记录操作时间和操作人

### 6. 提醒功能
- 待签署提醒
- 待上传提醒
- 超时提醒
- 完成通知

### 7. 统计分析
- 签署完成率
- 平均签署时长
- 签署模式分布
- 文书类型分布
