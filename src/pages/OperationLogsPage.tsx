import { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { getOperationLogs, getAllProfiles } from '@/db/api';
import type { OperationLog, Profile, OperationType } from '@/types/types';
import { OPERATION_TYPE_LABELS } from '@/types/types';
import { Search, FileText, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function OperationLogsPage() {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Profile[]>([]);
  
  // 筛选条件
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedOperationType, setSelectedOperationType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, selectedUserId, selectedOperationType, startDate, endDate, searchKeyword]);

  const loadData = async () => {
    setLoading(true);
    const [logsData, usersData] = await Promise.all([
      getOperationLogs({ limit: 500 }),
      getAllProfiles()
    ]);
    setLogs(logsData);
    setUsers(usersData);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // 用户筛选
    if (selectedUserId) {
      filtered = filtered.filter(log => log.user_id === selectedUserId);
    }

    // 操作类型筛选
    if (selectedOperationType) {
      filtered = filtered.filter(log => log.operation_type === selectedOperationType);
    }

    // 日期范围筛选
    if (startDate) {
      filtered = filtered.filter(log => log.created_at >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(log => log.created_at <= endDate + 'T23:59:59');
    }

    // 关键词搜索
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(log =>
        log.operation_detail.toLowerCase().includes(keyword) ||
        log.user_name?.toLowerCase().includes(keyword)
      );
    }

    setFilteredLogs(filtered);
  };

  const handleReset = () => {
    setSelectedUserId('');
    setSelectedOperationType('');
    setStartDate('');
    setEndDate('');
    setSearchKeyword('');
  };

  const handleExport = () => {
    // 导出为CSV
    const headers = ['时间', '用户', '操作类型', '操作详情'];
    const rows = filteredLogs.map(log => [
      format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN }),
      log.user_name || '未知用户',
      OPERATION_TYPE_LABELS[log.operation_type as OperationType] || log.operation_type,
      log.operation_detail
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `操作日志_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    link.click();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">操作日志</h1>
            <p className="text-muted-foreground mt-2">
              查看系统所有操作记录
            </p>
          </div>
          <Button onClick={handleExport} disabled={filteredLogs.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            导出日志
          </Button>
        </div>

        {/* 筛选条件 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              筛选条件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>用户</Label>
                <Select value={selectedUserId || undefined} onValueChange={(value) => setSelectedUserId(value || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部用户" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id as string} value={user.id as string}>
                        {(user.full_name || user.username) as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>操作类型</Label>
                <Select value={selectedOperationType || undefined} onValueChange={(value) => setSelectedOperationType(value || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(OPERATION_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>开始日期</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>结束日期</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索操作详情或用户名..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Button variant="outline" onClick={handleReset}>
                重置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 日志列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              操作记录 ({filteredLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                暂无操作日志
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px] whitespace-nowrap">时间</TableHead>
                      <TableHead className="w-[120px] whitespace-nowrap">用户</TableHead>
                      <TableHead className="w-[120px] whitespace-nowrap">操作类型</TableHead>
                      <TableHead className="whitespace-nowrap">操作详情</TableHead>
                      <TableHead className="w-[120px] whitespace-nowrap">IP地址</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm whitespace-nowrap">
                          {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{log.user_name || '未知用户'}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                            {OPERATION_TYPE_LABELS[log.operation_type as OperationType] || log.operation_type}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-md truncate" title={log.operation_detail}>
                          {log.operation_detail}
                        </TableCell>
                        <TableCell className="font-mono text-sm whitespace-nowrap">
                          {log.ip_address || '-'}
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
