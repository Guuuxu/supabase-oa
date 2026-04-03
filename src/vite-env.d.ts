/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 爱签 addSigner 个人签署方 validateType，默认 7；需逐字手写识别且平台开通时可设 6 */
  readonly VITE_ASIGN_VALIDATE_TYPE_INDIVIDUAL?: string;
  /** 企业签署方 validateType，默认 16 */
  readonly VITE_ASIGN_VALIDATE_TYPE_ENTERPRISE?: string;
}
