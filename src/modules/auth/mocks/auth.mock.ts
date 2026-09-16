import type { AuthUser } from '@/types'
import { initialsAvatar } from '@/modules/users/mocks/users.mock'

/**
 * Cuentas de demostración. La contraseña es compartida y está aquí a propósito:
 * no protege nada, sólo permite entrar a la demo sin backend.
 */
export const DEMO_PASSWORD = 'insight123'

export const DEMO_ACCOUNTS: ReadonlyArray<{ password: string; user: AuthUser }> = [
  {
    password: DEMO_PASSWORD,
    user: {
      id: 'u01',
      name: 'Valeria Ortiz',
      email: 'admin@insight.io',
      role: 'administrador',
      avatarUrl: initialsAvatar('Valeria Ortiz'),
    },
  },
  {
    password: DEMO_PASSWORD,
    user: {
      id: 'u02',
      name: 'Mateo Rojas',
      email: 'analista@insight.io',
      role: 'analista',
      avatarUrl: initialsAvatar('Mateo Rojas'),
    },
  },
  {
    password: DEMO_PASSWORD,
    user: {
      id: 'u08',
      name: 'Tomás Herrera',
      email: 'lector@insight.io',
      role: 'lector',
      avatarUrl: initialsAvatar('Tomás Herrera'),
    },
  },
]

/** Perfil devuelto al "iniciar sesión" con un proveedor OAuth simulado. */
export const OAUTH_DEMO_USERS: Record<'google' | 'github', AuthUser> = {
  google: {
    id: 'oauth-google',
    name: 'Camila Duarte',
    email: 'camila.duarte@gmail.com',
    role: 'analista',
    avatarUrl: initialsAvatar('Camila Duarte'),
  },
  github: {
    id: 'oauth-github',
    name: 'Renata Salas',
    email: 'renata.salas@users.noreply.github.com',
    role: 'administrador',
    avatarUrl: initialsAvatar('Renata Salas'),
  },
}
