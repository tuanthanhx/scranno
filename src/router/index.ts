import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

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
    {
      path: '/boards/:id',
      name: 'SingleBoard',
      component: () => import('../views/boards/SingleBoardView.vue'),
    },
    {
      path: '/:id',
      redirect: (to) => ({
        name: 'SingleBoard',
        params: { id: to.params.id },
      }),
    },
  ],
});

export default router;
