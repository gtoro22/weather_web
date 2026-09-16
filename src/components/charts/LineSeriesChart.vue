<script setup lang="ts">
/** Gráfica de línea o área para una o varias series temporales. */
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import BaseChart from './BaseChart.vue'
import { useChartTheme } from '@/composables'
import type { TimeRange, TimeSeries } from '@/types'
import { axisLabelPattern, dayjs, formatNumber } from '@/utils'

const props = withDefaults(
  defineProps<{
    series: TimeSeries[]
    range: TimeRange
    height?: number
    area?: boolean
    /** Fuerza el eje Y a partir de cero (por defecto se ajusta a los datos). */
    zeroBased?: boolean
    unit?: string
    ariaLabel?: string
  }>(),
  { height: 300, area: false, zeroBased: false, unit: '', ariaLabel: '' },
)

const { palette, categoryAxis, valueAxis } = useChartTheme()

const categories = computed(() =>
  (props.series[0]?.points ?? []).map((point) =>
    dayjs(point.t).format(axisLabelPattern(props.range)),
  ),
)

const option = computed<EChartsOption>(() => ({
  // Sólo hay leyenda a partir de dos series: con una, el título ya la nombra.
  legend: props.series.length > 1 ? { bottom: 0, left: 'center' } : undefined,
  grid: {
    left: 12,
    right: 18,
    top: 24,
    bottom: props.series.length > 1 ? 36 : 8,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value) => `${formatNumber(Number(value), 2)}${props.unit}`,
  },
  xAxis: categoryAxis(categories.value),
  yAxis: valueAxis(undefined, !props.zeroBased),
  series: props.series.map((item, index) => ({
    id: item.id,
    name: item.name,
    type: 'line',
    smooth: 0.28,
    showSymbol: false,
    symbolSize: 8,
    // El color sigue a la entidad por su posición fija, nunca a su ranking.
    itemStyle: { color: palette.value[index % palette.value.length] },
    lineStyle: { width: 2 },
    areaStyle: props.area
      ? {
          opacity: 0.16,
          color: palette.value[index % palette.value.length],
        }
      : undefined,
    data: item.points.map((point) => point.v),
  })),
}))
</script>

<template>
  <BaseChart :option="option" :height="height" :aria-label="ariaLabel" />
</template>
