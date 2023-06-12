<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

/** 箭头点击滚动计时器 */
let arrowClickScrollTimer = $ref<number | null>(null)

function clearArrowClickScrollTimer() {
  window.clearInterval(arrowClickScrollTimer!)
}

/** 处理箭头点击事件 */
function handleArrowClick() {
  let viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  let scrolledHeight = 0

  arrowClickScrollTimer = window.setInterval(() => {
    scrolledHeight += 10

    if (scrolledHeight >= viewPortHeight) {
      scrolledHeight = viewPortHeight
      clearArrowClickScrollTimer()
    }

    window.scroll({ top: scrolledHeight })
  })
}

let bannerHeight = $ref(0)

/** 动态计算 banner 高度 */
function computedBannerHeight() {
  let root = document.querySelector(':root') as Element
  let computedValue = getComputedStyle(root)
  let headerHeight = computedValue.getPropertyValue('--header-height')

  bannerHeight = window.innerHeight - parseInt(headerHeight)
}

onMounted(() => {
  computedBannerHeight()
  window.onresize = computedBannerHeight
})

onUnmounted(() => {
  clearArrowClickScrollTimer()
})
</script>

<template>
  <div class="Banner" :style="{ height: `${ bannerHeight }px` }">
    <div class="arrow" @click="handleArrowClick" />
  </div>
</template>

<style scoped lang="less">
@keyframes arrow-animation {
  0% {
    transform: translateY(0);
  }

  60% {
    transform: translateY(20px);
  }

  100% {
    transform: translateY(0);
  }
}

.Banner {
  position: relative;
  // height: calc(100vh - var(--header-height));

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  &::after {
    background-image: url('./images/banner.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top;
    margin-top: calc(-1 * var(--header-height));
    border-radius: 40px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    overflow: hidden;
  }

  .arrow {
    cursor: pointer;
    position: absolute;
    left: 50%;
    bottom: 40px;
    margin-left: -15px;
    width: 30px;
    height: 44px;
    background-image: url('./images/arrow.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    z-index: 1;
    transition: all .25s;
    animation: arrow-animation 2s infinite;
    filter: drop-shadow(0 0 10px rgba(151, 75, 134, .4));
    @media (max-width: 992px) {
      width: 24px;
      height: 28px;
    }

    &:hover {
      opacity: .75;
    }
  }
}
</style>
