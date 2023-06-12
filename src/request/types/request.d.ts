export declare type WarpperReturn<D = unknown> = {
  /**
   * 取消请求函数
   */
  cancel: () => void;
  /**
   * 请求函数
   */
  request: () => Promise<D>;
}
