import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import { CustomerManagementPage } from './pages/CustomerManagementPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import TemplatesPage from './pages/TemplatesPage';
import SigningsPage from './pages/SigningsPage';
import SigningDataPage from './pages/SigningDataPage';
import EmployeeDocumentRecordsPage from './pages/EmployeeDocumentRecordsPage';
import RolesPage from './pages/RolesPage';
import UsersPage from './pages/UsersPage';
import NotificationsPage from './pages/NotificationsPage';
import OperationLogsPage from './pages/OperationLogsPage';
import RecruitmentQueryPage from './pages/RecruitmentQueryPage';
import SettingsPage from './pages/SettingsPage';
import SalaryTemplatesPage from './pages/SalaryTemplatesPage';
import SalaryRecordsPage from './pages/SalaryRecordsPage';
import SalaryItemsPage from './pages/SalaryItemsPage';
import AttendancePage from './pages/AttendancePage';
import SalarySignaturesPage from './pages/SalarySignaturesPage';
import SalarySigningDataPage from './pages/SalarySigningDataPage';
import { EmployeeSignPage } from './pages/EmployeeSignPage';
import AIChatPage from './pages/AIChatPage';
import VerificationPage from './pages/VerificationPage';
import UserManualPage from './pages/UserManualPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '登录',
    path: '/login',
    element: <LoginPage />
  },
  {
    name: '看板',
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    name: '公司管理',
    path: '/companies',
    element: <CompaniesPage />
  },
  {
    name: '公司详情',
    path: '/companies/:id',
    element: <CompanyDetailPage />,
    visible: false
  },
  {
    name: '客户管理',
    path: '/customers',
    element: <CustomerManagementPage />
  },
  {
    name: '员工管理',
    path: '/employees',
    element: <EmployeesPage />
  },
  {
    name: '员工详情',
    path: '/employees/:id',
    element: <EmployeeDetailPage />,
    visible: false
  },
  {
    name: '文书模板',
    path: '/templates',
    element: <TemplatesPage />
  },
  {
    name: '文书签署',
    path: '/signings',
    element: <SigningsPage />
  },
  {
    name: '签署数据调取',
    path: '/signing-data',
    element: <SigningDataPage />
  },
  {
    name: '历史记录',
    path: '/employee-document-records',
    element: <EmployeeDocumentRecordsPage />
  },
  {
    name: '工资结构',
    path: '/salary-templates',
    element: <SalaryTemplatesPage />
  },
  {
    name: '工资表管理',
    path: '/salary-records',
    element: <SalaryRecordsPage />
  },
  {
    name: '工资条列表',
    path: '/salary-items',
    element: <SalaryItemsPage />
  },
  {
    name: '考勤管理',
    path: '/attendance',
    element: <AttendancePage />
  },
  {
    name: '薪酬签署',
    path: '/salary-signatures',
    element: <SalarySignaturesPage />
  },
  {
    name: '薪酬档案下载',
    path: '/salary-signing-data',
    element: <SalarySigningDataPage />
  },
  {
    name: '角色权限',
    path: '/roles',
    element: <RolesPage />
  },
  {
    name: '用户管理',
    path: '/users',
    element: <UsersPage />
  },
  {
    name: '通知中心',
    path: '/notifications',
    element: <NotificationsPage />
  },
  {
    name: '操作日志',
    path: '/operation-logs',
    element: <OperationLogsPage />
  },
  {
    name: 'AI助手',
    path: '/ai-chat',
    element: <AIChatPage />
  },
  {
    name: '招聘数据查询',
    path: '/recruitment-query',
    element: <RecruitmentQueryPage />
  },
  {
    name: '实名认证',
    path: '/verification',
    element: <VerificationPage />
  },
  {
    name: '员工签署',
    path: '/sign/:token',
    element: <EmployeeSignPage />,
    visible: false // 不在侧边栏显示
  },
  {
    name: '系统配置',
    path: '/settings',
    element: <SettingsPage />
  },
  {
    name: '使用手册',
    path: '/user-manual',
    element: <UserManualPage />
  }
];

export default routes;
