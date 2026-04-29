/**
 * 薪酬批量发起：与 SigningsPage 一致的爱签 create-signing（模板）调用与响应解析。
 */
import { toast } from 'sonner';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DocumentTemplate } from '@/types/types';
import type { AsignContractFillCompany, AsignContractFillEmployee } from '@/utils/asignFillData';
import { buildAsignFillDataForContract } from '@/utils/asignFillData';
import { getAsignTemplateData } from '@/db/api';
import {
  extractAsignTemplateControlHints,
  type AsignTemplateControlHints,
} from '@/utils/extractAsignTemplateControlHints';

export type AsignStrangerItem = {
  account: string;
  userType: 1 | 2;
  name?: string;
  idCard?: string;
  mobile?: string;
  companyName?: string;
  creditCode?: string;
};

/** 从 createContract 返回中尽量解析待签署文件预览地址（与 SigningsPage 逻辑一致） */
export function extractAsignCreateContractPreviewUrl(
  asignRoot: unknown,
  expectedContractNo?: string,
): string | undefined {
  const pickHttp = (v: unknown): string | undefined => {
    if (typeof v !== 'string') return undefined;
    const s = v.trim();
    if (!s) return undefined;
    return /^https?:\/\//i.test(s) ? s : undefined;
  };

  const tryShallowPreviewUrl = (node: unknown): string | undefined => {
    if (!node || typeof node !== 'object') {
      return undefined;
    }
    const read = (r: Record<string, unknown>): string | undefined => {
      for (const k of ['previewUrl', 'preview_url']) {
        const u = pickHttp(r[k]);
        if (u) {
          return u;
        }
      }
      return undefined;
    };
    const root = node as Record<string, unknown>;
    const fromRoot = read(root);
    if (fromRoot) {
      return fromRoot;
    }
    const nestedAsign = root.asign;
    if (nestedAsign && typeof nestedAsign === 'object') {
      const a = nestedAsign as Record<string, unknown>;
      const fromAsign = read(a);
      if (fromAsign) {
        return fromAsign;
      }
      const ad = a.data;
      if (ad && typeof ad === 'object') {
        return read(ad as Record<string, unknown>);
      }
    }
    return undefined;
  };

  const directPreview = tryShallowPreviewUrl(asignRoot);
  if (directPreview) {
    return directPreview;
  }

  const expected = (expectedContractNo || '').trim().toLowerCase();
  const scoredCandidates: Array<{ url: string; score: number; path: string }> = [];

  const scoreUrl = (url: string, keyPath: string): number => {
    const u = url.toLowerCase();
    const k = keyPath.toLowerCase();
    let score = 0;
    if (u.includes('preview') || u.includes('view') || u.includes('sync')) score += 4;
    if (k.includes('contractfiles')) score += 4;
    if (k.includes('syncurl') || k.includes('preview') || k.includes('viewurl') || k.includes('url')) {
      score += 2;
    }
    if (expected && (u.includes(expected) || k.includes(expected))) score += 8;
    return score;
  };

  const pushCandidate = (raw: unknown, keyPath: string) => {
    const hit = pickHttp(raw);
    if (!hit) return;
    scoredCandidates.push({ url: hit, score: scoreUrl(hit, keyPath), path: keyPath });
  };

  const walk = (node: unknown, depth: number, path: string) => {
    if (depth > 12 || node === null || node === undefined) return;
    if (typeof node === 'string') {
      pushCandidate(node, path);
      return;
    }
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i += 1) {
        walk(node[i], depth + 1, `${path}[${i}]`);
      }
      return;
    }
    if (typeof node !== 'object') return;
    const o = node as Record<string, unknown>;
    const focusedKeys = [
      'syncUrl',
      'sync_url',
      'previewUrl',
      'preview_url',
      'viewUrl',
      'view_url',
      'url',
    ];
    for (const k of focusedKeys) {
      pushCandidate(o[k], `${path}.${k}`);
    }
    for (const [k, v] of Object.entries(o)) {
      walk(v, depth + 1, `${path}.${k}`);
    }
  };

  walk(asignRoot, 0, 'root');
  if (scoredCandidates.length === 0) return undefined;
  const previewPathCandidates = scoredCandidates.filter((c) => {
    const p = c.path.toLowerCase();
    return p.includes('previewurl') || p.includes('preview_url');
  });
  if (previewPathCandidates.length > 0) {
    previewPathCandidates.sort((a, b) => b.score - a.score);
    return previewPathCandidates[0].url;
  }
  const syncCandidates = scoredCandidates.filter(
    (c) => c.path.toLowerCase().includes('syncurl') || c.path.toLowerCase().includes('sync_url'),
  );
  if (syncCandidates.length > 0) {
    syncCandidates.sort((a, b) => b.score - a.score);
    return syncCandidates[0].url;
  }
  scoredCandidates.sort((a, b) => b.score - a.score);
  return scoredCandidates[0].url;
}

