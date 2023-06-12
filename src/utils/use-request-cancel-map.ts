import * as cancelMapKeys from '#/keys/request-cancel-map'
import { type WarpperReturn } from '#/request/types/request'

type MapKeys = ValueOf<typeof cancelMapKeys>
type RequestCancel = null | WarpperReturn['cancel']

export default () => {
  /** 存储取消函数对应关系的容器 */
  let requestCancelMaps = new Map<MapKeys, RequestCancel>([])

  /** 定义取消函数对应关系 */
  let defineCancelMaps = (maps: MapKeys[]) => maps.forEach(key => requestCancelMaps.set(key, null))

  /** 保存取消函数 */
  let saveCancelFn = (key: MapKeys, fn: RequestCancel) => requestCancelMaps.set(key, fn)

  /** 取消单个请求 */
  let cancelRequest = (key: MapKeys) => requestCancelMaps.get(key)?.()

  /** 取消所有请求 */
  let cancelRequests = () => requestCancelMaps.forEach(cancel => cancel?.())

  return { defineCancelMaps, cancelRequest, saveCancelFn, cancelRequests }
}
