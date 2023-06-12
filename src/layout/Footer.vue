<script setup lang="ts">
import { getNavigation, hasChildrenNavigation, handleNavigationClick } from '#/utils/navigation'
import Logo from '#/components/logo/index.vue'
import { LogoImage } from '#/types/logo'
import { navigate } from 'vite-plugin-ssr/client/router'

/** 定义分享跳转 type 参数类型 */
const enum ShareType {
  Discord,
  Twitter,
  Youtube,
  Telegram
}

/**
 * 分享跳转
 * @param type 分享图标类型
 */
function shareJump(type: ShareType) {
  let link = ''

  switch (type) {
    case ShareType.Discord:
      link = import.meta.env.VITE_DISCORD_WEBSITE_ADDRESS
    break
    case ShareType.Twitter:
      link = import.meta.env.VITE_TWITTER_WEBSITE_ADDRESS
    break
    case ShareType.Youtube:
      link = import.meta.env.VITE_YOUTUBE_WEBSITE_ADDRESS
    break
    case ShareType.Telegram:
      link = import.meta.env.VITE_TELEGRAM_WEBSITE_ADDRESS
    break
  }

  window.open(link)
}

async function jumpToHome() {
  await navigate(import.meta.env.VITE_HOME_URL)
}

</script>

<template>
  <div class="Footer">
    <div class="container">
      <div class="left">
        <div class="logo" @click="jumpToHome">
          <Logo :type="LogoImage.White" />
        </div>
        <div class="share-items">
          <div class="share-item" @click="shareJump(ShareType.Discord)">
            <img src="./images/footer-share-icon1.png" />
          </div>
          <div class="share-item" @click="shareJump(ShareType.Twitter)">
            <img src="./images/footer-share-icon2.png" />
          </div>
          <div class="share-item" @click="shareJump(ShareType.Youtube)">
            <img src="./images/footer-share-icon3.png" />
          </div>
          <div class="share-item" @click="shareJump(ShareType.Telegram)">
            <img src="./images/footer-share-icon4.png" />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="navigation-items">
          <div class="navigation-item" v-for="item of getNavigation()">
            <div class="parent-text-container">
              <div class="text" :class="{ 'not-children': !hasChildrenNavigation(item)  }" @click="handleNavigationClick(item)">{{ item.text }}</div>
              <div class="arrow" v-if="!hasChildrenNavigation(item)"></div>
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
    </div>
  </div>
</template>

<style scoped lang="less">
.Footer {
  background-color: #222;
  padding: 3vw;
  @media (max-width: 992px) {
    padding: 40px 20px 100px;
  }

  .container {
    width: 100%;
    max-width: var(--container-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    @media (max-width: 992px) {
      flex-direction: column;
    }

    .left {
      @media (max-width: 992px) {
        margin-bottom: 72px;
      }

      .logo {
        cursor: pointer;
        max-width: 163px;
        margin-bottom: 43px;
        @media (max-width: 992px) {
          max-width: 200px;
          margin-bottom: 37px;
        }
      }

      .share-items {
        display: flex;

        .share-item {
          width: 24px;
          cursor: pointer;
          transition: all .25s;

          &:hover {
            opacity: .75;
          }

          &:not(:last-of-type) {
            margin-right: 24px;
            @media (max-width: 992px) {
              margin-right: 26px;
            }
          }
        }
      }
    }

    .right {
      .navigation-items {
        display: flex;
        @media (max-width: 992px) {
          flex-wrap: wrap;
          gap: 40px 0;
        }

        .navigation-item {
          @media (max-width: 992px) {
            width: 50%;

            &:nth-of-type(1) {
              order: 1;
            }

            &:nth-of-type(2) {
              order: 4;
            }

            &:nth-of-type(3) {
              order: 3;
            }

            &:nth-of-type(4) {
              order: 2;
            }
          }

          &:not(:last-of-type) {
            margin-right: 80px;
            @media (max-width: 992px) {
              margin-right: 0;
            }
          }

          .parent-text-container {
            display: flex;
            align-items: center;

            .text {
              font-size: 16px;
              line-height: 20px;
              font-weight: 600;
              color: #fff;

              &.not-children {
                cursor: pointer;

                &:hover {
                  text-decoration: underline;

                  & + .arrow {
                    opacity: 1;
                  }
                }
              }
            }

            .arrow {
              opacity: 0;
              margin-left: 6px;
              transition: all .25s;
              width: 9px;
              height: 20px;
              background-image: url('./images/footer-navigation-hover.png');
              background-repeat: no-repeat;
              background-size: contain;
              background-position: center;
            }
          }

          .children-container {
            .children-items {
              .children-item {
                margin-top: 24px;
                @media (max-width: 992px) {
                  margin-top: 16px;
                }

                .children-text-container {
                  display: flex;
                  align-items: center;

                  .text {
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 20px;
                    font-weight: 300;
                    color: rgba(255, 255, 255, .8);
                    @media (max-width: 992px) {
                      font-size: 14px;
                      line-height: 18px;
                    }

                    &:hover {
                      text-decoration: underline;

                      + .arrow {
                        opacity: 1;
                      }
                    }
                  }

                  .arrow {
                    opacity: 0;
                    margin-left: 6px;
                    transition: all .25s;
                    width: 9px;
                    height: 20px;
                    background-image: url('./images/footer-navigation-hover.png');
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
