<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import BottomLine from './BottomLine.vue'
import scrollViewPort, { type ScrollListenerReturn, ScrollDirection } from '#/utils/scroll-view-port'

/**
 * 控制动画是否已开始
 * - (true) 已开始
 * - (false) 未开始
 */
let animationIsStart = $ref(false)

let contentBoxRef = $ref<HTMLElement | null>(null)
let textRef = $ref<HTMLElement | null>(null)
let iconItemsRef = $ref<HTMLElement[]>([])

/** 计算图标居中位置 */
let computedIconsCenterPosition = $computed(() => {
  return (index: number) => {
    let distance = { horizontal: '0px', vertical: '0px' }

    if (!contentBoxRef || !iconItemsRef) return distance

    let [contentBoxWidth, contentBoxHeight] = [contentBoxRef.clientWidth, contentBoxRef.clientHeight]
    let [iconItemWidth, iconItemHeight] = [iconItemsRef[0].clientWidth, iconItemsRef[0].clientHeight]
    let currentIconItemRef = iconItemsRef[index]

    switch (animationIsStart) {
      case true: // 动画已开始
        let { clientWidth } = currentIconItemRef.parentElement!
        let maxDistance = clientWidth - currentIconItemRef.clientWidth

        const HORIZONTAL_DISTANCE_MAP: Record<number, string> = {
          0: maxDistance * 0.4 + 'px',
          1: maxDistance * 0.8 + 'px',
          2: maxDistance * 0.3 + 'px',
          3: maxDistance * 0.8 + 'px',
          4: maxDistance * 0.5 + 'px',
          5: maxDistance * 0.9 + 'px',
          6: maxDistance * 0.2 + 'px',
          7: maxDistance * 0.6 + 'px',
        }

        distance.horizontal = HORIZONTAL_DISTANCE_MAP[index]
      break
      case false: // 动画未开始
        distance.horizontal = (contentBoxWidth / 2) - (iconItemWidth / 2) + 'px'
        let parentElement = currentIconItemRef
        let offsetTop = 0

        while (parentElement !== contentBoxRef) {
          offsetTop += parentElement.offsetTop
          parentElement = parentElement.parentElement!
        }

        /**
         * 如果一个图标块刚好贴合顶部,
         * 那么这个大小就是它需要偏移顶部的距离
         */
        let _verticalBlock = (contentBoxHeight / 2) - (iconItemHeight / 2)

        distance.vertical = _verticalBlock - offsetTop + 'px'
      break
    }

    return distance
  }
})

function changeIconItemsRef(el: any) {
  iconItemsRef.push(el)
}

let stopScrollListenner: ScrollListenerReturn

onMounted(() => {
  stopScrollListenner = scrollViewPort(textRef!, (display, direction, topOverflow) => {
    switch (direction) {
      case ScrollDirection.Down:
        if (display) animationIsStart = true
      break
      case ScrollDirection.Up:
        if (topOverflow) animationIsStart = false
      break
      case ScrollDirection.None:
        animationIsStart = true
      break
    }
  })
})

onUnmounted(() => {
  stopScrollListenner?.()
})
</script>

<template>
  <div class="Description">
    <div class="container">
      <div class="content">
        <div class="content-box" ref="contentBoxRef">
          <div class="left-icons icon-items">
            <div
              class="icon-item"
              :class="{ 'animation': animationIsStart }"
              :ref="changeIconItemsRef"
              :style="{ left: computedIconsCenterPosition(0).horizontal, top: computedIconsCenterPosition(0).vertical }">
              <img src="./images/box2-icon1.png" />
            </div>
            <div
              class="icon-item"
              :class="{ 'animation': animationIsStart }"
              :ref="changeIconItemsRef"
              :style="{ left: computedIconsCenterPosition(1).horizontal, top: computedIconsCenterPosition(1).vertical }">
              <img src="./images/box2-icon2.png" />
            </div>
            <div
              class="icon-item"
              :class="{ 'animation': animationIsStart }"
              :ref="changeIconItemsRef"
              :style="{ left: computedIconsCenterPosition(2).horizontal, top: computedIconsCenterPosition(2).vertical }">
              <img src="./images/box2-icon3.png" />
            </div>
            <div
              class="icon-item"
              :class="{ 'animation': animationIsStart }"
              :ref="changeIconItemsRef"
              :style="{ left: computedIconsCenterPosition(3).horizontal, top: computedIconsCenterPosition(3).vertical }">
              <img src="./images/box2-icon4.png" />
            </div>
          </div>
          <div class="text" ref="textRef" :class="{ 'animation': animationIsStart }">
            Surf Guild is a <span class="weight">Web3 gaming guild</span> that drives user growth through community building, game distribution and quest to earn.
          </div>
          <div class="right-icons icon-items">
            <div
              class="icon-item"
              :class="{ 'animation': animationIsStart }"
              :ref="changeIconItemsRef"
              :style="{ right: computedIconsCenterPosition(4).horizontal, top: computedIconsCenterPosition(4).vertical }">
              <img src="./images/box2-icon5.png" />
            </div>
            <div
              class="icon-item"
              :class="{ 'animation': animationIsStart }"
              :ref="changeIconItemsRef"
              :style="{ right: computedIconsCenterPosition(5).horizontal, top: computedIconsCenterPosition(5).vertical }">
              <img src="./images/box2-icon6.png" />
            </div>
            <div
              class="icon-item"
              :class="{ 'animation': animationIsStart }"
              :ref="changeIconItemsRef"
              :style="{ right: computedIconsCenterPosition(6).horizontal, top: computedIconsCenterPosition(6).vertical }">
              <img src="./images/box2-icon7.png" />
            </div>
            <div
              class="icon-item"
              :class="{ 'animation': animationIsStart }"
              :ref="changeIconItemsRef"
              :style="{ right: computedIconsCenterPosition(7).horizontal, top: computedIconsCenterPosition(7).vertical }">
              <img src="./images/box2-icon8.png" />
            </div>
          </div>
        </div>
      </div>

      <BottomLine />
    </div>
  </div>
