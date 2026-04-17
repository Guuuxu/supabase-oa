/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 爱签 addSigner 个人签署方 validateType，默认 7；需逐字手写识别且平台开通时可设 6 */
  readonly VITE_ASIGN_VALIDATE_TYPE_INDIVIDUAL?: string;
  /** 企业签署方 validateType，默认 16 */
  readonly VITE_ASIGN_VALIDATE_TYPE_ENTERPRISE?: string;
  /**
   * 仅用于「非爱签模板」路径（如 HTML 转 PDF 上传）：addSigner 个人侧日期签署位 signKey 列表，逗号分隔。
   * 爱签模板发起时会实时拉 getTemplateData，以 signType=2 的签署位为准，不再使用本变量默认值。
   */
  readonly VITE_ASIGN_DATE_SIGN_KEYS?: string;
  /**
   * 个人签署方除「个人」手写区外，模板中额外存在的签署位 signKey（signType=1），逗号分隔，须与控制台一致。
   * 默认不传；勿填模板里不存在的 key，否则会报 100617。
   */
  readonly VITE_ASIGN_PARTY_B_EXTRA_SIGN_KEYS?: string;
}
