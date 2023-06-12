import axios from '#/request'

/** 获取首页数据 */
export declare type Response1 = {
  banner: Array<{
    addon: {
      down_and: string;
      down_ios: string;
      game_url: string;
      icon: string;
      nid: number;
    };
    cid: string;
    content: string;
    id: number;
    image_input: string[];
    synopsis: string;
    synopsis_en: string;
    title: string;
    title_en: string;
    video: string;
  }>;
  game: Array<{
    icon: string;
    id: number;
    image: string;
    introduces: string;
    introduces_en: string;
    is_del: number;
    name: string;
    name_en: string;
    sort: number;
    status: number;
    tag: string;
    video: string;
    web_url: string;
  }>;
  scholarship: Array<{
    id: number;
    image: string;
    introduces: string;
    introduces_en: string;
    is_del: number;
    name: string;
    name_en: string;
    sort: number;
    status: number;
    web_url: string;
  }>;
  journey: Array<{
    button: string;
    id: number;
    name: string;
    name_en: string;
    image: string;
    status: number;
    introduces: string;
    introduces_en: string;
    web_url: string;
    is_del: number;
    sort: number;
    content: string;
  }>;
}
export function getHomeData() {
  return axios<Response1>({
    url: '/api/home',
    method: 'GET'
  })
}