export function extractContractNoFromCreateSigningResponse(
  invokePayload: unknown,
  clientContractNo: string,
): string {
  if (!invokePayload || typeof invokePayload !== 'object') {
    return clientContractNo;
  }
  const env = invokePayload as Record<string, unknown>;
  const server = env.effectiveContractNo;
  if (typeof server === 'string' && server.trim()) {
    return server.trim();
  }
  const tryNode = (node: unknown): string | null => {
    if (!node || typeof node !== 'object') {
      return null;
    }
    const o = node as Record<string, unknown>;
    const inner = o.data;
    if (inner && typeof inner === 'object') {
      const d = inner as Record<string, unknown>;
      for (const k of ['contractNo', 'contract_no', 'contractNO']) {
        const v = d[k];
        if (typeof v === 'string' && v.trim()) {
          return v.trim();
        }
      }
    }
    for (const k of ['contractNo', 'contract_no', 'contractNO']) {
      const v = o[k];
      if (typeof v === 'string' && v.trim()) {
        return v.trim();
      }
    }
    return null;
  };
  const roots: unknown[] = [env.asign, invokePayload];
  for (const r of roots) {
    const got = tryNode(r);
    if (got) {
      return got;
    }
  }
  return clientContractNo;
}

export function buildAsignStrangersForSalarySigning(
  fillEmployee: AsignContractFillEmployee,
  company?: AsignContractFillCompany,
): AsignStrangerItem[] {
  const out: AsignStrangerItem[] = [];

  if (company && (company.name || '').trim()) {
    const credit = (company.code || '').trim().replace(/\s/g, '');
    const contactMobile = (company.contact_phone || '').trim().replace(/\s/g, '');
    const companyAccountRaw = (credit || contactMobile).toUpperCase();
    const account = companyAccountRaw ? `ASIGN${companyAccountRaw}` : '';
    if (account && contactMobile) {
      const companyName = (company.name || '').trim();
      const legalName =
        (company.legal_representative || '').trim() ||
        (company.contact_person || '').trim();
      out.push({
        account,
        userType: 1,
        mobile: contactMobile,
        ...(companyName ? { companyName } : {}),
        ...(credit ? { creditCode: credit } : {}),
        ...(legalName ? { name: legalName } : {}),
      });
    }
  }

  const mobile = (fillEmployee.phone || '').trim().replace(/\s/g, '');
  if (!mobile) {
    return out;
  }
  const idCard = (fillEmployee.id_card || '').trim().replace(/\s/g, '').toUpperCase();
  if (!idCard) {
    throw new Error(
      `电子签署要求员工身份证号，用于生成 account（规则：ASIGN+身份证号）。缺失员工：${fillEmployee.name || ''}`,
    );
  }
  const account = `ASIGN${idCard}`;
  const name = (fillEmployee.name || '').trim();
  out.push({
    account,
    userType: 2,
    idCard,
    mobile,
    ...(name ? { name } : {}),
  });

  return out;
}

export type InvokeAsignTemplateCreateResult = {
  contractNo: string;
  effectiveContractNo: string;
  contractName: string;
  asign: unknown;
  /** 由 get-asign-template-data 解析；create-signing 返回体通常不含控件树 */
  asignTemplateHints?: AsignTemplateControlHints;
};

/**
 * 单笔爱签模板 create-signing（与 SigningsPage.invokeCreateSigning 中 allAsignTemplateMode 分支对齐）。
 */
