/**
 * 生成《宝塔自建 Supabase 技术操作说明》Word 文档（一次性脚本，依赖 docx，使用 npm install --no-save docx）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outPath = path.join(root, "docs", "宝塔自建Supabase-技术操作说明.docx");

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} = await import("docx");

function p(text, paraOpts = {}) {
  const { numbering, ...runOpts } = paraOpts;
  return new Paragraph({
    spacing: { after: 120 },
    numbering,
    children: [new TextRun({ text, size: 22, ...runOpts })],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32 })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26 })],
  });
}

function codeBlock(lines) {
  const text = Array.isArray(lines) ? lines.join("\n") : lines;
  return new Paragraph({
    spacing: { after: 160 },
    shading: { fill: "F5F5F5" },
    children: [
      new TextRun({
        text,
        font: "Consolas",
        size: 20,
      }),
    ],
  });
}

function table(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h) =>
        new TableCell({
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
          },
          width: { size: 50 / headers.length, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 22 })] })],
        }),
    ),
  });
  const dataRows = rows.map(
    (cells) =>
      new TableRow({
        children: cells.map(
          (c) =>
            new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1 },
                bottom: { style: BorderStyle.SINGLE, size: 1 },
                left: { style: BorderStyle.SINGLE, size: 1 },
                right: { style: BorderStyle.SINGLE, size: 1 },
              },
              width: { size: 50 / cells.length, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: c, size: 22 })] })],
            }),
        ),
      }),
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

const children = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: "宝塔面板自建 Supabase 技术操作说明",
        bold: true,
        size: 40,
      }),
    ],
  }),
  p("文档性质：技术实施 / Runbook，按顺序执行即可。"),
  p("适用：Linux 服务器已安装宝塔，通过 Docker Compose 部署官方 supabase/supabase 仓库中的 docker 编排；对外 HTTPS，Postgres 不对公网开放。"),

  h1("1. 宝塔与 Docker"),
  p("在宝塔「软件商店」安装 Docker 管理器（或等价 Docker + Compose 插件）。"),
  p("SSH 或宝塔终端执行："),
  codeBlock(["docker version", "docker compose version"]),
  p("两条命令均有正常输出即可继续。"),

  h1("2. 拉取编排与配置"),
  codeBlock([
    "sudo mkdir -p /www/supabase && cd /www/supabase",
    "sudo git clone --depth 1 https://github.com/supabase/supabase.git",
    "cd supabase/docker",
    "cp .env.example .env",
  ]),
  p("编辑 .env（变量名以仓库内 .env.example 及注释为准，升级后可能变化）："),
  p("修改 POSTGRES_PASSWORD 等为强密码。"),
  p("按官方文档生成并填写 JWT_SECRET、ANON_KEY、SERVICE_ROLE_KEY 等，勿将示例默认值用于生产。"),
  p("将 SITE_URL、API_EXTERNAL_URL、SUPABASE_PUBLIC_URL 等与最终 https://你的域名 保持一致。"),
  codeBlock(["docker compose pull", "docker compose up -d", "docker compose ps"]),
  p("确认各容器状态为 running。失败常见原因：端口占用、内存不足、.env 格式错误。"),

  h1("3. 端口与 Nginx 反代"),
  p("使用 docker compose ps 或 ss -tlnp 确认 Kong 对外端口（常见为 8000，以实际为准）。"),
  p("宝塔：网站 → 添加站点 → 绑定 API 域名 → 申请 SSL。"),
  p("Nginx 将 https://api.你的域名 反代到 http://127.0.0.1:<Kong端口>。若使用 Realtime，按 Supabase 官方文档为反代补充 WebSocket 相关 proxy_set_header。"),
  p("修改 .env 中的公网 URL 后，需重新执行 docker compose up -d 使相关服务加载配置。"),
  p("防火墙 / 云安全组：仅放行 80、443；不要将 5432 暴露到公网。"),

  h1("4. Studio 与连接信息"),
  p("登录 Supabase Studio（访问方式以当前 docker-compose 与官方文档为准）。"),
  table(
    ["用途", "说明 / 环境变量"],
    [
      ["前端（Vite 项目）", "VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEY（见 src/db/supabase.ts）"],
      ["Edge Functions / 服务端", "SUPABASE_URL、SUPABASE_ANON_KEY、SUPABASE_SERVICE_ROLE_KEY；部分函数另需 SUPABASE_ADMIN_URL、SUPABASE_PUBLIC_URL（见 supabase/functions/.env.example）"],
    ],
  ),
  p("SERVICE_ROLE_KEY 仅用于服务端与 Functions，禁止写入前端构建产物或提交到公开仓库。"),

  h1("5. 数据库结构（迁移）"),
  p("本项目 SQL 迁移位于仓库 supabase/migrations/ 目录，为普通 PostgreSQL 脚本，不要求本机已全局安装 Supabase CLI。"),
  p("任选其一（均需能访问自建库的 Postgres 端口；迁移依赖 auth 等 schema，须为完整 Supabase Docker 栈，而非空白 Postgres）："),
  p("方式 A（推荐，无需全局安装 CLI）：在能访问数据库的机器上进入项目根目录，使用 npx 临时拉取 CLI 并执行（子命令以官方文档为准，示例为 db push 或 migration up）："),
  codeBlock([
    "npx supabase@latest db push --db-url \"postgresql://postgres:<密码>@<主机>:5432/postgres\"",
  ]),
  p("方式 B（本机不装 Node/CLI）：用 Docker 挂载项目目录后在容器内执行同上命令（镜像名以 github.com/supabase/cli 为准，常见为 supabase/cli）："),
  codeBlock([
    "docker run --rm -it -v \"<项目根目录>:/work\" -w /work supabase/cli:latest \\",
    "  db push --db-url \"postgresql://postgres:<密码>@<主机>:5432/postgres\"",
  ]),
  p("方式 C（完全不用 CLI）：已安装 psql 时，按文件名排序依次执行迁移文件（仅建议在空库或首次初始化时整目录执行；重复执行会报对象已存在）："),
  codeBlock([
    "# Linux / 服务器示例",
    "export PGPASSWORD='<密码>'",
    "for f in $(ls supabase/migrations/*.sql | sort); do",
    "  psql -h <主机> -p 5432 -U postgres -d postgres -v ON_ERROR_STOP=1 -f \"$f\"",
    "done",
  ]),
  p("完成后在 Studio → Table Editor（或 SQL）核对表结构、RLS 是否与预期一致。"),

  h1("6. 数据录入"),
  p("任选其一：Studio Table Editor 或 SQL；服务器本机 psql；或通过业务系统正常流程写入。"),
  codeBlock('psql "postgresql://postgres:<密码>@127.0.0.1:5432/postgres"'),

  h1("7. 与本项目联调"),
  p("项目根目录 .env 或 .env.local："),
  codeBlock(["VITE_SUPABASE_URL=https://你的API域名", "VITE_SUPABASE_ANON_KEY=<anon 密钥>"]),
  p("修改后重启 npm run dev（Vite 在启动时读取环境变量）。控制台不应再出现 SUPABASE_URL / ANON_KEY 未设置类报错。"),

  h1("8. 备份（生产建议）"),
  p("对 Postgres 做周期性 pg_dump，或对 Docker 数据卷做快照。升级镜像前先备份，再执行 docker compose pull 与 docker compose up -d。"),

  h1("9. 快速排错"),
  table(
    ["现象", "排查方向"],
    [
      ["浏览器无法访问 API", "域名解析、HTTPS 证书、Nginx upstream 端口、容器是否运行"],
      ["Auth 回调或邮件链接错误", "SITE_URL、Redirect URL 是否与真实域名一致"],
      ["Realtime 异常", "反代 WebSocket 配置、防火墙"],
    ],
  ),

  h2("附：重新生成本文档"),
  p("在项目根目录执行（需已安装 Node.js 与 npm）："),
  codeBlock(["npm install docx --no-save", "node scripts/generate-supabase-baota-sop-docx.mjs"]),
  p("输出文件路径：docs/宝塔自建Supabase-技术操作说明.docx"),
];

const doc = new Document({
  sections: [
    {
      properties: {},
      children,
    },
  ],
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
console.log("已生成:", outPath);
