<template>
    <div class="user">
        <NavBar :showLeft="true" :showRight="true">
            <template #left>
                <van-icon name="arrow-left" size="20" color="#181818" @click="handleReturn"/>
            </template>
        </NavBar>
        <h1>个人中心</h1>
        <p>欢迎来到个人中心</p>
    </div>
</template>

<script setup>
import NavBar from '../../components/NavBar.vue'
import { Icon as VanIcon } from 'vant'
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
// 返回
const handleReturn = () => {
	if (window.history.length <= 1) {
		// 没有上一页可回退则跳转首页
		router.push({ name: "Home" });
	} else {
		router.back();
	}
};
</script>

<style scoped>
.user {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

h1 {
    font-size: 0.8rem;
    margin-bottom: 0.533rem;
}

p {
    font-size: 0.427rem;
    color: #666;
}
</style>