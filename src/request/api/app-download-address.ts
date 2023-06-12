import axios from '#/request'

export declare type Response1 = {
  android: string;
  ios: string;
}
export function getAppDownLoadAddress() {
  return axios<Response1>({
    url: '/api/app_package',
    method: 'GET'
  })
}
