import { isClient } from '#/utils/get-env'


export default () => (isClient && 'ontouchstart' in document.documentElement)
