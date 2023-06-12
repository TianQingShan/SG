<script setup lang="ts">
import { PageType } from '#/types/news'
import News from '#/components/news/index.vue'
</script>

<script lang="ts">
export function getDocumentProps(pageProps: any) {
  return {
    title: 'Game Guide',
    description: ''
  }
}
</script>

<template>
  <div class="GameGuide">
    <News :pageType="PageType.GameGuide" />
  </div>
</template>

<style scoped lang="less">
.GameGuide {
  width: 100%;
}
</style>
