<script setup lang="ts">
/** Indicador tipo gauge para una única métrica resumida. */
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import BaseChart from './BaseChart.vue'
import { useChartTheme } from '@/composables'

const props = withDefaults(
  defineProps<{
    value: number
    min?: number
    max?: number
    label?: string
    unit?: string
    height?: number
    ariaLabel?: string
  }>(),
  { min: 0, max: 100, label: '', unit: '', height: 260, ariaLabel: '' },
)

const { palette, tokens } = useChartTheme()

const option = computed<EChartsOption>(() => ({
  tooltip: { show: false },
  series: [
    {
      type: 'gauge',
      min: props.min,
      max: props.max,
      startAngle: 210,
      endAngle: -30,
      radius: '92%',
      center: ['50%', '58%'],
      progress: { show: true, width: 12, roundCap: true, itemStyle: { color: palette.value[0] } },
      axisLine: { lineStyle: { width: 12, color: [[1, tokens.value.splitLine]] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { color: tokens.value.subtleText, fontSize: 10, distance: 16 },
      pointer: { show: false },
      anchor: { show: false },
      title: { offsetCenter: [0, '34%'], color: tokens.value.subtleText, fontSize: 12 },
      detail: {
        offsetCenter: [0, '2%'],
        color: tokens.value.text,
        fontSize: 26,
        fontWeight: 600,
        formatter: (value: number) => `${Math.round(value)}${props.unit}`,
      },
      data: [{ value: props.value, name: props.label }],
    },
  ],
}))
</script>

<template>
  <BaseChart :option="option" :height="height" :aria-label="ariaLabel" />
</template>
