import { PageContext } from '#renderer/types'
import { resolveRoute } from 'vite-plugin-ssr/routing'

export default (pageContext: PageContext) => {
  return resolveRoute(import.meta.env.VITE_EDUCATION_COURSES_DETAILS_URL, pageContext.urlPathname)
}
