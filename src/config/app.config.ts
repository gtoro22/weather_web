import { env } from './env'
import type { DataSourceMode } from '@/types'

/** Clave de localStorage bajo la que se guarda cada preferencia. */
export const STORAGE_KEYS = {
  session: 'insight-dashboard:session',
  theme: 'insight-dashboard:theme',
  settings: 'insight-dashboard:settings',
  dataSourceMode: 'insight-dashboard:data-source-mode',
} as const

/**
 * Descripción legible de cada modo de integración. Se muestra en /settings y
 * documenta, en un solo lugar, qué haría falta para activar cada backend.
 */
export const DATA_SOURCE_MODES: ReadonlyArray<{
  value: DataSourceMode
  label: string
  description: string
  ready: boolean
}> = [
  {
    value: 'mock',
    label: 'Mock API',
    description: 'Datos simulados en memoria. Funciona sin backend y es el modo por defecto.',
    ready: true,
  },
  {
    value: 'rest',
    label: 'REST API',
    description:
      'Consume VITE_API_BASE_URL mediante el cliente Axios central. Implementa los repositorios REST para activarlo.',
    ready: false,
  },
  {
    value: 'graphql',
    label: 'GraphQL',
    description:
      'Consume VITE_GRAPHQL_ENDPOINT con queries tipadas. Punto de integración preparado en services/repositories.',
    ready: false,
  },
  {
    value: 'firebase',
    label: 'Firebase / Firestore',
    description:
      'Lee colecciones de Firestore y delega la autenticación en Firebase Authentication.',
    ready: false,
  },
  {
    value: 'aws-api-gateway',
    label: 'Amazon API Gateway',
    description:
      'Invoca funciones Lambda detrás de API Gateway usando VITE_AWS_API_GATEWAY_URL y firma IAM o Cognito.',
    ready: false,
  },
]

export const appConfig = {
  title: env.appTitle,
  defaultDataSourceMode: env.dataSourceMode,
  defaultCityId: 'bog',
  pagination: {
    defaultPageSize: 8,
    pageSizeOptions: ['8', '12', '20', '50'],
  },
  /** Intervalo por defecto del indicador "última actualización" del dashboard. */
  refreshIntervalSeconds: 120,
} as const
