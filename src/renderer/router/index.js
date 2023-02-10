import { createRouter, createWebHashHistory } from 'vue-router';
import views from './views'

const routes = [
  { path: '/', component: () => import('../pages/check.vue'), children: [] },
  { path: '/activation', component: () => import('../pages/activation.vue'), children: [] },
  { path: '/install', component: () => import('../pages/install.vue'), children: [] },
  { path: '/login', component: () => import('../pages/login.vue'), children: [] },
  { path: '/home', component: () => import('../pages/home.vue'), children: views },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
