import axios from '#/request'

/** 订阅 */
declare type Response1 = {
  result: 0 | 1 | 2;
}
export function subscribe(data: { address: string; }) {
  return axios<Response1>({
    url: '/api/add_user_mail',
    method: 'POST',
    data
  })
}
