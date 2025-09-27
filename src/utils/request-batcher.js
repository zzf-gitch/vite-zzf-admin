// 请求批处理工具
class RequestBatcher {
  constructor(batchInterval = 100, maxBatchSize = 10) {
    this.batchInterval = batchInterval // 批处理间隔（毫秒）
    this.maxBatchSize = maxBatchSize // 最大批处理大小
    this.pendingRequests = [] // 待处理的请求队列
    this.batchTimer = null // 批处理定时器
  }

  /**
   * 添加请求到批处理队列
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求Promise
   */
  add(url, options = {}) {
    return new Promise((resolve, reject) => {
      // 将请求添加到队列
      this.pendingRequests.push({
        url,
        options,
        resolve,
        reject
      })

      // 如果队列达到最大大小，立即处理
      if (this.pendingRequests.length >= this.maxBatchSize) {
        this.processBatch()
      } else if (!this.batchTimer) {
        // 启动批处理定时器
        this.batchTimer = setTimeout(() => {
          this.processBatch()
        }, this.batchInterval)
      }
    })
  }

  /**
   * 处理批处理队列中的请求
   */
  async processBatch() {
    // 清除定时器
    if (this.batchTimer) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }

    // 如果没有待处理的请求，直接返回
    if (this.pendingRequests.length === 0) {
      return
    }

    // 获取当前批次的请求
    const batch = this.pendingRequests.splice(0, this.maxBatchSize)
    
    try {
      // 合并请求参数
      const urls = batch.map(req => req.url)
      const batchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: batch.map(req => ({
            url: req.url,
            ...req.options
          }))
        })
      }

      // 发送批处理请求
      // 注意：这需要后端支持批处理接口
      // 在实际应用中，您可能需要根据具体需求调整实现
      const response = await fetch('/api/batch', batchOptions)
      const results = await response.json()

      // 处理响应结果
      batch.forEach((req, index) => {
        if (results[index] && results[index].success) {
          req.resolve(results[index].data)
        } else {
          req.reject(results[index] ? results[index].error : new Error('Unknown error'))
        }
      })
    } catch (error) {
      // 如果批处理失败，拒绝所有请求
      batch.forEach(req => {
        req.reject(error)
      })
    }

    // 如果还有待处理的请求，继续处理下一个批次
    if (this.pendingRequests.length > 0) {
      this.batchTimer = setTimeout(() => {
        this.processBatch()
      }, this.batchInterval)
    }
  }

  /**
   * 清除所有待处理的请求
   */
  clear() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }
    
    // 拒绝所有待处理的请求
    this.pendingRequests.forEach(req => {
      req.reject(new Error('Request cancelled'))
    })
    
    this.pendingRequests = []
  }
}

// 创建默认的请求批处理实例
const defaultBatcher = new RequestBatcher()

// 导出类和默认实例
export { RequestBatcher }
export default defaultBatcher
