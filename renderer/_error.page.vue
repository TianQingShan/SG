<template>
  <div class="Error">
    <div v-if="is404">
        <h1>404 Page Not Found</h1>
        <p>This page could not be found.</p>
    </div>
    <div v-else>
      <h1>500 Internal Error</h1>
      <p>Something went wrong.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps(['is404'])
</script>

<script lang="ts">
export function getDocumentProps(pageProps: any) {
  return {
    title: '404',
    description: ''
  }
}
</script>

<style scoped lang="less">
.Error {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
