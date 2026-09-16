import type { AuthRepository } from '@/services/repositories'
import type { Credentials, OAuthProvider, Session } from '@/types'
import { DataSourceError } from '@/types'
import { STORAGE_KEYS } from '@/config'
import { delay, readStorage, removeStorage, writeStorage } from '@/utils'
import { DEMO_ACCOUNTS, OAUTH_DEMO_USERS } from '@/modules/auth/mocks/auth.mock'

const SESSION_TTL_MS = 8 * 60 * 60 * 1000

/**
 * Autenticación simulada. Reemplazar esta clase por un adaptador real
 * (JWT propio, OAuth 2.0 o Firebase Authentication) no exige tocar ni la
 * vista de login ni el store: ambos dependen sólo de `AuthRepository`.
 */
export class MockAuthAdapter implements AuthRepository {
  async loginWithCredentials({ email, password }: Credentials): Promise<Session> {
    await delay()
    const account = DEMO_ACCOUNTS.find(
      (item) => item.user.email.toLowerCase() === email.trim().toLowerCase(),
    )

    if (!account || account.password !== password) {
      throw new DataSourceError('Correo o contraseña incorrectos', {
        code: 'INVALID_CREDENTIALS',
        status: 401,
      })
    }

    return this.persist(this.buildSession(account.user.id, account.user))
  }

  async loginWithProvider(provider: OAuthProvider): Promise<Session> {
    await delay()
    const user = OAUTH_DEMO_USERS[provider]
    if (!user) {
      throw new DataSourceError(`Proveedor "${provider}" no soportado`, { code: 'UNSUPPORTED' })
    }
    return this.persist(this.buildSession(`${provider}-${user.id}`, user))
  }

  async logout(): Promise<void> {
    await delay(150)
    removeStorage(STORAGE_KEYS.session)
  }

  async restoreSession(): Promise<Session | null> {
    const session = readStorage<Session>(STORAGE_KEYS.session)
    if (!session) return null
    if (session.expiresAt <= Date.now()) {
      removeStorage(STORAGE_KEYS.session)
      return null
    }
    return session
  }

  private buildSession(seed: string, user: Session['user']): Session {
    return {
      // Token opaco sin valor criptográfico: en producción sería un JWT firmado.
      accessToken: `mock.${btoa(seed)}.${Date.now().toString(36)}`,
      expiresAt: Date.now() + SESSION_TTL_MS,
      user,
    }
  }

  private persist(session: Session): Session {
    writeStorage(STORAGE_KEYS.session, session)
    return session
  }
}
