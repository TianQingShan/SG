import { renderToString as renderToString_ } from '@vue/server-renderer'
import type { App } from 'vue'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import { createApp } from './app'
import type { PageContextServer, PageContext } from './types'
import { HighlightKey } from '#/types/navigation'
import { getPageTitle, getPageDescription, getImage } from './get-page-info'

const CURRENT_HEADER_HIGH_LIGHT_MAP = {
  [import.meta.env.VITE_WOLFOX_CLUB_URL]: HighlightKey.WolfoxClub,
  [import.meta.env.VITE_COMPASS_URL]: HighlightKey.Ecology,
  [import.meta.env.VITE_GAME_GUIDE_URL]: HighlightKey.Guide,
  [import.meta.env.VITE_GAME_GUIDE_DETAILS_URL]: HighlightKey.Guide,
  [import.meta.env.VITE_EDUCATION_COURSES_URL]: HighlightKey.Guide,
  [import.meta.env.VITE_EDUCATION_COURSES_DETAILS_URL]: HighlightKey.Guide,
}

async function render(pageContext: PageContextServer) {
  const app = createApp(pageContext)

  const appHtml = await renderToString(app)

  let title = getPageTitle(pageContext)
  let description = getPageDescription(pageContext)
  let image = getImage(pageContext)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="description" content="${ description }" />
        <meta name="facebook-domain-verification" content="u6rsnokc643zrl8sio6oo1tlxwthfr" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nytimes" />
        <meta name="twitter:creator" content="@Surf Guild" />
        <meta name="twitter:title" content="${ title }" />
        <meta name="twitter:description" content="${ description }" />
        <meta name="twitter:image" content="${ image }" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Surf Guild" />
        <meta property="og:title" content="${ title }" />
        <meta property="og:description" content="${ description }" />
        <meta property="og:image" content="${ image }" />

        <title>${ title }</title>
      </head>
      <body ontouchstart>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FBNMVLNWKV"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-FBNMVLNWKV');
        </script>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    }
  }
}

async function renderToString(app: App) {
  let err: unknown
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    err = err_
  }
  const appHtml = await renderToString_(app)
  if (err) throw err
  return appHtml
}

export { render }

export const passToClient = [
  'pageProps',
  'headerHighLightKey',
  'routeParams'
]

export function onBeforeRender(pageContext: PageContextServer) {
  return {
    pageContext: {
      headerHighLightKey: CURRENT_HEADER_HIGH_LIGHT_MAP[pageContext.urlPathname]
    }
  }
}
