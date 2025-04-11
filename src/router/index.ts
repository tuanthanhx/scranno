import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL as string),
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
      meta: {
        title: 'Create New Board | Scranno',
        description: 'Create a new board to organize your tasks and ideas.',
      },
    },
    {
      path: '/boards/:id',
      name: 'SingleBoard',
      component: () => import('../views/boards/SingleBoardView.vue'),
      meta: {
        title: 'Board Details | Scranno',
        description: 'View details of a specific board.',
      },
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

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  document.title = (to.meta.title as string) || 'Scranno';
  next();
});

export default router;
