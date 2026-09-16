import type { AuthRepository } from '@/services/repositories'
import type { Credentials, OAuthProvider, Session } from '@/types'
import { httpClient } from '@/services/api'
import { env, STORAGE_KEYS } from '@/config'
import { readStorage, removeStorage, writeStorage } from '@/utils'

/**
 * Autenticación contra un backend propio que emite JWT.
 *
 * Puntos de integración documentados:
 *
 * 1. Backend propio con JWT
 *    POST /auth/login    { email, password } → { accessToken, refreshToken, expiresAt, user }
 *    POST /auth/refresh  { refreshToken }    → nueva sesión
 *    POST /auth/logout   invalida el refresh token en servidor.
 *    El access token se adjunta automáticamente por el interceptor de
 *    `services/api/http.ts`.
 *
 * 2. OAuth 2.0 con Google / GitHub (Authorization Code + PKCE)
 *    `loginWithProvider` redirige al proveedor; el backend intercambia el
 *    código por tokens usando su client secret (que NUNCA vive en el frontend)
 *    y devuelve la sesión de la aplicación. La ruta de callback llamaría a
 *    `completeOAuth` con el `code` recibido.
 *
 * 3. Firebase Authentication
 *    Sustituir esta clase por un `FirebaseAuthAdapter` que envuelva
 *    `signInWithEmailAndPassword` / `signInWithPopup` y mapee el `User` de
 *    Firebase al tipo `AuthUser` del dominio.
 */
export class RestAuthAdapter implements AuthRepository {
  async loginWithCredentials(credentials: Credentials): Promise<Session> {
    const { data } = await httpClient.post<Session>('/auth/login', credentials)
    writeStorage(STORAGE_KEYS.session, data)
    return data
  }

  async loginWithProvider(provider: OAuthProvider): Promise<Session> {
    // Flujo de redirección: el navegador abandona la SPA, por lo que esta
    // promesa nunca resuelve. La sesión se crea en la ruta de callback.
    window.location.assign(this.buildAuthorizeUrl(provider))
    return new Promise<Session>(() => {})
  }

  /** Se invoca desde la ruta de callback de OAuth con el `code` del proveedor. */
  async completeOAuth(provider: OAuthProvider, code: string): Promise<Session> {
    const { data } = await httpClient.post<Session>(`/auth/oauth/${provider}`, { code })
    writeStorage(STORAGE_KEYS.session, data)
    return data
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout')
    } finally {
      // La sesión local se limpia incluso si el servidor no responde.
      removeStorage(STORAGE_KEYS.session)
    }
  }

  async restoreSession(): Promise<Session | null> {
    const session = readStorage<Session>(STORAGE_KEYS.session)
    if (!session) return null

    if (session.expiresAt > Date.now()) return session

    if (!session.refreshToken) {
      removeStorage(STORAGE_KEYS.session)
      return null
    }

    try {
      const { data } = await httpClient.post<Session>('/auth/refresh', {
        refreshToken: session.refreshToken,
      })
      writeStorage(STORAGE_KEYS.session, data)
      return data
    } catch {
      removeStorage(STORAGE_KEYS.session)
      return null
    }
  }

  private buildAuthorizeUrl(provider: OAuthProvider): string {
    const redirectUri = `${window.location.origin}/auth/callback/${provider}`
    if (provider === 'google') {
      const params = new URLSearchParams({
        client_id: env.oauth.googleClientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
      })
      return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    }
    const params = new URLSearchParams({
      client_id: env.oauth.githubClientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
    })
    return `https://github.com/login/oauth/authorize?${params}`
  }
}
