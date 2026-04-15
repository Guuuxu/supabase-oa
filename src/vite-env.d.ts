/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 爱签 addSigner 个人签署方 validateType，默认 7；需逐字手写识别且平台开通时可设 6 */
  readonly VITE_ASIGN_VALIDATE_TYPE_INDIVIDUAL?: string;
  /** 企业签署方 validateType，默认 16 */
  readonly VITE_ASIGN_VALIDATE_TYPE_ENTERPRISE?: string;
  /**
   * 爱签模板「签署日期」位在 addSigner 中的 signKey 列表，逗号分隔，须与控制台 key 完全一致。
   * 未列出的 key 不要写，否则会报模板参数不存在（如 100617）。默认：当前日期
   */
  readonly VITE_ASIGN_DATE_SIGN_KEYS?: string;
  /**
   * 个人签署方除「个人」手写区外，模板中额外存在的签署位 signKey（signType=1），逗号分隔，须与控制台一致。
   * 默认不传；勿填模板里不存在的 key，否则会报 100617。
   */
  readonly VITE_ASIGN_PARTY_B_EXTRA_SIGN_KEYS?: string;
}
