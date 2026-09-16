import { computed, onMounted, ref, shallowRef, watch, type Ref, type WatchSource } from 'vue'
import { toDataSourceError } from '@/types'
import type { RequestStatus } from '@/types'

interface UseAsyncDataOptions {
  /** Fuentes reactivas que, al cambiar, vuelven a disparar la carga. */
  watchSources?: WatchSource[]
  immediate?: boolean
}

interface UseAsyncDataResult<T> {
  data: Ref<T | null>
  status: Ref<RequestStatus>
  error: Ref<string | null>
  isLoading: Ref<boolean>
  isEmpty: Ref<boolean>
  refresh: () => Promise<void>
}

/**
 * Envuelve una promesa en los tres estados que la UI necesita: cargando,
 * vacío y error. Concentrar esto aquí evita repetir el mismo trío de refs en
 * cada vista y garantiza que todas se comporten igual.
 *
 * Las respuestas obsoletas se descartan comparando un identificador de
 * petición: sin esto, cambiar de ciudad rápido podría pintar datos viejos.
 */
export function useAsyncData<T>(
  loader: () => Promise<T>,
  options: UseAsyncDataOptions = {},
): UseAsyncDataResult<T> {
  const { watchSources = [], immediate = true } = options

  const data = shallowRef<T | null>(null) as Ref<T | null>
  const status = ref<RequestStatus>('idle')
  const error = ref<string | null>(null)
  let requestId = 0

  const isLoading = computed(() => status.value === 'loading')
  const isEmpty = computed(() => {
    if (status.value !== 'success') return false
    const value = data.value
    if (value === null || value === undefined) return true
    return Array.isArray(value) && value.length === 0
  })

  async function refresh(): Promise<void> {
    const currentRequest = (requestId += 1)
    status.value = 'loading'
    error.value = null
    try {
      const result = await loader()
      if (currentRequest !== requestId) return
      data.value = result
      status.value = 'success'
    } catch (raw) {
      if (currentRequest !== requestId) return
      error.value = toDataSourceError(raw).message
      status.value = 'error'
    }
  }

  if (watchSources.length > 0) {
    watch(watchSources, () => void refresh())
  }

  if (immediate) {
    onMounted(() => void refresh())
  }

  return { data, status, error, isLoading, isEmpty, refresh }
}
