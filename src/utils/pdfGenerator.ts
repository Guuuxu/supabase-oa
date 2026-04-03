import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { SalaryStructureTemplate } from '@/types/types';

// 添加中文字体支持（使用内置字体）
const setupChineseFont = (doc: jsPDF) => {
  // jsPDF默认不支持中文，这里使用一个简单的解决方案
  // 在生产环境中，应该加载真正的中文字体文件
  doc.setFont('helvetica');
};

export interface SalarySlipData {
  companyName: string;
  companyLogo?: string;
  employeeName: string;
  department?: string;
  position?: string;
  year: number;
  month: number;
  salaryData: Record<string, number | string>;
  totalAmount: number;
  template: SalaryStructureTemplate;
}

/**
 * 生成工资条PDF
 */
export async function generateSalarySlipPDF(data: SalarySlipData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  setupChineseFont(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // 获取PDF模板配置
  const config = data.template.pdf_template_config || {
    title: '工资条',
    show_company_logo: true,
    show_company_name: true,
    show_period: true,
    header_color: '#1e40af',
    font_size: 10,
    show_signature_area: true,
    signature_label: '员工签名',
    footer_text: '本工资条仅供个人查阅，请妥善保管'
  };

  // 1. 标题
  doc.setFontSize(18);
  doc.setTextColor(30, 64, 175); // 蓝色
  const title = config.title || '工资条';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
  yPosition += 10;

  // 2. 公司名称
  if (config.show_company_name) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const companyText = data.companyName;
    const companyWidth = doc.getTextWidth(companyText);
    doc.text(companyText, (pageWidth - companyWidth) / 2, yPosition);
    yPosition += 8;
  }

  // 3. 工资期间
  if (config.show_period) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const periodText = `${data.year}年${data.month}月`;
    const periodWidth = doc.getTextWidth(periodText);
    doc.text(periodText, (pageWidth - periodWidth) / 2, yPosition);
    yPosition += 10;
  }

  // 4. 员工信息
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const employeeInfo = [
    `姓名: ${data.employeeName}`,
    data.department ? `部门: ${data.department}` : '',
    data.position ? `职位: ${data.position}` : ''
  ].filter(Boolean);

  const infoStartX = margin;
  const infoSpacing = (pageWidth - 2 * margin) / employeeInfo.length;
  
  employeeInfo.forEach((info, index) => {
    doc.text(info, infoStartX + index * infoSpacing, yPosition);
  });
  yPosition += 10;

  // 5. 工资明细表格
  const tableData: any[] = [];
  const fields = data.template.fields || [];

  // 按类型分组
  const incomeFields = fields.filter(f => f.type === 'number' && !f.code.includes('deduction') && !f.code.includes('tax'));
  const deductionFields = fields.filter(f => f.type === 'number' && (f.code.includes('deduction') || f.code.includes('tax')));
  const otherFields = fields.filter(f => f.type !== 'number');

  // 收入项
  if (incomeFields.length > 0) {
    tableData.push([{ content: '收入项目', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]);
    incomeFields.forEach(field => {
      const value = data.salaryData[field.code];
      if (value !== undefined && value !== null && value !== '') {
        tableData.push([
          field.name,
          typeof value === 'number' ? `¥${value.toFixed(2)}` : String(value)
        ]);
      }
    });
  }

  // 扣除项
  if (deductionFields.length > 0) {
    tableData.push([{ content: '扣除项目', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]);
    deductionFields.forEach(field => {
      const value = data.salaryData[field.code];
      if (value !== undefined && value !== null && value !== '') {
        tableData.push([
          field.name,
          typeof value === 'number' ? `¥${value.toFixed(2)}` : String(value)
        ]);
      }
    });
  }

  // 其他信息
  if (otherFields.length > 0) {
    tableData.push([{ content: '其他信息', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]);
    otherFields.forEach(field => {
      const value = data.salaryData[field.code];
      if (value !== undefined && value !== null && value !== '') {
        tableData.push([field.name, String(value)]);
      }
    });
  }

  // 实发工资
  tableData.push([
    { content: '实发工资', styles: { fontStyle: 'bold', fillColor: [30, 64, 175], textColor: [255, 255, 255] } },
    { content: `¥${data.totalAmount.toFixed(2)}`, styles: { fontStyle: 'bold', fillColor: [30, 64, 175], textColor: [255, 255, 255] } }
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: config.font_size || 10,
      cellPadding: 3,
      font: 'helvetica'
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 'auto', halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });

  // 获取表格结束位置
  const finalY = (doc as any).lastAutoTable.finalY || yPosition + 50;
  yPosition = finalY + 10;

  // 6. 签名区域
  if (config.show_signature_area) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const signatureY = yPosition + 10;
    const signatureSpacing = (pageWidth - 2 * margin) / 2;
    
    // 员工签名
    doc.text(config.signature_label || '员工签名', margin, signatureY);
    doc.line(margin, signatureY + 2, margin + 50, signatureY + 2);
    
    // 日期
    doc.text('日期', margin + signatureSpacing, signatureY);
    doc.line(margin + signatureSpacing, signatureY + 2, margin + signatureSpacing + 50, signatureY + 2);
    
    yPosition = signatureY + 10;
  }

  // 7. 页脚
  if (config.footer_text) {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const footerText = config.footer_text;
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 10);
  }

  // 生成Blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
}

