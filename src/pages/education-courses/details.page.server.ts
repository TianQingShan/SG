import fetch from 'node-fetch'

export async function onBeforeRender(pageProps: any) {
  let { id } = pageProps.routeParams

  let requestUrl = `${ import.meta.env.VITE_AXIOS_BASEURL }api/article/${ id }?wakaka=1`
  let response = await fetch(requestUrl)
  let json: any = await response.json()

  let data: any = json.data

  return {
    pageContext: {
      pageProps: {
        title: data.info.title,
        description: data.info.content.content.replace(/<\/?.+?>/g, '').replace(/ /g, ''),
        image: data.info.image_input[0]
      }
    }
  }
}
