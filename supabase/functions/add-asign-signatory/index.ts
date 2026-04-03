// @ts-nocheck
/**
 * 爱签：添加签署方 —— 对应开放平台「contract/addSigner」。
 *
 * 文档要点（bizData 内字段）：
 * - contractNo *、account *、signType *（2 静默签 3 感知签）
 * - signStrategyList *（List{Object}）；customSignFlag=0（默认）时须与 signStrategyList 或骑缝策略配合，见开放平台
 * - sealNo、authSignAccount、noticeMobile、signOrder（字符串）、isNotice、validateType 等可选
 *
 * **多名用户（数组、且同一合同仅能调一次本接口）：** 开放平台说明：须一次性传入全部签署方；官方示例中 **bizData 序列化后为 JSON 数组根**：
 * `[{ contractNo, account, signStrategyList, signType, ... }, ...]`，每项含 **contractNo**（与示例一致）。
 * 本函数将 body.signers[] 组装为上述数组，经 callAsignFormPost 的 **bizDataInputArray** 发送（勿再包一层 signUser 等键名，除非文档另有说明）。
 *
 * 环境变量：
 * - ASIGN_PRIVATE_KEY + ASIGN_APP_ID：**必填**（与 createContract 相同）。callAsignFormPost 用其生成请求头 sign；
 *   未配置则无有效签名；爱签侧常见 100016「签名不匹配」多与私钥/appId/签名字符串规则不一致有关。
 * - ASIGN_BASE_URL / ASIGN_SIGN_* / ASIGN_BIZDATA_*：同上，在 ../_shared/asign-client.ts 的 callAsignFormPost → buildAsignHeaders 中读取（本文件不直接 Deno.env.get）
 * - ASIGN_ADD_SIGNATORY_PATH：默认 contract/addSigner
 * - ASIGN_DEFAULT_SIGN_TYPE：未传 signType 时默认，默认 3
 * - ASIGN_DEFAULT_IS_NOTICE：未传 isNotice 时默认，默认 1（发短信签署链接）
 * - ASIGN_DEFAULT_VALIDATE_TYPE：未传 validateType 时写入该值（可选，不设则不传该字段）
 * - ASIGN_ENTERPRISE_SEAL_NO：企业签署方默认印章编号（当前端 signers[i].isEnterpriseSigner=true 且未显式传 sealNo 时自动注入）
 * - ASIGN_ADD_SIGNER_SIGN_ORDER_AS_NUMBER=1：signOrder 序列化为数字（部分网关不接受字符串 "1"）
 * - 本地统一写在 supabase/functions/.env，functions serve 会注入整目录函数的 Deno.env
 *
 * 若长期出现「[test]请求参数异常」且换 validateType 无效：多为 account 未注册、attachNo/坐标与文档不符、
 * 或 signStrategyList 形态（可试 ASIGN_SIGN_STRATEGY_LIST_AS_STRING=1）。需爱签根据完整 bizData 与 appId 查后台原因。
 *
 * 业务流程：本仓库在 addSigner 成功后**不再**调用其它爱签「提交合同」类接口；成功返回中常见 data.signUser[].signUrl，
 * 且 isNotice=1 时会发短信签署链接，由用户去爱签 H5 完成签署即可。
 */
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { bizDataRecordLikeNodeDemoGeneric, callAsignFormPost } from "../_shared/asign-client.ts";
import { corsHeaders } from "../_shared/cors.ts";

const DEBUG = "[ADD_ASIGN_SIGNATORY]";

/** 仅允许出现在 signStrategyList[] 内的键；误把 validateType / 外层 signType 等塞进策略项会导致 [test] 参数异常 */
const SIGN_STRATEGY_ALLOW_KEYS = new Set([
  "attachNo",
  "locationMode",
  "sealNo",
  "canDrag",
  "signKey",
  "signType",
  "signPage",
  "signX",
  "signY",
  "offsetX",
  "offsetY",
]);

