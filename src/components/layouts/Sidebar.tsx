import { Link, useLocation } from 'react-router-dom';
import { cn, isAdmin } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getCurrentUserPermissions } from '@/db/api';
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
  BarChart3,
  Database,
  Sparkles,
  BadgeCheck,
  ScrollText,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import logoImage from '@/assets/logo.jpg';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  permission?: string; // 权限code，如 'company_view', 'employee_view' 等
  external?: boolean; // 是否为外部链接
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '我的',
    items: [
      {
        name: '看板',
        path: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        permission: 'dashboard_view'
      },
      {
        name: '客户管理',
        path: '/customers',
        icon: <Building2 className="h-5 w-5" />,
        permission: 'company_view'
      }
    ]
  },
  {
    title: '基础管理',
    items: [
      {
        name: '公司管理',
        path: '/companies',
        icon: <Building2 className="h-5 w-5" />,
        permission: 'company_view'
      },
      {
        name: '员工管理',
        path: '/employees',
        icon: <Users className="h-5 w-5" />,
        permission: 'employee_view'
      }
    ]
  },
  {
    title: '文书管理',
    items: [
      {
        name: '文书模板',
        path: '/templates',
        icon: <FileText className="h-5 w-5" />,
        permission: 'template_view'
      },
      {
        name: '文书签署',
        path: '/signings',
        icon: <FileSignature className="h-5 w-5" />,
        permission: 'document_view'
      },
      {
        name: '档案下载',
        path: '/signing-data',
        icon: <Database className="h-5 w-5" />,
        permission: 'signed_file_download'
      },
      {
        name: '历史记录',
        path: '/employee-document-records',
        icon: <ScrollText className="h-5 w-5" />,
        permission: 'document_view'
      }
    ]
  },
  {
    title: '薪酬管理',
    items: [
      {
        name: '工资表管理',
        path: '/salary-records',
        icon: <FileSpreadsheet className="h-5 w-5" />,
        permission: 'document_view'
      },
      {
        name: '考勤管理',
        path: '/attendance',
        icon: <Calendar className="h-5 w-5" />,
        permission: 'document_view'
      },
      {
        name: '薪酬签署',
        path: '/salary-signatures',
        icon: <FileText className="h-5 w-5" />,
        permission: 'document_view'
      },
      {
        name: '档案下载',
        path: '/salary-signing-data',
        icon: <Database className="h-5 w-5" />,
        permission: 'signed_file_download'
      }
    ]
  },
  {
    title: '工具箱',
    items: [
      {
        name: 'AI助手',
        path: '/ai-chat',
        icon: <Sparkles className="h-5 w-5" />
        // AI助手所有人都可以访问，不需要权限
      },
      {
        name: '招聘数据查询',
        path: '/recruitment-query',
        icon: <TrendingUp className="h-5 w-5" />
        // 招聘数据查询所有人都可以访问，不需要权限
      },
      {
        name: '实名认证',
        path: '/verification',
        icon: <BadgeCheck className="h-5 w-5" />
        // 实名认证所有人都可以访问，不需要权限
      }
    ]
  },
  {
    title: '系统管理',
    items: [
      {
        name: '角色权限',
        path: '/roles',
        icon: <Shield className="h-5 w-5" />,
        permission: 'role_view'
      },
      {
        name: '用户管理',
        path: '/users',
        icon: <UserCog className="h-5 w-5" />,
        permission: 'user_view'
      },
      {
        name: '通知中心',
        path: '/notifications',
        icon: <Bell className="h-5 w-5" />,
        permission: 'notification_view'
      },
      {
        name: '操作日志',
        path: '/operation-logs',
        icon: <ScrollText className="h-5 w-5" />,
        permission: 'system_config_view'
      },
      {
        name: '系统配置',
        path: '/settings',
        icon: <Settings className="h-5 w-5" />,
        permission: 'system_config_view'
      }
    ]
  }
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

  // 加载用户权限
  useEffect(() => {
    const loadPermissions = async () => {
      if (profile) {
        const permissions = await getCurrentUserPermissions();
        setUserPermissions(permissions);
      }
      setLoading(false);
    };
    loadPermissions();
  }, [profile]);

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

  // 权限检查：超级管理员可以看到所有菜单，其他用户根据权限显示
  const canViewItem = (item: NavItem) => {
    // 超级管理员可以看到所有菜单
    if (isAdmin(profile)) return true;
    
    // 没有权限要求的菜单，所有人都可以看到
    if (!item.permission) return true;
    
    // 检查用户是否有该权限
    return userPermissions.includes(item.permission);
  };

  // 侧边栏内容组件（桌面端和移动端共用）
  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
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
        {navGroups.map((group, groupIndex) => {
          const visibleItems = group.items.filter(canViewItem);
          if (visibleItems.length === 0) return null;
          
          const isExpanded = expandedGroups[groupIndex] ?? true;

          return (
            <div key={groupIndex}>
              {group.title ? (
                // 有标题的分组：可折叠
                <div>
                  <button
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
                        
                        // 外部链接使用 <a> 标签
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
                        
                        // 内部链接使用 <Link> 组件
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
                // 无标题的分组：直接显示，不可折叠
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    // 外部链接使用 <a> 标签
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
                    
                    // 内部链接使用 <Link> 组件
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

  return (
    <>
      {/* 桌面端侧边栏 - 大屏幕直接显示 */}
      <aside className="hidden lg:block w-44 border-r border-border bg-sidebar shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* 移动端侧边栏 - 使用Sheet组件 */}
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
          <SidebarContent onItemClick={() => {
            // 点击菜单项后关闭Sheet
            const closeButton = document.querySelector('[data-sheet-close]') as HTMLButtonElement;
            closeButton?.click();
          }} />
        </SheetContent>
      </Sheet>
    </>
  );
}
