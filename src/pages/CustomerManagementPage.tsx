import { useEffect, useState, useMemo } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getCompanies } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { Company } from '@/types/types';
import { Search, AlertCircle, TrendingUp, Users, Building2, FileSignature } from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Company[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 筛选条件
  const [searchKeyword, setSearchKeyword] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [scaleFilter, setScaleFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [customers, searchKeyword, industryFilter, regionFilter, scaleFilter, expiryFilter]);

  const loadData = async () => {
    setLoading(true);
    const companiesData = await getCompanies();
    
    // 获取每个公司的签章次数
    const companiesWithSignatures = await Promise.all(
      companiesData.map(async (company) => {
        const { count } = await supabase
          .from('signing_records')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id);
        
        return {
          ...company,
          signature_count: count || 0
        };
      })
    );
    
    setCustomers(companiesWithSignatures);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...customers];

    // 按公司名称筛选
    if (searchKeyword) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 按行业筛选
    if (industryFilter !== 'all') {
      filtered = filtered.filter(c => c.industry === industryFilter);
    }

    // 按地域筛选
    if (regionFilter !== 'all') {
      filtered = filtered.filter(c => c.region === regionFilter);
    }

    // 按员工规模筛选
    if (scaleFilter !== 'all') {
      filtered = filtered.filter(c => c.employee_scale === scaleFilter);
    }

    // 按到期时间筛选
    if (expiryFilter !== 'all') {
      const today = new Date();
      filtered = filtered.filter(c => {
        if (!c.service_end_date) return false;
        const endDate = new Date(c.service_end_date);
        const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (expiryFilter === 'expired') {
          return daysUntilExpiry < 0;
        } else if (expiryFilter === '30days') {
          return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
        } else if (expiryFilter === '90days') {
          return daysUntilExpiry > 30 && daysUntilExpiry <= 90;
        } else if (expiryFilter === 'normal') {
          return daysUntilExpiry > 90;
        }
        return true;
      });
    }

    setFilteredCustomers(filtered);
  };

  // 点击统计卡片，跳转到对应筛选的客户列表
  const handleCardClick = (filterType: 'all' | 'expiring' | 'expired' | 'signatures') => {
    // 清空其他筛选条件
    setSearchKeyword('');
    setIndustryFilter('all');
    setRegionFilter('all');
    setScaleFilter('all');

    // 根据点击的卡片设置对应的筛选条件
    if (filterType === 'all') {
      // 显示所有客户
      setExpiryFilter('all');
    } else if (filterType === 'expiring') {
      // 显示即将到期的客户（30天内）
      setExpiryFilter('30days');
    } else if (filterType === 'expired') {
      // 显示已到期的客户
      setExpiryFilter('expired');
    } else if (filterType === 'signatures') {
      // 显示所有客户（按签章次数排序）
      setExpiryFilter('all');
    }

    // 滚动到客户列表
    setTimeout(() => {
      const listElement = document.getElementById('customer-list');
      if (listElement) {
        listElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const getServiceStatusBadge = (status: string) => {
    switch (status) {
      case '服务中':
        return <Badge variant="default">服务中</Badge>;
      case '已到期':
        return <Badge variant="destructive">已到期</Badge>;
      case '已暂停':
        return <Badge variant="secondary">已暂停</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 更新服务状态
  const handleUpdateServiceStatus = async (companyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        // @ts-ignore - Supabase类型推断问题
        .update({ service_status: newStatus })
        .eq('id', companyId);

      if (error) throw error;

      // 更新本地状态
      setCustomers(prev => prev.map(c => 
        c.id === companyId ? { ...c, service_status: newStatus } : c
      ));

      toast.success('服务状态更新成功');
    } catch (error) {
      console.error('更新服务状态失败:', error);
      toast.error('更新服务状态失败');
    }
  };

  const isServiceExpiring = (endDate?: string) => {
    if (!endDate) return false;
    const today = new Date();
    const end = new Date(endDate);
    const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isServiceExpired = (endDate?: string) => {
    if (!endDate) return false;
    const today = new Date();
    const end = new Date(endDate);
    return end < today;
  };

  // 获取唯一的行业列表
  const industries = Array.from(new Set(customers.map(c => c.industry).filter(Boolean)));
  
  // 获取唯一的地域列表
  const regions = Array.from(new Set(customers.map(c => c.region).filter(Boolean)));

  // 计算统计数据
  const statistics = useMemo(() => {
    const total = customers.length;
    const activeCount = customers.filter(c => c.service_status === '服务中').length;
    const expiredCount = customers.filter(c => c.service_status === '已到期').length;
    const pausedCount = customers.filter(c => c.service_status === '已暂停').length;
    
    // 即将到期（30天内）
    const expiringCount = customers.filter(c => {
      if (!c.service_end_date) return false;
      const today = new Date();
      const end = new Date(c.service_end_date);
      const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    }).length;

    // 总签章次数
    const totalSignatures = customers.reduce((sum, c) => sum + (c.signature_count || 0), 0);

    return {
      total,
      activeCount,
      expiredCount,
      pausedCount,
      expiringCount,
      totalSignatures
    };
  }, [customers]);

  // 服务状态分布数据
  const serviceStatusData = useMemo(() => [
    { name: '服务中', value: statistics.activeCount, color: 'hsl(var(--primary))' },
    { name: '已到期', value: statistics.expiredCount, color: 'hsl(var(--destructive))' },
    { name: '已暂停', value: statistics.pausedCount, color: 'hsl(var(--muted))' }
  ], [statistics]);

  // 行业分布数据
  const industryData = useMemo(() => {
    const industryCount = new Map<string, number>();
    customers.forEach(c => {
      const industry = c.industry || '其他';
      industryCount.set(industry, (industryCount.get(industry) || 0) + 1);
    });
    return Array.from(industryCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [customers]);

  // 地域分布数据
  const regionData = useMemo(() => {
    const regionCount = new Map<string, number>();
    customers.forEach(c => {
      const region = c.region || '其他';
      regionCount.set(region, (regionCount.get(region) || 0) + 1);
    });
    return Array.from(regionCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [customers]);

  // 员工规模分布数据
  const scaleData = useMemo(() => {
    const scaleOrder = ['小于10人', '10-30人', '30-50人', '50-100人', '大于100人'];
    const scaleColors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))'
    ];
    const scaleCount = new Map<string, number>();
    customers.forEach(c => {
      const scale = c.employee_scale || '小于10人';
      scaleCount.set(scale, (scaleCount.get(scale) || 0) + 1);
    });
    return scaleOrder.map((scale, index) => ({
      name: scale,
      value: scaleCount.get(scale) || 0,
      color: scaleColors[index]
    }));
  }, [customers]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">客户管理</h1>
          <p className="text-muted-foreground mt-2">
            管理客户信息、服务状态和签章数据
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('all')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">客户总数</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                服务中 {statistics.activeCount} 家
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('expiring')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">即将到期</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{statistics.expiringCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                30天内到期客户
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('expired')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已到期</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{statistics.expiredCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                需要续约的客户
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('signatures')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总签章次数</CardTitle>
              <FileSignature className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalSignatures}</div>
              <p className="text-xs text-muted-foreground mt-1">
                累计签章数据
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 图表区域 */}
        {customers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>服务状态分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value, percent }) => 
                      value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : ''
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>员工规模分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scaleData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scaleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>行业分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={industryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="客户数量" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>地域分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name"
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" name="客户数量" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无客户数据，无法生成图表</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>筛选条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">公司名称</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="搜索公司名称..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">行业</Label>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger id="industry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部行业</SelectItem>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry!}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">地域</Label>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger id="region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部地域</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region!}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scale">员工规模</Label>
                <Select value={scaleFilter} onValueChange={setScaleFilter}>
                  <SelectTrigger id="scale">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部规模</SelectItem>
                    <SelectItem value="小于10人">小于10人</SelectItem>
                    <SelectItem value="10-30人">10-30人</SelectItem>
                    <SelectItem value="30-50人">30-50人</SelectItem>
                    <SelectItem value="50-100人">50-100人</SelectItem>
                    <SelectItem value="大于100人">大于100人</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry">到期时间</Label>
                <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                  <SelectTrigger id="expiry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="expired">已到期</SelectItem>
                    <SelectItem value="30days">30天内到期</SelectItem>
                    <SelectItem value="90days">31-90天到期</SelectItem>
                    <SelectItem value="normal">90天以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="customer-list">
          <CardHeader>
            <CardTitle>客户列表（共 {filteredCustomers.length} 家）</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">加载中...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">暂无客户数据</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">公司名称</TableHead>
                      <TableHead className="w-[120px]">行业</TableHead>
                      <TableHead className="w-[120px]">地域</TableHead>
                      <TableHead className="w-[100px]">员工规模</TableHead>
                      <TableHead className="w-[120px]">创建时间</TableHead>
                      <TableHead className="w-[120px]">服务开始</TableHead>
                      <TableHead className="w-[120px]">服务结束</TableHead>
                      <TableHead className="w-[100px]">服务状态</TableHead>
                      <TableHead className="w-[100px]">签章次数</TableHead>
                      <TableHead className="w-[120px]">联系人</TableHead>
                      <TableHead className="w-[120px]">联系电话</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {customer.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {customer.industry || '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {customer.region || '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {customer.employee_scale || '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {customer.service_start_date || '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {customer.service_end_date ? (
                            <div className="flex items-center gap-1">
                              {(isServiceExpiring(customer.service_end_date) || isServiceExpired(customer.service_end_date)) && (
                                <AlertCircle className="h-4 w-4 text-destructive" />
                              )}
                              <span className={
                                isServiceExpired(customer.service_end_date) 
                                  ? 'text-destructive font-semibold' 
                                  : isServiceExpiring(customer.service_end_date)
                                  ? 'text-orange-500 font-semibold'
                                  : ''
                              }>
                                {customer.service_end_date}
                              </span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Select
                            value={customer.service_status}
                            onValueChange={(value) => handleUpdateServiceStatus(customer.id, value)}
                          >
                            <SelectTrigger className="w-[110px] h-8">
                              <SelectValue>
                                {customer.service_status === '服务中' && (
                                  <Badge variant="default" className="cursor-pointer">服务中</Badge>
                                )}
                                {customer.service_status === '已到期' && (
                                  <Badge variant="destructive" className="cursor-pointer">已到期</Badge>
                                )}
                                {customer.service_status === '已暂停' && (
                                  <Badge variant="secondary" className="cursor-pointer">已暂停</Badge>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="服务中">
                                <Badge variant="default">服务中</Badge>
                              </SelectItem>
                              <SelectItem value="已到期">
                                <Badge variant="destructive">已到期</Badge>
                              </SelectItem>
                              <SelectItem value="已暂停">
                                <Badge variant="secondary">已暂停</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-center">
                          <Badge variant="outline">{customer.signature_count || 0}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {customer.contact_person || '-'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {customer.contact_phone || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
