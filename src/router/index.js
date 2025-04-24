import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { setPageTitle } from '@/utils/page-title-util.js';
import { REDIRECT_PATH } from '@/config/setting';

const routes = [
    {
        path: '/',
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('../views/home/index.vue'),
                meta: {
                    title: "首页",
                }
            },
            {
                path: '/user',
                name: 'User',
                component: () => import('../views/user/index.vue'),
                meta: {
                    title: "个人中心",
                }
            }
        ]
    }
]

const router = createRouter({
<<<<<<< HEAD
=======
    // history: createWebHistory(), // 切换到 Hash 模式
>>>>>>> de232ea (vite项目改成electron桌面端应用)
    history: createWebHashHistory(),
    routes
})

router.beforeEach(async (to) => {
    if (!to.path.includes(REDIRECT_PATH)) {
      setPageTitle(to.meta.title);
    }
  });

export default router