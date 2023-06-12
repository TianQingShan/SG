<script setup lang="ts">
import { PageType } from '#/types/news'
import Details from '#/components/news/Details.vue'
</script>

<script lang="ts">
export function getDocumentProps(pageProps: any) {
  return {
    title: pageProps.title,
    description: pageProps.description,
    image: pageProps.image
  }
}
</script>

<template>
  <div class="EducationCoursesDetails">
    <Details :pageType="PageType.EducationCourses" />
  </div>
</template>

<style scoped lang="less">
.EducationCoursesDetails {
  width: 100%;
}
</style>
