import { ref, watch } from 'vue'

/**
 * 用于创建防抖值的hook
 * @param {*} initialValue - 初始值
 * @param {number} delay - 防抖延迟时间（毫秒）
 * @returns {Object} 包含输入值、防抖值和更新函数的对象
 */
export function useDebounce(initialValue, delay = 300) {
  const inputValue = ref(initialValue)
  const debouncedValue = ref(initialValue)

  let timeoutId = null

  // 监听输入值变化，应用防抖
  watch(inputValue, (newValue) => {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 设置新的定时器
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  // 更新输入值的函数
  const updateInputValue = (value) => {
    inputValue.value = value
  }

  // 立即更新防抖值（跳过防抖）
  const immediateUpdate = (value) => {
    // 清除现有的定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // 立即设置值
    inputValue.value = value
    debouncedValue.value = value
  }

  return {
    inputValue,
    debouncedValue,
    updateInputValue,
    immediateUpdate
  }
}