export async function invokeAsignTemplateCreateSigning(
  supabase: SupabaseClient,
  opts: {
    docTemplate: DocumentTemplate;
    fillEmployee: AsignContractFillEmployee;
    companyForFill: AsignContractFillCompany;
    strangers: AsignStrangerItem[];
    contractNoNonce?: string;
    displayName: string;
    userId: string;
    suppressTemplateCreateToast?: boolean;
    extraFillData?: Record<string, string>;
  },
): Promise<InvokeAsignTemplateCreateResult> {
  const { docTemplate, fillEmployee, companyForFill, strangers, displayName, userId } = opts;
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  const nonceRaw = (opts.contractNoNonce || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
  const timeStr = nonceRaw ? `${hh}${mi}${ss}${ms}_${nonceRaw}` : `${hh}${mi}${ss}${ms}`;
  const nameForTitle = (fillEmployee.name || '').trim() || '员工';
  const ASIGN_CONTRACT_NO_MAX = 40;
  const uuidCompact = String(userId).replace(/-/g, '');
  const contractNoBase = `U_${dateStr}_${timeStr}`;
  let contractNo: string;
  if (contractNoBase.length + 1 + 8 > ASIGN_CONTRACT_NO_MAX) {
    contractNo = contractNoBase.slice(0, ASIGN_CONTRACT_NO_MAX);
  } else {
    const suffixBudget = ASIGN_CONTRACT_NO_MAX - contractNoBase.length - 1;
    const suffix = uuidCompact.slice(0, Math.max(4, suffixBudget));
    contractNo = `${contractNoBase}_${suffix}`;
    if (contractNo.length > ASIGN_CONTRACT_NO_MAX) {
      contractNo = contractNo.slice(0, ASIGN_CONTRACT_NO_MAX);
    }
  }
  const ASIGN_CONTRACT_NAME_MAX = 120;
  const normalizeContractName = (raw: string) =>
    raw.replace(/[\\/:*?"<>|]/g, '_').slice(0, ASIGN_CONTRACT_NAME_MAX);

  const fillData = {
    ...buildAsignFillDataForContract(fillEmployee, companyForFill),
    ...(opts.extraFillData || {}),
  };
  const rawName = (docTemplate.name || '文书').trim();
  const fileName = rawName
    .replace(/\.(pdf|docx?|doc)$/i, '')
    .replace(/[\\/:*?"<>|]/g, '_')
    .slice(0, 200);
  const contractNameRaw = `爱签模板_${rawName}_${nameForTitle}_${displayName}_${userId}_${dateStr}`;
  const contractName = normalizeContractName(contractNameRaw);
  const invokeBody: Record<string, unknown> = {
    contractNo,
    contractName,
    ...(strangers.length ? { strangers } : {}),
    templates: [
      {
        templateNo: String(docTemplate.asign_template_ident).trim(),
        fileName: fileName || '文书',
        fillData,
      },
    ],
  };

  if (!opts.suppressTemplateCreateToast) {
    toast.info('正在通过爱签模板创建待签署文件…');
  }

  const { data, error } = await supabase.functions.invoke('create-signing', {
    body: invokeBody,
  });

  if (error) {
    throw error;
  }

  const payload = data as Record<string, unknown> | null;
  if (payload && payload.ok === false) {
    const detail = payload.detail as { msg?: string; code?: string } | undefined;
    const debug = payload.debug as { note?: string; phase?: string } | undefined;
    const msg =
      debug?.note ??
      detail?.msg ??
      (typeof payload.error === 'string' ? payload.error : '') ??
      'create-signing 失败';
    throw new Error(msg);
  }

  const effectiveContractNo = extractContractNoFromCreateSigningResponse(data, contractNo);

  let asignTemplateHints: AsignTemplateControlHints | undefined;
  const ident = String(docTemplate.asign_template_ident || '').trim();
  if (ident) {
    const tplRes = await getAsignTemplateData({ template_ident: ident });
    if (tplRes.ok) {
      const parsed = extractAsignTemplateControlHints(tplRes.data);
      if (parsed.signKeys.length > 0) {
        asignTemplateHints = parsed;
      }
    }
  }

  return {
    contractNo,
    effectiveContractNo,
    contractName,
    asign: data,
    asignTemplateHints,
  };
}
