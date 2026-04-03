import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/db/supabase';
import type { RecruitmentOverview, RecruitmentStatistics } from '@/types/types';
import { Search, TrendingUp, Users, MapPin, Briefcase, DollarSign, GraduationCap, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function RecruitmentQueryPage() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<RecruitmentOverview | null>(null);
  const [statisticsData, setStatisticsData] = useState<RecruitmentStatistics | null>(null);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError('请输入企业名称、统一信用代码或注册号');
      return;
    }

    setLoading(true);
    setError('');
    setOverviewData(null);
    setStatisticsData(null);

    try {
      // 并行查询概况和统计数据
      const [overviewRes, statisticsRes] = await Promise.all([
        supabase.functions.invoke('enterprise-recruitment', {
          body: { keyword: keyword.trim(), type: 'overview' }
        }),
        supabase.functions.invoke('enterprise-recruitment', {
          body: { keyword: keyword.trim(), type: 'statistics' }
        })
      ]);

      // 处理概况数据
      if (overviewRes.error) {
        console.error('招聘概况查询错误:', overviewRes.error);
      } else if (overviewRes.data?.success) {
        setOverviewData(overviewRes.data.data);
      } else if (overviewRes.data?.code === 201) {
        setError('未查询到该企业的招聘概况数据');
      }

      // 处理统计数据
      if (statisticsRes.error) {
        console.error('招聘统计查询错误:', statisticsRes.error);
      } else if (statisticsRes.data?.success) {
        setStatisticsData(statisticsRes.data.data);
      } else if (statisticsRes.data?.code === 201) {
        if (!overviewData) {
          setError('未查询到该企业的招聘数据');
        }
      }

      // 如果两个都失败
      if ((!overviewRes.data?.success || overviewRes.error) && 
          (!statisticsRes.data?.success || statisticsRes.error)) {
        setError('查询失败，请检查企业名称是否正确或稍后重试');
      }

    } catch (err) {
      console.error('查询错误:', err);
      setError('查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">企业招聘数据查询</h1>
          <p className="text-muted-foreground mt-2">
            查询企业的招聘概况和详细统计数据
          </p>
        </div>

        {/* 搜索框 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              查询企业
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="keyword">企业名称 / 统一信用代码 / 注册号</Label>
                <Input
                  id="keyword"
                  placeholder="例如：北京百度网讯科技有限公司"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-2"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? '查询中...' : '查询'}
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 加载状态 */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full bg-muted" />
            <Skeleton className="h-96 w-full bg-muted" />
          </div>
        )}

        {/* 结果展示 */}
        {!loading && (overviewData || statisticsData) && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">招聘概况</TabsTrigger>
              <TabsTrigger value="statistics">详细统计</TabsTrigger>
            </TabsList>

            {/* 招聘概况 */}
            <TabsContent value="overview" className="space-y-4">
              {overviewData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          职位数量
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{overviewData.titleCnt}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          更新时间: {overviewData.titleModifyDate}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          平均薪资
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">¥{overviewData.avgSal}</div>
                        <p className="text-xs text-muted-foreground mt-1">元/月</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-600" />
                          城市数量
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{overviewData.cityCnt || overviewData.city.split('、').length}</div>
                        <p className="text-xs text-muted-foreground mt-1">个城市</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          招聘来源
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm font-medium">{overviewData.src.split('、')[0]}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          等{overviewData.src.split('、').length}个平台
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>职位信息</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-muted-foreground">职位关键词</Label>
                          <p className="mt-1">{overviewData.titleKw}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">职位类型</Label>
                          <p className="mt-1">{overviewData.titleType}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">职位级别</Label>
                          <p className="mt-1">{overviewData.titleLevel}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>地域分布</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <Label className="text-muted-foreground">招聘城市</Label>
                          <p className="mt-1">{overviewData.city}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    暂无招聘概况数据
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* 详细统计 */}
            <TabsContent value="statistics" className="space-y-4">
              {statisticsData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          总招聘数量
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{statisticsData.zpnumber}</div>
                        <p className="text-xs text-muted-foreground mt-1">个职位</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          平均薪资
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{statisticsData.avgSalStr}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          约¥{Math.round(statisticsData.avgSal)}/月
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                          本科学历占比
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{statisticsData.bkEducation}</div>
                        <p className="text-xs text-muted-foreground mt-1">本科及以上</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          3-5年经验占比
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{statisticsData.btw3and5Years}</div>
                        <p className="text-xs text-muted-foreground mt-1">工作经验</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 学历分布 */}
                    {statisticsData.educationList && statisticsData.educationList.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>学历分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={statisticsData.educationList}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ key, percent }) => `${key} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {statisticsData.educationList.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}

                    {/* 薪资区间分布 */}
                    {statisticsData.salaryList && statisticsData.salaryList.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>薪资区间分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statisticsData.salaryList}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="key" angle={-45} textAnchor="end" height={80} />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}

                    {/* 工作年限分布 */}
                    {statisticsData.yearsList && statisticsData.yearsList.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>工作年限分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statisticsData.yearsList}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="key" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#10b981" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    暂无详细统计数据
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
}
