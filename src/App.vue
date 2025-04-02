<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";

const screenHeight = ref(667 + "px"); // 页面高度

// 重新设置页面 size
const resetPageMinSize = () => {
	screenHeight.value = window.innerHeight + "px";
};

window.addEventListener("resize", resetPageMinSize);
window.addEventListener("DOMContentLoaded", resetPageMinSize);

</script>

<template>
  <RouterView :style="{ height: screenHeight }" />
</template>

<style scoped>

</style>
