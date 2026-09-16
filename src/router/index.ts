import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { registerGuards } from './guards'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
})

registerGuards(router)

export default router
export * from './routes'
