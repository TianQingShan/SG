import axios, { type AxiosRequestConfig } from 'axios'
import { success as requestSuccess, error as requestError } from './interceptors/request'
import { success as responseSuccess, error as responseError } from './interceptors/response'
import type { WarpperReturn } from '#/request/types/request'
/**
 * axios 实例配置对象 baseURL 的值
 * 根据开发环境以及生产环境取不同的值
 * 注: 因为开发环境中使用了 proxy, 所以取值为空字符串(及当前开发地址)
 */
const BASE_URL: Record<string, string> = {
  true: '',
  false: import.meta.env.VITE_AXIOS_BASEURL
}

/** axios 实例配置对象 */
const AXIOS_INSTANCE_CONFIG: AxiosRequestConfig = {
  baseURL: BASE_URL[String(import.meta.env.DEV)],
  timeout: 200000
}

/** 创建 axios 实例 */
const axiosInstance = axios.create(AXIOS_INSTANCE_CONFIG)

/** 请求/响应 拦截器 */
axiosInstance.interceptors.request.use(requestSuccess, requestError)
axiosInstance.interceptors.response.use(responseSuccess, responseError)

/**
 * 包装函数
 * @param config 请求配置对象
 */
function warpper<D = unknown>(config: AxiosRequestConfig): WarpperReturn<D> {
  const controller = new AbortController()
  const { signal } = controller

  return {
    cancel: () => controller.abort(),
    request: axiosInstance.bind(null, { ...config, signal })
  } as WarpperReturn<D>
}

export default warpper
