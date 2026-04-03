import { isSuperAdmin } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDocumentTemplates, getCompanies, createDocumentTemplate, updateDocumentTemplate, deleteDocumentTemplate } from '@/db/api';
import { DOCUMENT_CATEGORY_LABELS, DOCUMENT_CATEGORY_LABELS_WITH_UNIVERSAL, DOCUMENT_TEMPLATE_NAMES, DocumentCategoryWithUniversal } from '@/types/types';
import type { DocumentTemplate, Company, DocumentCategory } from '@/types/types';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search, Check, ChevronsUpDown, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/db/supabase';

export default function TemplatesPage() {
  const { profile } = useAuth();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false);
  const [formCompanyPopoverOpen, setFormCompanyPopoverOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategoryWithUniversal>('onboarding');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    company_id: '',
    name: '',
    category: 'onboarding' as DocumentCategory,
    content: '',
    requires_company_signature: false,
    is_universal: false
  });

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    setLoading(true);
    const companyId = isSuperAdmin(profile) ? undefined : (profile?.company_id as string | undefined);
    const [templatesData, companiesData] = await Promise.all([
      getDocumentTemplates(companyId as string | undefined),
      getCompanies()
    ]);
    setTemplates(templatesData);
    setCompanies(companiesData);
    setLoading(false);
  };

  const handleOpenDialog = (template?: DocumentTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        company_id: template.company_id || '',
        name: template.name,
        category: template.category,
        content: template.content || '',
        requires_company_signature: template.requires_company_signature,
        is_universal: !template.company_id // company_id为null表示通用模板
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        company_id: (profile?.company_id || '') as string,
        name: '',
        category: selectedCategory,
        content: '',
        requires_company_signature: false,
        is_universal: false
      });
    }
    setUploadedFile(null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('仅支持 Word、PDF、Excel 格式的文件');
        return;
      }
      
      setUploadedFile(file);
      toast.success(`已选择文件：${file.name}`);
    }
  };

  const uploadFileToStorage = async (file: File): Promise<string | null> => {
    try {
      console.log('开始上传文件到Storage:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `templates/${fileName}`;

      console.log('上传路径:', filePath);

      const { data, error } = await supabase.storage
        .from('document-templates')
        .upload(filePath, file);

      if (error) {
        console.error('Storage上传错误:', {
          error_code: error.message,
          error_name: error.name,
          file_path: filePath
        });
        toast.error('文件上传失败：' + error.message);
        return null;
      }

      console.log('Storage上传成功:', data);

      const { data: urlData } = supabase.storage
        .from('document-templates')
        .getPublicUrl(filePath);

      console.log('获取公开URL成功:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('上传文件异常:', error);
      toast.error('上传文件失败，请稍后重试');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 如果不是通用模板，则必须选择公司
    if (!formData.is_universal && !formData.company_id) {
      toast.error('请选择所属公司或设为通用模板');
      return;
    }

    if (!formData.name) {
      toast.error('请填写模板名称');
      return;
    }

    // 如果有新上传的文件，先上传
    let fileUrl: string | null = formData.content;
    if (uploadedFile) {
      setUploading(true);
      console.log('开始上传文件:', uploadedFile.name, '大小:', uploadedFile.size);
      fileUrl = await uploadFileToStorage(uploadedFile);
      setUploading(false);
      
      if (!fileUrl) {
        console.error('文件上传失败，返回null');
        toast.error('文件上传失败，请检查文件格式和大小');
        return;
      }
      console.log('文件上传成功，URL:', fileUrl);
    }

    // 准备提交数据，移除is_universal字段（这只是UI状态，不存储到数据库）
    const { is_universal, ...dataToSubmit } = formData;
    const submitData = {
      ...dataToSubmit,
      company_id: is_universal ? null : formData.company_id, // 通用模板的company_id为null
      content: fileUrl || null,
      is_active: true
    };

    console.log('准备提交模板数据:', {
      ...submitData,
      content: submitData.content ? '(文件URL已设置)' : '(无文件)'
    });

    if (editingTemplate) {
      const success = await updateDocumentTemplate(editingTemplate.id, submitData);
      if (success) {
        toast.success('更新成功');
        setDialogOpen(false);
        loadData();
      } else {
        console.error('更新模板失败');
        toast.error('更新失败，请稍后重试');
      }
    } else {
      const result = await createDocumentTemplate(submitData);
      if (result) {
        console.log('模板创建成功:', result);
        toast.success('创建成功');
        setDialogOpen(false);
        loadData();
      } else {
        console.error('创建模板失败，返回null');
        toast.error('创建失败，请检查网络连接或联系管理员');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个模板吗？')) return;

    const success = await deleteDocumentTemplate(id);
    if (success) {
      toast.success('删除成功');
      loadData();
    } else {
      toast.error('删除失败');
    }
  };

  const getTemplatesByCategory = (category: DocumentCategoryWithUniversal) => {
    let filteredTemplates: DocumentTemplate[];
    
    // 如果是通用模板分类，返回所有company_id为null的模板
    if (category === 'universal') {
      filteredTemplates = templates.filter(t => t.company_id === null);
    } else {
      // 否则按正常分类过滤
      filteredTemplates = templates.filter(t => t.category === category);
      
      // 如果选择了公司，只显示该公司的模板
      if (selectedCompanyId) {
        filteredTemplates = filteredTemplates.filter(t => t.company_id === selectedCompanyId);
      }
    }
    
    return filteredTemplates;
  };

  const getSelectedCompanyName = () => {
    if (!selectedCompanyId) return null;
    return companies.find(c => c.id === selectedCompanyId)?.name;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">文书模板管理</h1>
            <p className="text-muted-foreground mt-2">管理各类人力资源文书模板</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                添加模板
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingTemplate ? '编辑模板' : '添加模板'}</DialogTitle>
                  <DialogDescription>
                    {editingTemplate ? '修改文书模板信息' : '创建新的文书模板'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_id">所属公司 {!formData.is_universal && '*'}</Label>
                    <Popover open={formCompanyPopoverOpen} onOpenChange={setFormCompanyPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={formCompanyPopoverOpen}
                          className="w-full justify-between"
                          disabled={formData.is_universal}
                        >
                          {formData.is_universal
                            ? "通用模板（所有公司可用）"
                            : formData.company_id
                            ? companies.find((company) => company.id === formData.company_id)?.name
                            : "选择公司"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[500px] p-0">
                        <Command>
                          <CommandInput placeholder="搜索公司名称..." />
                          <CommandList>
                            <CommandEmpty>未找到匹配的公司</CommandEmpty>
                            <CommandGroup>
                              {companies.map((company) => (
                                <CommandItem
                                  key={company.id}
                                  value={company.name}
                                  onSelect={() => {
                                    setFormData({ ...formData, company_id: company.id });
                                    setFormCompanyPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.company_id === company.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {company.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_universal"
                      checked={formData.is_universal}
                      onCheckedChange={(checked) => {
                        setFormData({ 
                          ...formData, 
                          is_universal: checked as boolean,
                          company_id: checked ? '' : formData.company_id // 如果设为通用模板，清空公司选择
                        });
                      }}
                    />
                    <Label
                      htmlFor="is_universal"
                      className="text-sm font-normal cursor-pointer"
                    >
                      设为通用模板（所有公司可用）
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">文书分类 *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as DocumentCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label as string}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">模板名称 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="请输入模板名称"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">模板附件</Label>
                    <div className="space-y-2">
                      <Input
                        id="file"
                        type="file"
                        accept=".doc,.docx,.pdf,.xls,.xlsx"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        支持 Word、PDF、Excel 格式，不限制文件大小
                      </p>
                      {uploadedFile && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          <span>已选择：{uploadedFile.name}</span>
                        </div>
                      )}
                      {formData.content && !uploadedFile && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4" />
                          <a 
                            href={formData.content} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            查看当前附件
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requires_company_signature"
                      checked={formData.requires_company_signature}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, requires_company_signature: checked as boolean })
                      }
                    />
                    <Label htmlFor="requires_company_signature" className="cursor-pointer">
                      需要公司签署（劳动合同等双方签署文书）
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? '上传中...' : (editingTemplate ? '保存' : '创建')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 公司筛选器 */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Label className="text-sm font-medium mb-2 block">筛选公司</Label>
            <Popover open={companyPopoverOpen} onOpenChange={setCompanyPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={companyPopoverOpen}
                  className="w-full justify-between"
                >
                  {selectedCompanyId
                    ? companies.find((company) => company.id === selectedCompanyId)?.name
                    : "选择公司查看文书模板"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="搜索公司名称..." />
                  <CommandList>
                    <CommandEmpty>未找到匹配的公司</CommandEmpty>
                    <CommandGroup>
                      {companies.map((company) => (
                        <CommandItem
                          key={company.id}
                          value={company.name}
                          onSelect={() => {
                            setSelectedCompanyId(company.id);
                            setCompanyPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCompanyId === company.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {company.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {selectedCompanyId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCompanyId('')}
              className="mt-6"
            >
              <X className="mr-2 h-4 w-4" />
              清除筛选
            </Button>
          )}
        </div>

        {selectedCompanyId && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <span className="font-medium">当前查看：</span>
              <span className="text-primary font-semibold">{getSelectedCompanyName()}</span>
              <span className="text-muted-foreground">的文书模板</span>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>文书模板列表</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as DocumentCategoryWithUniversal)}>
              <TabsList className="grid w-full grid-cols-6">
                {Object.entries(DOCUMENT_CATEGORY_LABELS_WITH_UNIVERSAL).map(([key, label]) => (
                  <TabsTrigger key={key} value={key}>
                    {label as string}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.keys(DOCUMENT_CATEGORY_LABELS_WITH_UNIVERSAL).map((category) => (
                <TabsContent key={category} value={category} className="mt-4">
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full bg-muted" />
                      ))}
                    </div>
                  ) : getTemplatesByCategory(category as DocumentCategoryWithUniversal).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {category === 'universal' 
                        ? '暂无通用模板' 
                        : selectedCompanyId 
                        ? '该公司在此分类下暂无模板' 
                        : '该分类下暂无模板'}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>模板名称</TableHead>
                          <TableHead>所属公司</TableHead>
                          <TableHead>签署方式</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getTemplatesByCategory(category as DocumentCategory).map((template) => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">{template.name}</TableCell>
                            <TableCell>
                              {template.company_id ? (
                                template.company?.name || '-'
                              ) : (
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  通用模板
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={template.requires_company_signature ? 'default' : 'secondary'}>
                                {template.requires_company_signature ? '双方签署' : '单方签署'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenDialog(template)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(template.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
