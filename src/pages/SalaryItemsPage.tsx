import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  Eye,
  FileText,
  Calendar,
  Building2,
  User
} from 'lucide-react';
import { 
  getSalaryItems,
  getCompanies,
  getSalaryRecords
} from '@/db/api';
import type { SalaryItem, Company, SalaryRecord } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function SalaryItemsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SalaryItem[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [companiesData, recordsData] = await Promise.all([
        getCompanies(),
        getSalaryRecords()
      ]);
      
      setCompanies(companiesData);
      setSalaryRecords(recordsData);
      
      // 加载所有工资条
      const itemsData = await getSalaryItems();
      setItems(itemsData);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 筛选工资条
  const filteredItems = items.filter(item => {
    // 公司筛选
    if (selectedCompanyId && selectedCompanyId !== 'all') {
      const record = salaryRecords.find(r => r.id === item.salary_record_id);
      if (!record || record.company_id !== selectedCompanyId) {
        return false;
      }
    }

    // 工资记录筛选
    if (selectedRecordId && selectedRecordId !== 'all' && item.salary_record_id !== selectedRecordId) {
      return false;
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.employee_name?.toLowerCase().includes(query) ||
        item.employee_name?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // 获取工资记录信息
  const getRecordInfo = (recordId: string) => {
    return salaryRecords.find(r => r.id === recordId);
  };

  // 获取公司名称
  const getCompanyName = (recordId: string) => {
    const record = salaryRecords.find(r => r.id === recordId);
    if (!record) return '-';
    const company = companies.find(c => c.id === record.company_id);
    return company?.name || '-';
  };

  // 下载PDF
  const handleDownloadPDF = (item: SalaryItem) => {
    if (!item.pdf_url) {
      toast.error('PDF文件不存在');
      return;
    }
    window.open(item.pdf_url, '_blank');
  };

  // 预览PDF
  const handlePreviewPDF = (item: SalaryItem) => {
    if (!item.pdf_url) {
      toast.error('PDF文件不存在');
      return;
    }
    window.open(item.pdf_url, '_blank');
  };

  // 获取可选的工资记录（根据选中的公司）
  const availableRecords = selectedCompanyId && selectedCompanyId !== 'all'
    ? salaryRecords.filter(r => r.company_id === selectedCompanyId)
    : salaryRecords;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold">工资条列表</h1>
          <p className="text-muted-foreground mt-2">
            查看和管理员工个人工资条
          </p>
        </div>

        {/* 筛选区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              筛选条件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 公司筛选 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">所属公司</label>
                <Select
                  value={selectedCompanyId}
                  onValueChange={(value) => {
                    setSelectedCompanyId(value);
                    setSelectedRecordId('all'); // 重置工资记录筛选
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="全部公司" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部公司</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 工资记录筛选 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">工资期间</label>
                <Select
                  value={selectedRecordId}
                  onValueChange={setSelectedRecordId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="全部期间" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部期间</SelectItem>
                    {availableRecords.map(record => (
                      <SelectItem key={record.id} value={record.id}>
                        {record.year}年{record.month}月
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 搜索 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">搜索员工</label>
                <Input
                  placeholder="搜索员工姓名..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 工资条列表 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                工资条列表
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                共 {filteredItems.length} 条记录
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 w-full bg-muted" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无工资条记录</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>员工姓名</TableHead>
                      <TableHead>所属公司</TableHead>
                      <TableHead>工资期间</TableHead>
                      <TableHead>实发工资</TableHead>
                      <TableHead>PDF状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map(item => {
                      const record = getRecordInfo(item.salary_record_id);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{item.employee_name || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {getCompanyName(item.salary_record_id)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {record ? `${record.year}年${record.month}月` : '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-primary">
                              ¥{item.total_amount?.toFixed(2) || '0.00'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {item.pdf_url ? (
                              <Badge variant="default" className="bg-green-500">
                                已生成
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                未生成
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {item.pdf_url && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePreviewPDF(item)}
                                    title="预览PDF"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownloadPDF(item)}
                                    title="下载PDF"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
