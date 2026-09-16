import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { env, STORAGE_KEYS } from '@/config'
import { DataSourceError, type Session } from '@/types'
import { readStorage } from '@/utils'

/**
 * Cliente HTTP central. Todos los adaptadores que hablen con una API real
 * (REST, GraphQL o API Gateway) deben usar esta instancia para heredar
 * interceptores, cabeceras de autenticación y normalización de errores.
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

/** Adjunta el access token de la sesión persistida a cada petición. */
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const session = readStorage<Session>(STORAGE_KEYS.session)
  if (session?.accessToken) {
    config.headers.set('Authorization', `Bearer ${session.accessToken}`)
  }
  return config
})

/**
 * Traduce cualquier error de Axios a `DataSourceError`, de modo que la UI
 * maneje una única forma de error sin conocer el transporte.
 *
 * Punto de integración: aquí es donde iría el refresco de token (401 →
 * refresh → reintento) cuando exista un backend real.
 */
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message ??
      (status === 401
        ? 'Tu sesión ha expirado. Vuelve a iniciar sesión.'
        : error.message || 'Error de comunicación con el servidor')

    return Promise.reject(
      new DataSourceError(message, { code: error.code ?? 'HTTP_ERROR', status, cause: error }),
    )
  },
)

/**
 * Helper para un backend GraphQL. Reutiliza el mismo cliente Axios para no
 * duplicar interceptores ni configuración de autenticación.
 */
export async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const { data } = await httpClient.post<{ data: T; errors?: Array<{ message: string }> }>(
    env.graphqlEndpoint,
    { query, variables },
  )
  if (data.errors?.length) {
    throw new DataSourceError(data.errors[0].message, { code: 'GRAPHQL_ERROR' })
  }
  return data.data
}
