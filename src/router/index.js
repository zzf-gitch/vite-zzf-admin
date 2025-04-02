import { createRouter, createWebHistory } from 'vue-router'
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
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to) => {
    if (!to.path.includes(REDIRECT_PATH)) {
      setPageTitle(to.meta.title);
    }
  });

export default router