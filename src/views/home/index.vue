<template>
    <div class="home">
        <NavBar :showLeft="true" :showRight="true">
            <template #left>
                <van-popover v-model:show="showPopover" :actions="actions" :offset="[offsetX, 10]"
                    placement="bottom-start" @select="toggTab">
                    <template #reference>
                        <img class="Login_avatar" :src="avatar" />
                    </template>
                </van-popover>
            </template>
            <template #right>
                <van-icon name="qq" size="20" color="#181818" />
            </template>
        </NavBar>

        <ImageGallery />
    </div>
</template>

<script setup>
import NavBar from '../../components/NavBar.vue'
import { Icon as VanIcon } from 'vant'
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";
const { push, currentRoute } = useRouter()

const avatar = ref(new URL(`@/assets/avatar.png`, import.meta.url).href)
console.log(currentRoute.value.fullPath);

/** 头像下拉框 */
const showPopover = ref(false);
const actions = ref([
    { text: "个人中心", icon: "user-o" },
    { text: "关闭系统", icon: "replay" },
]);

const toggTab = (action) => {
    switch (action.text) {
        case "个人中心":
            push({ path: '/user' })
            break;
        case "关闭系统":
            // window.close();
            window.location.href = "about:blank";
            break;
    }
};

// 下拉弹框偏移量
const offsetX = computed(() => {
    const bodyWidth = document.body.offsetWidth;
    const clientWidth = window.innerWidth;

    if (bodyWidth === clientWidth) {
        return 8;
    }

    return (clientWidth - bodyWidth) / 2 + 8;
});
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    position: relative;
}

.Login_avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #ccc;
}
</style>