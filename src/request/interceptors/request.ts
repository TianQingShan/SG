import { type AxiosRequestConfig } from 'axios'
import { IS_OPEN_AES, AESencrypt } from '#/utils/aes'
import { isClient } from '#/utils/get-env'

/**
 * 请求拦截成功
 * @param confgi 请求配置
 */
export function success(config: AxiosRequestConfig) {
  /** 添加请求头 */
  const LOGIN_INFO = isClient && JSON.parse(localStorage.getItem('SG_INFO') || null!)
  if (LOGIN_INFO && !config.closeHeadersAuthoriZation) config.headers!['Authori-zation'] = 'Bearer ' + LOGIN_INFO.token

  /** 通知后端所选语言 */
  const LANGUAGE_KEY = isClient && localStorage.getItem('SG_LOCALE')
  isClient && (document.cookie = `think_lang=${ LANGUAGE_KEY }`)

  /** 加密请求数据 */
  if (!config.closeAes) {
    const getRequestMethod = config.method!.toUpperCase()

    switch (getRequestMethod) {
      case 'GET':
        const params = config.params || {}

        if (IS_OPEN_AES) config.params = { data: AESencrypt(JSON.stringify(params)) }
        else config.params = { ...params, wakaka: 1 }
        break
      case 'POST':
        const data = config.data || {}

        if (IS_OPEN_AES) config.data = { data: AESencrypt(JSON.stringify(data)) }
        else config.data = { ...data, wakaka: 1 }
        break
    }
  }

  return config
}

/**
 * 请求拦截失败
 * @param error 错误
 */
export function error(error: any) {
  return Promise.reject(error)
}
