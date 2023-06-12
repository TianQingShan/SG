import type { PageContext } from './types'

/** 获取网站标题 */
export function getPageTitle(pageContext: PageContext) {
  let { getDocumentProps } = pageContext.exports

  let title = getDocumentProps?.(pageContext.pageProps)?.title || 'A Web3 Gamer Guild'

  return title + ' | Surf Guild'
}

/** 获取网站描述 */
export function getPageDescription(pageContext: PageContext) {
  let { getDocumentProps } = pageContext.exports

  let description = getDocumentProps?.(pageContext.pageProps)?.description || 'Surf Guild is a P2E guild that brings players to earn via web3 game & social'

  return description
}

/** 获取分享图片 */
export function getImage(pageContext: PageContext) {
  let { getDocumentProps } = pageContext.exports

  let image = getDocumentProps?.(pageContext.pageProps)?.image || '/seo/black-white-logo.png'

  return image
}
