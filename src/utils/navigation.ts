import { usePageContext } from '#renderer/usePageContext'
import { HighlightKey } from '#/types/navigation'
import { navigate } from 'vite-plugin-ssr/client/router'

/** 定义导航项类型 */
export declare type NaivigationItem = {
  /** 导航文字 */
  text: string;

  /**
   * 是否外部链接
   * - (true) 是
   * - (false) 不是
   */
  isExternalLink?: boolean;

  /** 外部链接跳转地址 */
  externalLinkAddress?: string;

  /** 内部链接跳转的地址 */
  internalLinkRouteUrl?: string;

  /** 子级导航 */
  children?: Array<NaivigationItem>;

  /** 顶级导航高亮键名 */
  highlight?: HighlightKey;
}

/**
 * 获取导航项是否有子级导航
 * @return {boolean}
 * - (true) 有子级
 * - (false) 反之
 */
export const hasChildrenNavigation = (navigationItem: NaivigationItem) => navigationItem.children

/**
 * 顶部导航项是否有游泳圈
 * @return {boolean}
 * - (true) 有
 * - (false) 反之
 */
export const hasSwimmingCircleIcon = (navigationItem: NaivigationItem) => !navigationItem.isExternalLink

/**
 * 是否显示顶部导航项游泳圈
 * @return {boolean}
 * - (true) 显示
 * - (false) 不显示
 */
export const isDisplaySwimmingCircleIcon = (navigationItem: NaivigationItem) => {
  let pageContext = usePageContext()

  return pageContext.headerHighLightKey === navigationItem.highlight
}

/** 处理导航项点击 */
export async function handleNavigationClick(navigationItem: NaivigationItem) {
  /**
   * 如果有子级导航的话, 不做任何处理
   * 使用 css 切换子级导航
   */
   if (hasChildrenNavigation(navigationItem)) return

   /** 判断是否是外部链接 */
   switch (navigationItem.isExternalLink) {
    case true:
      window.open(navigationItem.externalLinkAddress)
    break
    case false:
      await navigate(navigationItem.internalLinkRouteUrl!)
    break
   }
}

/** 获取导航数据 */
export function getNavigation() {
  let navigationItems = $ref<Array<NaivigationItem>>([
    {
      text: 'Wolfox Club',
      internalLinkRouteUrl: import.meta.env.VITE_WOLFOX_CLUB_URL,
      isExternalLink: false,
      highlight: HighlightKey.WolfoxClub
    },
    {
      text: 'Ecology',
      children: [
        {
          text: 'OilWar',
          isExternalLink: true,
          externalLinkAddress: 'https://oilwar.surfguild.io/#/',
        },
        {
          text: 'Compass',
          isExternalLink: false,
          internalLinkRouteUrl: import.meta.env.VITE_COMPASS_URL
        },
      ],
      highlight: HighlightKey.Ecology
    },
    {
      text: 'Guide',
      children: [
        {
          text: 'Game Guide',
          isExternalLink: false,
          internalLinkRouteUrl: import.meta.env.VITE_GAME_GUIDE_URL
        },
        {
          text: 'Education Courses',
          isExternalLink: false,
          internalLinkRouteUrl: import.meta.env.VITE_EDUCATION_COURSES_URL,
        },
      ],
      highlight: HighlightKey.Guide
    },
    {
      text: 'Whitepaper',
      isExternalLink: true,
      externalLinkAddress: 'https://surfguild.gitbook.io/whitepaper/'
    }
  ])

  return navigationItems
}
