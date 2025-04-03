<script setup>
import { ref , provide , nextTick } from 'vue'
import { RouterView } from "vue-router";

const screenHeight = ref(667 + "px"); // 页面高度

// 重新设置页面 size
const resetPageMinSize = () => {
  screenHeight.value = window.innerHeight + "px";
};

window.addEventListener("resize", resetPageMinSize);
window.addEventListener("DOMContentLoaded", resetPageMinSize);

const isRouterActive = ref(true)
const reload = () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
}
provide('reload', reload)
</script>

<template>
  <div id="app">
    <RouterView :style="{ height: screenHeight }" v-if="isRouterActive"></RouterView>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100%;
}
</style>
