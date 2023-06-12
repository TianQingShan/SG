import axios from '#/request'

/** 获取筛选项对应数量 */
export declare type Response1 = {
  attr_stat: {
    [propName: string]: number;
  };
}
export function getFilterItemNumber() {
  return axios<Response1>({
    url: '/api/nft_index',
    method: 'GET'
  })
}

/** 获取列表数据 */
export declare type Response2 = {
  count: number;
  list: Array<{
    address: string;
    id: number;
    img_url: string;
    name: string;
    token_id: string;
  }>;
}
export function getList(params: { attr?: string[]; token_id?: string; }) {
  return axios<Response2>({
    url: '/api/nft_list',
    method: 'GET',
    params
  })
}

/** 获取列表项详情数据 */
export declare type Response3 = {
  detail: {
    address: string;
    attr: Array<{
      trait_type: string;
      value: string;
    }>;
    id: number;
    img_url: string;
    name: string;
    token_id: string;
  };
}
export function getListItemDetail(params: { id: string; mint?: number; }) {
  return axios<Response3>({
    url: '/api/nft_info',
    method: 'GET',
    params
  })
}
