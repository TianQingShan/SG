import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import { loadEnv } from 'vite'
import { resolve } from 'path'

let devEnv = loadEnv('development', process.cwd(), 'VITE_')

export default (() => {
  return {
    plugins: [
      vue({ reactivityTransform: true }),
      ssr()
    ],
    resolve: {
      alias: {
        '#': resolve(__dirname, './src'),
        '#renderer': resolve(__dirname, './renderer')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: devEnv.VITE_AXIOS_BASEURL,
          changeOrigin: true
        }
      }
    },
    build: {
      target: 'es2015'
    },
    define: {
      global: 'globalThis',
    }
  }
})
