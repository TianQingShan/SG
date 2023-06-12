<script setup lang="ts">
import getWebsocketAddress from '#/utils/websocket-address'
import { onMounted, onUnmounted } from 'vue'
import { useStore as _messageComponentStore } from '#/store/message-component'
import { useStore as _walletStore } from '#/store/wallet'
import { SG_INFO } from '#/keys/storage'
import { ethers, errors  } from 'ethers'
import {
  getPrizeWinnerList as _getPrizeWinnerList,
  whiteListQuery as _whiteListQuery,
  getDetail,
  cancelLotterySignature,
  type Response4
} from '#/request/api/mint'
import erc20Abi from '#/assets/abi/erc20.json'
import authorizedCastingABi from '#/assets/abi/authorized-casting.json'
import axios from 'axios'
import { ErrorCode } from '@ethersproject/logger'
import useRequestCancelMap from '#/utils/use-request-cancel-map'
import { MINT_SIGN, MINT_DETAILS } from '#/keys/request-cancel-map'
import { WalletConnectStatus } from '#/types/wallet'

const enum ProgressItemStatus {
  /** 已结束 */
  Ended = 0,

  /** 进行中 */
  Progress = 1,

  /** 未开启 */
  Unopened = 2
}

const enum MintButtonStatus {
  /** 未开启 */
  NotOpen = 'Coming Soon',

  /** 初始状态 */
  Default = 'Mint now',

  /** 钱包余额不足 */
  InsufficientUSDTBalance = 'Insufficient USDT balance',

  /** 授权金额不足 */
  ApproveUseOfUSDT = 'Approve use of USDT',
}

type EthersError = {
  action: string;
  code: ErrorCode;
  reason: string;
  transaction: any;
}

/** 定义进度项类型 */
type ProgressItem = {
  /** 标题 */
  title: string;

  /** 状态 */
  status: ProgressItemStatus;
}

let { defineCancelMaps, saveCancelFn, cancelRequests } = useRequestCancelMap()

defineCancelMaps([MINT_SIGN, MINT_DETAILS])

/** 获取当前进度是否已结束 */
let getCurrentProgressItemIsEnded = $computed(() => (status: ProgressItemStatus) => status === ProgressItemStatus.Ended)

/** 获取当前进度是否进行中 */
let getCurrentProgressItemIsProgress = $computed(() => (status: ProgressItemStatus) => status === ProgressItemStatus.Progress)

/** 获取进度项状态对应的文字 */
let getProgressItemStatusText = $computed(() => {
  const TABLE = $ref<Record<ProgressItemStatus, string>>({
    [ProgressItemStatus.Ended]: 'Ended',
    [ProgressItemStatus.Progress]: 'Now',
    [ProgressItemStatus.Unopened]: 'Coming Soon'
  })

  return (status: ProgressItemStatus) => TABLE[status]
})

/** 进度项 */
let progressItems = $ref<Array<ProgressItem>>([
  {
    title: 'Free Mint',
    status: ProgressItemStatus.Ended
  },
  {
    title: '$1,000',
    status: ProgressItemStatus.Progress
  },
  {
    title: '$2,000',
    status: ProgressItemStatus.Unopened
  },
  {
    title: '$5,000',
    status: ProgressItemStatus.Unopened
  },
  {
    title: '$10,000',
    status: ProgressItemStatus.Unopened
  }
])

let messageComponentStore = _messageComponentStore()
let walletStore = _walletStore()

let websocketInstance: WebSocket | null = null
let mintStatus = $ref<number | undefined>()
let mintIsNotOpen = $computed(() => mintStatus === 0)

let minting = $ref(false)
let mintButtonStatus = $ref<MintButtonStatus>(MintButtonStatus.Default)
let detailModalSource = $ref({
  visible: false,
  id: '',
  detail: null as (Response4 | null)
})

async function cancel() {
  let { request } = cancelLotterySignature()
  await request()
}

