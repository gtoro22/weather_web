<script setup lang="ts">
/** Radar para comparar varias métricas normalizadas de 0 a 100. */
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import BaseChart from './BaseChart.vue'
import { useChartTheme } from '@/composables'

export interface RadarIndicator {
  name: string
  max: number
}

export interface RadarSeries {
  name: string
  values: number[]
}

const props = withDefaults(
  defineProps<{
    indicators: RadarIndicator[]
    series: RadarSeries[]
    height?: number
    ariaLabel?: string
  }>(),
  { height: 300, ariaLabel: '' },
)

const { palette, tokens } = useChartTheme()

const option = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item' },
  legend: props.series.length > 1 ? { bottom: 0, left: 'center' } : undefined,
  radar: {
    indicator: props.indicators,
    radius: '64%',
    center: ['50%', '48%'],
    axisName: { color: tokens.value.subtleText, fontSize: 11 },
    splitLine: { lineStyle: { color: tokens.value.splitLine } },
    axisLine: { lineStyle: { color: tokens.value.splitLine } },
    splitArea: { show: false },
  },
  series: [
    {
      type: 'radar',
      symbolSize: 6,
      data: props.series.map((item, index) => ({
        name: item.name,
        value: item.values,
        lineStyle: { width: 2, color: palette.value[index % palette.value.length] },
        itemStyle: { color: palette.value[index % palette.value.length] },
        areaStyle: { opacity: 0.16, color: palette.value[index % palette.value.length] },
      })),
    },
  ],
}))
</script>

<template>
  <BaseChart :option="option" :height="height" :aria-label="ariaLabel" />
</template>
