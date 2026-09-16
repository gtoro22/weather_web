import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores'
import { appConfig } from '@/config'

/**
 * Guard de autenticación. Espera a que la sesión persistida se restaure antes
 * de decidir: sin esa espera, un refresco de página expulsaría al login aunque
 * la sesión siguiera siendo válida.
 */
export function registerGuards(router: Router): void {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    await auth.restore()

    if (to.meta.public) {
      // Un usuario ya autenticado no necesita volver a ver el login.
      if (to.name === 'login' && auth.isAuthenticated) {
        return { name: 'dashboard' }
      }
      return true
    }

    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    return true
  })

  router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} · ${appConfig.title}` : appConfig.title
  })
}
