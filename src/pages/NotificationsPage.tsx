import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount } from '@/db/api';
import type { Notification } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadNotifications();
    }
  }, [profile]);

  const loadNotifications = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    const [notificationsData, count] = await Promise.all([
      getNotifications(profile.id as string),
      getUnreadNotificationCount(profile.id as string)
    ]);
    setNotifications(notificationsData);
    setUnreadCount(count);
    setLoading(false);
  };

  const handleMarkAsRead = async (id: string) => {
    const success = await markNotificationAsRead(id);
    if (success) {
      loadNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!profile?.id) return;
    
    const success = await markAllNotificationsAsRead(profile.id as string);
    if (success) {
      toast.success('已标记所有通知为已读');
      loadNotifications();
    } else {
      toast.error('操作失败');
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      contract_expiry: '合同到期',
      document_signing: '文书签署',
      employee_onboarding: '员工入职',
      system: '系统通知'
    };
    return labels[type] || type;
  };

  const getNotificationTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'contract_expiry':
        return 'destructive';
      case 'document_signing':
        return 'default';
      case 'employee_onboarding':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">通知中心</h1>
            <p className="text-muted-foreground mt-2">
              查看系统通知和提醒
              {unreadCount > 0 && (
                <span className="ml-2 text-primary font-medium">
                  ({unreadCount} 条未读)
                </span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              全部标记为已读
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>通知列表</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full bg-muted" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无通知</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.is_read
                        ? 'bg-background border-border'
                        : 'bg-accent/50 border-primary/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getNotificationTypeBadgeVariant(notification.type)}>
                            {getNotificationTypeLabel(notification.type)}
                          </Badge>
                          {!notification.is_read && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              未读
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium">{notification.title}</h3>
                        {notification.content && (
                          <p className="text-sm text-muted-foreground">
                            {notification.content}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
