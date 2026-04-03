import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CompanySelector } from '@/components/ui/company-selector';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FileText, GripVertical } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getSalaryStructureTemplates,
  createSalaryStructureTemplate,
  updateSalaryStructureTemplate,
  deleteSalaryStructureTemplate,
  getCompanies
} from '@/db/api';
import type { SalaryStructureTemplate, SalaryStructureField, Company } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

export default function SalaryTemplatesPage() {
  const { profile } = useAuth();
  const [templates, setTemplates] = useState<SalaryStructureTemplate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SalaryStructureTemplate | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [formData, setFormData] = useState({
    company_id: '',
    name: '',
    description: '',
    fields: [] as SalaryStructureField[],
    is_default: false,
    is_universal: false // 是否为通用模板
  });
  const [newField, setNewField] = useState({
    name: '',
    code: '',
    type: 'number' as 'number' | 'text',
    required: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [templatesData, companiesData] = await Promise.all([
      getSalaryStructureTemplates(),
      getCompanies()
    ]);
    setTemplates(templatesData);
    setCompanies(companiesData);
    setLoading(false);
  };

  const handleOpenDialog = (template?: SalaryStructureTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        company_id: template.company_id || '',
        name: template.name,
        description: template.description || '',
        fields: template.fields || [],
        is_default: template.is_default,
        is_universal: template.is_universal || false
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        company_id: profile?.company_id?.toString() || '',
        name: '',
        description: '',
        fields: [],
        is_default: false,
        is_universal: false
      });
    }
    setDialogOpen(true);
  };

  const handleAddField = () => {
    if (!newField.name || !newField.code) {
      toast.error('请填写字段名称和代码');
      return;
    }

    // 检查代码是否重复
    if (formData.fields.some(f => f.code === newField.code)) {
      toast.error('字段代码已存在');
      return;
    }

    setFormData({
      ...formData,
      fields: [...formData.fields, { ...newField, order: formData.fields.length }]
    });

    setNewField({
      name: '',
      code: '',
      type: 'number',
      required: false
    });
  };

  const handleRemoveField = (index: number) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    // 验证：通用模板不需要company_id，普通模板需要
    if (!formData.is_universal && !formData.company_id) {
      toast.error('请选择所属公司或勾选"通用模板"');
      return;
    }
    
    if (!formData.name || formData.fields.length === 0) {
      toast.error('请填写模板名称并至少添加一个字段');
      return;
    }

    try {
      const submitData = {
        ...formData,
        company_id: formData.is_universal ? null : formData.company_id
      };
      
      if (editingTemplate) {
        await updateSalaryStructureTemplate(editingTemplate.id, submitData);
        toast.success('工资结构模板更新成功');
      } else {
        await createSalaryStructureTemplate(submitData);
        toast.success('工资结构模板创建成功');
      }
      setDialogOpen(false);
      loadData();
    } catch (error) {
      toast.error(editingTemplate ? '更新失败' : '创建失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个工资结构模板吗？')) {
      return;
    }

    try {
      await deleteSalaryStructureTemplate(id);
      toast.success('删除成功');
      loadData();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">工资结构模板</h1>
            <p className="text-muted-foreground mt-2">管理公司的工资结构模板，用于工资表自动拆分</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            创建模板
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>模板列表</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="搜索公司名称..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">暂无工资结构模板</p>
                <p className="text-sm mt-2">点击"创建模板"按钮开始创建</p>
              </div>
            ) : (() => {
              // 过滤模板
              const filteredTemplates = templates.filter(template => {
                if (!searchKeyword) return true;
                
                // 通用模板：根据模板名称和描述搜索
                if (template.is_universal) {
                  return template.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         '通用模板'.includes(searchKeyword);
                }
                
                // 公司模板：根据公司名称、模板名称和描述搜索
                const company = companies.find(c => c.id === template.company_id);
                return company?.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                       template.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                       template.description?.toLowerCase().includes(searchKeyword.toLowerCase());
              });

              return filteredTemplates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">未找到匹配的模板</p>
                  <p className="text-sm mt-2">请尝试其他关键词</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>模板名称</TableHead>
                    <TableHead>所属公司</TableHead>
                    <TableHead>字段数量</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => {
                    const company = companies.find(c => c.id === template.company_id);
                    return (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          {template.is_universal ? (
                            <Badge variant="secondary">通用模板</Badge>
                          ) : (
                            company?.name || '未知公司'
                          )}
                        </TableCell>
                        <TableCell>{template.fields?.length || 0} 个字段</TableCell>
                        <TableCell>
                          {template.is_default ? (
                            <Badge>默认模板</Badge>
                          ) : (
                            <Badge variant="outline">普通模板</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(template.created_at).toLocaleDateString('zh-CN')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              );
            })()}
          </CardContent>
        </Card>

        {/* 创建/编辑对话框 */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? '编辑工资结构模板' : '创建工资结构模板'}</DialogTitle>
              <DialogDescription>
                定义工资结构字段，用于自动拆分工资表
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* 通用模板选项 */}
              <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                <Checkbox
                  id="is_universal"
                  checked={formData.is_universal}
                  onCheckedChange={(checked) => {
                    setFormData({ 
                      ...formData, 
                      is_universal: checked as boolean,
                      company_id: checked ? '' : (profile?.company_id?.toString() || '')
                    });
                  }}
                />
                <div className="flex-1">
                  <Label htmlFor="is_universal" className="cursor-pointer font-medium">
                    设为通用模板
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    通用模板可被所有公司使用，不属于任何特定公司
                  </p>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_id">
                    所属公司 {!formData.is_universal && '*'}
                  </Label>
                  <CompanySelector
                    companies={companies}
                    value={formData.company_id}
                    onValueChange={(value) => setFormData({ ...formData, company_id: value })}
                    placeholder={formData.is_universal ? "通用模板（所有公司可用）" : "请选择公司"}
                    emptyText="未找到公司"
                    searchPlaceholder="搜索公司名称..."
                    disabled={formData.is_universal}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">模板名称 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：标准工资结构"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">模板描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="描述这个工资结构模板的用途"
                  rows={2}
                />
              </div>

              {/* 字段配置 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">工资结构字段</Label>
                  <Badge variant="secondary">{formData.fields.length} 个字段</Badge>
                </div>

                {/* 已添加的字段列表 */}
                {formData.fields.length > 0 && (
                  <div className="border rounded-lg p-4 space-y-2">
                    {formData.fields.map((field, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium">{field.name}</p>
                            <p className="text-xs text-muted-foreground">字段名称</p>
                          </div>
                          <div>
                            <p className="text-sm font-mono">{field.code}</p>
                            <p className="text-xs text-muted-foreground">字段代码</p>
                          </div>
                          <div>
                            <Badge variant="outline">{field.type === 'number' ? '数字' : '文本'}</Badge>
                            {field.required && <Badge variant="secondary" className="ml-2">必填</Badge>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 添加新字段 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">添加新字段</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="field_name">字段名称</Label>
                        <Input
                          id="field_name"
                          value={newField.name}
                          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                          placeholder="例如：基本工资"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field_code">字段代码</Label>
                        <Input
                          id="field_code"
                          value={newField.code}
                          onChange={(e) => setNewField({ ...newField, code: e.target.value })}
                          placeholder="例如：base_salary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field_type">字段类型</Label>
                        <Select
                          value={newField.type}
                          onValueChange={(value: 'number' | 'text') => setNewField({ ...newField, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="number">数字</SelectItem>
                            <SelectItem value="text">文本</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleAddField} className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          添加字段
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit}>
                {editingTemplate ? '保存' : '创建'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
