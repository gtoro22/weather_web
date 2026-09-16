import type { UserRole } from './user'

export type OAuthProvider = 'google' | 'github'

export interface Credentials {
  email: string
  password: string
}

/** Usuario autenticado tal como lo consume la aplicación. */
export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
}

/**
 * Sesión persistida. `accessToken` es un JWT en una integración real;
 * en el modo mock es una cadena opaca sin valor criptográfico.
 */
export interface Session {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  user: AuthUser
}
