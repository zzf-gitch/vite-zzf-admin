// 并发控制器
class ConcurrencyController {
  constructor(maxConcurrency = 3) {
    this.maxConcurrency = maxConcurrency // 最大并发数
    this.runningCount = 0 // 当前运行的任务数
    this.queue = [] // 等待执行的任务队列
  }

  /**
   * 执行任务，控制并发数量
   * @param {Function} task - 要执行的任务函数，应返回Promise
   * @returns {Promise} 任务执行结果的Promise
   */
  async run(task) {
    return new Promise((resolve, reject) => {
      // 将任务包装成可执行的格式
      const wrappedTask = async () => {
        try {
          this.runningCount++
          const result = await task()
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          this.runningCount--
          // 检查队列中是否有等待的任务
          this.processQueue()
        }
      }

      // 如果当前运行的任务数未达到最大并发数，直接执行任务
      if (this.runningCount < this.maxConcurrency) {
        wrappedTask()
      } else {
        // 否则将任务加入队列等待执行
        this.queue.push(wrappedTask)
      }
    })
  }

  /**
   * 处理队列中的任务
   */
  processQueue() {
    // 如果队列不为空且当前运行的任务数未达到最大并发数
    while (this.queue.length > 0 && this.runningCount < this.maxConcurrency) {
      // 从队列中取出一个任务并执行
      const task = this.queue.shift()
      task()
    }
  }

  /**
   * 获取当前状态
   * @returns {Object} 包含当前运行任务数和队列长度的对象
   */
  getStatus() {
    return {
      running: this.runningCount,
      queued: this.queue.length,
      maxConcurrency: this.maxConcurrency
    }
  }

  /**
   * 清空队列
   */
  clearQueue() {
    this.queue = []
  }

  /**
   * 动态调整最大并发数
   * @param {number} newMaxConcurrency - 新的最大并发数
   */
  setMaxConcurrency(newMaxConcurrency) {
    if (newMaxConcurrency > 0) {
      this.maxConcurrency = newMaxConcurrency
      // 调整后立即处理队列
      this.processQueue()
    }
  }
}

// 创建默认的并发控制器实例
const defaultController = new ConcurrencyController()

// 导出类和默认实例
export { ConcurrencyController }
export default defaultController
