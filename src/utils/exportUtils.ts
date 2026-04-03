/**
 * 导出工具函数
 * 用于将数据导出为CSV或Excel格式
 */

/**
 * 将数据导出为CSV文件
 * @param data 要导出的数据数组
 * @param headers 表头配置 { key: string, label: string }[]
 * @param filename 文件名（不含扩展名）
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[],
  filename: string
): void {
  if (data.length === 0) {
    throw new Error('没有数据可导出');
  }

  // 构建CSV内容
  const csvRows: string[] = [];

  // 添加表头（使用UTF-8 BOM以支持Excel正确显示中文）
  const headerRow = headers.map(h => h.label).join(',');
  csvRows.push(headerRow);

  // 添加数据行
  data.forEach(row => {
    const values = headers.map(h => {
      const value = row[h.key];
      // 处理特殊字符和换行
      let cellValue = value === null || value === undefined ? '' : String(value);
      // 如果包含逗号、引号或换行符，需要用引号包裹并转义引号
      if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
        cellValue = `"${cellValue.replace(/"/g, '""')}"`;
      }
      return cellValue;
    });
    csvRows.push(values.join(','));
  });

  // 添加UTF-8 BOM
  const csvContent = '\uFEFF' + csvRows.join('\n');

  // 创建Blob并下载
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 将数据导出为JSON文件
 * @param data 要导出的数据
 * @param filename 文件名（不含扩展名）
 */
export function exportToJSON<T>(data: T, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
