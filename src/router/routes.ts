import type { RouteRecordRaw } from 'vue-router'

/**
 * Meta de ruta usada por el layout y los guards:
 * - `public`: accesible sin sesión.
 * - `nav`: aparece en el menú lateral con este icono y orden.
 */
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    public?: boolean
    icon?: string
    nav?: boolean
    order?: number
    breadcrumb?: string[]
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Iniciar sesión', public: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'dashboard' },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard', icon: 'dashboard', nav: true, order: 1 },
      },
      {
        path: 'weather',
        name: 'weather',
        component: () => import('@/views/WeatherView.vue'),
        meta: { title: 'Clima', icon: 'cloud', nav: true, order: 2 },
      },
      {
        path: 'finance',
        name: 'finance',
        component: () => import('@/views/FinanceView.vue'),
        meta: { title: 'Finanzas', icon: 'stock', nav: true, order: 3 },
      },
      {
        path: 'news',
        name: 'news',
        component: () => import('@/views/NewsView.vue'),
        meta: { title: 'Noticias', icon: 'read', nav: true, order: 4 },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/UsersView.vue'),
        meta: { title: 'Usuarios', icon: 'team', nav: true, order: 5 },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { title: 'Configuración', icon: 'setting', nav: true, order: 6 },
      },
    ],
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada', public: true },
  },
  // Cualquier ruta desconocida termina en la misma página 404.
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'not-found' },
  },
]
