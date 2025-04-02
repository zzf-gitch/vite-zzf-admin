<template>
    <div class="video-wrapper">
        <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto"
            width="100%" height="auto">
            <source :src="videoSrc" type="video/mp4">
        </video>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount , computed } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
    videoSrc: {
        type: String,
        required: true
    }
})

// 处理视频路径 解决打包后404问题
const processedVideoSrc = computed(() => {
    return withBase(props.videoSrc)
})

const videoPlayer = ref(null)
let player = null

onMounted(() => {
    player = videojs(videoPlayer.value, {
        controls: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2]
    })
})

onBeforeUnmount(() => {
    if (player) {
        player.dispose()
    }
})
</script>

<style>
.video-wrapper {
    width: 100%;
    max-width: 400px;
}
</style>