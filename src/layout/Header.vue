<script setup lang="ts">
import Logo from '#/components/logo/index.vue'
import { LogoImage } from '#/types/logo'
import { getNavigation, hasChildrenNavigation, handleNavigationClick, hasSwimmingCircleIcon, isDisplaySwimmingCircleIcon } from '#/utils/navigation'
import Subscribe from './Subscribe.vue'
import MobileHeader from './MobileHeader.vue'
import { navigate } from 'vite-plugin-ssr/client/router'

async function jumpToHome() {
  await navigate(import.meta.env.VITE_HOME_URL)
}

/** 控制订阅弹框显示隐藏 */
let subscribeVisible = $ref(false)

/** 处理订阅按钮点击 */
function subscribe() {
  subscribeVisible = true
}

let mobileHeaderVisible = $ref(false)
</script>

<template>
  <div class="Header">
    <div class="container">
      <div class="logo" @click="jumpToHome">
        <Logo :type="LogoImage.Black" />
      </div>

      <div class="navigation">
        <div class="navigation-items">
          <div class="navigation-item" v-for="item of getNavigation()">
            <div class="parent-text-container">
              <img
                class="icon"
                :class="[
                  isDisplaySwimmingCircleIcon(item)? 'display' : '',
                  hasSwimmingCircleIcon(item)? 'visible' : 'hidden'
                ]"
                src="./images/navigation-icon1.png"
              />
              <div class="text" @click="handleNavigationClick(item)">{{ item.text }}</div>
              <div class="arrow" v-if="hasChildrenNavigation(item)"></div>
            </div>
            <div class="children-container" v-if="hasChildrenNavigation(item)">
              <div class="children-items">
                <div class="children-item" v-for="childrenItem of (item.children || [])">
                  <div class="children-text-container">
                    <div class="text" @click="handleNavigationClick(childrenItem)">{{ childrenItem.text }}</div>
                    <div class="arrow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="subscribe" @click="subscribe">Subscribe</div>

      <div class="mobile-menu-icon" @click="mobileHeaderVisible = true">
        <img src="./images/mobile-menu-icon.png" />
      </div>
    </div>
  </div>

  <transition name="subscribe">
    <Subscribe @close="subscribeVisible = false" v-if="subscribeVisible" />
  </transition>

  <transition name="mobile-header">
    <MobileHeader @close="mobileHeaderVisible = false" @subscribe="subscribe" v-if="mobileHeaderVisible" />
  </transition>
</template>

<style scoped lang="less">
.Header {
  background-image: linear-gradient(180deg, rgba(255, 255, 255, .39), rgba(255, 255, 255, 0) 100%);
  padding: 0 3vw;
  position: relative;
  z-index: 10;
  @media (max-width: 992px) {
    padding: 0 20px;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: var(--container-width);
    height: var(--header-height);
    margin: 0 auto;

    .logo {
      cursor: pointer;
      flex-shrink: 0;
      max-width: 158px;
    }

    .navigation {
      @media (max-width: 992px) {
        display: none;
      }

      .navigation-items {
        display: flex;
        align-items: center;

        .navigation-item {
          cursor: pointer;
          position: relative;

          &:not(:last-of-type) {
            margin-right: 80px;
            @media (max-width: 1600px) {
              margin-right: 40px;
            }
          }

          .parent-text-container {
            display: flex;
            align-items: center;

            .icon {
              opacity: 0;
              margin-right: 4px;
              transition: all .25s;

              &.display {
                opacity: 1;
              }

              &.hidden {
                opacity: 0;
              }
            }

            .text {
              font-size: 16px;
              font-weight: 400;
              color: #222;
              transition: all .25s;
            }

            .arrow {
              position: relative;
              width: 10px;
              height: 5px;
              margin-left: 4px;

              &::before,
              &::after {
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
              }

              &::before {
                background-image: url('./images/navigation-expend.png');
              }

              &::after {
                display: none;
                background-image: url('./images/navigation-pack-up.png');
              }
            }
          }

          .children-container {
            position: absolute;
            top: 100%;
            left: 0;
            padding-top: 9px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all .25s;

            .children-items {
              background-color: rgba(255, 255, 255, .7);
              border: 1px solid #f7f7f7;
              box-shadow: 1px -8px 20px 0 rgba(56, 118, 113, .06);
              border-radius: 12px;
              padding: 24px;
              white-space: nowrap;

              .children-item {
                &:not(:last-of-type) {
                  margin-bottom: 30px;
                }

                .children-text-container {
                  display: flex;
                  align-items: center;

                  .text {
                    font-size: 14px;
                    font-weight: 400;
                    color: #222;
                    transition: all .25s;
                  }

                  .arrow {
                    margin-left: 12px;
                    width: 7px;
                    height: 7px;
                    background-image: url('./images/navigation-hover.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    opacity: 0;
                  }
                }

                &:hover {
                  .children-text-container {
                    .text {
                      color: var(--theme-color);
                    }

                    .arrow {
                      opacity: 1;
                    }
                  }
                }
              }
            }
          }

          &:hover {
            .parent-text-container {
              .text {
                color: var(--theme-color);
              }

              .arrow {
                &::before {
                  display: none;
                }

                &::after {
                  display: block;
                }
              }
            }

            .children-container {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }
          }
        }
      }
    }

    .subscribe {
      cursor: pointer;
      user-select: none;
      font-size: 20px;
      font-weight: 400;
      color: #fff;
      background-color: var(--theme-color);
      border-radius: 16px;
      padding: 14px 32px;
      transition: all .25s;
      @media (max-width: 992px) {
        display: none;
      }

      &:hover {
        background-color: var(--theme-color-hover);
      }
    }

    .mobile-menu-icon {
      cursor: pointer;
      display: none;
      @media (max-width: 992px) {
        display: block;
      }
    }
  }
}

.subscribe-enter-active,
.subscribe-leave-active {
  transition: all .25s;
}

.subscribe-enter-from,
.subscribe-leave-to {
  opacity: 0;
}

.mobile-header-enter-active,
.mobile-header-leave-active {
  transition: all .25s;
}

.mobile-header-enter-from,
.mobile-header-leave-to {
  opacity: 0;
}
</style>
