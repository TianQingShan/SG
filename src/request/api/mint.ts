import axios from '#/request'

/** 获取中奖者名单 */
export declare type Response1 = {
	list: string[]
}
export function getPrizeWinnerList() {
	return axios<Response1>({
		url: '/api/mint_address',
		method: 'GET'
	})
}

/** 白名单查询 */
export declare type Response2 = {
	is_whitelist: 0 | 1;
}
export function whiteListQuery(data: { address: string; }) {
	return axios<Response2>({
		url: '/api/v1.user/check_mint_whitelist',
		method: 'POST',
		data
	})
}

/** 抽奖签名 */
declare type Response3 = {
	deadline: number;
	signature: string;
}
export function lotterySignature() {
	return axios<Response3>({
		url: '/api/get_mint_nft',
		method: 'POST'
	})
}

/** 获取详情 */
export declare type Response4 = {
  attributes: Array<{
		trait_type: string;
		extra: string;
		value: string;
	}>,
  name: string;
  description: string;
  image: string;
}
export function getDetail(params: { id: string; }) {
	return axios<Response4>({
		url: '/api/nft_ipfs',
		method: 'GET',
		params
	})
}

/** 取消抽奖签名 */
declare type Response5 = any
export function cancelLotterySignature() {
	return axios<Response5>({
		url: '/api/cancel_mint_nft',
		method: 'POST'
	})
}
