<template>
  <div class="high-concurrency-demo">
    <NavBar :showLeft="true" :showRight="true">
      <template #left>
        <van-icon name="arrow-left" size="20" color="#181818" @click="handleReturn" />
      </template>
    </NavBar>

    <div class="container">

      <!-- 防抖演示 -->
      <div class="card">
        <h3>1. 防抖 (Debounce) 演示</h3>
        <p>输入内容后停止输入 500ms 才会触发搜索</p>
        <div class="form-group">
          <label>搜索框 (防抖):</label>
          <input v-model="searchInput" placeholder="输入搜索内容..." />
          <p>实际搜索值: {{ debouncedSearch }}</p>
          <p>触发次数: {{ debounceCount }}</p>
        </div>
      </div>

      <!-- 节流演示 -->
      <div class="card">
        <h3>2. 节流 (Throttle) 演示</h3>
        <p>按钮点击每 1000ms 最多执行一次</p>
        <div class="form-group">
          <button @click="handleThrottledClick" :disabled="isThrottled">
            点击我 (节流)
          </button>
          <p>点击次数: {{ throttleCount }}</p>
          <p v-if="isThrottled">节流中...请稍后再试</p>
        </div>
      </div>

      <!-- 请求合并演示 -->
      <div class="card">
        <h3>3. 请求合并 (Request Batching) 演示</h3>
        <p>点击按钮发起多个请求，系统会自动合并处理</p>
        <div class="form-group">
          <button @click="sendBatchRequests">发起 5 个请求</button>
          <button @click="clearBatchRequests">清空请求队列</button>
          <div class="request-status">
            <p>待处理请求: {{ batchPendingCount }}</p>
            <p>已完成请求: {{ batchCompletedCount }}</p>
          </div>
        </div>
      </div>

      <!-- 并发控制演示 -->
      <div class="card">
        <h3>4. 并发控制 (Concurrency Control) 演示</h3>
        <p>限制同时执行的任务数量</p>
        <div class="form-group">
          <div class="concurrency-controls">
            <button @click="startConcurrentTasks">启动 10 个并发任务</button>
            <div class="slider-container">
              <label>最大并发数: {{ maxConcurrency }}</label>
              <input type="range" min="1" max="10" v-model.number="maxConcurrency" @change="updateConcurrency" />
            </div>
          </div>
          <div class="task-status">
            <p>运行中任务: {{ concurrencyStatus.running }}</p>
            <p>队列中任务: {{ concurrencyStatus.queued }}</p>
            <p>已完成任务: {{ completedTasks.length }}</p>
          </div>
          <div class="task-list" v-if="completedTasks.length > 0">
            <h4>已完成任务:</h4>
            <ul>
              <li v-for="(task, index) in completedTasks" :key="index">
                任务 {{ task.id }}: {{ task.status }} (耗时: {{ task.duration }}ms)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 性能监控 -->
      <div class="card">
        <h3>5. 性能监控</h3>
        <div class="performance-metrics">
          <div class="metric">
            <h3>防抖效果</h3>
            <p>减少请求数: {{ debounceCount }} → 1</p>
          </div>
          <div class="metric">
            <h3>节流效果</h3>
            <p>限制点击频率: {{ throttleCount }} 次/秒</p>
          </div>
          <div class="metric">
            <h3>并发控制</h3>
            <p>最大并发数: {{ maxConcurrency }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from "vue-router"
import NavBar from '@/components/NavBar.vue'
import { useDebounce } from '@/composables/useDebounce'
import { useThrottle } from '@/composables/useThrottle'
import requestBatcher from '@/utils/request-batcher'
import concurrencyController from '@/utils/concurrency-controller'

const router = useRouter()

// 防抖相关
const searchInput = ref('')
const { debouncedValue: debouncedSearch, updateInputValue: updateSearch } = useDebounce(searchInput.value, 500)
const debounceCount = ref(0)

// 节流相关
const { throttledValue: isThrottled, updateInputValue: updateThrottle } = useThrottle(false, 1000)
const throttleCount = ref(0)

// 请求合并相关
const batchPendingCount = ref(0)
const batchCompletedCount = ref(0)
let batchInterval = null

// 并发控制相关
const maxConcurrency = ref(3)
const concurrencyStatus = ref({ running: 0, queued: 0, maxConcurrency: 3 })
const completedTasks = ref([])
let statusInterval = null

// 监听搜索输入
const handleSearchInput = (value) => {
  updateSearch(value)
  debounceCount.value++
}

// 节流点击处理
const handleThrottledClick = () => {
  if (!isThrottled.value) {
    throttleCount.value++
    updateThrottle(true)

    // 1秒后解除节流
    setTimeout(() => {
      updateThrottle(false)
    }, 1000)
  }
}

// 发送批处理请求
const sendBatchRequests = async () => {
  const requests = []

  // 创建5个模拟请求
  for (let i = 0; i < 5; i++) {
    requests.push(
      requestBatcher.add(`/api/data/${i}`, { method: 'GET' })
        .then(() => {
          batchCompletedCount.value++
        })
        .catch(() => {
          batchCompletedCount.value++
        })
    )
  }

  batchPendingCount.value = requestBatcher.pendingRequests.length

  try {
    await Promise.all(requests)
  } catch (error) {
    console.error('Batch request failed:', error)
  }
}

// 清空批处理请求
const clearBatchRequests = () => {
  requestBatcher.clear()
  batchPendingCount.value = 0
}

// 启动并发任务
const startConcurrentTasks = async () => {
  completedTasks.value = []

  // 创建10个任务
  const tasks = []
  for (let i = 1; i <= 10; i++) {
    const taskId = i
    tasks.push(
      concurrencyController.run(() => simulateTask(taskId))
    )
  }

  try {
    await Promise.all(tasks)
  } catch (error) {
    console.error('Concurrent tasks failed:', error)
  }
}

// 模拟任务执行
const simulateTask = (taskId) => {
  return new Promise((resolve) => {
    const startTime = Date.now()

    // 模拟随机耗时任务 (100-1000ms)
    const duration = Math.floor(Math.random() * 900) + 100
    setTimeout(() => {
      const endTime = Date.now()
      completedTasks.value.push({
        id: taskId,
        status: '完成',
        duration: endTime - startTime
      })
      resolve()
    }, duration)
  })
}

// 更新并发控制设置
const updateConcurrency = () => {
  concurrencyController.setMaxConcurrency(maxConcurrency.value)
}

// 更新状态显示
const updateStatus = () => {
  batchPendingCount.value = requestBatcher.pendingRequests.length
  concurrencyStatus.value = concurrencyController.getStatus()
}

// 返回上一页
const handleReturn = () => {
  if (window.history.length <= 1) {
    router.push({ name: "Home" })
  } else {
    router.back()
  }
}

// 监听输入变化
watch(searchInput, handleSearchInput)

// 组件挂载时启动状态更新定时器
onMounted(() => {
  batchInterval = setInterval(() => {
    batchPendingCount.value = requestBatcher.pendingRequests.length
  }, 100)

  statusInterval = setInterval(updateStatus, 100)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (batchInterval) clearInterval(batchInterval)
  if (statusInterval) clearInterval(statusInterval)
  requestBatcher.clear()
})
</script>

<style scoped>
.high-concurrency-demo {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 20px 0;
  font-family: 'Arial', sans-serif;
  position: relative;
  z-index: 10;
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

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: bold;
}

.card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.card h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.card p {
  color: #666;
  margin: 10px 0;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input[type="text"]:focus {
  border-color: #667eea;
  outline: none;
}

input[type="range"] {
  width: 100%;
  margin: 10px 0;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-right: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.request-status,
.task-status {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  border: 1px solid #eee;
}

.task-list {
  margin-top: 20px;
}

.task-list h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.task-list ul {
  padding-left: 20px;
  margin: 0;
}

.task-list li {
  margin-bottom: 8px;
  color: #555;
  line-height: 1.4;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.metric {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.metric h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.concurrency-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.slider-container {
  flex: 1;
  min-width: 200px;
}

.slider-container label {
  color: #333;
  font-weight: normal;
  display: block;
  margin-bottom: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .card {
    padding: 20px;
  }

  .card h2 {
    font-size: 1.3rem;
  }

  .concurrency-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .slider-container {
    min-width: auto;
  }

  button {
    width: 100%;
    margin-right: 0;
  }

  .performance-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
