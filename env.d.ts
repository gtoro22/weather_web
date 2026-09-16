/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_DATA_SOURCE_MODE: 'mock' | 'rest' | 'graphql' | 'firebase' | 'aws-api-gateway'
  readonly VITE_API_BASE_URL: string
  readonly VITE_GRAPHQL_ENDPOINT: string
  readonly VITE_AWS_API_GATEWAY_URL: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_OAUTH_GOOGLE_CLIENT_ID: string
  readonly VITE_OAUTH_GITHUB_CLIENT_ID: string
  readonly VITE_MOCK_LATENCY_MS: string
  readonly VITE_MOCK_ERROR_RATE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
