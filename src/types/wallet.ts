/** 钱包连接状态枚举值 */
export const enum WalletConnectStatus {
  /** 未连接 */
  NotConnect,

  /** 正在连接中 */
  Connecting,

  /** 已连接 */
  Connected,

  /** 连接失败 */
  Failed
}

/** 提供商名称枚举值 */
export const enum ProviderName {
  MeteMask,

  Walletconnect
}
