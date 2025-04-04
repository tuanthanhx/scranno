import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/boards',
      name: 'ListBoard',
      component: () => import('../views/boards/ListBoardView.vue'),
    },
    {
      path: '/boards/create',
      name: 'CreateBoard',
      component: () => import('../views/boards/CreateBoardView.vue'),
    },
  ],
})

export default router
