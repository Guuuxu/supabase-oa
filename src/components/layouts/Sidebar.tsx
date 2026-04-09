import { Link, useLocation } from 'react-router-dom';
import { cn, isSuperAdmin } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentUserPermissions } from '@/db/api';
import type { Profile } from '@/types/types';
import { sidebarCodesFromPermissionGroup } from '@/config/permissions';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  FileSignature,
  Shield,
  UserCog,
  Settings,
  Bell,
  Database,
  Sparkles,
  BadgeCheck,
  ScrollText,
  TrendingUp,
  FileSpreadsheet,
  LayoutTemplate,
  Receipt,
  Calendar,
  ChevronDown,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import logoImage from '@/assets/logo.jpg';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  /** 所需权限之一（与 permissionAlternates 一并取 OR） */
  permission?: string;
  /**
   * 与 permission 为 OR：具备任一即可显示（解决库里的 employee_manage / document_initiate
   * 等与菜单上 employee_view / document_view 命名不一致的问题）
   */
  permissionAlternates?: string[];
  external?: boolean;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

function navItemAllowedCodes(item: NavItem): string[] {
  const codes: string[] = [];
  if (item.permission) codes.push(item.permission);
  if (item.permissionAlternates?.length) {
    codes.push(...item.permissionAlternates);
  }
  return codes;
}

function shouldShowNavItem(
  item: NavItem,
  profile: Profile | null,
  userPermissions: string[]
): boolean {
  if (isSuperAdmin(profile)) return true;
  const codes = navItemAllowedCodes(item);
  if (codes.length === 0) return true;
  return codes.some((c) => userPermissions.includes(c));
}

type NavRenderSlice = { group: NavGroup; groupIndex: number; visibleItems: NavItem[] };