/**
 * 生成带签名的工资条PDF
 */
export async function generateSignedSalarySlipPDF(
  originalData: SalarySlipData,
  signatureData?: {
    signedAt: string;
    signatureImage?: string;
  }
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  setupChineseFont(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // 获取PDF模板配置
  const config = originalData.template.pdf_template_config || {
    title: '工资条',
    show_company_logo: true,
    show_company_name: true,
    show_period: true,
    header_color: '#1e40af',
    font_size: 10,
    show_signature_area: true,
    signature_label: '员工签名',
    footer_text: '本工资条仅供个人查阅，请妥善保管'
  };

  // 1. 标题
  doc.setFontSize(18);
  doc.setTextColor(30, 64, 175);
  const title = config.title || '工资条';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
  yPosition += 10;

  // 2. 公司名称
  if (config.show_company_name) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const companyText = originalData.companyName;
    const companyWidth = doc.getTextWidth(companyText);
    doc.text(companyText, (pageWidth - companyWidth) / 2, yPosition);
    yPosition += 8;
  }

  // 3. 工资期间
  if (config.show_period) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const periodText = `${originalData.year}年${originalData.month}月`;
    const periodWidth = doc.getTextWidth(periodText);
    doc.text(periodText, (pageWidth - periodWidth) / 2, yPosition);
    yPosition += 10;
  }

  // 4. 员工信息
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const employeeInfo = [
    `姓名: ${originalData.employeeName}`,
    originalData.department ? `部门: ${originalData.department}` : '',
    originalData.position ? `职位: ${originalData.position}` : ''
  ].filter(Boolean);

  const infoStartX = margin;
  const infoSpacing = (pageWidth - 2 * margin) / employeeInfo.length;
  
  employeeInfo.forEach((info, index) => {
    doc.text(info, infoStartX + index * infoSpacing, yPosition);
  });
  yPosition += 10;

  // 5. 工资明细表格（与原始PDF相同）
  const tableData: any[] = [];
  const fields = originalData.template.fields || [];

  const incomeFields = fields.filter(f => f.type === 'number' && !f.code.includes('deduction') && !f.code.includes('tax'));
  const deductionFields = fields.filter(f => f.type === 'number' && (f.code.includes('deduction') || f.code.includes('tax')));
  const otherFields = fields.filter(f => f.type !== 'number');

  if (incomeFields.length > 0) {
    tableData.push([{ content: '收入项目', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]);
    incomeFields.forEach(field => {
      const value = originalData.salaryData[field.code];
      if (value !== undefined && value !== null && value !== '') {
        tableData.push([
          field.name,
          typeof value === 'number' ? `¥${value.toFixed(2)}` : String(value)
        ]);
      }
    });
  }

  if (deductionFields.length > 0) {
    tableData.push([{ content: '扣除项目', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]);
    deductionFields.forEach(field => {
      const value = originalData.salaryData[field.code];
      if (value !== undefined && value !== null && value !== '') {
        tableData.push([
          field.name,
          typeof value === 'number' ? `¥${value.toFixed(2)}` : String(value)
        ]);
      }
    });
  }

  if (otherFields.length > 0) {
    tableData.push([{ content: '其他信息', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]);
    otherFields.forEach(field => {
      const value = originalData.salaryData[field.code];
      if (value !== undefined && value !== null && value !== '') {
        tableData.push([field.name, String(value)]);
      }
    });
  }

  tableData.push([
    { content: '实发工资', styles: { fontStyle: 'bold', fillColor: [30, 64, 175], textColor: [255, 255, 255] } },
    { content: `¥${originalData.totalAmount.toFixed(2)}`, styles: { fontStyle: 'bold', fillColor: [30, 64, 175], textColor: [255, 255, 255] } }
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: config.font_size || 10,
      cellPadding: 3,
      font: 'helvetica'
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 'auto', halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });

  const finalY = (doc as any).lastAutoTable.finalY || yPosition + 50;
  yPosition = finalY + 10;

  // 6. 签名区域（已签署）
  if (config.show_signature_area && signatureData) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const signatureY = yPosition + 10;
    const signatureSpacing = (pageWidth - 2 * margin) / 2;
    
    // 员工签名
    doc.text(config.signature_label || '员工签名', margin, signatureY);
    doc.text(originalData.employeeName, margin, signatureY + 5);
    doc.line(margin, signatureY + 7, margin + 50, signatureY + 7);
    
    // 签署日期
    doc.text('签署日期', margin + signatureSpacing, signatureY);
    const signedDate = new Date(signatureData.signedAt).toLocaleDateString('zh-CN');
    doc.text(signedDate, margin + signatureSpacing, signatureY + 5);
    doc.line(margin + signatureSpacing, signatureY + 7, margin + signatureSpacing + 50, signatureY + 7);
    
    // 添加"已签署"水印
    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.text('已签署', pageWidth / 2 - 30, pageHeight / 2, { angle: 45 });
    
    yPosition = signatureY + 15;
  }

  // 7. 页脚
  if (config.footer_text) {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const footerText = config.footer_text;
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 10);
  }

  const pdfBlob = doc.output('blob');
  return pdfBlob;
}

