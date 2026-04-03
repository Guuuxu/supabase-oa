import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Building2, User, Users, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function VerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // 身份证二要素认证
  const [idCardForm, setIdCardForm] = useState({
    idcard: '',
    name: ''
  });
  const [idCardResult, setIdCardResult] = useState<any>(null);

  const handleIdCardVerify = async () => {
    if (!idCardForm.idcard || !idCardForm.name) {
      toast.error('请填写完整信息');
      return;
    }

    setIsLoading(true);
    setIdCardResult(null);

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/idcard-verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(idCardForm)
      });

      const data = await response.json();

      if (data.error) {
        toast.error('认证失败：' + data.error);
        return;
      }

      setIdCardResult(data);
      
      if (data.showapi_res_body?.code === 0) {
        toast.success('身份证认证通过');
      } else {
        toast.error('身份证认证失败：' + data.showapi_res_body?.msg);
      }
    } catch (error) {
      console.error('身份证认证错误:', error);
      toast.error('认证失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 企业三要素认证
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    creditNo: '',
    legalPerson: ''
  });
  const [companyResult, setCompanyResult] = useState<any>(null);

  const handleCompanyVerify = async () => {
    if (!companyForm.companyName || !companyForm.creditNo || !companyForm.legalPerson) {
      toast.error('请填写完整信息');
      return;
    }

    setIsLoading(true);
    setCompanyResult(null);

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/company-verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyForm)
      });

      const data = await response.json();

      if (data.error) {
        toast.error('认证失败：' + data.error);
        return;
      }

      setCompanyResult(data);
      
      if (data.data?.result === 0) {
        toast.success('企业三要素认证通过');
      } else {
        toast.error('企业三要素认证失败：' + data.data?.desc);
      }
    } catch (error) {
      console.error('企业认证错误:', error);
      toast.error('认证失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 工商信息查询
  const [companyKeyword, setCompanyKeyword] = useState('');
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  const handleCompanyInfoQuery = async () => {
    if (!companyKeyword) {
      toast.error('请输入公司名称或统一社会信用代码');
      return;
    }

    setIsLoading(true);
    setCompanyInfo(null);

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/company-info`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword: companyKeyword })
      });

      const data = await response.json();

      if (data.error) {
        toast.error('查询失败：' + data.error);
        return;
      }

      // 检查是否查询到结果
      if (data.success && data.data?.data?.base) {
        setCompanyInfo(data);
        toast.success('工商信息查询成功');
      } else {
        // 查询无结果
        toast.warning(data.msg || '未查询到该企业的工商信息，请检查企业名称或统一社会信用代码是否正确');
      }
    } catch (error) {
      console.error('工商信息查询错误:', error);
      toast.error('查询失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 人脸对比
  const [faceMatchForm, setFaceMatchForm] = useState({
    image1: '',
    image2: ''
  });
  const [faceMatchResult, setFaceMatchResult] = useState<any>(null);

  const handleImageUpload = async (file: File, field: 'image1' | 'image2') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      // 移除data:image/...;base64,前缀
      const base64Data = base64.split(',')[1];
      setFaceMatchForm(prev => ({ ...prev, [field]: base64Data }));
    };
    reader.readAsDataURL(file);
  };

  const handleFaceMatch = async () => {
    if (!faceMatchForm.image1 || !faceMatchForm.image2) {
      toast.error('请上传两张人脸图片');
      return;
    }

    setIsLoading(true);
    setFaceMatchResult(null);

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/face-match`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(faceMatchForm)
      });

      const data = await response.json();

      if (data.error) {
        toast.error('对比失败：' + data.error);
        return;
      }

      setFaceMatchResult(data);
      
      if (data.error_code === 0) {
        const score = data.result?.score || 0;
        if (score >= 80) {
          toast.success(`人脸对比成功，相似度：${score.toFixed(2)}%`);
        } else {
          toast.warning(`人脸对比完成，相似度较低：${score.toFixed(2)}%`);
        }
      } else {
        toast.error('人脸对比失败：' + data.error_msg);
      }
    } catch (error) {
      console.error('人脸对比错误:', error);
      toast.error('对比失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">实名认证管理</h1>
        <p className="text-muted-foreground mt-1">
          身份证认证、企业认证、人脸识别、工商信息查询
        </p>
      </div>

      <Tabs defaultValue="idcard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="idcard">
            <User className="h-4 w-4 mr-2" />
            身份证认证
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building2 className="h-4 w-4 mr-2" />
            企业认证
          </TabsTrigger>
          <TabsTrigger value="company-info">
            <Users className="h-4 w-4 mr-2" />
            工商信息
          </TabsTrigger>
          <TabsTrigger value="face">
            <ImageIcon className="h-4 w-4 mr-2" />
            人脸对比
          </TabsTrigger>
        </TabsList>

        {/* 身份证二要素认证 */}
        <TabsContent value="idcard">
          <Card>
            <CardHeader>
              <CardTitle>身份证二要素实名认证</CardTitle>
              <CardDescription>
                通过身份证号和姓名进行实名认证
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idcard">身份证号</Label>
                  <Input
                    id="idcard"
                    placeholder="请输入身份证号"
                    value={idCardForm.idcard}
                    onChange={(e) => setIdCardForm({ ...idCardForm, idcard: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    placeholder="请输入姓名"
                    value={idCardForm.name}
                    onChange={(e) => setIdCardForm({ ...idCardForm, name: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleIdCardVerify} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                开始认证
              </Button>

              {idCardResult && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {idCardResult.showapi_res_body?.code === 0 ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          认证通过
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          认证失败
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>验证结果</Label>
                        <p className="text-sm">{idCardResult.showapi_res_body?.msg}</p>
                      </div>
                      {idCardResult.showapi_res_body?.sex && (
                        <div>
                          <Label>性别</Label>
                          <p className="text-sm">{idCardResult.showapi_res_body.sex === 'M' ? '男' : '女'}</p>
                        </div>
                      )}
                      {idCardResult.showapi_res_body?.birthday && (
                        <div>
                          <Label>出生日期</Label>
                          <p className="text-sm">{idCardResult.showapi_res_body.birthday}</p>
                        </div>
                      )}
                      {idCardResult.showapi_res_body?.province && (
                        <div>
                          <Label>籍贯</Label>
                          <p className="text-sm">
                            {idCardResult.showapi_res_body.province} {idCardResult.showapi_res_body.city} {idCardResult.showapi_res_body.county}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 企业三要素认证 */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>企业三要素认证</CardTitle>
              <CardDescription>
                验证企业名称、统一社会信用代码、法人姓名是否一致
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">企业名称</Label>
                  <Input
                    id="companyName"
                    placeholder="请输入企业名称"
                    value={companyForm.companyName}
                    onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditNo">统一社会信用代码</Label>
                  <Input
                    id="creditNo"
                    placeholder="请输入统一社会信用代码"
                    value={companyForm.creditNo}
                    onChange={(e) => setCompanyForm({ ...companyForm, creditNo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalPerson">法人姓名</Label>
                  <Input
                    id="legalPerson"
                    placeholder="请输入法人姓名"
                    value={companyForm.legalPerson}
                    onChange={(e) => setCompanyForm({ ...companyForm, legalPerson: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleCompanyVerify} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                开始认证
              </Button>

              {companyResult && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {companyResult.data?.result === 0 ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          认证通过
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          认证失败
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label>验证结果</Label>
                      <p className="text-sm">{companyResult.data?.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 工商信息查询 */}
        <TabsContent value="company-info">
          <Card>
            <CardHeader>
              <CardTitle>企业工商信息查询</CardTitle>
              <CardDescription>
                查询企业的工商基本信息、分支机构、变更记录等
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="请输入公司名称或统一社会信用代码"
                  value={companyKeyword}
                  onChange={(e) => setCompanyKeyword(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCompanyInfoQuery} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  查询
                </Button>
              </div>

              {companyInfo && companyInfo.data?.data?.base && (
                <Card>
                  <CardHeader>
                    <CardTitle>{companyInfo.data.data.base.companyName}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{companyInfo.data.data.base.companyStatus}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>统一社会信用代码</Label>
                        <p className="text-sm">{companyInfo.data.data.base.creditNo}</p>
                      </div>
                      <div>
                        <Label>法定代表人</Label>
                        <p className="text-sm">{companyInfo.data.data.base.legalPerson}</p>
                      </div>
                      <div>
                        <Label>注册资本</Label>
                        <p className="text-sm">{companyInfo.data.data.base.capital}</p>
                      </div>
                      <div>
                        <Label>成立日期</Label>
                        <p className="text-sm">{companyInfo.data.data.base.establishDate}</p>
                      </div>
                      <div>
                        <Label>企业类型</Label>
                        <p className="text-sm">{companyInfo.data.data.base.companyType}</p>
                      </div>
                      <div>
                        <Label>注册号</Label>
                        <p className="text-sm">{companyInfo.data.data.base.companyCode}</p>
                      </div>
                    </div>
                    <div>
                      <Label>企业地址</Label>
                      <p className="text-sm">{companyInfo.data.data.base.companyAddress}</p>
                    </div>
                    <div>
                      <Label>经营范围</Label>
                      <p className="text-sm">{companyInfo.data.data.base.businessScope}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {companyInfo && !companyInfo.data?.data?.base && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-yellow-800">未查询到企业信息</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>可能的原因：</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>企业名称输入有误，请检查是否为完整的企业全称</li>
                            <li>统一社会信用代码输入有误</li>
                            <li>该企业尚未在工商系统登记</li>
                            <li>企业已注销或吊销</li>
                          </ul>
                          <p className="mt-2">建议：请使用企业营业执照上的完整名称或18位统一社会信用代码进行查询</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 人脸对比 */}
        <TabsContent value="face">
          <Card>
            <CardHeader>
              <CardTitle>人脸1:1对比</CardTitle>
              <CardDescription>
                上传两张人脸图片进行相似度对比
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image1">图片1（生活照）</Label>
                  <Input
                    id="image1"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'image1');
                    }}
                  />
                  {faceMatchForm.image1 && (
                    <p className="text-xs text-muted-foreground">✓ 图片已上传</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image2">图片2（身份证照）</Label>
                  <Input
                    id="image2"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'image2');
                    }}
                  />
                  {faceMatchForm.image2 && (
                    <p className="text-xs text-muted-foreground">✓ 图片已上传</p>
                  )}
                </div>
              </div>

              <Button onClick={handleFaceMatch} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                开始对比
              </Button>

              {faceMatchResult && faceMatchResult.error_code === 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {faceMatchResult.result?.score >= 80 ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          对比通过
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-yellow-500" />
                          相似度较低
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label>相似度得分</Label>
                      <p className="text-2xl font-bold text-primary">
                        {faceMatchResult.result?.score.toFixed(2)}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        建议阈值：80分以上为同一人
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
