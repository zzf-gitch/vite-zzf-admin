import { ref, watch } from 'vue'

/**
 * 用于同步localStorage和Vue响应式数据的hook
 * @param {string} key - localStorage的键名
 * @param {*} defaultValue - 默认值
 * @returns {Object} 包含响应式数据和更新函数的对象
 */
export function useLocalStorage(key, defaultValue = null) {
  // 从localStorage获取初始值
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  const storedValue = ref(getStoredValue())

  // 当响应式数据变化时，同步到localStorage
  watch(storedValue, (newValue) => {
    try {
      if (newValue === null || newValue === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(newValue))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, { deep: true })

  // 提供一个方法来手动更新值
  const setValue = (value) => {
    storedValue.value = value
  }

  // 提供一个方法来移除存储项
  const removeItem = () => {
    storedValue.value = null
  }

  return {
    storedValue,
    setValue,
    removeItem
  }
}
