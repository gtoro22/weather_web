import type { Credentials, OAuthProvider, Session } from '@/types'
import { toDataSourceError } from '@/types'
import { getRepositories } from './data-source.factory'

/**
 * Fachada de autenticación. El store de Pinia sólo conoce este servicio, de
 * modo que pasar de mock a JWT/OAuth/Firebase es cuestión de registrar otro
 * adaptador en la fábrica de repositorios.
 */
class AuthServiceImpl {
  async login(credentials: Credentials): Promise<Session> {
    try {
      return await getRepositories().auth.loginWithCredentials(credentials)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async loginWithProvider(provider: OAuthProvider): Promise<Session> {
    try {
      return await getRepositories().auth.loginWithProvider(provider)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async logout(): Promise<void> {
    try {
      await getRepositories().auth.logout()
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async restore(): Promise<Session | null> {
    try {
      return await getRepositories().auth.restoreSession()
    } catch {
      // Una sesión corrupta no debe impedir arrancar la aplicación.
      return null
    }
  }
}

export const AuthService = new AuthServiceImpl()
