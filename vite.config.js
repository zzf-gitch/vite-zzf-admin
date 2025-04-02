import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig((command) => {
  const alias = {
    '@/': resolve('src') + '/',
  };
  return {
    base:'/vite-zzf-admin/',
    plugins: [vue()],
    resolve: { alias },
    server: {
      port: 1314, //指定开发服务器端口
      strictPort: false, //设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
      cors: true, //为开发服务器配置 CORS。默认启用并允许任何源，传递一个 选项对象 来调整行为或设为 false 表示禁用
    },
    optimizeDeps: {
      include: [
        'vue-easy-lightbox',
        'video.js/core',
        'video.js/tech/html5',
        'video.js/dist/video-js.css',
      ]
    },
  }
})