/** 与文档「添加签署方 addSigner」单条请求参数一致（除 contractNo 由顶层合并） */
type SignStrategyItem = {
  attachNo: number;
  locationMode: number;
  sealNo?: number;
  canDrag?: number;
  signKey?: string;
  signType?: number;
  signPage?: number;
  signX?: number;
  signY?: number;
  offsetX?: number;
  offsetY?: number;
};

type AddSignerItem = {
  account: string;
  signType?: number;
  sealNo?: string;
  authSignAccount?: string;
  noticeMobile?: string;
  /** 顺序签署序号，从 1 起；无序签署可传 "1" */
  signOrder?: string;
  /** 0 否 1 是，是否短信通知签署链接 */
  isNotice?: number;
  validateType?: number;
  /**
   * 0 由 signStrategyList/骑缝指定位置（默认）；1 用户拖拽签章；2 拖拽签章+骑缝。
   * 传了 signStrategyList 时若不传，Edge 会写 customSignFlag=0。
   */
  customSignFlag?: number;
  /** 前端标记企业签署方；用于后端注入企业默认印章编号 */
  isEnterpriseSigner?: boolean;
  sealSetting?: number;
  signStrategyList?: SignStrategyItem[];
};

type AddSignatoryBody = {
  signingRecordId?: string;
  contractNo: string;
  /** 模式 A：完整 bizData，单次请求（仅添加一名签署方时使用） */
  bizData?: Record<string, unknown>;
  /**
   * 模式 B：**多名签署方**，数组；合并为 **一次** addSigner 请求（合同维度仅可调一次该接口）。
   */
  signers?: AddSignerItem[];
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** 失败时在控制台打出爱签 msg/code；泛化「参数异常」常与 validateType 无关 */
function logAddSignerAsignFailure(
  label: string,
  asignResult: {
    status: number;
    data?: unknown;
    debug?: {
      asignMsg?: unknown;
      asignCode?: unknown;
      url?: string;
      attempt?: string;
    };
  },
  opts?: { bizDataJson?: string },
) {
  const asignMsg = asignResult.debug?.asignMsg;
  console.warn(`${DEBUG} addSigner 失败 ${label}`, {
    asignMsg,
    asignCode: asignResult.debug?.asignCode,
    attempt: asignResult.debug?.attempt,
    url: asignResult.debug?.url,
    httpStatus: asignResult.status,
    detail: asignResult.data,
  });
  const msgStr = String(asignMsg ?? "");
  if (/参数异常|请仔细核对/.test(msgStr)) {
    console.warn(`${DEBUG} 泛化「参数异常」排查（多数与 validateType 无关）`, {
      checklist: [
        "account 是否已在当前 ASIGN_APP_ID 下注册为爱签用户",
        "contractNo 是否与 create 一致（前端应使用 create-signing 返回的 effectiveContractNo，勿仅用本地生成的号）",
        "signStrategyList[].attachNo 是否与 create 返回 contractFiles 一致",
        "坐标签章坐标是否与官方约定一致（比例/像素）",
        "可试 .env：ASIGN_SIGN_STRATEGY_LIST_AS_STRING=1、ASIGN_ADD_SIGNER_SIGN_ORDER_AS_NUMBER=1",
        "仍无解：把本条下方 bizDataJson 与爱签技术支持核对",
      ],
      bizDataJson: opts?.bizDataJson,
    });
  }
}

/**
 * 开放平台文档：signStrategyList 为 List{Object}，默认保持 **数组** 参与 JSON 序列化。
 * 仅当个别网关要求字符串时设 ASIGN_SIGN_STRATEGY_LIST_AS_STRING=1 再 JSON.stringify。
 */
function normalizeBizDataSignStrategyList(biz: Record<string, unknown>): Record<string, unknown> {
  const raw = (Deno.env.get("ASIGN_SIGN_STRATEGY_LIST_AS_STRING") ?? "0").trim().toLowerCase();
  const stringifyList = raw === "1" || raw === "true" || raw === "string";
  const list = biz.signStrategyList;
  if (!Array.isArray(list) || list.length === 0) {
    return biz;
  }
  if (stringifyList) {
    return { ...biz, signStrategyList: JSON.stringify(list) };
  }
  return biz;
}

/** 文档：customSignFlag 为 0 时须传 signStrategyList 或骑缝策略；有策略列表时显式传 0 避免服务端默认值不一致 */
function ensureCustomSignFlagWhenStrategyList(biz: Record<string, unknown>): Record<string, unknown> {
  const list = biz.signStrategyList;
  const hasList = Array.isArray(list) && list.length > 0;
  if (!hasList) {
    return biz;
  }
  const cur = biz.customSignFlag;
  if (cur !== undefined && cur !== null && String(cur).trim() !== "") {
    return biz;
  }
  return { ...biz, customSignFlag: 0 };
}

function getAddSignatoryPath(): string {
  let raw = (Deno.env.get("ASIGN_ADD_SIGNATORY_PATH") ?? "contract/addSigner").trim();
  raw = raw.replace(/^\/+/, "");
  /** 常见笔误：addSign 不是文档中的「添加签署方」接口，应为 addSigner */
  if (raw === "contract/addSign") {
    console.warn(
      `${DEBUG} ASIGN_ADD_SIGNATORY_PATH 为 contract/addSign，已自动改为 contract/addSigner（请勿少写 er）`,
    );
    return "contract/addSigner";
  }
  return raw;
}

function parseIntEnv(key: string, defaultVal: number): number {
  const raw = Deno.env.get(key);
  if (raw === undefined || raw === "") return defaultVal;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : defaultVal;
}

/** 文档：signX/signY 为 Double 且常要求保留两位小数；坐标签章策略内 signType 应为 1（签章）或 2（时间戳），勿传外层感知签 3 */
function normalizeSignStrategyListForAsign(raw: SignStrategyItem[]): SignStrategyItem[] {
  return raw.map((entry) => {
    const next: SignStrategyItem = { ...entry };

    let loc = next.locationMode;
    if (loc !== undefined && loc !== null && String(loc).trim() !== "") {
      const n = Number(loc);
      if (Number.isFinite(n)) {
        next.locationMode = n;
        loc = n;
      }
    }

    const hasCoord =
      next.signPage !== undefined &&
      next.signPage !== null &&
      next.signX !== undefined &&
      next.signX !== null &&
      next.signY !== undefined &&
      next.signY !== null;
    if (hasCoord && (loc === undefined || loc === null || !Number.isFinite(Number(loc)))) {
      next.locationMode = 2;
      loc = 2;
      console.warn(
        `${DEBUG} signStrategyList 项含 signPage/signX/signY 但未有效 locationMode，已补 locationMode=2（坐标签章）`,
      );
    }

    if (next.signX !== undefined && next.signX !== null) {
      const x = Number(next.signX);
      if (Number.isFinite(x)) {
        next.signX = Math.round(x * 100) / 100;
      }
    }
    if (next.signY !== undefined && next.signY !== null) {
      const y = Number(next.signY);
      if (Number.isFinite(y)) {
        next.signY = Math.round(y * 100) / 100;
      }
    }

    const isSeatMode = Number(loc) === 2;
    if (isSeatMode) {
      const st = next.signType;
      if (st === undefined || st === null) {
        next.signType = 1;
      } else if (Number(st) === 3) {
        console.warn(
          `${DEBUG} 坐标签章策略项误含 signType=3（3 仅用于 bizData 外层感知签），已改为 1`,
        );
        next.signType = 1;
      }
    }

    /** 字符串 locationMode、或其它路径漏判时，策略内仍不应出现 3（与外层感知签混淆） */
    if (Number(next.signType) === 3) {
      console.warn(
        `${DEBUG} signStrategyList 项 signType=3 已强制改为 1（避免与爱签参数校验冲突）`,
      );
      next.signType = 1;
    }

    return next;
  });
}

/** 去掉策略项内误嵌套的 validateType、noticeMobile 等，再坐标规范化 */
function sanitizeAndNormalizeSignStrategyList(raw: SignStrategyItem[]): SignStrategyItem[] {
  return normalizeSignStrategyListForAsign(
    raw.map((entry) => {
      const ex = entry as Record<string, unknown>;
      const cleaned: Record<string, unknown> = {};
      const stripped: string[] = [];
      for (const key of Object.keys(ex)) {
        if (SIGN_STRATEGY_ALLOW_KEYS.has(key)) {
          cleaned[key] = ex[key];
        } else {
          stripped.push(key);
        }
      }
      if (stripped.length > 0) {
        console.warn(
          `${DEBUG} signStrategyList 项已移除非文档字段（请放在 bizData 顶层，勿塞进策略对象）`,
          { stripped },
        );
      }
      return cleaned as unknown as SignStrategyItem;
    }),
  );
}

function normalizeBizDataStrategyCoordinates(biz: Record<string, unknown>): Record<string, unknown> {
  const list = biz.signStrategyList;
  if (!Array.isArray(list) || list.length === 0) {
    return biz;
  }
  return {
    ...biz,
    signStrategyList: sanitizeAndNormalizeSignStrategyList(list as SignStrategyItem[]),
  };
}

/** 单名签署方除 contractNo 外的字段；与 contractNo 合并后为官方示例数组中的一项 */
function signerBizFieldsFromItem(item: AddSignerItem): Record<string, unknown> {
  const account = (item.account ?? "").trim();
  if (!account) {
    throw new Error("每位签署方必须提供 account（用户唯一标识码）");
  }

  const defaultSignType = parseIntEnv("ASIGN_DEFAULT_SIGN_TYPE", 3);
  const signType = item.signType !== undefined && item.signType !== null
    ? Number(item.signType)
    : defaultSignType;

  const out: Record<string, unknown> = {
    account,
    signType,
  };

  if (Array.isArray(item.signStrategyList) && item.signStrategyList.length > 0) {
    out.signStrategyList = sanitizeAndNormalizeSignStrategyList(item.signStrategyList);
    if (item.customSignFlag !== undefined && item.customSignFlag !== null) {
      out.customSignFlag = Number(item.customSignFlag);
    } else {
      out.customSignFlag = parseIntEnv("ASIGN_DEFAULT_CUSTOM_SIGN_FLAG", 0);
    }
  }
  if (
    item.sealSetting !== undefined &&
    item.sealSetting !== null &&
    Number.isFinite(Number(item.sealSetting))
  ) {
    out.sealSetting = Number(item.sealSetting);
  }

  if (item.sealNo !== undefined && item.sealNo !== null && String(item.sealNo).trim() !== "") {
    out.sealNo = String(item.sealNo).trim();
  } else if (item.isEnterpriseSigner === true) {
    const enterpriseSealNo = (Deno.env.get("ASIGN_ENTERPRISE_SEAL_NO") ?? "").trim();
    if (enterpriseSealNo) {
      out.sealNo = enterpriseSealNo;
    }
  }
  if (item.authSignAccount !== undefined && item.authSignAccount !== null && String(item.authSignAccount).trim() !== "") {
    out.authSignAccount = String(item.authSignAccount).trim();
  }
  if (item.noticeMobile !== undefined && item.noticeMobile !== null && String(item.noticeMobile).trim() !== "") {
    out.noticeMobile = String(item.noticeMobile).trim().replace(/\s/g, "");
  }
  if (item.signOrder !== undefined && item.signOrder !== null && String(item.signOrder).trim() !== "") {
    const rawSo = String(item.signOrder).trim();
    const orderAsNumber = (Deno.env.get("ASIGN_ADD_SIGNER_SIGN_ORDER_AS_NUMBER") ?? "").trim() === "1";
    if (orderAsNumber) {
      const n = parseInt(rawSo, 10);
      out.signOrder = Number.isFinite(n) ? n : rawSo;
    } else {
      out.signOrder = rawSo;
    }
  }

  if (item.isNotice !== undefined && item.isNotice !== null) {
    out.isNotice = Number(item.isNotice);
  } else {
    const defNotice = Deno.env.get("ASIGN_DEFAULT_IS_NOTICE");
    if (defNotice !== undefined && defNotice !== "") {
      out.isNotice = parseInt(defNotice, 10);
    } else {
      out.isNotice = 1;
    }
  }

  if (item.validateType !== undefined && item.validateType !== null) {
    out.validateType = Number(item.validateType);
  } else {
    const defVt = Deno.env.get("ASIGN_DEFAULT_VALIDATE_TYPE");
    if (defVt !== undefined && defVt !== "") {
      out.validateType = parseInt(defVt, 10);
    } else if (signType === 3) {
      /** 有感知签（signType=3）时，测试环境常要求指定意愿校验方式；1=短信验证码签 */
      const skip = (Deno.env.get("ASIGN_SKIP_DEFAULT_VALIDATE_FOR_PERCEIVED") ?? "").trim() === "1";
      if (!skip) {
        out.validateType = 1;
      }
    }
  }

  const isNoticeVal = Number(out.isNotice);
  if (isNoticeVal === 1) {
    const nmRaw = out.noticeMobile;
    const nm =
      nmRaw !== undefined && nmRaw !== null ? String(nmRaw).trim().replace(/\s/g, "") : "";
    if (nm === "") {
      throw new Error(
        "开启签署链接短信（isNotice=1）时必须传 noticeMobile（仅用于接收签署链接，非意愿验证码短信）",
      );
    }
    out.noticeMobile = nm;
  }

  return out;
}

/** 组装单条 addSigner 的 bizData（仅一名签署方时使用模式 A 或与 contractNo 合并） */
function bizDataForOneSigner(contractNo: string, item: AddSignerItem): Record<string, unknown> {
  const no = (contractNo ?? "").trim();
  return { contractNo: no, ...signerBizFieldsFromItem(item) };
}

function normalizeOneSignerObjectInArray(el: Record<string, unknown>): Record<string, unknown> {
  let x: Record<string, unknown> = { ...el };
  x = normalizeBizDataSignStrategyList(x);
  x = ensureCustomSignFlagWhenStrategyList(x);
  x = normalizeBizDataStrategyCoordinates(x);
  return x;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return json({ error: "缺少 SUPABASE_URL / SUPABASE_ANON_KEY 环境变量" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    const body = (await req.json()) as AddSignatoryBody;
    if (!body?.contractNo || typeof body.contractNo !== "string") {
      return json({ error: "缺少 contractNo" }, 400);
    }

    if (body.signingRecordId) {
      const { data: row, error } = await supabase
        .from("signing_records")
        .select("id, third_party_contract_no")
        .eq("id", body.signingRecordId)
        .maybeSingle();

      if (error) {
        console.log(`${DEBUG} signing_records 查询失败`, { error });
        return json({ error: "无法校验签署记录", detail: error.message }, 400);
      }
      if (!row) {
        return json({ error: "未找到签署记录 signingRecordId" }, 404);
      }
      if (row.third_party_contract_no && row.third_party_contract_no !== body.contractNo) {
        return json({
          error: "contractNo 与签署记录中的第三方合同号不一致",
          expected: row.third_party_contract_no,
          got: body.contractNo,
        }, 400);
      }
    }

    const path = getAddSignatoryPath();
    const keepEmptyKeysRaw = Deno.env.get("ASIGN_ADD_SIGNATORY_KEEP_EMPTY_KEYS");
    let keepEmptyStringKeys: string[] = [];
    if (keepEmptyKeysRaw && keepEmptyKeysRaw.trim()) {
      keepEmptyStringKeys = keepEmptyKeysRaw.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const hasBizData = body.bizData && typeof body.bizData === "object" && !Array.isArray(body.bizData);
    const hasSigners = Array.isArray(body.signers) && body.signers.length > 0;

    if (hasBizData && hasSigners) {
      return json({ error: "请勿同时传 bizData 与 signers" }, 400);
    }

    if (!hasBizData && !hasSigners) {
      return json({
        error: "请提供 bizData（单对象）或 signers（数组，合并为单次 addSigner 的 JSON 数组根）",
      }, 400);
    }

    if (hasBizData) {
      let bizDataInput = { ...body.bizData };
      const no = bizDataInput.contractNo;
      if (typeof no === "string" && no !== body.contractNo) {
        return json({ error: "bizData.contractNo 与顶层 contractNo 不一致" }, 400);
      }
      if (bizDataInput.contractNo === undefined || bizDataInput.contractNo === null) {
        bizDataInput.contractNo = body.contractNo;
      }

      bizDataInput = normalizeBizDataSignStrategyList(bizDataInput);
      bizDataInput = ensureCustomSignFlagWhenStrategyList(bizDataInput);
      bizDataInput = normalizeBizDataStrategyCoordinates(bizDataInput);

      console.log(`${DEBUG} 单次 bizData 调用`, { path, contractNo: body.contractNo });
      console.log(`${DEBUG} 发往爱签 addSigner 的 bizData(JSON)=`, JSON.stringify(bizDataInput));

      const asignResult = await callAsignFormPost({
        path,
        bizDataInput,
        keepEmptyStringKeys,
        strictBizDataOverride: bizDataRecordLikeNodeDemoGeneric(bizDataInput),
        debugLogPrefix: DEBUG,
      });

      if (!asignResult.ok) {
        logAddSignerAsignFailure("(单次 bizData)", asignResult, {
          bizDataJson: JSON.stringify(bizDataInput),
        });
        const debug = asignResult.debug;
        let hint: string | undefined;
        if (debug?.missingPrivateKey) {
          hint =
            "未配置 ASIGN_PRIVATE_KEY（或本地未注入 secrets）。请在 Supabase secrets 中配置，或使用 _shared/asign-client.ts 中 FALLBACK（仅本地）。";
        }
        return json(
          {
            ok: false,
            error: "爱签 addSigner 调用失败",
            ...(hint && { hint }),
            status: asignResult.status,
            detail: asignResult.data,
            debug,
          },
          200,
        );
      }

      return json({ ok: true, asign: asignResult.data, path, mode: "single" });
    }

    const signers = body.signers;
    /** 与爱签示例一致：bizData 根为数组，每项含 contractNo、account、signStrategyList、signType… */
    const bizDataInputArray: Record<string, unknown>[] = [];

    for (let i = 0; i < signers.length; i++) {
      try {
        let row = bizDataForOneSigner(body.contractNo, signers[i]);
        row = normalizeOneSignerObjectInArray(row);
        bizDataInputArray.push(row);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return json(
          {
            ok: false,
            error: message,
            failedIndex: i,
          },
          400,
        );
      }
    }

    console.log(`${DEBUG} 批量添加签署方（单次 addSigner）：bizData 根为 JSON 数组，共 ${signers.length} 项`, {
      path,
      contractNo: body.contractNo,
    });
    console.log(`${DEBUG} 发往爱签 addSigner 的 bizData(JSON)=`, JSON.stringify(bizDataInputArray));

    const asignResult = await callAsignFormPost({
      path,
      bizDataInputArray,
      keepEmptyStringKeys,
      debugLogPrefix: DEBUG,
    });

    if (!asignResult.ok) {
      logAddSignerAsignFailure("(单次批量 JSON 数组根)", asignResult, {
        bizDataJson: JSON.stringify(bizDataInputArray),
      });
      const debug = asignResult.debug;
      let hint: string | undefined;
      if (debug?.missingPrivateKey) {
        hint =
          "未配置 ASIGN_PRIVATE_KEY（或本地未注入 secrets）。请在 Supabase secrets 中配置。";
      }
      return json(
        {
          ok: false,
          error: "爱签 addSigner 调用失败（批量数组模式）",
          ...(hint && { hint }),
          status: asignResult.status,
          detail: asignResult.data,
          debug,
        },
        200,
      );
    }

    return json({
      ok: true,
      asign: asignResult.data,
      count: signers.length,
      path,
      mode: "batch_once",
      bizDataRoot: "json_array",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.log(`${DEBUG} 异常`, { message });
    return json({
      ok: false,
      error: "add-asign-signatory 运行异常",
      detail: message,
    }, 200);
  }
});