async function mint() {
  if (mintButtonStatus === MintButtonStatus.NotOpen) return
  if (mintButtonStatus === MintButtonStatus.InsufficientUSDTBalance) return
  if (mintIsNotOpen) return messageComponentStore.addMessage('The event will open soon, so stay tuned!')
  if (minting) return

  if (walletStore.connectStatus !== WalletConnectStatus.Connected) return walletStore.openSelectModal()

  let provider = walletStore.getProvider()

  /** 切换网络 */
  let currentNetwork = await provider?.detectNetwork()
  if (currentNetwork?.chainId !== +import.meta.env.VITE_CHAIN_ID) {
    await walletStore.switchNetwork()
    return
  }

  let account = walletStore.account

  try {
    minting = true

    const authorizedCastingContract = new ethers.Contract(import.meta.env.VITE_AUTHORIZED_CASTING_CONTRACT_ADDRESS, authorizedCastingABi, provider.getSigner())
    const erc20Contract = new ethers.Contract(import.meta.env.VITE_ERC20_CONTRACT_ADDRESS, erc20Abi, provider.getSigner())

    /** 铸造金额 */
    let price = (await authorizedCastingContract.functions['price']())[0]

    /** 用户钱包金额 */
    let balanceOf = (await erc20Contract.functions['balanceOf'](account))[0]

    /** 已授权金额 */
    let allowance = (await erc20Contract.functions['allowance'](account, import.meta.env.VITE_AUTHORIZED_CASTING_CONTRACT_ADDRESS))[0]

    if (mintButtonStatus === MintButtonStatus.ApproveUseOfUSDT) {
      let tx = await erc20Contract.functions['approve'](import.meta.env.VITE_AUTHORIZED_CASTING_CONTRACT_ADDRESS, price.sub(allowance))
      await tx.wait()
      return mintButtonStatus = MintButtonStatus.Default
    }

    /** 判断钱包金额是否足够 */
    if (balanceOf.lt(price)) return mintButtonStatus = MintButtonStatus.InsufficientUSDTBalance

    /** 判断授权金额是否足够 */
    if (allowance.lt(price)) return mintButtonStatus = MintButtonStatus.ApproveUseOfUSDT

    let tx = await authorizedCastingContract.functions['mintWithPayment'](account)
    let receipt = await tx.wait()
    let event = receipt.events.find((event: any) => event.event === 'Transfer')
    const tokenId = event.args.tokenId.toString()

    let { cancel: _cancel, request: _requset } = getDetail({ id: tokenId })
    saveCancelFn(MINT_DETAILS, _cancel)
    let detailResponse = await _requset()

    detailModalSource.visible = true
    detailModalSource.id = tokenId
    detailModalSource.detail = detailResponse
  } catch (error) {
    if (axios.isCancel(error)) return
    if (axios.isAxiosError(error)) return messageComponentStore.addMessage(error.message)

    if (error instanceof Error && errors[(error as unknown as EthersError)?.code]) {
      let _error = error as unknown as EthersError
      messageComponentStore.addMessage(_error.reason)
      // await cancel()
      return
    }
    if (error instanceof Error) {
      // await cancel()
      messageComponentStore.addMessage(error.message)
    }
  } finally {
    minting = false
  }
}

function jumpToOpensea() {
  window.open(import.meta.env.VITE_NFT_OPENSEA_ADDRESS + import.meta.env.VITE_NFT_CONTRACT_ADDRESS + '/' + detailModalSource.id)
}

onMounted(() => {
  websocketInstance = new WebSocket(getWebsocketAddress())

  websocketInstance.addEventListener('open', () => {
    let info = JSON.parse(localStorage.getItem(SG_INFO)!)
    if (info) websocketInstance!.send(JSON.stringify({ type: 'login', data: info.token }))

    websocketInstance?.send(JSON.stringify({ type: 'mintOpen' }))
  })

  websocketInstance.addEventListener('message', (event) => {
    let { type, data } = JSON.parse(event.data)

    switch (type) {
      case 'MINT_OPEN':
        mintStatus = Number(data.status)
      break
    }
  })

})

onUnmounted(() => {
  cancelRequests()
  websocketInstance?.close()
})
</script>

<script lang="ts">
export function getDocumentProps(pageProps: any) {
  return {
    title: 'Wolfox Club',
    description: ''
  }
}
</script>

