<script setup lang="ts" generic="T">
/**
 * Resuelve el trío cargando / error / vacío una sola vez y entrega los datos
 * ya garantizados al slot por defecto mediante un **scoped slot**: quien lo
 * usa recibe `data` con tipo `T` no nulo y se olvida de comprobarlo.
 */
import type { RequestStatus } from '@/types'

withDefaults(
  defineProps<{
    data: T | null
    status: RequestStatus
    error?: string | null
    empty?: boolean
    skeletonRows?: number
    emptyText?: string
  }>(),
  {
    error: null,
    empty: false,
    skeletonRows: 4,
    emptyText: 'No hay información disponible',
  },
)

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <a-skeleton
    v-if="status === 'loading' || status === 'idle'"
    active
    :paragraph="{ rows: skeletonRows }"
  />

  <a-alert v-else-if="status === 'error'" type="error" show-icon :message="error ?? 'Error'">
    <template #action>
      <a-button size="small" @click="emit('retry')">Reintentar</a-button>
    </template>
  </a-alert>

  <slot v-else-if="empty || data === null" name="empty">
    <a-empty :description="emptyText" />
  </slot>

  <!-- Scoped slot: `data` llega ya resuelto y sin nulos. -->
  <slot v-else :data="data as T" />
</template>
