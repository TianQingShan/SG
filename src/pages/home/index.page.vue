<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import Banner from './Banner.vue'
import Description from './Description.vue'
import StartYourJourney from './StartYourJourney.vue'
import RoadMap from './RoadMap.vue'
import RelationshipNetwork from './RelationshipNetwork.vue'
import { getHomeData as _getHomeData, type Response1 } from '#/request/api/home'
import useRequestCancelMap from '#/utils/use-request-cancel-map'
import { HOME } from '#/keys/request-cancel-map'

let { defineCancelMaps, saveCancelFn, cancelRequests } = useRequestCancelMap()

defineCancelMaps([HOME])

let homeData = $ref<Response1 | null>(null)

onMounted(async() => {
  try {
    let { cancel, request } = _getHomeData()
    saveCancelFn(HOME, cancel)

    homeData = await request()
  } catch (error) {}
})

onBeforeUnmount(() => {
  cancelRequests()
})
</script>

<script lang="ts">
export function getDocumentProps(pageProps: any) {
  return {
    title: 'A Web3 Gamer Guild',
    description: ''
  }
}
</script>

<template>
  <div class="Home">
    <Banner />
    <Description />
    <StartYourJourney :list="homeData?.journey || []" />
    <RoadMap />
    <RelationshipNetwork />
  </div>
</template>

<style scoped lang="less">
.Home {
  width: 100%;
}
</style>
