import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ThemeMode } from '@/types'
import { STORAGE_KEYS } from '@/config'
import { readStorage, writeStorage } from '@/utils'

function detectInitialTheme(): ThemeMode {
  const stored = readStorage<ThemeMode>(STORAGE_KEYS.theme)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Estado visual de la shell: tema, sidebar y última actualización de datos. */
export const useUiStore = defineStore('ui', () => {
  const theme = ref<ThemeMode>(detectInitialTheme())
  const sidebarCollapsed = ref(false)
  const lastUpdatedAt = ref<string>(new Date().toISOString())

  const isDark = computed(() => theme.value === 'dark')

  // El atributo en <html> permite que los estilos globales y las gráficas
  // reaccionen al tema sin pasar props por todo el árbol.
  watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value
      writeStorage(STORAGE_KEYS.theme, value)
    },
    { immediate: true },
  )

  function setTheme(value: ThemeMode): void {
    theme.value = value
  }

  function toggleTheme(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebarCollapsed(value: boolean): void {
    sidebarCollapsed.value = value
  }

  function markUpdated(): void {
    lastUpdatedAt.value = new Date().toISOString()
  }

  return {
    theme,
    isDark,
    sidebarCollapsed,
    lastUpdatedAt,
    setTheme,
    toggleTheme,
    toggleSidebar,
    setSidebarCollapsed,
    markUpdated,
  }
})
