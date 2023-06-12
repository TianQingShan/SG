<script setup lang="ts">
import { onUnmounted } from 'vue'
import { subscribe as _subscribe } from '#/request/api/subscribe'
import useRequestCancelMap from '#/utils/use-request-cancel-map'
import { SUBSCRIBE } from '#/keys/request-cancel-map'
import failedStatusImage from './images/subscribe-failed-icon.png'
import successStatusImage from './images/subscribe-success-icon.png'
import repeatStatusImage from './images/subscribe-repeat-icon.png'

let { defineCancelMaps, saveCancelFn, cancelRequests } = useRequestCancelMap()

defineCancelMaps([SUBSCRIBE])

let emits = defineEmits<{
  (e: 'close'): void
}>()

/** 定义订阅状态枚举值 */
const enum SubscribeStatus {
  /** 未开始订阅 */
  NotSubscribe,

  /** 订阅中 */
  Subscribing,

  /** 订阅成功 */
  SubscribeSuccess,

  /** 订阅重复 */
  SubscribeRepeat,

  /** 订阅失败 */
  SubscribeFailed
}

/** 订阅状态 */
let subscribeStatus = $ref(SubscribeStatus.NotSubscribe)

/** 输入的邮箱 */
let inputEmail = $ref('')

/** 按钮激活 */
let buttonActived = $computed(() => inputEmail && inputEmail.includes('@'))

/** 是否正在订阅中 */
let isSubscribing = $computed(() => subscribeStatus === SubscribeStatus.Subscribing)

/** 是否订阅失败 */
let isSubscribeFailed = $computed(() => subscribeStatus === SubscribeStatus.SubscribeFailed)

/** 获取订阅结果展示信息 */
let getSubscribeResultInfo = $computed(() => {
  /**
   * @prop title 标题
   * @prop description 描述
   * @prop imageAddress 图片地址
   */
  let info = {
    title: '',
    description: '',
    imageAddress: ''
  }

  switch (subscribeStatus) {
    case SubscribeStatus.SubscribeFailed:
      Object.assign(info, {
        title: 'Subscription Failed',
        description: 'Subscription failed, please try again.',
        imageAddress: failedStatusImage
      })
    break
    case SubscribeStatus.SubscribeSuccess:
    Object.assign(info, {
        title: 'Subscription Success',
        description: 'Thank you for subscribing!',
        imageAddress: successStatusImage
      })
    break
    case SubscribeStatus.SubscribeRepeat:
    Object.assign(info, {
        title: 'Subscription Repeat',
        description: 'You have successfully subscribed!',
        imageAddress: repeatStatusImage
      })
    break
  }

  return info
})

/** 确认订阅 */
async function confirmSubscribe() {
  if (!buttonActived) return
  if (isSubscribing) return

  try {
    subscribeStatus = SubscribeStatus.Subscribing

    let { cancel, request } = _subscribe({ address: inputEmail })
    saveCancelFn(SUBSCRIBE, cancel)
    let { result } = await request()

    switch (result) {
      case 0:
        subscribeStatus = SubscribeStatus.SubscribeFailed
      break
      case 1:
        subscribeStatus = SubscribeStatus.SubscribeSuccess
      break
      case 2:
        subscribeStatus = SubscribeStatus.SubscribeRepeat
      break
    }
  } catch (error) {
    subscribeStatus = SubscribeStatus.SubscribeFailed
  }
}

/** 关闭订阅弹框 */
function close() {
  emits('close')
}

onUnmounted(() => {
  cancelRequests()
})
</script>

