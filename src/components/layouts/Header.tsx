import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, BookOpen, Bell } from 'lucide-react';
import { USER_ROLE_LABELS, type UserRole } from '@/types/types';
import { useEffect, useState } from 'react';
import { getUnreadNotificationCount } from '@/db/api';

export function Header() {
  const { profile, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (profile?.id) {
      loadUnreadCount();
      // 每30秒刷新一次未读数量
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const loadUnreadCount = async () => {
    if (!profile?.id) return;
    const count = await getUnreadNotificationCount(profile.id as string);
    setUnreadCount(count);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitial = (): string => {
    if (profile?.full_name) {
      return (profile.full_name as string).charAt(0).toUpperCase();
    }
    if (profile?.username) {
      return (profile.username as string).charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* 移动端：为汉堡菜单留出空间 */}
        <div className="lg:hidden w-10" />
        
        <div className="flex-1 flex items-center gap-2">
          {/* 使用手册按钮 */}
          <Button variant="outline" size="sm" asChild>
            <Link to="/user-manual" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">使用手册</span>
            </Link>
          </Button>
          
          {/* 通知按钮 */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-sm">
                <span className="font-medium">{(profile?.full_name || profile?.username) as string}</span>
                <span className="text-xs text-muted-foreground">
                  {profile?.role_name || (profile?.role ? USER_ROLE_LABELS[profile.role as UserRole] : '')}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{(profile?.full_name || profile?.username) as string}</p>
                <p className="text-xs text-muted-foreground">
                  {profile?.role_name || (profile?.role ? USER_ROLE_LABELS[profile.role as UserRole] : '')}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                个人资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
