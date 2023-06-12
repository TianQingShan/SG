<script setup lang="ts">
import blackLogo from './images/black-logo.png'
import whiteLogo from './images/white-logo.png'
import { LogoImage } from '#/types/logo'

type Style = {
  imageLink: string;
  textColor: string;
}

type Props = {
  type: LogoImage
}

let { type } = defineProps<Props>()

let getStyle = $computed(() => {
  const TABLE: Record<LogoImage, Style> = {
    [LogoImage.Black]: {
      imageLink: blackLogo,
      textColor: '#000'
    },
    [LogoImage.White]: {
      imageLink: whiteLogo,
      textColor: '#fff'
    }
  }

  return TABLE[type]
})
</script>

<template>
  <div class="Logo">
    <div class="image">
      <img :src="getStyle.imageLink" />
    </div>
    <div class="text" :style="{ 'color': getStyle.textColor }">Surf Guild</div>
  </div>
</template>

<style scoped lang="less">
.Logo {
  display: flex;
  align-items: center;

  .image {
    width: 38px;
    flex-shrink: 0;
    margin-right: 4px;
  }

  .text {
    flex-shrink: 0;
    font-family: 'Impact';
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;
    transform: matrix(1, 0, -0.19, 0.98, 0, 0);
    letter-spacing: 0.02em;
  }
}
</style>
