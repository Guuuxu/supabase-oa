import { isSuperAdmin } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats, getAllProfiles } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  UserCheck, 
  FileSignature, 
  AlertCircle, 
  Building2, 
  BuildingIcon,
  Wallet,
  Clock,
  CalendarCheck,
  FileCheck
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Profile } from '@/types/types';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeEmployees: 0,
    pendingSignings: 0,
    expiringContracts: 0,
    expiringCompanies: 0,
    expiredCompanies: 0,
    totalSalaryRecords: 0,
    pendingSalarySignatures: 0,
    totalAttendanceRecords: 0,
    pendingAttendanceSignatures: 0
  });
  const [loading, setLoading] = useState(true);
  const [targetUser, setTargetUser] = useState<Profile | null>(null);

  useEffect(() => {
    loadStats();
    if (userId) {
      loadTargetUser();
    }
  }, [profile, userId]);

  const loadTargetUser = async () => {
    if (!userId) return;
    const users = await getAllProfiles();
    const user = users.find(u => u.id === userId);
    setTargetUser(user || null);
  };

  const loadStats = async () => {
    setLoading(true);
    // 如果指定了userId，只查询该用户的数据，不限制companyId
    if (userId) {
      const data = await getDashboardStats(undefined, userId);
      setStats(data);
    } else {
      // 否则根据当前用户权限查询
      const companyId = isSuperAdmin(profile) ? undefined : (profile?.company_id as string | undefined);
      const data = await getDashboardStats(companyId, undefined);
      setStats(data);
    }
    setLoading(false);
  };

  const statCards = [
    {
      title: '公司总数',
      value: stats.totalCompanies,
      icon: <Building2 className="h-8 w-8 text-primary" />,
      description: '系统中的公司总数',
      link: '/companies'
    },
    {
      title: '在职员工',
      value: stats.activeEmployees,
      icon: <UserCheck className="h-8 w-8 text-chart-2" />,
      description: '当前在职状态的员工',
      link: '/employees?status=active'
    },
    {
      title: '待签署文书',
      value: stats.pendingSignings,
      icon: <FileSignature className="h-8 w-8 text-chart-4" />,
      description: '等待签署的文书数量',
      link: '/signings?status=pending'
    },
    {
      title: '即将到期合同',
      value: stats.expiringContracts,
      icon: <AlertCircle className="h-8 w-8 text-destructive" />,
      description: '30天内到期的劳动合同',
      link: '/employees?expiring=30'
    },
    {
      title: '即将到期公司',
      value: stats.expiringCompanies,
      icon: <Building2 className="h-8 w-8 text-chart-3" />,
      description: '3个月内服务到期的公司',
      link: '/companies?expiring=90'
    },
    {
      title: '已到期公司',
      value: stats.expiredCompanies,
      icon: <BuildingIcon className="h-8 w-8 text-destructive" />,
      description: '服务已到期的公司',
      link: '/companies?expired=true'
    },
    {
      title: '工资记录总数',
      value: stats.totalSalaryRecords,
      icon: <Wallet className="h-8 w-8 text-chart-1" />,
      description: '系统中的工资记录总数',
      link: '/salary-records'
    },
    {
      title: '待签署工资条',
      value: stats.pendingSalarySignatures,
      icon: <Clock className="h-8 w-8 text-chart-5" />,
      description: '等待员工签署的工资条',
      link: '/salary-signing'
    },
    {
      title: '考勤记录总数',
      value: stats.totalAttendanceRecords,
      icon: <CalendarCheck className="h-8 w-8 text-chart-3" />,
      description: '系统中的考勤记录总数',
      link: '/attendance'
    },
    {
      title: '待签署考勤表',
      value: stats.pendingAttendanceSignatures,
      icon: <FileCheck className="h-8 w-8 text-chart-4" />,
      description: '等待员工签署的考勤确认表',
      link: '/signing-status'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">数据看板</h1>
            {targetUser && (
              <Badge variant="secondary" className="px-3 py-1.5 text-base">
                {String(targetUser.full_name || targetUser.username)}的数据
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2">
            {targetUser 
              ? `正在查看 ${targetUser.full_name || targetUser.username} 的数据统计`
              : `欢迎回来，${(profile?.full_name || profile?.username) as string}`
            }
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card, index) => (
            <Link key={index} to={card.link} className="block transition-transform hover:scale-105">
              <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium whitespace-nowrap">
                    {card.title}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20 bg-muted" />
                  ) : (
                    <div className="text-2xl font-bold">{card.value}</div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <a
                href="/employees"
                className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Users className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">员工管理</span>
              </a>
              <a
                href="/signings"
                className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <FileSignature className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">发起签署</span>
              </a>
              <a
                href="/templates"
                className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <FileSignature className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">文书模板</span>
              </a>
              <a
                href="/companies"
                className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">公司管理</span>
              </a>
              <a
                href="/salary-records"
                className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Wallet className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">工资表管理</span>
              </a>
              <a
                href="/salary-signatures"
                className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <FileCheck className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">薪酬签署</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
