/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  let component: DefineComponent<{}, {}, any>
  export default component
}
