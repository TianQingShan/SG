import { PageContext } from '#renderer/types'
import { resolveRoute } from 'vite-plugin-ssr/routing'

export default (pageContext: PageContext) => {
  return resolveRoute(import.meta.env.VITE_GAME_GUIDE_DETAILS_URL, pageContext.urlPathname)
}
