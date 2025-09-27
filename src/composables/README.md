# Vue Composables 使用说明

## 目录

- [Vue Composables 使用说明](#vue-composables-使用说明)
  - [目录](#目录)
  - [useDebounce (防抖)](#usedebounce-防抖)
    - [使用方法](#使用方法)
    - [参数说明](#参数说明)
    - [返回值](#返回值)
    - [应用场景](#应用场景)
  - [useThrottle (节流)](#usethrottle-节流)
    - [使用方法](#使用方法-1)
    - [参数说明](#参数说明-1)
    - [返回值](#返回值-1)
    - [应用场景](#应用场景-1)
  - [请求批处理 (Request Batching)](#请求批处理-request-batching)
    - [使用方法](#使用方法-2)
    - [参数说明](#参数说明-2)
    - [方法](#方法)
    - [应用场景](#应用场景-2)
  - [并发控制 (Concurrency Control)](#并发控制-concurrency-control)
    - [使用方法](#使用方法-3)
    - [参数说明](#参数说明-3)
    - [方法](#方法-1)
    - [应用场景](#应用场景-3)
  - [完整示例](#完整示例)

---

## useDebounce (防抖)

防抖是一种限制函数执行频率的技术。当函数被频繁调用时，防抖会确保函数只在最后一次调用后的一段时间内执行一次。

### 使用方法

```javascript
import { useDebounce } from '@/composables/useDebounce'

// 创建防抖值
const { inputValue, debouncedValue, updateInputValue } = useDebounce('', 500)

// 在模板中使用
// <input v-model="inputValue" @input="updateInputValue($event.target.value)" />
// <p>防抖后的值: {{ debouncedValue }}</p>
```

### 参数说明

- `initialValue`: 初始值
- `delay`: 防抖延迟时间（毫秒），默认 300ms

### 返回值

- `inputValue`: 响应式的输入值
- `debouncedValue`: 响应式的防抖值
- `updateInputValue(value)`: 更新输入值的函数
- `immediateUpdate(value)`: 立即更新防抖值（跳过防抖）

### 应用场景

- 搜索框输入
- 表单验证
- 窗口大小调整
- 滚动事件处理

---

## useThrottle (节流)

节流是一种限制函数执行速率的技术。它确保函数在指定的时间间隔内最多执行一次。

### 使用方法

```javascript
import { useThrottle } from '@/composables/useThrottle'

// 创建节流值
const { inputValue, throttledValue, updateInputValue } = useThrottle('', 1000)

// 在模板中使用
// <button @click="updateInputValue(Date.now())">点击我</button>
// <p>节流后的值: {{ throttledValue }}</p>
```

### 参数说明

- `initialValue`: 初始值
- `delay`: 节流间隔时间（毫秒），默认 300ms

### 返回值

- `inputValue`: 响应式的输入值
- `throttledValue`: 响应式的节流值
- `updateInputValue(value)`: 更新输入值的函数
- `immediateUpdate(value)`: 立即更新节流值（跳过节流）

### 应用场景

- 按钮点击限制
- 滚动事件处理
- 鼠标移动事件
- API 请求频率控制

---

## 请求批处理 (Request Batching)

请求批处理是一种将多个小请求合并为一个大请求的技术，以减少网络开销和提高性能。

### 使用方法

```javascript
import requestBatcher from '@/utils/request-batcher'

// 添加请求到批处理队列
const result = await requestBatcher.add('/api/data/1', { method: 'GET' })

// 创建批处理实例
const customBatcher = new RequestBatcher(200, 5) // 200ms间隔，最大5个请求
```

### 参数说明

- `batchInterval`: 批处理间隔时间（毫秒），默认 100ms
- `maxBatchSize`: 最大批处理大小，默认 10个请求

### 方法

- `add(url, options)`: 添加请求到批处理队列
- `clear()`: 清除所有待处理的请求

### 应用场景

- 批量数据获取
- 减少 HTTP 请求次数
- 提高网络性能
- 优化用户体验

---

## 并发控制 (Concurrency Control)

并发控制是一种限制同时执行任务数量的技术，防止系统过载。

### 使用方法

```javascript
import concurrencyController from '@/utils/concurrency-controller'

// 执行受控任务
const result = await concurrencyController.run(async () => {
  // 你的异步任务
  return await fetchData()
})

// 创建并发控制器实例
const customController = new ConcurrencyController(5) // 最大并发数为5
```

### 参数说明

- `maxConcurrency`: 最大并发数，默认 3

### 方法

- `run(task)`: 执行受控任务
- `getStatus()`: 获取当前状态
- `clearQueue()`: 清空队列
- `setMaxConcurrency(newMaxConcurrency)`: 动态调整最大并发数

### 应用场景

- 限制 API 请求并发数
- 控制文件上传数量
- 管理资源密集型任务
- 防止浏览器卡顿

---

## 完整示例

查看 `src/views/HighConcurrencyDemo.vue` 文件获取完整的使用示例。
