import axios from '#/request'

/** 登录 */
declare type Response1 = {
  expires_time: number;
  sign_code: string;
  spread_code: string;
  token: string;
}

export function login(data: { signature: string; address: string; message: string; spread_code?: string; utm_source?: string; }) {
  return axios<Response1>({
    url: '/api/v1.meta_mask_login',
    method: 'POST',
    data
  })
}

/** 获取登录随机码 */
declare type Response2 = {
  walletLoginOnce: string;
  verifyStr: string;
}

export function getLoginRandomCode(params: { address: string; }) {
  return axios<Response2>({
    url: '/api/v1.login/walletLoginOnce',
    method: 'GET',
    params
  })
}
