import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/** 控制台搜此前缀，对照签署调试日志 */
const LOG = '[SIGNING_DEBUG][htmlToPdf]';

/**
 * 将完整 HTML 文档字符串渲染为 PDF Blob（浏览器端，供爱签 contractFiles 上传）。
 * 使用离屏 iframe 解析 HTML，再用 html2canvas 截图分页写入 A4 PDF。
 */
export async function htmlStringToPdfBlob(html: string): Promise<Blob> {
  console.log(LOG, '开始转 PDF', { htmlChars: html.length });
  const iframe = document.createElement('iframe');
  iframe.setAttribute('title', 'html-to-pdf');
  iframe.style.position = 'fixed';
  iframe.style.left = '-12000px';
  iframe.style.top = '0';
  iframe.style.width = '794px';
  iframe.style.height = '12000px';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  try {
    const idoc = iframe.contentDocument;
    if (!idoc) {
      throw new Error('PDF: iframe 无 document');
    }
    idoc.open();
    idoc.write(html);
    idoc.close();

    await new Promise<void>((resolve, reject) => {
      const done = () => resolve();
      const t = window.setTimeout(done, 800);
      iframe.onload = () => {
        window.clearTimeout(t);
        window.setTimeout(done, 50);
      };
      iframe.onerror = () => {
        window.clearTimeout(t);
        reject(new Error('PDF: iframe 加载失败'));
      };
    });

    const body = idoc.body;
    if (!body) {
      throw new Error('PDF: HTML 无 body');
    }

    console.log(LOG, 'iframe 内 body 尺寸', {
      scrollWidth: body.scrollWidth,
      scrollHeight: body.scrollHeight,
      clientWidth: body.clientWidth,
      clientHeight: body.clientHeight,
    });

    const canvas = await html2canvas(body, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: body.scrollWidth,
      windowHeight: body.scrollHeight,
    });

    console.log(LOG, 'html2canvas 完成', {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      scale: 2,
      approxPixels: canvas.width * canvas.height,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    console.log(LOG, 'JPEG dataURL 长度（越大 PDF/base64 往往越大）', imgData.length);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    let heightLeft = imgH;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
    heightLeft -= pageH;

    while (heightLeft > 0) {
      position = heightLeft - imgH;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
      heightLeft -= pageH;
    }

    const blob = pdf.output('blob');
    const sizeMB = blob.size / 1024 / 1024;
    console.log(LOG, 'PDF Blob 生成完成', {
      sizeBytes: blob.size,
      sizeMB: Number(sizeMB.toFixed(3)),
      approxBase64Chars: Math.ceil((blob.size * 4) / 3),
    });
    return blob;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(LOG, '转 PDF 失败', { msg, err: e });
    throw e;
  } finally {
    document.body.removeChild(iframe);
  }
}
