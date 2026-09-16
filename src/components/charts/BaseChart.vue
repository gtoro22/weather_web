<script setup lang="ts">
/**
 * Único punto donde la aplicación toca ECharts. Todas las gráficas pasan por
 * aquí, lo que garantiza redimensionado automático, altura coherente y
 * re-render al cambiar de tema (ECharts cachea la opción, así que el cambio de
 * tokens de color exige forzar la actualización con `notMerge`).
 */
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/composables'

const props = withDefaults(
  defineProps<{
    option: EChartsOption
    height?: number
    /** Descripción textual para lectores de pantalla. */
    ariaLabel?: string
  }>(),
  { height: 300, ariaLabel: '' },
)

const { isDark, baseOption } = useChartTheme()

// La fusión es superficial y deliberada: cada gráfica puede sustituir un bloque
// completo (tooltip, legend) sin heredar restos de la configuración base. El
// cast es necesario porque el spread pierde los tipos discriminados de ECharts.
const mergedOption = computed<EChartsOption>(
  () =>
    ({
      ...baseOption.value,
      ...props.option,
      tooltip: { ...baseOption.value.tooltip, ...(props.option.tooltip ?? {}) },
      legend: props.option.legend
        ? { ...baseOption.value.legend, ...props.option.legend }
        : undefined,
    }) as EChartsOption,
)
</script>

<template>
  <VChart
    :key="isDark ? 'dark' : 'light'"
    class="chart"
    :option="mergedOption"
    :style="{ height: `${height}px` }"
    :init-options="{ renderer: 'canvas' }"
    autoresize
    role="img"
    :aria-label="ariaLabel"
  />
</template>

<style scoped>
.chart {
  width: 100%;
}
</style>
