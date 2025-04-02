/**
 * axios实例
 */
import axios from 'axios';
import { API_BASE_URL } from '@/config/setting';

/** 创建axios实例 */
const service = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * 添加请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(new Error('网络错误'));
  }
);

/**
 * 添加响应拦截器
 */
service.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.error(error);
    return Promise.reject(new Error('网络错误'));
  }
);

export default service;