/**
 * 上传PDF到Supabase Storage
 */
export async function uploadPDFToStorage(
  blob: Blob,
  fileName: string,
  bucket: string = 'signature-files'
): Promise<string | null> {
  try {
    const { supabase } = await import('@/db/supabase');
    
    // 生成安全的文件名：使用UUID + 时间戳，避免中文字符
    const timestamp = Date.now();
    const randomId = crypto.randomUUID();
    const safeFileName = `${randomId}_${timestamp}.pdf`;
    const filePath = `salary-slips/${safeFileName}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error('上传PDF失败:', error);
      return null;
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('上传PDF异常:', error);
    return null;
  }
}

/**
 * 考勤确认表数据接口
 */
export interface AttendanceRecordData {
  companyName: string;
  employeeName: string;
  department?: string;
  position?: string;
  year: number;
  month: number;
  attendanceData: {
    work_days?: number; // 出勤天数
    absent_days?: number; // 缺勤天数
    late_count?: number; // 迟到次数
    leave_days?: number; // 请假天数
    overtime_hours?: number; // 加班小时
    notes?: string; // 备注
    [key: string]: number | string | undefined;
  };
}

/**
 * 生成考勤确认表PDF
 */
export async function generateAttendanceRecordPDF(data: AttendanceRecordData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  setupChineseFont(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // 1. 标题
  doc.setFontSize(18);
  doc.setTextColor(30, 64, 175); // 蓝色
  const title = '考勤确认表';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
  yPosition += 10;

  // 2. 公司名称
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const companyText = data.companyName;
  const companyWidth = doc.getTextWidth(companyText);
  doc.text(companyText, (pageWidth - companyWidth) / 2, yPosition);
  yPosition += 8;

  // 3. 考勤期间
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const periodText = `${data.year}年${data.month}月`;
  const periodWidth = doc.getTextWidth(periodText);
  doc.text(periodText, (pageWidth - periodWidth) / 2, yPosition);
  yPosition += 10;

  // 4. 员工信息
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const employeeInfo = [
    `姓名: ${data.employeeName}`,
    data.department ? `部门: ${data.department}` : '',
    data.position ? `职位: ${data.position}` : ''
  ].filter(Boolean);

  const infoStartX = margin;
  const infoSpacing = (pageWidth - 2 * margin) / employeeInfo.length;
  
  employeeInfo.forEach((info, index) => {
    doc.text(info, infoStartX + index * infoSpacing, yPosition);
  });
  yPosition += 10;

  // 5. 考勤明细表格
  const tableData: any[] = [];

  // 定义考勤字段映射
  const attendanceFields = [
    { key: 'work_days', label: '出勤天数', unit: '天' },
    { key: 'absent_days', label: '缺勤天数', unit: '天' },
    { key: 'late_count', label: '迟到次数', unit: '次' },
    { key: 'leave_days', label: '请假天数', unit: '天' },
    { key: 'overtime_hours', label: '加班时长', unit: '小时' }
  ];

  // 添加考勤数据
  attendanceFields.forEach(field => {
    const value = data.attendanceData[field.key];
    if (value !== undefined && value !== null) {
      tableData.push([
        field.label,
        `${value} ${field.unit}`
      ]);
    }
  });

  // 添加备注
  if (data.attendanceData.notes) {
    tableData.push([
      '备注',
      data.attendanceData.notes
    ]);
  }

  // 添加其他字段
  Object.entries(data.attendanceData).forEach(([key, value]) => {
    if (!['work_days', 'absent_days', 'late_count', 'leave_days', 'overtime_hours', 'notes'].includes(key)) {
      if (value !== undefined && value !== null && value !== '') {
        tableData.push([key, String(value)]);
      }
    }
  });

  autoTable(doc, {
    startY: yPosition,
    head: [['项目', '数值']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 4,
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'left' }
    },
    margin: { left: margin, right: margin }
  });

  // 获取表格结束位置
  const finalY = (doc as any).lastAutoTable.finalY || yPosition + 50;
  yPosition = finalY + 15;

  // 6. 签名区域
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const signatureY = yPosition + 10;
  const signatureSpacing = (pageWidth - 2 * margin) / 2;
  
  // 员工签名
  doc.text('员工签名', margin, signatureY);
  doc.line(margin, signatureY + 2, margin + 50, signatureY + 2);
  
  // 日期
  doc.text('日期', margin + signatureSpacing, signatureY);
  doc.line(margin + signatureSpacing, signatureY + 2, margin + signatureSpacing + 50, signatureY + 2);
  
  yPosition = signatureY + 10;

  // 7. 页脚
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const footerText = '本考勤确认表仅供个人查阅，请妥善保管';
  const footerWidth = doc.getTextWidth(footerText);
  doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 10);

  // 生成Blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
}

/**
 * 生成带签名的考勤确认表PDF
 */
export async function generateSignedAttendanceRecordPDF(
  originalData: AttendanceRecordData,
  signatureData?: {
    signedAt: string;
    signatureImage?: string;
  }
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  setupChineseFont(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // 1. 标题
  doc.setFontSize(18);
  doc.setTextColor(30, 64, 175);
  const title = '考勤确认表';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
  yPosition += 10;

  // 2. 公司名称
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const companyText = originalData.companyName;
  const companyWidth = doc.getTextWidth(companyText);
  doc.text(companyText, (pageWidth - companyWidth) / 2, yPosition);
  yPosition += 8;

  // 3. 考勤期间
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const periodText = `${originalData.year}年${originalData.month}月`;
  const periodWidth = doc.getTextWidth(periodText);
  doc.text(periodText, (pageWidth - periodWidth) / 2, yPosition);
  yPosition += 10;

  // 4. 员工信息
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const employeeInfo = [
    `姓名: ${originalData.employeeName}`,
    originalData.department ? `部门: ${originalData.department}` : '',
    originalData.position ? `职位: ${originalData.position}` : ''
  ].filter(Boolean);

  const infoStartX = margin;
  const infoSpacing = (pageWidth - 2 * margin) / employeeInfo.length;
  
  employeeInfo.forEach((info, index) => {
    doc.text(info, infoStartX + index * infoSpacing, yPosition);
  });
  yPosition += 10;

  // 5. 考勤明细表格（与原始PDF相同）
  const tableData: any[] = [];

  const attendanceFields = [
    { key: 'work_days', label: '出勤天数', unit: '天' },
    { key: 'absent_days', label: '缺勤天数', unit: '天' },
    { key: 'late_count', label: '迟到次数', unit: '次' },
    { key: 'leave_days', label: '请假天数', unit: '天' },
    { key: 'overtime_hours', label: '加班时长', unit: '小时' }
  ];

  attendanceFields.forEach(field => {
    const value = originalData.attendanceData[field.key];
    if (value !== undefined && value !== null) {
      tableData.push([
        field.label,
        `${value} ${field.unit}`
      ]);
    }
  });

  if (originalData.attendanceData.notes) {
    tableData.push([
      '备注',
      originalData.attendanceData.notes
    ]);
  }

  Object.entries(originalData.attendanceData).forEach(([key, value]) => {
    if (!['work_days', 'absent_days', 'late_count', 'leave_days', 'overtime_hours', 'notes'].includes(key)) {
      if (value !== undefined && value !== null && value !== '') {
        tableData.push([key, String(value)]);
      }
    }
  });

  autoTable(doc, {
    startY: yPosition,
    head: [['项目', '数值']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 4,
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'left' }
    },
    margin: { left: margin, right: margin }
  });

  const finalY = (doc as any).lastAutoTable.finalY || yPosition + 50;
  yPosition = finalY + 15;

  // 6. 签名区域（已签署）
  if (signatureData) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const signatureY = yPosition + 10;
    const signatureSpacing = (pageWidth - 2 * margin) / 2;
    
    // 员工签名
    doc.text('员工签名', margin, signatureY);
    doc.text(originalData.employeeName, margin, signatureY + 5);
    doc.line(margin, signatureY + 7, margin + 50, signatureY + 7);
    
    // 签署日期
    doc.text('签署日期', margin + signatureSpacing, signatureY);
    const signedDate = new Date(signatureData.signedAt).toLocaleDateString('zh-CN');
    doc.text(signedDate, margin + signatureSpacing, signatureY + 5);
    doc.line(margin + signatureSpacing, signatureY + 7, margin + signatureSpacing + 50, signatureY + 7);
    
    // 添加"已签署"水印
    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.text('已签署', pageWidth / 2 - 30, pageHeight / 2, { angle: 45 });
    
    yPosition = signatureY + 15;
  }

  // 7. 页脚
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const footerText = '本考勤确认表仅供个人查阅，请妥善保管';
  const footerWidth = doc.getTextWidth(footerText);
  doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 10);

  const pdfBlob = doc.output('blob');
  return pdfBlob;
}

