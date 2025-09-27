<template>
    <div class="user">
        <NavBar :showLeft="true" :showRight="true">
            <template #left>
                <van-icon name="arrow-left" size="20" color="#181818" @click="handleReturn" />
            </template>
        </NavBar>

        <van-uploader v-model="leftFileList" :max-count="1" :before-read="beforeRead"
            :after-read="(file) => afterRead(file, 'left')" accept="image/*" :preview-size="80" upload-text="上传胜方头像" />

        <van-uploader v-model="rightFileList" :max-count="1" :before-read="beforeRead"
            :after-read="(file) => afterRead(file, 'right')" accept="image/*" :preview-size="80" upload-text="上传败方头像" />

        <van-uploader v-model="mvpFileList" :max-count="1" :before-read="beforeRead"
            :after-read="(file) => afterRead(file, 'MVP')" accept="image/*" :preview-size="80" upload-text="上传MVP图片" />

        <van-button type="primary" @click="uploadAllFiles">批量上传所有图片</van-button>
    </div>
</template>

<script setup>
import NavBar from '../../components/NavBar.vue'
import { Icon as VanIcon, Uploader as VanUploader, showToast } from 'vant'
import { useRoute, useRouter } from "vue-router";
import { ref } from 'vue';
import { upload_avatar } from "@/api/upload";

const router = useRouter();
const leftFileList = ref([]);
const rightFileList = ref([]);
const mvpFileList = ref([]);

// 返回
const handleReturn = () => {
    if (window.history.length <= 1) {
        // 没有上一页可回退则跳转首页
        router.push({ name: "Home" });
    } else {
        router.back();
    }
};

// 上传前校验
const beforeRead = (file) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        showToast('请上传 jpg 或 png 格式图片');
        return false;
    }
    return true;
};

// 上传后处理(单文件上传)
const afterRead = async (file, type) => {
    try {
        const res = await upload_avatar({ file: file.file, type: type });
        showToast(res)
    } catch (error) {
        showToast('上传失败');
    }
};

// 上传后处理(多文件上传)
const uploadAllFiles = async () => {
    try {
        const uploadPromises = [];
        
        // 收集所有有待上传的文件
        if (leftFileList.value.length > 0 && leftFileList.value[0].file) {
            uploadPromises.push(
                upload_avatar({
                    file: leftFileList.value[0].file, 
                    type: 'left'
                })
            );
        }
        
        if (rightFileList.value.length > 0 && rightFileList.value[0].file) {
            uploadPromises.push(
                upload_avatar({
                    file: rightFileList.value[0].file, 
                    type: 'right'
                })
            );
        }
        
        if (mvpFileList.value.length > 0 && mvpFileList.value[0].file) {
            uploadPromises.push(
                upload_avatar({
                    file: mvpFileList.value[0].file, 
                    type: 'MVP'
                })
            );
        }
        
        if (uploadPromises.length === 0) {
            showToast('没有文件需要上传');
            return;
        }
        
        // 并行执行所有上传
        const results = await Promise.all(uploadPromises);
        showToast(`成功上传 ${results.length} 个文件`);
    } catch (error) {
        console.error('批量上传失败:', error);
        showToast('批量上传失败: ' + error.message);
    }
};
</script>

<style scoped>
.user {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    z-index: 9;
    background: linear-gradient(180deg, #fff5f5 0%, #fff0f5 100%);
}
</style>
