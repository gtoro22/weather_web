import type { DataSourceMode } from '@/types'
import { appConfig, STORAGE_KEYS } from '@/config'
import { readStorage, writeStorage } from '@/utils'
import type {
  AuthRepository,
  FinanceRepository,
  NewsRepository,
  UserRepository,
  WeatherRepository,
} from './repositories'
import {
  MockAuthAdapter,
  MockFinanceAdapter,
  MockNewsAdapter,
  MockUserAdapter,
  MockWeatherAdapter,
} from './adapters/mock'

export interface RepositoryBundle {
  weather: WeatherRepository
  finance: FinanceRepository
  news: NewsRepository
  users: UserRepository
  auth: AuthRepository
}

function createMockBundle(): RepositoryBundle {
  return {
    weather: new MockWeatherAdapter(),
    finance: new MockFinanceAdapter(),
    news: new MockNewsAdapter(),
    users: new MockUserAdapter(),
    auth: new MockAuthAdapter(),
  }
}

/**
 * Fábrica de repositorios: único lugar del proyecto donde se decide qué
 * implementación concreta se usa.
 *
 * Para activar un backend real basta con devolver aquí el bundle
 * correspondiente. Ejemplo para REST (los adaptadores de referencia ya existen
 * en `adapters/rest`):
 *
 * ```ts
 * case 'rest':
 *   return {
 *     weather: new RestWeatherAdapter(),
 *     finance: new RestFinanceAdapter(),
 *     news: new RestNewsAdapter(),
 *     users: new RestUserAdapter(),
 *     auth: new RestAuthAdapter(),
 *   }
 * ```
 *
 * `graphql`, `firebase` y `aws-api-gateway` siguen exactamente el mismo
 * patrón: implementan las interfaces de `services/repositories` y se registran
 * en este `switch`. Mientras no existan, cualquier modo cae en los mocks para
 * que la demo nunca se quede sin datos.
 */
export function createRepositories(mode: DataSourceMode): RepositoryBundle {
  switch (mode) {
    case 'mock':
      return createMockBundle()
    case 'rest':
    case 'graphql':
    case 'firebase':
    case 'aws-api-gateway':
    default:
      return createMockBundle()
  }
}

/** Modo activo: preferencia del usuario si existe, si no la del `.env`. */
export function resolveInitialMode(): DataSourceMode {
  return readStorage<DataSourceMode>(STORAGE_KEYS.dataSourceMode) ?? appConfig.defaultDataSourceMode
}

let activeMode: DataSourceMode = resolveInitialMode()
let repositories: RepositoryBundle = createRepositories(activeMode)

export function getRepositories(): RepositoryBundle {
  return repositories
}

export function getActiveMode(): DataSourceMode {
  return activeMode
}

/** Cambia el backend en caliente; lo usa la pantalla de configuración. */
export function setDataSourceMode(mode: DataSourceMode): RepositoryBundle {
  activeMode = mode
  repositories = createRepositories(mode)
  writeStorage(STORAGE_KEYS.dataSourceMode, mode)
  return repositories
}
