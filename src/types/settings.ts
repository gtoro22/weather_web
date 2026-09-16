/** Modos de integración de datos disponibles en /settings. */
export type DataSourceMode = 'mock' | 'rest' | 'graphql' | 'firebase' | 'aws-api-gateway'

export type ThemeMode = 'light' | 'dark'

export interface NotificationPreferences {
  email: boolean
  push: boolean
  weatherAlerts: boolean
  financeAlerts: boolean
  digestFrequency: 'realtime' | 'daily' | 'weekly'
}

export interface ProfileSettings {
  displayName: string
  email: string
  jobTitle: string
  language: 'es' | 'en'
}

export interface DataSourceSettings {
  mode: DataSourceMode
  baseUrl: string
  refreshIntervalSeconds: number
  simulateErrors: boolean
}
