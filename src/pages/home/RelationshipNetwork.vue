<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Title from './Title.vue'
import scrollViewPort, { type ScrollListenerReturn, ScrollDirection } from '#/utils/scroll-view-port'

/**
 * 控制动画是否已开始
 * - (true) 已开始
 * - (false) 未开始
 */
let animationIsStart = $ref(false)

let containerRef = $ref<HTMLElement | null>(null)

let stopScrollListenner: ScrollListenerReturn

onMounted(() => {
  stopScrollListenner = scrollViewPort(containerRef!, (display, direction, topOverflow) => {
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
  <div class="RelationshipNetwork">
    <div class="container">
      <Title title="Relationship Network" />
      <div class="content">
        <div class="items-container"  ref="containerRef" :class="{ 'animation': animationIsStart }">
          <div class="items">
            <div class="item" style="height: 57px;">
              <img src="./images/relationship-network-image1.png" />
            </div>
            <div class="item" style="height: 50px;">
              <img src="./images/relationship-network-image2.png" />
            </div>
            <div class="item" style="height: 58px;">
              <img src="./images/relationship-network-image3.png" />
            </div>
            <div class="item" style="height: 55px;">
              <img src="./images/relationship-network-image4.png" />
            </div>
          </div>

          <div class="items">
            <div class="item" style="height: 57px">
              <img src="./images/relationship-network-image5.png" />
            </div>
            <div class="item" style="height: 56px;">
              <img src="./images/relationship-network-image6.png" />
            </div>
            <div class="item" style="height: 84px;">
              <img src="./images/relationship-network-image7.png" />
            </div>
            <div class="item" style="height: 59px;">
              <img src="./images/relationship-network-image8.png" />
            </div>
            <div class="item" style="height: 46px;">
              <img src="./images/relationship-network-image9.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@keyframes animation {
  0% {
    opacity: 0;
  }

  50% {
    opacity: .45;
  }

  100% {
    opacity: 1;
  }
}

.RelationshipNetwork {
  padding: 0 3vw;
  @media (max-width: 992px) {
    padding: 0 20px;
  }

  .container {
    width: 100%;
    max-width: var(--container-width);
    margin: 0 auto;
    padding-bottom: 240px;
    @media (max-width: 992px) {
      padding-bottom: 100px;
    }

    .content {
      position: relative;
      padding: 70px 0;
      border: 1px solid #e0e0e0;
      border-left-width: 0;
      border-right-width: 0;
      margin-top: 80px;
      @media (max-width: 992px) {
        margin-top: 70px;
        padding: 38px 5px;
      }

      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 225px;
        height: 5px;
        background-color: var(--theme-color);
        border-radius: 999px;
        @media (max-width: 992px) {
          width: 40px;
          height: 3px;
        }
      }

      &::before {
        left: 0;
        top: -3px;
        @media (max-width: 992px) {
          top: -2px;
        }
      }

      &::after {
        right: 0;
        bottom: -3px;
        @media (max-width: 992px) {
          bottom: -2px;
        }
      }

      .items-container {
        &.animation {
          animation: animation .75s ease both;
        }

        .items {
          display: grid;
          align-items: center;

          &:nth-of-type(1) {
            grid-template-columns: repeat(4, auto);
            padding: 0 3.8vw 64px;
            @media (max-width: 992px) {
              padding-left: 0;
              padding-right: 0;
            }
          }

          &:nth-of-type(2) {
            column-gap: 9vw;
            grid-template-columns: repeat(5, auto);
          }

          @media (max-width: 992px) {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12vw !important;
          }

          .item {
            text-align: center;

            @media (max-width: 992px) {
              text-align: center;
              height: auto !important;
            }

            img {
              width: auto;
              height: 100%;
              object-fit: contain;
            }
          }
        }
      }
    }
  }
}
</style>