<template>
  <div class="Subscribe">
    <template v-if="[SubscribeStatus.NotSubscribe, SubscribeStatus.Subscribing].includes(subscribeStatus)">
      <div class="subscribe-input-container">
        <div class="close-icon" @click="close"></div>
        <div class="image"></div>
        <div class="content">
          <div class="title">Join the Surfguild Newsletter</div>
          <div class="description">Be the first to receive Surfguild updates, announcements and more</div>
          <input class="input" placeholder="Email" v-model="inputEmail" />
          <div
            class="confirm-button"
            :class="{ 'has-value': buttonActived, subscribing: isSubscribing }"
            @click="confirmSubscribe">
            {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
          </div>
        </div>
      </div>
    </template>

    <template v-if="[SubscribeStatus.SubscribeSuccess, SubscribeStatus.SubscribeRepeat, SubscribeStatus.SubscribeFailed].includes(subscribeStatus)">
      <div class="result-container">
        <div class="close-icon" @click="close"></div>
        <div class="title">{{ getSubscribeResultInfo.title }}</div>
        <div class="description">{{ getSubscribeResultInfo.description }}</div>
        <div class="image">
          <img :src="getSubscribeResultInfo.imageAddress" />
        </div>
        <div class="resubmit" :class="{ subscribing: isSubscribing }" @click="confirmSubscribe" v-if="isSubscribeFailed">
          {{ isSubscribing ? 'Resubmiting...' : 'Resubmit' }}
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
.Subscribe {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  padding: 20px;
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

  .subscribe-input-container,
  .result-container {
    position: relative;
    width: 100%;
    max-width: 560px;
    background-color: #fff;
    box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .08);
    border-radius: 12px;
    overflow: hidden;

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
  }

  .subscribe-input-container .content,
  .result-container {
    padding: 40px;
    @media (max-width: 992px) {
      padding: 20px;
    }

    .title {
      font-weight: 600;
      font-size: 26px;
      line-height: 34px;
      color: #000;
      @media (max-width: 992px) {
        font-size: 24px;
        line-height: 30px;
      }
    }

    .description {
      font-size: 14px;
      line-height: 18px;
      font-weight: 300;
      color: #858687;
      @media (max-width: 992px) {
        line-height: 20px;
      }
    }
  }

  .subscribe-input-container {

    .image {
      border-radius: inherit;
      overflow: hidden;
      height: 212px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-image: url('./images/subscribe-image1.png');
      @media (max-width: 992px) {
        height: 210px;
      }
    }

    .content {
      .description {
        margin-top: 20px;
        @media (max-width: 992px) {
          margin-top: 8px;
        }
      }

      .input {
        width: 100%;
        height: 40px;
        border-radius: 12px;
        border: 1px solid #e7e7ea;
        padding: 16px;
        margin-top: 30px;
        font-size: 14px;
        line-height: 17px;
        color: #222;
        transition: all .25s;
        @media (max-width: 992px) {
          height: 48px;
          margin-top: 20px;
        }

        &::-webkit-input-placeholder {
          color: #828387;
        }

        &:focus {
          border-color: var(--theme-color);
        }
      }

      .confirm-button {
        margin-top: 30px;
        cursor: pointer;
        user-select: none;
        font-size: 20px;
        line-height: 26px;
        color: #fff;
        padding: 14px 32px;
        background-color: var(--theme-color);
        opacity: .4;
        border-radius: 16px;
        text-align: center;
        transition: all .25s;
        @media (max-width: 992px) {
          margin-top: 20px;
        }

        &.has-value {
          opacity: 1;
        }

        &.subscribing {
          opacity: .4;
        }

        &.has-value:not(.subscribing):hover {
          background-color: #12aea1;
        }
      }
    }
  }

  .result-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .description {
      margin-top: 12px;
    }

    .resubmit {
      width: 100%;
      margin-top: 30px;
      cursor: pointer;
      user-select: none;
      font-size: 20px;
      color: #fff;
      padding: 14px 32px;
      background-color: var(--theme-color);
      border-radius: 16px;
      text-align: center;
      transition: all .25s;
      @media (max-width: 992px) {
        margin-top: 20px;
      }

      &.subscribing {
        opacity: .4;
      }

      &:not(.subscribing):hover {
        background-color: #12aea1;
      }
    }
  }
}
</style>
