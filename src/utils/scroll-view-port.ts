
/**
 * 定义滚动监听的回调函数类型
 * @param display 是否出现在可视区域
 * - (true) 出现在可视区域里
 * - (false) 反之
 * @param direction 滚动方向
 * @param topOverflow 向上滚动时, 元素的顶部有没有小于等于视窗高度
 * - (true) 有
 * - (false) 反之
 */
declare type Callback = (display: boolean, direction: ScrollDirection, topOverflow: boolean) => void

/** 定义滚动监听函数的返回值类型 */
export declare type ScrollListenerReturn = () => void;

/** 定义滚动方向枚举 */
export const enum ScrollDirection {
  /** 向下滚动 */
  Down,

  /** 向上滚动 */
  Up,

  /** 滚动位置无变化 */
  None
}

/**
 * 监听元素是否出现在可视区域里
 * @param element 需要监听的元素
 * @param callback 回调函数
 * @return 停止监听函数
 */
export default (element: HTMLElement, callback: Callback): ScrollListenerReturn => {
  let init = true
  let prevScrollDistance = 0

  let scrollEventListenerFn = (e: Event) => {
    if (init) {
      prevScrollDistance = document.documentElement.scrollTop
      init = false
    }

    /** 判断滚动方向 */
    let direction: ScrollDirection

    let _prevScrollDistance = prevScrollDistance
    let currentScrollDistance = document.documentElement.scrollTop

    prevScrollDistance = currentScrollDistance

    if (currentScrollDistance > _prevScrollDistance) direction = ScrollDirection.Down
    else if (currentScrollDistance < _prevScrollDistance) direction = ScrollDirection.Up
    else direction = ScrollDirection.None

    /** 判断容器是否出现在可视区域内 */
    let viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    let { clientHeight } = element
    let scrollTop = document.documentElement.scrollTop

    let _element = element
    let offsetTop = 0

    while (_element) {
      offsetTop +=  _element.offsetTop
      _element =  _element.offsetParent! as HTMLElement
    }

    let _topOverflow = offsetTop - scrollTop > viewPortHeight

    if (
      (offsetTop - scrollTop <= viewPortHeight) &&
      (scrollTop <= offsetTop + clientHeight)
    ) {
      callback(true, direction!, _topOverflow)
    } else {
      callback(false, direction!, _topOverflow)
    }
  }

  window.addEventListener('scroll', scrollEventListenerFn)


  return () => window.removeEventListener('scroll', scrollEventListenerFn)
}
