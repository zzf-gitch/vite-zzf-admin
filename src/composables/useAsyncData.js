import { ref, watch } from 'vue'

/**
 * 用于处理异步数据获取的通用hook
 * @param {Function} fetchFunction - 执行数据获取的函数
 * @param {Array} watchSources - 监听的响应式数据源，当这些数据变化时重新获取数据
 * @returns {Object} 包含数据、加载状态和错误信息的对象
 */
export function useAsyncData(fetchFunction, watchSources = []) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await fetchFunction()
      data.value = result
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 如果提供了监听源，则在源变化时自动重新获取数据
  if (watchSources.length > 0) {
    watch(watchSources, execute, { immediate: true })
  }

  // 初始执行
  if (watchSources.length === 0) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute // 手动触发重新获取数据
  }
}
