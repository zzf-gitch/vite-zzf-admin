# Vue Composition API Hooks

这个目录包含了一些有用的Vue Composition API hooks，可以在组件中复用逻辑。

## useAsyncData

用于处理异步数据获取的通用hook。

### 使用方法

```javascript
import { useAsyncData } from '@/composables/useAsyncData'

// 基本用法
const { data, loading, error, execute } = useAsyncData(() => fetchData())

// 监听响应式数据源并在变化时重新获取数据
const userId = ref(1)
const { data, loading, error } = useAsyncData(
  () => fetchUser(userId.value),
  [userId] // 当userId变化时重新获取数据
)

// 获取后端接口数据的示例
import request from '@/utils/request'

// 定义API函数
const fetchUserData = async () => {
  const response = await request.get('/api/users')
  return response.data
}

// 在组件中使用
const { data, loading, error } = useAsyncData(fetchUserData)
```

### 返回值

- `data`: 获取到的数据
- `loading`: 是否正在加载
- `error`: 错误信息
- `execute`: 手动触发重新获取数据的函数

## useLocalStorage

用于同步localStorage和Vue响应式数据的hook。

### 使用方法

```javascript
import { useLocalStorage } from '@/composables/useLocalStorage'

// 基本用法
const { storedValue, setValue, removeItem } = useLocalStorage('my-key', 'default-value')

// 在模板中使用
// <input v-model="storedValue.value" />

// 更新值
setValue('new value')

// 移除存储项
removeItem()
```

### 参数

- `key`: localStorage的键名
- `defaultValue`: 默认值（可选）

### 返回值

- `storedValue`: 响应式数据
- `setValue`: 更新值的函数
- `removeItem`: 移除存储项的函数

## useDebounce

用于创建防抖值的hook。

### 使用方法

```javascript
import { useDebounce } from '@/composables/useDebounce'

// 基本用法
const { inputValue, debouncedValue, updateInputValue } = useDebounce('', 300)

// 在模板中使用
// <input v-model="inputValue.value" @input="handleInput" />
// <p>防抖值: {{ debouncedValue.value }}</p>

const handleInput = (e) => {
  updateInputValue(e.target.value)
}
```

### 参数

- `initialValue`: 初始值
- `delay`: 防抖延迟时间（毫秒），默认为300ms

### 返回值

- `inputValue`: 输入值（响应式）
- `debouncedValue`: 防抖后的值（响应式）
- `updateInputValue`: 更新输入值的函数
- `immediateUpdate`: 立即更新防抖值的函数（跳过防抖）
