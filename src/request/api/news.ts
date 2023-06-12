import axios from '#/request'
import { type Cid } from '#/types/news'

/** 获取新闻列表 */
export declare type Response1 = {
  list: Array<{
    id: number;
    add_time: string;
    author: {
      head_img: string;
      id: number;
      name: string;
    };
    title: string;
    title_en: string;
    image_input: string[];
    synopsis: string;
    synopsis_en: string;
    content: {
      nid: number;
      content: string;
    };
    flgs: string;
  }>;
  count: number;
}
export function getNewsList(params: {
  cid: Cid;
  flgs: string;
  page: number;
  limit: number;
}) {
  return axios<Response1>({
    url: '/api/article',
    method: 'GET',
    params
  })
}

/** 获取标签列表 */
export declare type Response2 = {
  list: Array<{
    id: number;
    sortid: number;
    att: string;
    name: string;
    status: number;
  }>;
}

export function getTagsList(params: { cid: Cid; }) {
  return axios<Response2>({
    url: '/api/article/att',
    method: 'GET',
    params
  })
}

/** 获取新闻详情 */
export declare type Response3 = {
  info: {
    id: number;
    cid: string;
    title: string;
    title_en: string;
    author_id: number;
    author: {
      id: number;
      name: string;
      head_img: string;
      synopsis: string;
    };
    image_input: string[];
    video: string;
    synopsis: string;
    synopsis_en: string;
    share_title: string;
    share_synopsis: string;
    visit: number;
    sort: number;
    url: string;
    status: number;
    add_time: string;
    hide: number;
    admin_id: number;
    mer_id: number;
    product_id: number;
    is_hot: number;
    is_banner: number;
    banner_location: string;
    flgs: string;
    like_count: number;
    content: {
      nid: number;
      content: string;
    };
    catename: string;
    cateName: {
      id: number;
      aid: number;
      pid: number;
      title: string;
      intr: string;
      image: string;
      status: number;
      sort: number;
      is_del: number;
      add_time: string;
      hidden: number;
    };
  },
  recommend: Array<{
    id: number;
    cid: string;
    title: string;
    title_en: string;
    author_id: number;
    author: {
      id: number;
      name: string;
      head_img: string;
    };
    image_input: string[];
    video: string;
    synopsis: string;
    synopsis_en: string;
    share_title: string;
    share_synopsis: string;
    visit: number;
    sort: number;
    url: string;
    status: number;
    add_time: string;
    hide: number;
    admin_id: number;
    mer_id: number;
    product_id: number;
    is_hot: number;
    is_banner: number;
    banner_location: string;
    flgs: string;
    like_count: number;
    content: {
      nid: number;
      content: string;
    };
    catename: string;
    cateName: {
      id: 21,
      aid: number;
      pid: number;
      title: string;
      intr: string;
      image: string;
      status: 1,
      sort: number;
      is_del: number;
      add_time: string;
      hidden: number;
    }
  }>
}
export function getDetail(params: { id: string; }) {
  return axios<Response3>({
    url: `/api/article/${ params.id }`,
    method: 'GET'
  })
}
