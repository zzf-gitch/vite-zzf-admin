import { ref, watch } from 'vue'

/**
 * 用于创建节流值的hook
 * @param {*} initialValue - 初始值
 * @param {number} delay - 节流间隔时间（毫秒）
 * @returns {Object} 包含输入值、节流值和更新函数的对象
 */
export function useThrottle(initialValue, delay = 300) {
  const inputValue = ref(initialValue)
  const throttledValue = ref(initialValue)
  const lastExecTime = ref(0)

  // 更新输入值的函数
  const updateInputValue = (value) => {
    const now = Date.now()
    inputValue.value = value

    // 检查是否应该执行节流函数
    if (now - lastExecTime.value >= delay) {
      throttledValue.value = value
      lastExecTime.value = now
    }
  }

  // 立即更新节流值（跳过节流）
  const immediateUpdate = (value) => {
    inputValue.value = value
    throttledValue.value = value
    lastExecTime.value = Date.now()
  }

  return {
    inputValue,
    throttledValue,
    updateInputValue,
    immediateUpdate
  }
}
