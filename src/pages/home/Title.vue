<script setup lang="ts">
type Props = {
  /** 标题 */
  title: string;
}

let { title } = defineProps<Props>()
</script>

<template>
  <div class="Title">
    <div class="text">{{ title }}</div>
  </div>
</template>

<style scoped lang="less">
.Title {
  display: flex;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: "/";
    font-size: 24px;
    line-height: 30px;
    font-weight: 200;
    @media (max-width: 992px) {
      font-size: 12px;
      line-height: 15px;
    }
  }

  .text {
    font-size: 40px;
    font-weight: 600;
    color: #222;
    line-height: 50px;
    margin: 0 40px;
    @media (max-width: 992px) {
      font-size: 22px;
      line-height: 30px;
      margin: 0 12px;
    }
  }
}
</style>
