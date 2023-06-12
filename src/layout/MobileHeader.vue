<script setup lang="ts">
import { getNavigation, hasChildrenNavigation } from '#/utils/navigation'
import { navigate } from 'vite-plugin-ssr/client/router'

type Emits = {
  (e: 'close'): void;
  (e: 'subscribe'): void;
}

let emits = defineEmits<Emits>()

let navigationItems = getNavigation()

let currentExpandIndexArray = $ref<number[]>([])

let isOpenedChidrenContainer = $computed(() => (index: number) => currentExpandIndexArray.includes(index))

async function handleNavigationItemClick(item: typeof navigationItems[number], index?: number) {
  if (hasChildrenNavigation(item)) {
    switch (isOpenedChidrenContainer(index!)) {
      case true:
        currentExpandIndexArray = currentExpandIndexArray.filter(_index => _index !== index)
      break
      case false:
        currentExpandIndexArray.push(index!)
      break
    }

    return
  }

  switch (item.isExternalLink) {
    case true:
      window.open(item.externalLinkAddress)
    break
    case false:
      await navigate(import.meta.env.VITE_HOME_URL)
      close()
    break
   }
}

function close() {
  emits('close')
}

function subscribe() {
  close()
  emits('subscribe')
}
</script>

<template>
  <div class="MobileHeader">
    <div class="header">
      <div class="left">
        <div class="logo">
          <img src="./images/footer-logo.png" />
        </div>
      </div>
      <div class="right">
        <div class="subscribe" @click="subscribe">Subscribe</div>
        <div class="close-icon" @click="close">
          <img src="./images/mobile-menu-close-icon.png" />
        </div>
      </div>
    </div>

    <div class="menu-container">
      <div class="navigation-items">
        <div class="navigation-item" v-for="(item, index) of navigationItems" :class="{ 'open-children-container': isOpenedChidrenContainer(index)  }">
          <div class="parent-text-container">
            <div class="text" @click="handleNavigationItemClick(item, index)">{{ item.text }}</div>
            <div class="arrow" v-if="hasChildrenNavigation(item)">
              <img src="./images/mobile-navigation-arrow.png" />
            </div>
          </div>
          <div class="children-container" v-if="hasChildrenNavigation(item)">
            <div class="children-items">
              <div class="children-item" v-for="childrenItem of (item.children || [])">
                <div class="children-text-container">
                  <div class="text" @click="handleNavigationItemClick(childrenItem)">{{ childrenItem.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.MobileHeader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1b1b1b;
  z-index: 99999;
  display: flex;
  flex-direction: column;

  .header {
    height: var(--header-height);
    padding: 0 20px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;

    .left {
      .logo {
        max-width: 124px;
      }
    }

    .right {
      display: flex;
      align-items: center;

      .subscribe {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: #fff;
        padding: 12px 24px;
        margin-right: 24px;
        border-radius: 16px;
        border: 1px solid #fff;
        transition: all .25s;

        &:active {
          opacity: .75;
        }
      }
    }
  }

  .menu-container {
    border-top: 1px solid #222;
    padding: 54px 20px 20px;
    flex-grow: 1;
    overflow-y: auto;

    .navigation-items {
      .navigation-item {
        &:not(:last-of-type) {
          margin-bottom: 48px;

          &.open-children-container {
            margin-bottom: 34px;
          }
        }

        .parent-text-container {
          display: flex;
          align-items: center;

          .text {
            cursor: pointer;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
            color: #fff;
            margin-right: 4px;
          }

          .arrow {
            display: flex;
            align-items: center;
          }
        }

        .children-container {
          display: none;
          margin-top: 30px;
          padding-left: 20px;

          .children-items {
            .children-item {
              &:not(:last-of-type) {
                margin-bottom: 24px;
              }

             .children-text-container {
              .text {
                cursor: pointer;
                font-weight: 300;
                font-size: 14px;
                line-height: 22px;
                color: #fff;
              }
             }
            }
          }
        }

        &.open-children-container {
          .parent-text-container {
            .arrow {
              transform: rotate(180deg);
            }
          }

          .children-container {
            display: block;
          }
        }
      }
    }
  }
}
</style>
