import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getReminderConfig, upsertReminderConfig, getCompanies, checkContractExpiry, checkPaydayAndSend } from '@/db/api';
import type { ReminderConfig, Company } from '@/types/types';
import { toast } from 'sonner';
import { Save, Bell, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { profile } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [config, setConfig] = useState<ReminderConfig | null>(null);
  const [formData, setFormData] = useState({
    contract_expiry_days: 30,
    renewal_notice_days: 7,
    enable_sms: true,
    enable_in_app: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      loadConfig();
    }
  }, [selectedCompanyId]);

  const loadCompanies = async () => {
    const data = await getCompanies();
    setCompanies(data);
    if (data.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(data[0].id);
    }
  };

  const loadConfig = async () => {
    if (!selectedCompanyId) return;
    
    const data = await getReminderConfig(selectedCompanyId);
    if (data) {
      setConfig(data);
      setFormData({
        contract_expiry_days: data.contract_expiry_days,
        renewal_notice_days: data.renewal_notice_days || 7,
        enable_sms: data.enable_sms,
        enable_in_app: data.enable_in_app
      });
    } else {
      setConfig(null);
      setFormData({
        contract_expiry_days: 30,
        renewal_notice_days: 7,
        enable_sms: true,
        enable_in_app: true
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompanyId) {
      toast.error('请选择公司');
      return;
    }

    setLoading(true);
    const success = await upsertReminderConfig({
      company_id: selectedCompanyId,
      ...formData
    });
    setLoading(false);

    if (success) {
      toast.success('保存成功');
      loadConfig();
    } else {
      toast.error('保存失败');
    }
  };

  const handleCheckExpiry = async () => {
    setLoading(true);
    toast.loading('正在检查合同到期情况...');
    
    const result = await checkContractExpiry();
    setLoading(false);
    
    toast.dismiss();
    
    if (result.success) {
      toast.success(`检查完成！找到 ${result.count || 0} 个即将到期的合同`);
    } else {
      toast.error(result.error || '检查失败');
    }
  };

  const handleCheckPayday = async () => {
    setLoading(true);
    toast.loading('正在检查发薪日并发送短信...');
    
    const result = await checkPaydayAndSend();
    setLoading(false);
    
    toast.dismiss();
    
    if (result.success) {
      toast.success(`检查完成！${result.companies || 0} 家公司发薪，共 ${result.totalEmployees || 0} 名员工，发送 ${result.totalSent || 0} 条短信`);
    } else {
      toast.error(result.error || '检查失败');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">系统配置</h1>
          <p className="text-muted-foreground mt-2">配置系统提醒和通知设置</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>提醒配置</CardTitle>
            <CardDescription>
              配置合同到期提醒和通知方式
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company">选择公司</Label>
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择公司" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract_expiry_days">合同到期提前提醒天数</Label>
                <Input
                  id="contract_expiry_days"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.contract_expiry_days}
                  onChange={(e) => setFormData({ ...formData, contract_expiry_days: parseInt(e.target.value) || 30 })}
                />
                <p className="text-sm text-muted-foreground">
                  在合同到期前多少天开始发送提醒通知
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="renewal_notice_days">续签通知提前天数</Label>
                <Input
                  id="renewal_notice_days"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.renewal_notice_days}
                  onChange={(e) => setFormData({ ...formData, renewal_notice_days: parseInt(e.target.value) || 7 })}
                />
                <p className="text-sm text-muted-foreground">
                  在合同到期前多少天自动发送续签通知
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable_in_app">站内信通知</Label>
                    <p className="text-sm text-muted-foreground">
                      在系统内发送通知消息
                    </p>
                  </div>
                  <Switch
                    id="enable_in_app"
                    checked={formData.enable_in_app}
                    onCheckedChange={(checked) => setFormData({ ...formData, enable_in_app: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable_sms">短信通知</Label>
                    <p className="text-sm text-muted-foreground">
                      通过短信发送提醒（需配置短信服务）
                    </p>
                  </div>
                  <Switch
                    id="enable_sms"
                    checked={formData.enable_sms}
                    onCheckedChange={(checked) => setFormData({ ...formData, enable_sms: checked })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading || !selectedCompanyId}>
                  <Save className="mr-2 h-4 w-4" />
                  保存配置
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={loading}
                  onClick={handleCheckExpiry}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  立即检查到期合同
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={loading}
                  onClick={handleCheckPayday}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  立即检查发薪日
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>第三方电子签集成</CardTitle>
            <CardDescription>
              配置第三方电子签署服务API接口
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api_endpoint">API端点</Label>
                <Input
                  id="api_endpoint"
                  placeholder="https://api.example.com"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_key">API密钥</Label>
                <Input
                  id="api_key"
                  type="password"
                  placeholder="请输入API密钥"
                  disabled
                />
              </div>
              <p className="text-sm text-muted-foreground">
                第三方电子签集成功能预留，待后续配置
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>第三方短信集成</CardTitle>
            <CardDescription>
              配置第三方短信服务API接口
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sms_api_endpoint">API端点</Label>
                <Input
                  id="sms_api_endpoint"
                  placeholder="https://api.example.com"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms_api_key">API密钥</Label>
                <Input
                  id="sms_api_key"
                  type="password"
                  placeholder="请输入API密钥"
                  disabled
                />
              </div>
              <p className="text-sm text-muted-foreground">
                第三方短信集成功能预留，待后续配置
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
