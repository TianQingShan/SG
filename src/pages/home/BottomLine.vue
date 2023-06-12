<script setup lang="ts"></script>

<template>
  <div class="BottomLine"></div>
</template>

<style scoped lang="less">
.BottomLine {
  position: relative;
  width: 100%;
  height: 2px;
  background-color: #f2f2f5;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--theme-color);
    @media (max-width: 992px) {
      width: 4px;
      height: 4px;
    }
  }

  &::before {
    bottom: calc(100% + 20px);
    left: 0;
    @media (max-width: 992px) {
      bottom: calc(100% + 6px);
    }
  }

  &::after {
    top: calc(100% + 20px);
    right: 0;
    @media (max-width: 992px) {
      top: calc(100% + 6px);
    }
  }
}
</style>
