<script setup lang="ts">
/**
 * Envoltorio común de todas las gráficas: encabezado, filtros, lienzo,
 * leyenda y pie. Concentra aquí los tres estados (cargando, error, vacío)
 * para que ninguna gráfica tenga que repetirlos.
 */
withDefaults(
  defineProps<{
    title: string
    description?: string
    loading?: boolean
    error?: string | null
    empty?: boolean
    height?: number
  }>(),
  { description: '', loading: false, error: null, empty: false, height: 300 },
)

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <a-card class="chart-card" :body-style="{ padding: '16px' }">
    <template #title>
      <!-- Slot `header`: título compuesto (badge de variación, tag, etc.). -->
      <slot name="header">
        <div class="chart-card__heading">
          <span class="chart-card__title">{{ title }}</span>
          <span v-if="description" class="chart-card__description">{{ description }}</span>
        </div>
      </slot>
    </template>

    <template v-if="$slots.filters" #extra>
      <div class="chart-card__filters"><slot name="filters" /></div>
    </template>

    <div class="chart-card__body" :style="{ minHeight: `${height}px` }">
      <a-skeleton
        v-if="loading"
        active
        :title="false"
        :paragraph="{ rows: 6 }"
        class="chart-card__skeleton"
      />

      <a-result
        v-else-if="error"
        status="error"
        title="No se pudieron cargar los datos"
        :sub-title="error"
      >
        <template #extra>
          <a-button type="primary" @click="emit('retry')">Reintentar</a-button>
        </template>
      </a-result>

      <a-empty v-else-if="empty" description="Sin datos para el rango seleccionado" />

      <slot v-else />
    </div>

    <div v-if="$slots.legend && !loading && !error && !empty" class="chart-card__legend">
      <slot name="legend" />
    </div>

    <template v-if="$slots.footer" #actions>
      <div class="chart-card__footer"><slot name="footer" /></div>
    </template>
  </a-card>
</template>

<style scoped>
.chart-card {
  height: 100%;
}

.chart-card__heading {
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: normal;
}

.chart-card__title {
  font-size: 15px;
  font-weight: 600;
}

.chart-card__description {
  color: var(--app-text-secondary);
  font-size: 12px;
  font-weight: 400;
}

.chart-card__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chart-card__skeleton {
  padding: 8px 0;
}

.chart-card__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chart-card__legend {
  margin-top: 12px;
  border-top: 1px solid var(--app-border);
  padding-top: 10px;
}

.chart-card__footer {
  padding: 0 16px;
  color: var(--app-text-secondary);
  font-size: 12px;
  text-align: left;
}
</style>
