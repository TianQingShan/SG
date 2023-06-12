<script setup lang="ts">
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useStore as _messageComponentStore } from '#/store/message-component'
import { useStore as _walletStore } from '#/store/wallet'
import Message from '#/components/message/index.vue'
import { onMounted } from 'vue'
import clearLoginStorage from '#/utils/clearLoginStorage'
import { SG_INFO, SG_LOGIN_DATE } from '#/keys/storage'
import { WalletConnectStatus, ProviderName } from '#/types/wallet'
import metamaskIcon from './images/metamsk.png'
import walletConnectIcon from './images/walletconnect.png'

let messageComponentStore = _messageComponentStore()
let walletStore = _walletStore()
let walletItems = $ref([
  {
    key: ProviderName.MeteMask,
    text: 'METAMASK',
    icon: metamaskIcon
  },
  {
    key: ProviderName.Walletconnect,
    text: 'Wallet Connect',
    icon: walletConnectIcon
  }
])


/** 选择钱包 */
async function selectWalletItem(providerName: ProviderName) {
  if (walletStore.connectStatus === WalletConnectStatus.Connecting) return
  await walletStore.connect(providerName)
}

onMounted(async () => {
  let currentTimestamp = new Date().getTime()
  let getInfo = localStorage.getItem(SG_INFO)
  let getLoginDate = localStorage.getItem(SG_LOGIN_DATE)

  /** 缺少缓存信息 */
  if (!(getInfo && getLoginDate)) return

  let infoToJSON = JSON.parse(getInfo)
  let dateToNumber = +getLoginDate

  if (currentTimestamp < (dateToNumber + infoToJSON.expires_time * 1000)) { /** 登录未过期 */
    walletStore.connectStatus = WalletConnectStatus.Connected
    await walletStore.saveCachedData()
    walletStore.listen()
  } else { /** 登录过期 */
    clearLoginStorage()
  }
})
</script>

<template>
  <div class="Layout">
    <div class="header">
      <Header />
    </div>
    <div class="page-content">
      <slot />
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>

  <transition-group name="message">
    <Message v-for="(message, index) of messageComponentStore.message" :message="message" :key="index" />
  </transition-group>

  <transition name="select-wallet-modal">
    <div class="select-wallet-modal" v-if="walletStore.selectWalletModalVisible">
      <div class="mask-layer"></div>
      <div class="content-container">
        <div class="close-buttoon" @click="walletStore.changeSelectWalletModalVisible(false)"></div>
        <div class="title">Choose your wallet</div>
        <div class="wallet-items">
          <div
            class="wallet-item"
            :class="{
              'loading': walletStore.providerName === item.key,
              'disabled': walletStore.connectStatus === WalletConnectStatus.Connecting && walletStore.providerName !== item.key
            }"
            v-for="item of walletItems"
            @click="selectWalletItem(item.key)">
            <img :src="item.icon" class="icon" />
            <div class="text">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="less">
@import '#/stylesheet/index.less';
</style>

<style scoped lang="less">
.Layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .haeder {
    flex-shrink: 0;
  }

  .page-content {
    flex-grow: 1;
    display: flex;
  }

  .footer {
    flex-shrink: 0;
  }
}

.message-enter-active,
.message-leave-active {
  transition: all .5s;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  margin-top: -30px;
}

.select-wallet-modal-enter-active,
.select-wallet-modal-leave-active {
  transition: all .25s;
}

.select-wallet-modal-enter-from,
.select-wallet-modal-leave-to {
  opacity: 0;
}

.select-wallet-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .mask-layer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(13, 17, 28, .6);
  }

  .content-container {
    width: 100%;
    max-width: 560px;
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    padding: 40px;
    @media (max-width: 992px) {
      padding: 20px;
    }

    .close-buttoon {
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

    .title {
      font-size: 26PX;
      font-weight: 500;
      color: #000;
      line-height: 34px;
      @media (max-width: 992px) {
        font-size: 24px;
        line-height: 30px;
      }
    }

    .wallet-items {
      margin-top: 30px;
      @media (max-width: 992px) {
        margin-top: 20px;
      }

      .wallet-item {
        position: relative;
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #e7e7ea;
        transition: all .25s;
        overflow: hidden;

        &.loading {
          border-color: var(--theme-color);

          &::before {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            content: "Loading...";
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 14px;
            color: var(--theme-color);
            padding-right: 20px;
          }
        }

        &.disabled {
          cursor: no-drop;
          filter: blur(2px);
        }

        &:not(:last-of-type) {
          margin-bottom: 30px;
          @media (max-width: 992px) {
            margin-bottom: 20px;
          }
        }

        .icon {
          width: 34px;
          flex-shrink: 0;
          margin-right: 20px;
        }

        .text {
          flex-grow: 1;
          font-weight: 400;
          font-size: 18px;
          line-height: 20px;
          color: #000;
        }

        &:not(.loading):not(.disabled):hover {
          border-color: var(--theme-color);
        }
      }
    }
  }
}
</style>
