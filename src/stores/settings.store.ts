import { reactive, ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import type {
  DataSourceMode,
  DataSourceSettings,
  NotificationPreferences,
  ProfileSettings,
} from '@/types'
import { env, STORAGE_KEYS } from '@/config'
import { readStorage, setMockErrorRate, writeStorage } from '@/utils'
import { getActiveMode, setDataSourceMode, WeatherService } from '@/services'

interface PersistedSettings {
  profile: ProfileSettings
  notifications: NotificationPreferences
  dataSource: DataSourceSettings
}

function defaultSettings(): PersistedSettings {
  return {
    profile: {
      displayName: 'Valeria Ortiz',
      email: 'admin@insight.io',
      jobTitle: 'Analista de datos',
      language: 'es',
    },
    notifications: {
      email: true,
      push: false,
      weatherAlerts: true,
      financeAlerts: true,
      digestFrequency: 'daily',
    },
    dataSource: {
      mode: getActiveMode(),
      baseUrl: env.apiBaseUrl,
      refreshIntervalSeconds: 120,
      simulateErrors: env.mockErrorRate > 0,
    },
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const stored = readStorage<PersistedSettings>(STORAGE_KEYS.settings)
  const state = reactive<PersistedSettings>({ ...defaultSettings(), ...(stored ?? {}) })
  const saving = ref(false)

  // Restaura la preferencia persistida al arrancar, no sólo al guardarla.
  setMockErrorRate(state.dataSource.simulateErrors ? 0.5 : 0)

  function persist(): void {
    writeStorage(STORAGE_KEYS.settings, toRaw(state))
  }

  async function saveProfile(profile: ProfileSettings): Promise<void> {
    saving.value = true
    state.profile = { ...profile }
    persist()
    saving.value = false
  }

  async function saveNotifications(preferences: NotificationPreferences): Promise<void> {
    saving.value = true
    state.notifications = { ...preferences }
    persist()
    saving.value = false
  }

  /**
   * Cambia el backend activo. La fábrica reconstruye los repositorios y los
   * servicios con caché deben invalidarla para no mezclar datos de dos modos.
   */
  async function saveDataSource(settings: DataSourceSettings): Promise<void> {
    saving.value = true
    state.dataSource = { ...settings }
    // La demo usa una tasa alta pero no total: así fallan algunas peticiones y
    // se puede ver el contraste entre bloques cargados y bloques en error.
    setMockErrorRate(settings.simulateErrors ? 0.5 : 0)
    applyMode(settings.mode)
    persist()
    saving.value = false
  }

  function applyMode(mode: DataSourceMode): void {
    setDataSourceMode(mode)
    WeatherService.invalidate()
  }

  return { state, saving, saveProfile, saveNotifications, saveDataSource }
})
