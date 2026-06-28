import { createRouter, createWebHistory } from 'vue-router';

import PolaroidsSite from '@/views/PolaroidsSite.vue';
import InstagramSite from '@/views/InstagramSite.vue';

const routes = [
  // Site de scroll com galeria polaroid.
  // `alias: '/'` faz a raiz servir este site sem redirect — mantém intactos
  // os QR codes e o retorno do Mercado Pago, que apontam para a raiz.
  {
    path: '/polaroids',
    alias: '/',
    name: 'polaroids',
    component: PolaroidsSite,
  },
  // Site no estilo stories do Instagram (uma tela por vez).
  {
    path: '/instagram',
    name: 'instagram',
    component: InstagramSite,
  },
  // Qualquer rota desconhecida cai no site polaroid.
  {
    path: '/:pathMatch(.*)*',
    redirect: '/polaroids',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
