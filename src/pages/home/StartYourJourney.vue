<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import Title from './Title.vue'
import BottomLine from './BottomLine.vue'
import { type Response1 } from '#/request/api/home'
import scrollViewPort, { type ScrollListenerReturn } from '#/utils/scroll-view-port'
import isMobile from '#/utils/is-mobile'

type ListItem = Response1['journey'][number]

let { list } = defineProps<{
  list: ListItem[];
}>()

let itemsBoxRef = $ref<HTMLElement | null>(null)
let itemsRef = $ref<HTMLElement | null>(null)
let itemRef = $ref<HTMLElement[]>([])

function jump(item: ListItem) {
  window.open(item.web_url)
}

let linePath = $computed(() => {
  switch (isMobile()) {
    case true:
      return 'M 262 238, q 135 30 0 120, q 0 0 -100 42, q -100 50 -118 100, q -50 81 0 192, q 40 60 100 90, q 0 0 0 0, q 0 0 100 78, q 175 185 0 370, q -20 20 -80 0, q -70 -40 -140 0'
    case false:
      return 'M 660 215, q 280 -142 392 0, q 60 90 0 175, q -80 100 -300 200, q 0 0 -100 40, q 0 0 -180 85, q -375 220 0 350, q 120 30 275 50, q 310 70 140 240, q -160 135 -185 200, q -40 170 200 115, q 22 -5 300 -115, q 190 -90 220 0'
  }
})

let getLinePathCss = $computed(() => `path('${ linePath }')`)

let stopScrollListenner: ScrollListenerReturn
let animationIsStart = $ref(false)

onMounted(async () => {
  stopScrollListenner = scrollViewPort(itemsBoxRef!, (display, direction, topOverflow) => {
    if (display) animationIsStart = true
  })
})

onUnmounted(() => {
  stopScrollListenner?.()
})
</script>

<template>
  <div class="StartYourJourney">
    <div class="container">
      <Title title="Start your journey" />
      <div class="items-container">
        <div class="items-box" ref="itemsBoxRef">
          <div class="items" ref="itemsRef">
            <div class="item-box" v-for="item of list">
              <div class="item" ref="itemRef">
                <div class="title">{{ item.name }}</div>
                <div class="description">{{ item.introduces }}</div>
                <div class="button-container">
                  <div class="button" @click="jump(item)">{{ item.button }}</div>
                </div>
                <div class="image">
                  <img :src="item.image" />
                </div>
              </div>
            </div>
          </div>
          <div class="animation-container">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <path :d="linePath" fill="none" stroke-width="2" stroke="#08C1B1" />
            </svg>
            <div class="plane" :class="{ 'animation': animationIsStart }"></div>
          </div>
        </div>
      </div>
      <BottomLine />
    </div>
  </div>
</template>

<style scoped lang="less">
.StartYourJourney {
  margin-top: 160px;
  @media (max-width: 1600px) {
    padding: 0 3vw;
  }

  @media (max-width: 992px) {
    padding: 0 20px;
    margin-top: 68px;
  }

  .container {
    width: 100%;
    max-width: var(--container-width);
    margin: 0 auto;
    padding-bottom: 115px;

    .items-container {
      position: relative;
      padding: 80px 80px 115px;
      @media (max-width: 992px) {
        padding: 34px 0 0;
      }

      .items-box {
        position: relative;
        @media (max-width: 992px) {
          padding-bottom: 148px;
        }

        .items {
          position: relative;
          z-index: 1;

          .item-box {
            display: flex;

            &:not(:last-of-type) {
              @media (max-width: 992px) {
                margin-bottom: 52px;
              }
            }

            &:last-of-type {
              @media (max-width: 992px) {

              }
            }

            .item {
              width: 600px;
              @media (max-width: 992px) {
                width: 75%;
              }

              .title {
                font-size: 32px;
                line-height: 40px;
                font-weight: 700;
                color: #222;
                margin-bottom: 16px;
                @media (max-width: 992px) {
                  font-size: 20px;
                  line-height: 26px;
                  margin-bottom: 12px;
                }
              }

              .description {
                font-size: 24px;
                line-height: 32px;
                font-weight: 400;
                color: #8a8a8a;
                margin-bottom: 4px;
                margin-bottom: 32px;
                @media (max-width: 992px) {
                  font-size: 16px;
                  line-height: 22px;
                  font-weight: 400;
                  margin-bottom: 12px;
                  letter-spacing: 0.02em;
                }

                .weight {
                  font-weight: 700;
                  color: var(--theme-color);
                  @media (max-width: 992px) {
                    font-weight: 600;
                  }
                }
              }

              .button-container {
                display: flex;

                .button {
                  position: relative;
                  cursor: pointer;
                  border-radius: 16px;
                  padding: 14px 32px;
                  background-color: var(--theme-color);
                  font-size: 20px;
                  line-height: 26px;
                  font-weight: 400;
                  color: #fff;
                  transition: all .25s;
                  @media (max-width: 992px) {
                    padding: 12px 24px;
                    font-size: 16px;
                    line-height: 20px;
                  }

                  &::after {
                    content: "";
                    width: 17px;
                    height: 8px;
                    display: inline-block;
                    background-image: url('./images/start-your-journey-arrow.png');
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    margin-left: 10px;
                  }

                  &:hover {
                    background-color: var(--theme-color-hover);
                  }
                }
              }
            }

            &:nth-of-type(1) {
              .button-container {
                justify-content: flex-end;
              }

              .image {
                @media (max-width: 992px) {
                  margin-top: -35px;
                }
              }
            }

            &:nth-of-type(2) {
              flex-direction: row-reverse;
              text-align: right;

              .button-container {
                justify-content: flex-end;
              }

              .image {
                @media (max-width: 992px) {
                  margin-left: 20px;
                  margin-top: -15px;
                }
              }
            }

            &:nth-of-type(3) {}
          }
        }

        .animation-container {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          overflow: hidden;
          @media (max-width: 992px) {
            margin: 0 -6px;
          }

          @keyframes move {
              0% {
                  offset-distance: 0%;
              }
              100% {
                  offset-distance: 100%;
              }
          }

          .plane {
            position: absolute;
            top: 0;
            left: 0;
            width: 86px;
            height: 63px;
            background-image: url('./images/plane.png');
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
            offset-path: v-bind(getLinePathCss);
            @media (max-width: 992px) {
              width: 32px;
              height: 36px;
            }

            &.animation {
              animation: move 7s forwards linear;
            }
          }
        }
      }
    }
  }
}
</style>