function SidebarNavContent({
  slices,
  expandedGroups,
  toggleGroup,
  location,
  onItemClick,
}: {
  slices: NavRenderSlice[];
  expandedGroups: { [key: number]: boolean };
  toggleGroup: (groupIndex: number) => void;
  location: ReturnType<typeof useLocation>;
  onItemClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex flex-col items-center gap-2">
          <img src={logoImage} alt="九头鸟Logo" className="h-8 w-8 object-contain" />
          <div className="text-center">
            <h1 className="text-base font-bold text-sidebar-foreground leading-tight">
              九头鸟人事托管
            </h1>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">签署系统</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
        {slices.map(({ group, groupIndex, visibleItems }) => {
          if (visibleItems.length === 0) return null;

          const isExpanded = expandedGroups[groupIndex] ?? true;

          return (
            <div key={groupIndex}>
              {group.title ? (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleGroup(groupIndex)}
                    className="w-full flex items-center justify-between px-2 py-2 mb-1.5 rounded-md hover:bg-sidebar-accent/30 transition-colors"
                  >
                    <h2 className="text-sm font-bold text-sidebar-foreground/80 uppercase tracking-wide">
                      {group.title}
                    </h2>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-sidebar-foreground/70" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-sidebar-foreground/70" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="space-y-0.5">
                      {visibleItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        if (item.external) {
                          return (
                            <a
                              key={item.path}
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={onItemClick}
                              className={cn(
                                'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
                                'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                              )}
                            >
                              {item.icon}
                              <span className="truncate">{item.name}</span>
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={onItemClick}
                            className={cn(
                              'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                            )}
                          >
                            {item.icon}
                            <span className="truncate">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    if (item.external) {
                      return (
                        <a
                          key={item.path}
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={onItemClick}
                          className={cn(
                            'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
                            'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                          )}
                        >
                          {item.icon}
                          <span className="truncate">{item.name}</span>
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onItemClick}
                        className={cn(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                        )}
                      >
                        {item.icon}
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
              {groupIndex < navGroups.length - 1 && visibleItems.length > 0 && (
                <Separator className="mt-3 bg-sidebar-border" />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

const navGroups: NavGroup[] = [
  {
    title: '我的',
    items: [
      {
        name: '看板',
        path: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('dashboard', 'dashboard_view'),
      },
      {
        name: '客户管理',
        path: '/customers',
        icon: <Building2 className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('customer', 'customer_view'),
      },
    ],
  },
  {
    title: '基础管理',
    items: [
      {
        name: '公司管理',
        path: '/companies',
        icon: <Building2 className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('company', 'company_view'),
      },
      {
        name: '员工管理',
        path: '/employees',
        icon: <Users className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('employee', 'employee_view'),
      },
    ],
  },
  {
    title: '文书管理',
    items: [
      {
        name: '文书模板',
        path: '/templates',
        icon: <FileText className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('template', 'template_view'),
      },
      {
        name: '文书签署',
        path: '/signings',
        icon: <FileSignature className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('signing', 'signing_view'),
      },
      {
        name: '档案下载',
        path: '/signing-data',
        icon: <Database className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('document_archive', 'signed_document_download'),
      },
      {
        name: '历史记录',
        path: '/employee-document-records',
        icon: <ScrollText className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('document_archive', 'document_history_view'),
      },
    ],
  },
  {
    title: '薪酬管理',
    items: [
      {
        name: '工资结构',
        path: '/salary-templates',
        icon: <LayoutTemplate className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('salary_structure', 'salary_template_view'),
      },
      {
        name: '工资表管理',
        path: '/salary-records',
        icon: <FileSpreadsheet className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('salary_record', 'salary_record_view'),
      },
      {
        name: '工资条管理',
        path: '/salary-items',
        icon: <Receipt className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('salary_item', 'salary_item_view'),
      },
      {
        name: '考勤管理',
        path: '/attendance',
        icon: <Calendar className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('attendance', 'attendance_view'),
      },
      {
        name: '薪酬签署',
        path: '/salary-signatures',
        icon: <FileText className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('salary_signing', 'salary_signing_view'),
      },
      {
        name: '档案下载',
        path: '/salary-signing-data',
        icon: <Database className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('salary_archive', 'salary_archive_download'),
      },
    ],
  },
  {
    title: '工具箱',
    items: [
      {
        name: 'AI助手',
        path: '/ai-chat',
        icon: <Sparkles className="h-5 w-5" />,
        permission: 'ai_assistant_use',
        permissionAlternates: [],
      },
      {
        name: '招聘数据查询',
        path: '/recruitment-query',
        icon: <TrendingUp className="h-5 w-5" />,
        permission: 'recruitment_query_view',
        permissionAlternates: ['recruitment_query_export'],
      },
      {
        name: '实名认证',
        path: '/verification',
        icon: <BadgeCheck className="h-5 w-5" />,
        permission: 'identity_verification_view',
        permissionAlternates: ['identity_verification_manage'],
      },
    ],
  },
  {
    title: '系统管理',
    items: [
      {
        name: '角色权限',
        path: '/roles',
        icon: <Shield className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('role', 'role_view'),
      },
      {
        name: '用户管理',
        path: '/users',
        icon: <UserCog className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('user', 'user_view'),
      },
      {
        name: '通知中心',
        path: '/notifications',
        icon: <Bell className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('notification', 'notification_view'),
      },
      {
        name: '操作日志',
        path: '/operation-logs',
        icon: <ScrollText className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('audit', 'audit_log_view'),
      },
      {
        name: '系统配置',
        path: '/settings',
        icon: <Settings className="h-5 w-5" />,
        ...sidebarCodesFromPermissionGroup('system_config', 'system_config_view'),
      },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  // 管理每个分组的展开/收起状态
  const [expandedGroups, setExpandedGroups] = useState<{ [key: number]: boolean }>({
    0: false, // 默认收起"我的"
    1: false, // 默认收起基础管理
    2: false, // 默认收起文书管理
    3: false, // 默认收起薪酬管理
    4: false, // 默认收起工具箱
    5: false  // 默认收起系统管理
  });

  // 切换分组展开状态（手风琴效果：同时只能展开一个）
  const toggleGroup = (groupIndex: number) => {
    setExpandedGroups(prev => {
      const newState: { [key: number]: boolean } = {};
      // 关闭所有分组
      Object.keys(prev).forEach(key => {
        newState[Number(key)] = false;
      });
      // 只展开当前点击的分组
      newState[groupIndex] = !prev[groupIndex];
      return newState;
    });
  };

  // 加载用户权限：用 role_id 等原始字段作依赖，避免 profile 引用不变时编辑角色后不刷新；登出时清空列表
  useEffect(() => {
    let cancelled = false;
    const loadPermissions = async () => {
      if (!profile) {
        setUserPermissions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const permissions = await getCurrentUserPermissions();
      if (!cancelled) {
        setUserPermissions(permissions);
        setLoading(false);
      }
    };
    void loadPermissions();
    return () => {
      cancelled = true;
    };
  }, [profile?.id, profile?.role_id, profile?.role]);

  // 根据当前路由自动展开对应的一级菜单
  useEffect(() => {
    const currentPath = location.pathname;
    
    // 查找当前路由所属的菜单组
    const groupIndex = navGroups.findIndex(group => 
      group.items.some(item => item.path === currentPath)
    );
    
    // 如果找到了对应的菜单组，自动展开它
    if (groupIndex !== -1) {
      setExpandedGroups(prev => {
        const newState: { [key: number]: boolean } = {};
        // 关闭所有分组
        Object.keys(prev).forEach(key => {
          newState[Number(key)] = false;
        });
        // 展开当前路由所属的分组
        newState[groupIndex] = true;
        return newState;
      });
    }
  }, [location.pathname]); // 监听路由变化

  // 与界面渲染同源：用 useMemo 绑定 profile + userPermissions，避免闭包/内部组件类型每轮重创建导致菜单不随权限更新
  const navRenderSlices = useMemo(
    () =>
      navGroups.map((group, groupIndex) => ({
        group,
        groupIndex,
        visibleItems: group.items.filter((item) =>
          shouldShowNavItem(item, profile, userPermissions)
        ),
      })),
    [profile, userPermissions]
  );

  const sidebarMenuKey = useMemo(
    () =>
      `${profile?.id ?? 'x'}|${profile?.role_id ?? 'x'}|${[...userPermissions].sort().join(',')}`,
    [profile?.id, profile?.role_id, userPermissions]
  );

  // 调试：控制台搜 [JY:PERM]（与 navRenderSlices 一致）
  useEffect(() => {
    if (loading) return;
    if (!profile) {
      console.log('[JY:PERM] 未登录，无 profile');
      return;
    }
    const visibleMenus = navRenderSlices
      .map(({ group, visibleItems }) => ({
        title: group.title ?? '(无分组名)',
        items: visibleItems.map((item) => ({
          name: item.name,
          path: item.path,
          permission: navItemAllowedCodes(item).join(' | ') || '(无要求)',
        })),
      }))
      .filter((g) => g.items.length > 0);
  }, [loading, profile, userPermissions, navRenderSlices]);

  return (
    <>
      <aside
        key={sidebarMenuKey}
        className="hidden lg:block w-44 border-r border-border bg-sidebar shrink-0 h-full"
      >
        <SidebarNavContent
          slices={navRenderSlices}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
          location={location}
        />
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-3 left-3 z-40 bg-background/80 backdrop-blur-sm border border-border"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <SidebarNavContent
            key={sidebarMenuKey}
            slices={navRenderSlices}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
            location={location}
            onItemClick={() => {
              const closeButton = document.querySelector('[data-sheet-close]') as HTMLButtonElement;
              closeButton?.click();
            }}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
