import type { DataSourceMode } from '@/types'

const VALID_MODES: DataSourceMode[] = ['mock', 'rest', 'graphql', 'firebase', 'aws-api-gateway']

function parseMode(raw: string | undefined): DataSourceMode {
  return VALID_MODES.includes(raw as DataSourceMode) ? (raw as DataSourceMode) : 'mock'
}

function parseNumber(raw: string | undefined, fallback: number): number {
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

/**
 * Punto único de lectura de `import.meta.env`. Ningún otro archivo debería
 * tocar las variables de entorno directamente: así el resto del código se
 * puede testear inyectando valores.
 */
export const env = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'Insight Dashboard',
  dataSourceMode: parseMode(import.meta.env.VITE_DATA_SOURCE_MODE),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  graphqlEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT || '',
  awsApiGatewayUrl: import.meta.env.VITE_AWS_API_GATEWAY_URL || '',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  },
  oauth: {
    googleClientId: import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID || '',
    githubClientId: import.meta.env.VITE_OAUTH_GITHUB_CLIENT_ID || '',
  },
  mockLatencyMs: parseNumber(import.meta.env.VITE_MOCK_LATENCY_MS, 600),
  mockErrorRate: parseNumber(import.meta.env.VITE_MOCK_ERROR_RATE, 0),
} as const