<template>
  <div class="WolfoxClub">
    <div class="container">
      <div class="big-title">Wolfox Club</div>
      <div class="content">
        <div class="image">
          <img src="./images/image1.png" />
        </div>
        <div class="text-container">
          <div class="description">Wolfox is a NFT collection of 1,000 based on Polygon. Holders have the highest equity in SG Eco. Mint price gradually increases with the number of sales.</div>
          <div class="bottom">
            <div class="small-title">
              <div class="text">Equity</div>
              <div class="line"></div>
            </div>
            <div class="list-items">
              <div class="list-item">Comp airdrop</div>
              <div class="list-item">Alpha Identity</div>
              <div class="list-item">Exclusive Groups, giveaway and Services</div>
              <div class="list-item">Transaction fee discounts</div>
            </div>
          </div>
        </div>
      </div>
      <div class="progress-items">
        <div
          class="progress-item"
          :class="{ 'ended': getCurrentProgressItemIsEnded(item.status), 'progress': getCurrentProgressItemIsProgress(item.status) }"
          v-for="item of progressItems">
          <div class="title">{{ item.title }}</div>
          <div class="status">{{ getProgressItemStatusText(item.status) }}</div>
        </div>
      </div>
      <div class="button-container">
        <div class="text" :class="{ 'mint-not-open': mintIsNotOpen }" @click="mint">
          {{ mintButtonStatus }} {{ minting ? '...' : '' }}
        </div>
      </div>
    </div>

    <transition name="result-modal">
      <div class="result-modal" v-if="detailModalSource.visible">
        <div class="container">
          <div class="close-icon" @click="detailModalSource.visible = false"></div>
          <div class="title">Congratulation！</div>
          <div class="image">
            <img :src="detailModalSource.detail?.image" />
          </div>
          <div class="code">{{ detailModalSource.detail?.name }}</div>
          <div class="button" @click="jumpToOpensea">Go to View</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="less">
