import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser, Credentials, OAuthProvider, Session, UserRole } from '@/types'
import { toDataSourceError } from '@/types'
import { AuthService } from '@/services'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  /** Falso hasta que `restore()` termina: los guards esperan a este flag. */
  const initialized = ref(false)

  const user = computed<AuthUser | null>(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => session.value !== null)
  const role = computed<UserRole | null>(() => session.value?.user.role ?? null)

  async function run<T>(operation: () => Promise<T>): Promise<T> {
    loading.value = true
    error.value = null
    try {
      return await operation()
    } catch (raw) {
      const failure = toDataSourceError(raw)
      error.value = failure.message
      throw failure
    } finally {
      loading.value = false
    }
  }

  async function login(credentials: Credentials): Promise<void> {
    session.value = await run(() => AuthService.login(credentials))
  }

  async function loginWithProvider(provider: OAuthProvider): Promise<void> {
    session.value = await run(() => AuthService.loginWithProvider(provider))
  }

  async function logout(): Promise<void> {
    await AuthService.logout()
    session.value = null
    error.value = null
  }

  /** Restaura la sesión persistida al arrancar o al recargar la página. */
  async function restore(): Promise<void> {
    if (initialized.value) return
    session.value = await AuthService.restore()
    initialized.value = true
  }

  function clearError(): void {
    error.value = null
  }

  return {
    session,
    user,
    role,
    loading,
    error,
    initialized,
    isAuthenticated,
    login,
    loginWithProvider,
    logout,
    restore,
    clearError,
  }
})
