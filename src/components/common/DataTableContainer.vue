<script setup lang="ts">
/**
 * Contenedor de tablas y listados. Unifica barra de herramientas, filtros,
 * estado vacío y pie de paginación; la tabla concreta llega por el slot por
 * defecto, de modo que /users y /finance comparten el mismo armazón.
 */
withDefaults(
  defineProps<{
    title?: string
    loading?: boolean
    error?: string | null
    empty?: boolean
  }>(),
  { title: '', loading: false, error: null, empty: false },
)

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <a-card class="table-container" :body-style="{ padding: '16px' }">
    <template v-if="title || $slots.toolbar" #title>
      <div class="table-container__head">
        <span v-if="title" class="table-container__title">{{ title }}</span>
      </div>
    </template>

    <template v-if="$slots.toolbar" #extra>
      <div class="table-container__toolbar"><slot name="toolbar" /></div>
    </template>

    <div v-if="$slots.filters" class="table-container__filters">
      <slot name="filters" />
    </div>

    <a-alert
      v-if="error"
      class="table-container__alert"
      type="error"
      show-icon
      :message="'No se pudieron cargar los datos'"
      :description="error"
    >
      <template #action>
        <a-button size="small" @click="emit('retry')">Reintentar</a-button>
      </template>
    </a-alert>

    <a-skeleton v-else-if="loading" active :paragraph="{ rows: 6 }" />

    <div v-else-if="empty" class="table-container__empty">
      <!-- Slot `empty`: cada listado puede ofrecer su propia acción vacía. -->
      <slot name="empty">
        <a-empty description="No hay registros que coincidan con los filtros" />
      </slot>
    </div>

    <slot v-else />

    <div v-if="$slots.footer" class="table-container__footer">
      <slot name="footer" />
    </div>
  </a-card>
</template>

<style scoped>
.table-container__title {
  font-size: 15px;
  font-weight: 600;
}

.table-container__toolbar,
.table-container__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.table-container__filters {
  margin-bottom: 16px;
}

.table-container__alert {
  margin-bottom: 8px;
}

.table-container__empty {
  padding: 24px 0;
}

.table-container__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}
</style>
