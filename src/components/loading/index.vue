<script setup lang="ts">
type Props = {
  /** 盒子大小 */
  boxSize?: number;
  /** 圆大小 */
  roundSize?: number;
  /** 圆颜色 */
  roundColor?: string;
}

let { boxSize = 70, roundSize = 10, roundColor = '#80b1fe' } = defineProps<Props>()

let getBoxSize = $computed(() => boxSize + 'px')
let getRoundSize = $computed(() => roundSize + 'px')
let offsetTopSize = $computed(() => (-roundSize / 2) + 'px')
</script>

<template>
  <div class="Loading">
    <div class="round"></div>
    <div class="round"></div>
    <div class="round"></div>
    <div class="round"></div>
    <div class="round"></div>
    <div class="round"></div>
    <div class="round"></div>
    <div class="round"></div>
  </div>
</template>

<style scoped lang="less">
@keyframes scale {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
}

.Loading {
  width: v-bind(getBoxSize);
  height: v-bind(getBoxSize);
  position: relative;
  border-radius: 50%;
  position: relative;
  z-index: 999;

  .round {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: v-bind(offsetTopSize);
    width: 50%;
    height: v-bind(getRoundSize);
    transform-origin: left center;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: v-bind(getRoundSize);
      background-color: v-bind(roundColor);
      border-radius: 50%;
      animation: scale .8s ease infinite alternate;
    }

    &:nth-of-type(1) {
      &::before {
        animation-delay: 0s;
      }
    }

    &:nth-of-type(2) {
      transform: rotate(45deg);

      &::before {
        animation-delay: 0.1s;
      }
    }

    &:nth-of-type(3) {
      transform: rotate(90deg);

      &::before {
        animation-delay: 0.2s;
      }
    }

    &:nth-of-type(4) {
      transform: rotate(135deg);

      &::before {
        animation-delay: 0.3s;
      }
    }

    &:nth-of-type(5) {
      transform: rotate(180deg);

      &::before {
        animation-delay: 0.4s;
      }
    }

    &:nth-of-type(6) {
      transform: rotate(225deg);

      &::before {
        animation-delay: 0.5s;
      }
    }

    &:nth-of-type(7) {
      transform: rotate(270deg);

      &::before {
        animation-delay: 0.6s;
      }
    }

    &:nth-of-type(8) {
      transform: rotate(315deg);

      &::before {
        animation-delay: 0.7s;
      }
    }
  }
}
</style>
