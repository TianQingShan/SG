import '#/window-polyfill'
import { createApp } from './app'
import type { PageContext } from './types'
import { getPageTitle } from './get-page-info'

// This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
let app: (ReturnType<typeof createApp>)
async function render(pageContext: PageContext) {
  if (!app) {
    app = createApp(pageContext)
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }

  document.title = getPageTitle(pageContext)
}

export { render }
export const clientRouting = true
