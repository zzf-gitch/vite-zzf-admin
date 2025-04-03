<template>
    <div class="container">
        <div class="battle-section" ref="battle">
            <div class="player-vs">
                <div class="player">
                    <img class="avatar" :src="url('left')" :alt="Images[0].alt" @click="showImg(0)" />
                </div>
                <div class="vs-text">
                    <span class="v-text">V</span>
                    <span class="s-text">S</span>
                </div>
                <div class="player">
                    <img class="avatar" :src="url('right')" :alt="Images[1].alt" @click="showImg(1)" />
                </div>
            </div>
            <div class="divider"></div>
            <div class="battle-status">
                <span class="status-text">战绩待揭晓</span>
            </div>
            <div class="divider"></div>
            <div class="result-section">
                <div class="player-result">
                    <span class="win-text">胜北</span>
                    <div class="player">
                        <img class="avatar" :src="url('left')" :alt="Images[0].alt" @click="showImg(0)" />
                    </div>
                </div>
                <div class="player-result">
                    <span class="lose-text">负北</span>
                    <div class="player">
                        <img class="avatar" :src="url('right')" :alt="Images[1].alt" @click="showImg(1)" />
                    </div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="mvp-section">
                <span class="mvp-text">MVP结算画面</span>
                <img class="mvp" :src="url('MVP')" :alt="Images[2].alt" @click="showImg(2)" />
            </div>
            <!-- <VideoPlayer :videoSrc="MVP" /> -->
        </div>
    </div>
    <vue-easy-lightbox :visible="visible" :imgs="Images" :index="index" @hide="handleHide"></vue-easy-lightbox>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue'
import { showToast } from 'vant'
import VueEasyLightbox from 'vue-easy-lightbox'
import MVP from '@/assets/MVP.mp4'
import { API_BASE_URL } from '@/config/setting';
import html2canvas from 'html2canvas';

const visible = ref(false)
const index = ref(0)

const url = (type) => {
    return `${API_BASE_URL}/images/${type}.jpg?timestamp=${Math.random()*new Date().getTime()}`
}

const Images = ref([
    {
        // src: new URL(`@/assets/left.jpg`, import.meta.url).href,
        src: url('left'),
        title: '胜方头像',
    },
    {
        // src: new URL(`@/assets/right.jpg`, import.meta.url).href,
        src: url('right'),
        title: '败方头像',
    },
    {
        // src: new URL(`@/assets/MVP.jpg`, import.meta.url).href,
        src: url('MVP'),
        title: 'MVP结算画面',
    }
])

const showImg = (i) => {
    index.value = i
    visible.value = true
}

const handleHide = () => {
    visible.value = false
}

// 使用html2canvas下载图片
const battle = ref(null)
const imageUrl = ref('');
const download = async () => {
    try {
        const canvas = await html2canvas(battle.value, {
            backgroundColor: '#fff2f5',  // 画布背景色
            scale: 2,              // 提升分辨率
            useCORS: true          // 处理跨域图片
        });

        // 转换为图片URL
        imageUrl.value = canvas.toDataURL('image/png');

        // 自动下载
        const link = document.createElement('a');
        link.download = 'VS.png';
        link.href = imageUrl.value;
        link.click();
        showToast('图片下载成功');
    } catch (error) {
        console.error('生成图片失败:', error);
        showToast('生成图片失败');
    }
}

defineExpose({ download })
</script>

<style scoped>
.container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #fff5f5 0%, #fff0f5 100%);
}

.battle-section {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
}

.player-vs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
}

.player {
    width: clamp(60px, 15vw, 100px);
    height: clamp(60px, 15vw, 100px);
    border-radius: 50%;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.vs-text {
    font-size: clamp(24px, 5vw, 48px);
    font-weight: bold;
    display: flex;
}

.v-text {
    color: #000;
}

.s-text {
    color: #ff0000;
}

.divider {
    width: 100%;
    height: 2px;
    background-color: #ff0000;
}

.status-text {
    font-size: clamp(20px, 4vw, 36px);
    color: #ff0000;
    font-weight: bold;
}

.result-section {
    display: flex;
    justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
    gap: 20px;
}

.player-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.win-text {
    font-size: clamp(18px, 3.5vw, 32px);
    font-weight: bold;
    color: #ff0000;
    transform: rotate(-25deg);
}

.lose-text {
    font-size: clamp(18px, 3.5vw, 32px);
    font-weight: bold;
    color: #000000;
    transform: rotate(45deg);
}

.mvp-text {
    font-size: clamp(24px, 4.5vw, 40px);
    color: #ff0000;
    font-weight: bold;
}

.mvp {
    width: 100%;
    max-width: 800px;
    height: auto;
    max-height: 200px;
    object-fit: contain;
}

.mvp-section {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

img {
    cursor: pointer;
}
</style>