.WolfoxClub {
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
    padding: 20px;
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
    @media (max-width: 992px) {
      padding-bottom: 107px;
    }

    .big-title {
      font-size: 72px;
      font-weight: 600;
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
      margin-top: 80px;
      @media (max-width: 992px) {
        margin-top: 60px;
        flex-direction: column;
      }

      .image {
        width: 48%;
        margin-right: 80px;
        flex-shrink: 0;
        @media (max-width: 992px) {
          width: 100%;
          margin-right: 0;
          margin-bottom: 40px;
        }
      }

      .text-container {
        flex-grow: 1;

        .description {
          font-size: 32px;
          font-weight: 300;
          color: #222;
          line-height: 52px;
          @media (max-width: 992px) {
            font-size: 14px;
            font-weight: 400;
            line-height: 28px;
          }
        }

        .bottom {
          margin-top: 60px;
          @media (max-width: 992px) {
            margin-top: 30px;
          }

          .small-title {
            display: flex;
            align-items: center;

            .text {
              flex-shrink: 0;
              font-size: 32px;
              font-weight: 700;
              line-height: 52px;
              color: #222;
              margin-right: 20px;
              @media (max-width: 992px) {
                font-size: 24px;
                line-height: 30px;
              }
            }

            .line {
              position: relative;
              flex-grow: 1;
              height: 2px;
              background-color: rgba(0, 0, 0, .15);

              &::before {
                content: "";
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 85px;
                height: 4px;
                background-color: #222;
              }
            }
          }

          .list-items {
            margin-top: 20px;
            margin-left: 8px;

            .list-item {
              position: relative;
              font-size: 26px;
              font-weight: 300;
              line-height: 32px;
              color: #222;
              counter-increment: count;
              @media (max-width: 992px) {
                font-size: 14px;
                line-height: 18px;
              }

              &:not(:last-of-type) {
                margin-bottom: 20px;
                @media (max-width: 992px) {
                  margin-bottom: 10px;
                }
              }

              &::before {
                content: counter(count, decimal-leading-zero);
                font-size: 26px;
                font-weight: 700;
                line-height: 32px;
                margin-right: 45px;
                @media (max-width: 992px) {
                  font-size: 16px;
                  line-height: 20px;
                  margin-right: 10px;
                }
              }
            }
          }
        }
      }
    }

    .progress-items {
      display: flex;
      justify-content: space-between;
      margin-top: 120px;
      overflow-x: auto;
      @media (max-width: 992px) {
        margin-top: 62px;
      }
      @media (max-width: 414px) {
        margin-right: -20px;
      }

      &::-webkit-scrollbar {
        width: 0;
      }

      .progress-item {
        position: relative;
        border-radius: 20px;
        border: 1px solid #000;
        background-color: #fff;
        width: 256px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        flex-shrink: 0;
        @media (max-width: 1600px) {
          width: 18%;
        }

        @media (max-width: 992px) {
          width: auto;
          height: auto;
        }

        &:not(:last-of-type) {
          @media (max-width: 992px) {
            margin-right: 40px;
          }
        }

        &::before {
          content: "";
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          height: 2px;
          background-image: linear-gradient(90deg, #000, #000);
        }

        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border: 1px solid #000;
          border-radius: 50%;
          background-color: #fff;
          background-image: radial-gradient(circle at center, #222 2px, transparent 0);
        }

        .title {
          font-size: 32px;
          line-height: 52px;
          font-weight: 600;
          color: #222;
          @media (max-width: 1600px) {
            font-size: 22px;
          }

          @media (max-width: 992px) {
            font-size: 20px;
            line-height: 25px;
            margin-bottom: 12px;
          }
        }

        .status {
          font-size: 24px;
          font-weight: 400;
          line-height: 52px;
          color: #858687;
          @media (max-width: 1600px) {
            font-size: 18px;
          }

          @media (max-width: 992px) {
            font-size: 14px;
            line-height: 18px;
          }
        }

        &:first-of-type {
          &::after {
            display: none;
          }
        }

        &:last-of-type {
          &::before {
            display: none;
          }
        }

        &.ended {
          border: 1px solid rgba(34, 34, 34, .15);

          &::before {
            background-image: linear-gradient(90deg, rgba(34, 34, 34, .15), #000 20%);
          }
        }

        &.progress {
          @media (max-width: 992px) {
            border-width: 2px;
          }

          .title,
          .status {
            color: var(--theme-color);
          }

          &::after {
            background-image: radial-gradient(circle at center, var(--theme-color) 6px, transparent 0);
          }
        }
      }
    }

    .button-container {
      display: flex;
      justify-content: center;
      margin-top: 80px;
      @media (max-width: 992px) {
        margin-top: 60px;
      }

      .text {
        cursor: pointer;
        font-size: 36px;
        line-height: 46px;
        font-weight: 400;
        color: #fff;
        background-color: var(--theme-color);
        border-radius: 16px;
        padding: 14px 121px;
        transition: all .25s;
        max-width: 100%;
        text-align: center;

        @media (max-width: 992px) {
          width: 100%;
          padding: 12px 24px;
          border-radius: 14px;
          font-size: 16px;
          line-height: 20px;
        }

        &.mint-not-open {
          filter: grayscale(1);
        }

        &:not(.mint-not-open):hover {
          background-color: #12aea1;
        }
      }
    }
  }
}

.result-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;

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
    border-radius: 12px;
    box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .08);
    background-color: #fff;
    padding: 40px;
    @media (max-width: 992px) {
      padding: 20px;
    }

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

    .title {
      font-size: 26px;
      line-height: 34px;
      font-weight: 600;
      color: #222;
      text-align: center;
      margin-bottom: 30px;
      @media (max-width: 992px) {
        font-size: 24px;
        line-height: 30px;
        margin-bottom: 20px;
      }
    }

    .image {
      width: 280px;
      border-radius: 12px;
      overflow: hidden;
      margin: 0 auto 30px;
      @media (max-width: 992px) {
        margin-bottom: 20px;
      }
    }

    .code {
      font-size: 14px;
      line-height: 18px;
      font-weight: 600;
      color: #474747;
      margin-bottom: 30px;
      text-align: center;
      @media (max-width: 992px) {
        margin-bottom: 20px;
      }
    }

    .button {
      cursor: pointer;
      user-select: none;
      border-radius: 16px;
      background-color: var(--theme-color);
      padding: 14px 32px;
      font-size: 20px;
      line-height: 26px;
      font-weight: 400;
      color: #fff;
      text-align: center;
      transition: all .4s;
      max-width: 100%;
      @media (max-width: 992px) {
        border-radius: 14px;
        padding: 12px 24px;
        font-size: 16px;
        line-height: 20px;
      }

      &:hover {
        background-color: var(--theme-color-hover);
      }
    }
  }
}
</style>
