<template>
    <div class="home-container">

        <NavBar :showLeft="true" :showRight="true">
            <template #left>
                <van-icon name="arrow-left" size="20" color="#181818" @click="handleReturn" />
            </template>
        </NavBar>

        <div class="card">
            <h2>对称加密 (Symmetric Encryption)</h2>
            <div class="form-group">
                <label>消息:</label>
                <textarea v-model="message" placeholder="输入要加密的消息"></textarea>
            </div>

            <div class="form-group">
                <label>密钥:</label>
                <input v-model="key" :placeholder="keyPlaceholder" readonly />
                <button @click="generateSymmetricKey" :disabled="!isSodiumReady">生成密钥</button>
            </div>

            <div class="actions">
                <button @click="encrypt" :disabled="!isSodiumReady || !key">加密</button>
                <button @click="decrypt" :disabled="!isSodiumReady || !encryptedData.encrypted">解密</button>
            </div>

            <div class="result" v-if="encryptedData.encrypted">
                <h3>加密结果:</h3>
                <p><strong>Nonce:</strong> {{ encryptedData.nonce }}</p>
                <p><strong>加密数据:</strong> {{ encryptedData.encrypted }}</p>
            </div>

            <div class="result" v-if="decryptedMessage">
                <h3>解密结果:</h3>
                <p><strong>原始消息:</strong> {{ decryptedMessage }}</p>
            </div>
        </div>

        <div class="card">
            <h2>非对称加密 (Asymmetric Encryption)</h2>
            <div class="form-group">
                <label>消息:</label>
                <textarea v-model="asymmetricMessage" placeholder="输入要加密的消息"></textarea>
            </div>

            <div class="form-group">
                <label>公钥:</label>
                <input v-model="keyPair.publicKey" :placeholder="keyPlaceholder" readonly />
                <button @click="generateAsymmetricKeyPair" :disabled="!isSodiumReady">生成密钥对</button>
            </div>

            <div class="form-group">
                <label>私钥:</label>
                <input v-model="keyPair.privateKey" :placeholder="keyPlaceholder" readonly />
            </div>

            <div class="actions">
                <button @click="encryptAsymmetric" :disabled="!isSodiumReady || !keyPair.publicKey">加密</button>
                <button @click="decryptAsymmetric"
                    :disabled="!isSodiumReady || !asymmetricEncryptedData.encrypted">解密</button>
            </div>

            <div class="result" v-if="asymmetricEncryptedData.encrypted">
                <h3>加密结果:</h3>
                <p><strong>Nonce:</strong> {{ asymmetricEncryptedData.nonce }}</p>
                <p><strong>临时公钥:</strong> {{ asymmetricEncryptedData.ephemeralPublicKey }}</p>
                <p><strong>加密数据:</strong> {{ asymmetricEncryptedData.encrypted }}</p>
            </div>

            <div class="result" v-if="asymmetricDecryptedMessage">
                <h3>解密结果:</h3>
                <p><strong>原始消息:</strong> {{ asymmetricDecryptedMessage }}</p>
            </div>
        </div>

        <div class="status">
            <p>状态: {{ statusMessage }}</p>
            <p v-if="error" class="error">错误: {{ error }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from "vue-router";
import NavBar from '../../components/NavBar.vue'
import {
    useEncryption,
    initSodium,
    encryptMessage,
    decryptMessage,
    generateKey,
    generateKeyPair,
    encryptWithPublicKey,
    decryptWithPrivateKey
} from '@/composables/useEncryption.js'

const router = useRouter();
// 响应式数据
const message = ref('Hello, WebAssembly 加密!')
const key = ref('')
const encryptedData = ref({ nonce: '', encrypted: '' })
const decryptedMessage = ref('')

const asymmetricMessage = ref('这是一个非对称加密测试消息')
const keyPair = ref({ publicKey: '', privateKey: '' })
const asymmetricEncryptedData = ref({ nonce: '', ephemeralPublicKey: '', encrypted: '' })
const asymmetricDecryptedMessage = ref('')

const isSodiumReady = ref(false)
const error = ref(null)

// 计算属性
const keyPlaceholder = computed(() => isSodiumReady.value ? '点击"生成密钥"按钮' : '正在初始化加密库...')

const statusMessage = computed(() => {
    if (!isSodiumReady.value) return '正在初始化 libsodium...'
    if (error.value) return '发生错误'
    return '加密库已就绪'
})

// 方法
const generateSymmetricKey = async () => {
    try {
        key.value = await generateKey()
    } catch (err) {
        error.value = err.message
    }
}

const generateAsymmetricKeyPair = async () => {
    try {
        const pair = await generateKeyPair()
        keyPair.value = pair
    } catch (err) {
        error.value = err.message
    }
}

const encrypt = async () => {
    if (!message.value || !key.value) return

    try {
        encryptedData.value = await encryptMessage(message.value, key.value)
        error.value = null
    } catch (err) {
        error.value = err.message
    }
}

const decrypt = async () => {
    if (!encryptedData.value.encrypted || !encryptedData.value.nonce || !key.value) return

    try {
        decryptedMessage.value = await decryptMessage(
            encryptedData.value.encrypted,
            encryptedData.value.nonce,
            key.value
        )
        error.value = null
    } catch (err) {
        error.value = err.message
    }
}

const encryptAsymmetric = async () => {
    if (!asymmetricMessage.value || !keyPair.value.publicKey) return

    try {
        asymmetricEncryptedData.value = await encryptWithPublicKey(
            asymmetricMessage.value,
            keyPair.value.publicKey
        )
        error.value = null
    } catch (err) {
        error.value = err.message
    }
}

const decryptAsymmetric = async () => {
    if (!asymmetricEncryptedData.value.encrypted ||
        !asymmetricEncryptedData.value.nonce ||
        !asymmetricEncryptedData.value.ephemeralPublicKey ||
        !keyPair.value.privateKey) return

    try {
        asymmetricDecryptedMessage.value = await decryptWithPrivateKey(
            asymmetricEncryptedData.value.encrypted,
            asymmetricEncryptedData.value.nonce,
            asymmetricEncryptedData.value.ephemeralPublicKey,
            keyPair.value.privateKey
        )
        error.value = null
    } catch (err) {
        error.value = err.message
    }
}

// 初始化
onMounted(async () => {
    try {
        await initSodium()
        isSodiumReady.value = true
    } catch (err) {
        error.value = err.message
    }
})

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
.home-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    position: relative;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    overflow-y: scroll;
    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
    /* PC端移动端自适应 */
    padding: calc(var(--navbar-height)) 10px 0 10px;
}

.card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
}

textarea,
input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
    background: white;
}

textarea {
    min-height: 80px;
    resize: vertical;
}

button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
    margin-top: 10px;
    font-size: 14px;
    transition: background-color 0.3s;
}

button:hover:not(:disabled) {
    background: #0056b3;
}

button:disabled {
    background: #6c757d;
    cursor: not-allowed;
}

.actions {
    margin: 20px 0;
    text-align: center;
}

.result {
    background: #e9ecef;
    padding: 15px;
    border-radius: 4px;
    margin-top: 15px;
    border: 1px solid #dee2e6;
}

.result h3 {
    margin-top: 0;
    color: #333;
}

.result p {
    word-break: break-all;
    font-size: 14px;
}

.status {
    text-align: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
    margin-top: 20px;
    border: 1px solid #dee2e6;
}

.error {
    color: #dc3545;
    font-weight: bold;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

h2 {
    color: #333;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
    margin-top: 0;
}
</style>
