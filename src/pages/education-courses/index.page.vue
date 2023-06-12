<script setup lang="ts">
import { PageType } from '#/types/news'
import News from '#/components/news/index.vue'
</script>

<script lang="ts">
export function getDocumentProps(pageProps: any) {
  return {
    title: 'Education Courses',
    description: ''
  }
}
</script>

<template>
  <div class="EducationCourses">
    <News :pageType="PageType.EducationCourses" />
  </div>
</template>

<style scoped lang="less">
.EducationCourses {
  width: 100%;
}
</style>
