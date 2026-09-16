import type { Credentials, OAuthProvider, Session } from '@/types'

/**
 * Contrato de autenticación. Las implementaciones reales documentadas en
 * `services/adapters/rest/auth.rest.ts` cubren JWT propio, OAuth 2.0 con
 * Google/GitHub y Firebase Authentication.
 */
export interface AuthRepository {
  loginWithCredentials(credentials: Credentials): Promise<Session>
  loginWithProvider(provider: OAuthProvider): Promise<Session>
  logout(): Promise<void>
  /** Revalida la sesión persistida al recargar la página. */
  restoreSession(): Promise<Session | null>
}
