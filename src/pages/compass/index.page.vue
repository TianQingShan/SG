<script setup lang="ts">
import isMobile from '#/utils/is-mobile'
import { useStore as _messageComponentStore } from '#/store/message-component'
import { getAppDownLoadAddress as _getAppDownLoadAddress } from '#/request/api/app-download-address'

let messageComponentStore = _messageComponentStore()

let downloadModalVisible = $ref(false)

async function openDownLoad() {
  try {
    let { request } = _getAppDownLoadAddress()
    let { android } = await request()

    window.location.href = android
  } catch (error) {}
}

/** 下载 */
function handleDownload() {
  switch (isMobile()) {
    case true:
			let category = navigator.userAgent
			let isIos = !!category.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

      if (isIos) return messageComponentStore.addMessage('The current version only supports Android download.')

      openDownLoad()
    break
    case false:
      downloadModalVisible = true
    break
  }
}
</script>

<script lang="ts">
export function getDocumentProps(pageProps: any) {
  return {
    title: 'Compass',
    description: ''
  }
}
</script>

<template>
  <div class="Compass">
    <div class="container">
      <div class="big-title">Compass</div>
      <div class="content">
        <div class="text-container">
          <div class="description">The compass brings a new way of playing and earning. You don't have any consumption pressure here, and you can also get rich rewards through various activities and tasks, get to know more friends, expand your social circle, and become a social expert.</div>
          <div class="button">
            <div class="text" @click="handleDownload">Download</div>
          </div>
        </div>
        <div class="image">
          <img src="./images/image.png" />
        </div>
      </div>
    </div>

    <transition name="download">
      <div class="download-modal" v-if="downloadModalVisible">
        <div class="container">
          <div class="close-icon" @click="downloadModalVisible = false"></div>
          <div class="text">
            <p>Install compass</p>
            <p>for your android</p>
          </div>
          <div class="image"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="less">
.Compass {
  position: relative;
  width: 100%;
  background-image: url('./images/bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;
  border-radius: 60px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  overflow: hidden;
  padding: 3vw 3vw calc(3vw + 60px);
  @media (max-width: 992px) {
    padding: 20px 20px 80px;
  }

  @media (max-width: 414px) {
    background-image: url('./images/mobile-bg.png');
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-image: url('./images/bg5.png');
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 100% auto;
    display: none;

    @media (max-width: 414px) {
      display: block;
    }
  }

  .container {
    width: 100%;
    max-width: var(--container-width);
    margin: 0 auto;
    padding-top: 60px;

    .big-title {
      font-size: 72px;
      font-weight: 700;
      line-height: 90px;
      color: #222;
      text-align: center;
      @media (max-width: 992px) {
        font-size: 28px;
        line-height: 35px;
      }
    }

    .content {
      display: flex;
      align-items: center;
      margin-top: 80px;
      @media (max-width: 992px) {
        margin-top: 60px;
        flex-direction: column-reverse;
      }

      .text-container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .description {
          font-size: 32px;
          line-height: 52px;
          font-weight: 300;
          color: #222;
          margin-bottom: 53px;
          @media (max-width: 992px) {
            font-size: 14px;
            line-height: 28px;
            margin-bottom: 53px;
          }
        }

        .button {
          display: flex;

          .text {
            cursor: pointer;
            font-size: 36px;
            font-weight: 400;
            line-height: 46px;
            color: #fff;
            border-radius: 16px;
            background-color: var(--theme-color);
            padding: 14px 112px;
            transition: all .25s;
            max-width: 100%;
            text-align: center;
            @media (max-width: 992px) {
              padding: 12px 24px;
              border-radius: 14px;
              font-size: 16px;
              line-height: 20px;
              width: 100%;
            }

            &:hover {
              background-color: var(--theme-color-hover);
            }
          }
        }
      }

      .image {
        flex-shrink: 0;
        width: 48%;
        margin-left: 68px;
        @media (max-width: 1600px) {
          width: 50%;
        }
        @media (max-width: 992px) {
          width: 100%;
          margin-left: 0;
          margin-bottom: 40px;
        }
      }
    }
  }
}

.download-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .44);
  }

  .container {
    position: relative;
    width: 100%;
    max-width: 560px;
    padding: 40px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .08);
    display: flex;
    flex-direction: column;
    align-items: center;

    .close-icon {
      cursor: pointer;
      position: absolute;
      top: 30px;
      right: 30px;
      width: 12px;
      height: 12px;
      background-image: url('./images/close-icon.png');
      background-size: contain;
      background-repeat: center;
      background-position: center;
      transition: all .4s;

      &:hover {
        opacity: .75;
      }
    }

    .text {
      font-size: 26px;
      line-height: 36px;
      font-weight: 600;
      color: #222;
      margin-bottom: 20px;
    }

    .image {
      width: 50%;
      aspect-ratio: 1 / 1;
      background-image: url('https://surfguild.io/uploads/package/QRcode.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
  }
}

.download-enter-active,
.download-leave-active {
  transition: all .25s;
}

.download-enter-from,
.download-leave-to {
  opacity: 0;
}
</style>
