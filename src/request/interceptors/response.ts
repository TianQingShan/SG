import axios from 'axios'
import { type AxiosResponse } from 'axios'
import { IS_OPEN_AES, AESdecrypt } from '#/utils/aes'
import type { ResponseData } from '#/request/types/response'

let { AxiosError } = axios

/**
 * 响应拦截成功
 * @param response
 *
 */
export async function success(response: AxiosResponse) {
  /**
   * 获取响应后的数据
   * 并且判断是否需要解密数据
   */
  let _data = response.data
  let _response = (!response.config.closeAes && IS_OPEN_AES) ? JSON.parse(AESdecrypt(_data)) : _data

  if (response.config.noWrapper) return _response

  let { data, msg, status } = _response as ResponseData

  switch (status) {
    /** 处理成功 */
    case 200:
      return data
    /** 登录过期 */
    case 410000:
    case 410001:
    case 410002:
      return Promise.reject(new AxiosError(msg, String(status)))
    /** 其他情况 */
    default:
      return Promise.reject(new AxiosError(msg, String(status)))
  }
}

/**
 * 响应拦截失败
 * @param error 错误
 */
export function error(error: any) {
  return Promise.reject(error)
}
