export declare type ResponseData<T = any> = {
  /**
   * 响应数据
   */
  data: T;
  /**
   * 响应信息
   * 后端返回的 成功/失败 信息文本
   */
  msg: string;
  /**
   * 响应状态码
   * 通过这个状态码在自己的逻辑代码中做不同的处理
   */
  status: number;
}
