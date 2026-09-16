<script setup lang="ts">
/** Gráfica de barras para comparar indicadores entre categorías. */
import { computed } from 'vue'
import type { CallbackDataParams, EChartsOption } from 'echarts/types/dist/shared'
import BaseChart from './BaseChart.vue'
import { useChartTheme } from '@/composables'
import { formatNumber } from '@/utils'

export interface BarDatum {
  label: string
  value: number
}

const props = withDefaults(
  defineProps<{
    data: BarDatum[]
    height?: number
    unit?: string
    /** Colorea según el signo del valor (útil para variaciones). */
    diverging?: boolean
    /**
     * Asigna un color distinto por categoría. Sólo tiene sentido cuando cada
     * barra es una entidad propia; para una misma métrica medida en varias
     * categorías, un único color evita sugerir identidades que no existen.
     */
    byCategory?: boolean
    horizontal?: boolean
    ariaLabel?: string
  }>(),
  { height: 300, unit: '', diverging: false, byCategory: false, horizontal: false, ariaLabel: '' },
)

const { palette, semantic, categoryAxis, valueAxis, tokens } = useChartTheme()

const option = computed<EChartsOption>(() => {
  const labels = props.data.map((item) => item.label)
  const category = { ...categoryAxis(labels), boundaryGap: true }
  const value = valueAxis()

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (raw) => `${formatNumber(Number(raw), 2)}${props.unit}`,
    },
    grid: { left: 12, right: 18, top: 24, bottom: 8, containLabel: true },
    xAxis: props.horizontal ? value : category,
    yAxis: props.horizontal ? category : value,
    series: [
      {
        type: 'bar',
        // Extremo redondeado sólo en el lado del dato; la base queda anclada.
        barMaxWidth: 34,
        itemStyle: {
          borderRadius: props.horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
          color: (params: CallbackDataParams) => {
            if (props.diverging) {
              return Number(params.value) >= 0 ? semantic.value.positive : semantic.value.negative
            }
            return props.byCategory
              ? palette.value[params.dataIndex % palette.value.length]
              : palette.value[0]
          },
        },
        data: props.data.map((item) => item.value),
        markLine: props.diverging
          ? {
              silent: true,
              symbol: 'none',
              lineStyle: { color: tokens.value.axisLine, type: 'solid' },
              data: [props.horizontal ? { xAxis: 0 } : { yAxis: 0 }],
              label: { show: false },
            }
          : undefined,
      },
    ],
  }
})
</script>

<template>
  <BaseChart :option="option" :height="height" :aria-label="ariaLabel" />
</template>
