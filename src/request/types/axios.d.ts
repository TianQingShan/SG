import { AxiosRequestConfig } from 'axios'

declare module 'axios' {
  export interface AxiosInstance {
    <D = unknown>(): Promise<D>;
  }
  export interface AxiosRequestConfig {
    closeHeadersAuthoriZation?: boolean;
    closeAes?: boolean;
    noWrapper?: boolean;
  }
}
