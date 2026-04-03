import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Search, 
  Home, 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  Settings,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function UserManualPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  const sections: Section[] = [
    {
      id: 'overview',
      title: '系统概述',
      icon: <BookOpen className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">系统概述</h2>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">系统介绍</h3>
            <p className="text-muted-foreground leading-relaxed">
              九头鸟人事托管签署系统是一款面向多公司的电子签署管理系统，专门用于处理各类人力资源管理文书的电子签署。
              系统支持员工入职、在职、离职全生命周期的文书管理，提供薪酬工资条生成与电子签署功能，
              并预留了第三方电子签API接口，可对接第三方电子签署服务。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">主要功能</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>多公司客户信息管理与服务状态跟踪</li>
              <li>员工全生命周期管理（入职、在职、离职）</li>
              <li>文书模板库管理（公司模板、通用模板）</li>
              <li>电子签署流程管理（发起、跟踪、统计）</li>
              <li>薪酬管理（工资表、考勤、签署确认）</li>
              <li>用户权限管理（角色、权限配置）</li>
              <li>系统配置与数据统计</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">用户角色说明</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">超级管理员</h4>
                <p className="text-sm text-muted-foreground">
                  系统最高权限角色，负责整体系统配置与管理，可以管理所有公司、员工、用户和系统设置。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">主管</h4>
                <p className="text-sm text-muted-foreground">
                  负责管理所属公司的文书发起、审批与签署流程，可以管理分配给自己的公司和员工。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">员工</h4>
                <p className="text-sm text-muted-foreground">
                  接收并签署各类人力资源管理文书，通过短信链接完成电子签署操作。
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'quickstart',
      title: '快速入门',
      icon: <Home className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">快速入门</h2>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">登录系统</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>打开系统登录页面</li>
              <li>输入用户名和密码</li>
              <li>点击"登录"按钮进入系统</li>
              <li>首次登录建议修改默认密码</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">界面导航</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground">系统界面主要分为以下几个部分：</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>顶部导航栏</strong>：显示系统标题、用户信息和退出按钮</li>
                <li><strong>左侧菜单栏</strong>：包含所有功能模块的导航菜单</li>
                <li><strong>主内容区</strong>：显示当前选中功能模块的内容</li>
                <li><strong>面包屑导航</strong>：显示当前页面的位置路径</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">基本操作</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">查看数据</h4>
                <p className="text-sm text-muted-foreground">
                  点击左侧菜单进入相应模块，数据以表格形式展示，支持搜索、筛选和排序。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">添加数据</h4>
                <p className="text-sm text-muted-foreground">
                  点击页面右上角的"添加"或"新增"按钮，在弹出的对话框中填写信息，点击"保存"完成添加。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">编辑数据</h4>
                <p className="text-sm text-muted-foreground">
                  点击数据行的"编辑"按钮，修改信息后点击"保存"完成编辑。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">删除数据</h4>
                <p className="text-sm text-muted-foreground">
                  点击数据行的"删除"按钮，确认后完成删除。支持批量选择后批量删除。
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'customer',
      title: '客户管理',
      icon: <Building2 className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">客户管理</h2>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">功能说明</h3>
            <p className="text-muted-foreground">
              客户管理模块用于管理所有托管的公司客户信息，包括公司基本信息、服务状态、员工统计等。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">添加客户</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>点击"客户管理"菜单进入客户列表页面</li>
              <li>点击右上角"添加客户"按钮</li>
              <li>填写客户基本信息：
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>公司名称（必填）</li>
                  <li>统一社会信用代码</li>
                  <li>法定代表人</li>
                  <li>联系人和联系电话</li>
                  <li>公司地址</li>
                  <li>所属行业、地域、员工规模</li>
                </ul>
              </li>
              <li>设置服务信息：
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>服务起止日期</li>
                  <li>服务状态（服务中/已到期/已暂停）</li>
                  <li>发薪日期</li>
                </ul>
              </li>
              <li>点击"保存"完成添加</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">筛选客户</h3>
            <p className="text-muted-foreground">支持以下筛选方式：</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>按公司名称搜索</li>
              <li>按到期时间筛选（30天内到期、60天内到期等）</li>
              <li>按行业筛选</li>
              <li>按地域筛选</li>
              <li>按员工规模筛选</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">查看客户详情</h3>
            <p className="text-muted-foreground">
              点击客户名称进入详情页面，可以查看：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>客户完整信息</li>
              <li>关联的员工列表</li>
              <li>签章使用数据</li>
              <li>服务历史记录</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'employee',
      title: '员工管理',
      icon: <Users className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">员工管理</h2>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">功能说明</h3>
            <p className="text-muted-foreground">
              员工管理模块用于管理所有公司的员工信息，支持员工全生命周期管理，包括入职、在职、离职等状态管理。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">添加员工</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>点击"员工管理"菜单进入员工列表页面</li>
              <li>点击右上角"添加员工"按钮</li>
              <li>填写员工基本信息：
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>选择所属公司（必填）</li>
                  <li>员工姓名（必填）</li>
                  <li>证件类型和证件号码</li>
                  <li>性别、出生日期</li>
                  <li>联系电话（必填，用于接收签署短信）</li>
                  <li>部门、岗位</li>
                  <li>入职日期</li>
                </ul>
              </li>
              <li>设置劳动合同信息：
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>合同起止日期</li>
                  <li>合同类型（固定期限/无固定期限）</li>
                </ul>
              </li>
              <li>点击"保存"完成添加</li>
              <li>系统会自动弹出提示，询问是否立即办理入职手续</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">员工状态管理</h3>
            <p className="text-muted-foreground">支持以下员工状态：</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li><strong>在职</strong>：正常工作状态</li>
              <li><strong>请假</strong>：临时请假状态</li>
              <li><strong>休假</strong>：年假、产假等休假状态</li>
              <li><strong>待岗</strong>：待岗状态</li>
              <li><strong>出差</strong>：出差状态</li>
              <li><strong>离职</strong>：已离职状态（设置为离职后自动发送离职手续签署链接）</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">查看员工详情</h3>
            <p className="text-muted-foreground">
              点击员工姓名进入详情页面，可以查看：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>员工基本信息</li>
              <li>当前状态及历史状态变更记录</li>
              <li>劳动合同起止时间及签订次数</li>
              <li>已签订的所有文书记录</li>
              <li>工资记录和考勤记录</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">批量导入员工</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>点击"批量导入"按钮</li>
              <li>下载Excel模板</li>
              <li>按照模板格式填写员工信息</li>
              <li>上传填写好的Excel文件</li>
              <li>系统自动校验并导入数据</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'document',
      title: '文书管理',
      icon: <FileText className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">文书管理</h2>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">文书模板库</h3>
            <p className="text-muted-foreground">
              文书模板分为公司模板和通用模板库两类：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li><strong>公司模板</strong>：每个公司独立维护的文书模板</li>
              <li><strong>通用模板库</strong>：所有公司和员工均可使用的模板</li>
            </ul>
            
            <p className="text-muted-foreground mt-2">模板按以下大类分类：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="p-2 bg-muted rounded">
                <strong>入职管理</strong>
                <ul className="text-sm mt-1 space-y-0.5">
                  <li>• 入职信息登记表</li>
                  <li>• 劳动合同</li>
                  <li>• 岗位职责</li>
                  <li>• 员工手册</li>
                  <li>• 规章制度</li>
                  <li>• 保密协议</li>
                  <li>• 竞业禁止协议</li>
                  <li>• 培训协议</li>
                </ul>
              </div>
              <div className="p-2 bg-muted rounded">
                <strong>在职管理</strong>
                <ul className="text-sm mt-1 space-y-0.5">
                  <li>• 劳动合同续签</li>
                  <li>• 劳动合同变更协议</li>
                  <li>• 岗位调整</li>
                  <li>• 薪酬调整</li>
                  <li>• 职级调整</li>
                  <li>• 限期返岗通知书</li>
                  <li>• 记过确认通知书</li>
                  <li>• 请假条</li>
                </ul>
              </div>
              <div className="p-2 bg-muted rounded">
                <strong>离职管理</strong>
                <ul className="text-sm mt-1 space-y-0.5">
                  <li>• 离职申请</li>
                  <li>• 离职交接确认表</li>
                  <li>• 解除劳动合同协议</li>
                  <li>• 离职证明</li>
                  <li>• 保密协议确认书</li>
                  <li>• 竞业协议确认书</li>
                </ul>
              </div>
              <div className="p-2 bg-muted rounded">
                <strong>薪酬管理</strong>
                <ul className="text-sm mt-1 space-y-0.5">
                  <li>• 考勤确认</li>
                  <li>• 绩效考核确认</li>
                  <li>• 工资条确认</li>
                  <li>• 考勤表</li>
                </ul>
              </div>
              <div className="p-2 bg-muted rounded">
                <strong>证明开具</strong>
                <ul className="text-sm mt-1 space-y-0.5">
                  <li>• 收入证明</li>
                  <li>• 离职证明</li>
                  <li>• 在职证明</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">发起签署</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>点击"文书签署"菜单，然后点击"发起签署"按钮</li>
              <li>选择目标公司</li>
              <li>选择目标员工（支持多选）</li>
              <li>选择文书模板：
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>可以跨模板多选</li>
                  <li>同一大类中选择多个文书时，签署人仅需完成一次签署动作</li>
                  <li>每一大类文书支持全选或部分选择</li>
                </ul>
              </li>
              <li>确认签署流程：
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>劳动合同类：员工签署 → 公司签署</li>
                  <li>其他制度文书：员工单方签署</li>
                </ul>
              </li>
              <li>点击"发起签署"，系统自动通过短信或站内信通知签署人</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">查看签署状态</h3>
            <p className="text-muted-foreground">
              在"文书签署"页面可以查看所有签署记录的状态：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li><strong>待签署</strong>：等待签署人签署</li>
              <li><strong>已签署</strong>：签署完成</li>
              <li><strong>已拒签</strong>：签署人拒绝签署</li>
              <li><strong>已撤回</strong>：发起人撤回签署</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              支持按公司、员工、文书类型、签署状态等条件筛选和搜索。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">签署数据调取</h3>
            <p className="text-muted-foreground">
              在"签署数据调取"页面可以查看：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>签署数据统计</li>
              <li>签署率分析</li>
              <li>签署时效分析</li>
              <li>支持数据导出功能</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'salary',
      title: '薪资管理',
      icon: <DollarSign className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">薪资管理</h2>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">工资结构模板</h3>
            <p className="text-muted-foreground">
              设置通用工资结构模板，所有公司均可使用：
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>点击"工资表管理"菜单</li>
              <li>点击"工资结构模板"标签</li>
              <li>添加或编辑工资项：
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>工资项名称（如：基本工资、绩效工资、加班费等）</li>
                  <li>字段代码（用于Excel导入匹配）</li>
                  <li>字段类型（数字、文本等）</li>
                </ul>
              </li>
              <li>保存模板</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">上传工资表</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>准备Excel工资表文件，确保列名与工资结构模板匹配</li>
              <li>点击"工资表管理"菜单</li>
              <li>点击"上传工资表"按钮</li>
              <li>选择目标公司和工资月份</li>
              <li>选择关联的工资结构模板</li>
              <li>上传Excel文件</li>
              <li>系统自动拆分为每位员工的独立工资条</li>
              <li>工资条自动进入薪酬签署管理的待签署列表</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">考勤管理</h3>
            <p className="text-muted-foreground">
              管理员工考勤记录：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>录入或导入考勤数据</li>
              <li>查看考勤统计</li>
              <li>生成考勤确认表</li>
              <li>发送考勤确认签署</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">薪酬签署管理</h3>
            <p className="text-muted-foreground">
              管理工资条和考勤表的签署：
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>在"薪酬签署管理"页面查看待签署列表</li>
              <li>选择需要发送的工资条或考勤表</li>
              <li>点击"立即签署"按钮，系统向员工手机号发送电子签署链接短信</li>
              <li>或等待发薪日当日，系统自动批量发送</li>
              <li>查看签署状态和签署时间</li>
            </ol>
            
            <p className="text-muted-foreground mt-2">
              支持批量操作：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>批量撤回：撤回已发送但未签署的记录</li>
              <li>批量删除：删除选中的记录</li>
              <li>批量下载：下载已签署的文件</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'system',
      title: '系统配置',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">系统配置</h2>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">用户管理</h3>
            <p className="text-muted-foreground">
              管理系统用户账号：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>添加新用户：设置用户名、密码、角色</li>
              <li>编辑用户信息：修改用户资料和权限</li>
              <li>停用用户：暂停用户账号</li>
              <li>分配角色：为用户分配一个或多个角色</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">角色设置</h3>
            <p className="text-muted-foreground">
              自定义角色和权限：
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>点击"角色设置"菜单</li>
              <li>点击"添加角色"按钮</li>
              <li>输入角色名称和描述</li>
              <li>选择权限项：
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>客户管理：公司录入、客户信息查看、客户签章管理</li>
                  <li>员工管理：员工录入、员工信息查看、员工状态管理</li>
                  <li>文书管理：文书模板增加、文书发起、签署情况查看</li>
                  <li>薪资管理：工资结构模板设置、工资表上传、薪酬签署管理</li>
                  <li>系统配置：第三方API配置、身份认证配置</li>
                  <li>用户权限管理：用户列表管理、角色设置、权限分配</li>
                  <li>看板：首页数据统计查看</li>
                  <li>下属管理：管理直属下属的文书发起与审批</li>
                </ul>
              </li>
              <li>保存角色</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">系统设置</h3>
            <p className="text-muted-foreground">
              配置系统参数：
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>劳动合同到期提醒设置（提前30天提醒）</li>
              <li>第三方电子签API接口配置</li>
              <li>身份认证配置（身份证二要素、人脸识别等）</li>
              <li>数据查询配置（工商信息查询、企业招聘数据查询）</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'faq',
      title: '常见问题',
      icon: <HelpCircle className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">常见问题解答</h2>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">登录相关</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 忘记密码怎么办？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 请联系系统管理员重置密码。管理员可以在用户管理页面为您重置密码。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 登录后看不到某些菜单？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 这是正常的权限控制。您只能看到自己有权限访问的功能模块。如需更多权限，请联系管理员。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">操作相关</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 如何批量导入员工？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 在员工管理页面点击"批量导入"按钮，下载Excel模板，按照模板格式填写员工信息后上传即可。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 员工没有收到签署短信怎么办？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 请检查：1) 员工手机号是否正确；2) 手机是否能正常接收短信；3) 短信是否被拦截。如问题持续，请联系技术支持。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 如何撤回已发起的签署？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 在文书签署页面的待签署列表中，找到对应记录，点击"撤回"按钮即可。已签署的记录无法撤回。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 工资表上传后如何修改？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 如果工资条尚未发送给员工，可以删除后重新上传。如果已发送，需要先撤回签署，删除记录，然后重新上传。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 如何查看员工的签署历史？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 点击员工姓名进入员工详情页面，在"文书记录"标签中可以查看该员工的所有签署历史。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">数据相关</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 如何导出数据？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 大部分列表页面都提供"导出"按钮，点击后可以导出当前筛选条件下的数据为Excel或CSV格式。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 数据可以批量删除吗？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 可以。在列表页面勾选需要删除的记录，然后点击"批量删除"按钮。删除前会要求确认。
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">Q: 删除的数据可以恢复吗？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 删除操作是永久性的，无法恢复。删除前请务必确认。建议定期备份重要数据。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">技术支持</h3>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                如果您遇到本手册未涵盖的问题，或需要技术支持，请联系：
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground ml-4">
                <li>技术支持邮箱：support@jiutouniao.com</li>
                <li>客服电话：400-XXX-XXXX</li>
                <li>工作时间：周一至周五 9:00-18:00</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // 过滤章节（基于搜索关键词）
  const filteredSections = sections.filter(section => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return section.title.toLowerCase().includes(keyword);
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold">使用手册</h1>
          <p className="text-muted-foreground mt-2">
            九头鸟人事托管签署系统完整使用指南
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧目录 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">目录</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索章节..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-1 p-4">
                  {filteredSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      {section.icon}
                      <span className="flex-1 text-left">{section.title}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 右侧内容 */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="prose prose-sm max-w-none">
                  {sections.find(s => s.id === activeSection)?.content}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
