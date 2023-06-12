<script setup lang="ts"></script>

<template>
  <div class="NotData">
    <div class="image">
      <img src="./images/image.png" />
    </div>
    <div class="text">Not content</div>
  </div>
</template>

<style scoped lang="less">
.NotData {
  display: flex;
  flex-direction: column;
  align-items: center;

  .image {
    max-width: 100%;
    width: 320px;
  }

  .text {
    font-size: 16px;
    font-weight: 300;
    line-height: 28px;
    color: #858687;
  }
}
</style>
