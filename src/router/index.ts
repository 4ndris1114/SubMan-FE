import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter: async (to, from, next) => {
      const userStore = useUserStore()
      if (!userStore.isAuthenticated) {
        next({ name: 'auth' })
      } else {
        next()
      }
    },
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    component: () => import('../views/SubscriptionView.vue'),
    beforeEnter: async (to, from, next) => {
      const userStore = useUserStore()
      if (!userStore.isAuthenticated) {
        next({ name: 'auth' })
      } else {
        next()
      }
    },
  },
  {
    path: '/login',
    name: 'auth',
    component: () => import('../views/AuthView.vue'),
    beforeEnter: async (to, from, next) => {
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        next({ name: 'home' })
      } else {
        next()
      }
    },
  },
],})

export default router;