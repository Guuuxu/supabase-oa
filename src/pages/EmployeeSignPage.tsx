import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getSalarySignatureByToken, confirmSalarySignature, rejectSalarySignature } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { SalarySignature } from '@/types/types';
import { CheckCircle2, XCircle, FileText, Calendar, Building2, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function EmployeeSignPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [signature, setSignature] = useState<SalarySignature | null>(null);
  const [salaryData, setSalaryData] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (token) {
      loadSignatureData();
    }
  }, [token]);

  const loadSignatureData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      // 获取签署记录
      const signatureData = await getSalarySignatureByToken(token);
      
      if (!signatureData) {
        toast.error('签署链接无效或已过期');
        setLoading(false);
        return;
      }

      setSignature(signatureData);

      // 根据类型加载对应的数据
      if (signatureData.type === 'salary_slip') {
        // 加载工资条数据
        const { data: salaryItem } = await supabase
          .from('salary_items')
          .select('*')
          .eq('salary_record_id', signatureData.reference_id)
          .eq('employee_id', signatureData.employee_id)
          .single();

        if (salaryItem) {
          setSalaryData(salaryItem);
        }
      } else if (signatureData.type === 'attendance_record') {
        // 加载考勤数据（包含员工信息）
        const { data: attendanceRecord } = await supabase
          .from('attendance_records')
          .select(`
            *,
            employee:employees(*)
          `)
          .eq('id', signatureData.reference_id)
          .single();

        if (attendanceRecord) {
          setAttendanceData(attendanceRecord);
        }
      }
    } catch (error) {
      console.error('加载签署数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!token) return;

    setSigning(true);
    try {
      const result = await confirmSalarySignature(token);
      
      if (result.success) {
        toast.success('签署成功');
        // 重新加载数据以更新状态
        await loadSignatureData();
      } else {
        toast.error(result.error || '签署失败');
      }
    } catch (error) {
      console.error('签署失败:', error);
      toast.error('签署失败，请重试');
    } finally {
      setSigning(false);
    }
  };

  const handleReject = async () => {
    if (!token || !rejectReason.trim()) {
      toast.error('请填写拒签原因');
      return;
    }

    setSigning(true);
    try {
      const result = await rejectSalarySignature(token, rejectReason);
      
      if (result.success) {
        toast.success('已拒签');
        setShowRejectDialog(false);
        // 重新加载数据以更新状态
        await loadSignatureData();
      } else {
        toast.error(result.error || '拒签失败');
      }
    } catch (error) {
      console.error('拒签失败:', error);
      toast.error('拒签失败，请重试');
    } finally {
      setSigning(false);
    }
  };

  const renderSalarySlip = () => {
    if (!salaryData) return null;

    const data = salaryData.data || {};
    const fields = Object.entries(data);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">员工姓名</Label>
            <p className="font-medium">{salaryData.employee_name}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">工资明细</h3>
          <div className="grid grid-cols-2 gap-3">
            {fields.map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground">{key}</span>
                <span className="font-medium">¥{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>实发工资</span>
            <span className="text-primary">¥{salaryData.total_amount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendanceRecord = () => {
    if (!attendanceData) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">员工姓名</Label>
            <p className="font-medium">{attendanceData.employee?.name || '-'}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">部门</Label>
            <p className="font-medium">{attendanceData.employee?.department || '-'}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">职位</Label>
            <p className="font-medium">{attendanceData.employee?.position || '-'}</p>
          </div>
        </div>

        {/* PDF预览 */}
        {attendanceData.pdf_url && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">考勤确认表预览</h3>
            <div className="border rounded-lg overflow-hidden bg-muted/30">
              <iframe
                src={attendanceData.pdf_url}
                className="w-full h-[600px]"
                title="考勤确认表PDF"
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground text-center">
              <a 
                href={attendanceData.pdf_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                在新窗口中打开PDF
              </a>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">考勤明细</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">出勤天数</span>
              <span className="font-medium">{attendanceData.work_days || 0} 天</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">缺勤天数</span>
              <span className="font-medium">{attendanceData.absent_days || 0} 天</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">迟到次数</span>
              <span className="font-medium">{attendanceData.late_times || 0} 次</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">请假天数</span>
              <span className="font-medium">{attendanceData.leave_days || 0} 天</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">加班时长</span>
              <span className="font-medium">{attendanceData.overtime_hours || 0} 小时</span>
            </div>
            {attendanceData.remarks && (
              <div className="col-span-2 p-3 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground block mb-1">备注</span>
                <span className="font-medium">{attendanceData.remarks}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">加载中...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!signature) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold">签署链接无效</h2>
              <p className="text-muted-foreground">该签署链接不存在或已过期</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSigned = signature.status === 'signed';
  const isRejected = signature.status === 'rejected';

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 头部信息 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {signature.type === 'salary_slip' ? '工资条签署' : '考勤确认表签署'}
              </CardTitle>
              {isSigned && <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" />已签署</Badge>}
              {isRejected && <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />已拒签</Badge>}
              {!isSigned && !isRejected && <Badge variant="secondary">待签署</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-xs text-muted-foreground">公司</Label>
                  <p className="text-sm font-medium">{signature.company?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-xs text-muted-foreground">员工</Label>
                  <p className="text-sm font-medium">{signature.employee?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-xs text-muted-foreground">期间</Label>
                  <p className="text-sm font-medium">{signature.year}年{signature.month}月</p>
                </div>
              </div>
            </div>

            {signature.signed_at && (
              <div className="text-sm text-muted-foreground">
                签署时间：{new Date(signature.signed_at).toLocaleString('zh-CN')}
              </div>
            )}

            {signature.reject_reason && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <Label className="text-sm font-medium text-destructive">拒签原因</Label>
                <p className="text-sm mt-1">{signature.reject_reason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 内容区域 */}
        <Card>
          <CardHeader>
            <CardTitle>
              {signature.type === 'salary_slip' ? '工资明细' : '考勤明细'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signature.type === 'salary_slip' ? renderSalarySlip() : renderAttendanceRecord()}
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        {!isSigned && !isRejected && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={signing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  拒签
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={signing}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {signing ? '签署中...' : '确认签署'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 拒签对话框 */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>拒签确认</AlertDialogTitle>
            <AlertDialogDescription>
              请说明拒签原因，以便公司了解情况并进行处理。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reject-reason">拒签原因</Label>
            <Textarea
              id="reject-reason"
              placeholder="请输入拒签原因..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={signing}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={signing || !rejectReason.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              {signing ? '提交中...' : '确认拒签'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