</template>

<style scoped lang="less">
@keyframes textAnimation {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }

  50% {
    opacity: .45;
    transform: translateY(-30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.Description {
  position: relative;
  padding: 112px 3vw 0;
  @media (max-width: 992px) {
    padding: 60px 20px 0;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: url('./images/box2-bg.png');
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% auto;
    margin-top: -40px;
    z-index: -1;
    @media (max-width: 992px) {
      background-image: url('./images/box2-mobile-bg.png');
    }
  }

  .container {
    width: 100%;
    max-width: var(--container-width);
    margin: 0 auto;

    .content {
      padding-bottom: 115px;
      @media (max-width: 992px) {
        padding-bottom: 50px;
      }

      .content-box {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .icon-items {
          flex-shrink: 1;
          flex-grow: 1;
          position: relative;
          z-index: 1;

          .icon-item {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;

            img {
              @media (max-width: 992px) {
                max-width: 60%;
              }
            }

            &::before {
              content: "";
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              border-radius: 20px;
              background-color: #fff;
              filter: drop-shadow(0 6px 60px rgba(37, 150, 140, .19));
              z-index: -1;
              @media (max-width: 992px) {
                border-radius: 12px;
                filter: drop-shadow(0 4px 12px rgba(37, 150, 140, .16));
              }
            }

            &:not(:last-of-type) {
              margin-bottom: 40px;
            }

            &.animation {
              transition: all .75s;
              opacity: 1;
            }
          }
        }

        .text {
          width: 800px;
          font-size: 32px;
          font-weight: 400;
          line-height: 52px;
          color: #222;
          text-align: center;
          @media (max-width: 992px) {
            font-size: 16px;
            line-height: 32px;
            width: 225px;
          }

          .weight {
            @media (max-width: 992px) {
              font-weight: 600;
              color: var(--theme-color);
            }
          }

          &.animation {
            animation: textAnimation .75s ease both;
          }
        }

        .left-icons {
          .icon-item:nth-of-type(1) {
            width: 85px;
            height: 85px;
            @media (max-width: 992px) {
              width: 40px;
              height: 40px;
            }

            &::before {
              transform: rotate(-1deg);
            }
          }

          .icon-item:nth-of-type(2) {
            width: 86px;
            height: 86px;
            @media (max-width: 992px) {
              width: 40px;
              height: 40px;
            }

            &::before {
              transform: rotate(25deg);
            }
          }

          .icon-item:nth-of-type(3) {
            width: 106px;
            height: 106px;
            @media (max-width: 992px) {
              width: 46px;
              height: 46px;
            }

            &::before {
              transform: rotate(-24deg);
            }
          }

          .icon-item:nth-of-type(4) {
            width: 88px;
            height: 88px;
            @media (max-width: 992px) {
              width: 45px;
              height: 45px;
            }

            &::before {
              transform: rotate(22deg);
            }
          }
        }

        .right-icons {
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          .icon-item:nth-of-type(1) {
            width: 100px;
            height: 100px;
            @media (max-width: 992px) {
              width: 44px;
              height: 44px;
            }

            &::before {
              transform: rotate(12deg);
            }
          }

          .icon-item:nth-of-type(2) {
            width: 78px;
            height: 78px;
            @media (max-width: 992px) {
              width: 38px;
              height: 38px;
            }

            &::before {
              transform: rotate(18deg);
            }
          }

          .icon-item:nth-of-type(3) {
            width: 78px;
            height: 78px;
            @media (max-width: 992px) {
              width: 44px;
              height: 44px;
            }

            &::before {
              transform: rotate(-1deg);
            }
          }

          .icon-item:nth-of-type(4) {
            width: 98px;
            height: 98px;
            @media (max-width: 992px) {
              width: 50px;
              height: 50px;
            }

            &::before {
              transform: rotate(7deg);
            }
          }
        }
      }
    }
  }
}
</style>
