<script setup lang="ts">
type Props = {
  message: string;
}

let { message = '' } = defineProps<Props>()
</script>

<template>
  <div class="Message">
    <div class="text">{{ message }}</div>
  </div>
</template>

<style scoped lang="less">
.Message {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  max-width: 725px;
  max-height: 230px;
  background-color: #000;
  border-radius: 6px;
  padding: 4px 20px;
  display: flex;
  justify-content: center;
  overflow: auto;
  @media (max-width: 1024px) {
    width: 75%;
  }

  .text {
    font-family: 'SourceHanSansCN-Bold';
    font-size: 20px;
    color: #fff;
    // word-break: break-word;
    @media (max-width: 1024px) {
      font-size: 15px;
    }
  }
}
</style>
