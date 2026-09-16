<script setup lang="ts">
/** Dona para distribuciones por categoría (participación sobre un total). */
import { computed } from 'vue'
import type { CallbackDataParams, EChartsOption } from 'echarts/types/dist/shared'
import BaseChart from './BaseChart.vue'
import { useChartTheme } from '@/composables'

export interface DonutDatum {
  label: string
  value: number
}

const props = withDefaults(
  defineProps<{
    data: DonutDatum[]
    height?: number
    centerLabel?: string
    ariaLabel?: string
  }>(),
  { height: 300, centerLabel: '', ariaLabel: '' },
)

const { palette, tokens } = useChartTheme()

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

const option = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (raw) => {
      const params = raw as CallbackDataParams
      return `${params.name}<br/><strong>${params.value}</strong> (${params.percent}%)`
    },
  },
  legend: {
    orient: 'horizontal',
    bottom: 0,
    left: 'center',
    textStyle: { color: tokens.value.subtleText },
  },
  series: [
    {
      type: 'pie',
      radius: ['58%', '78%'],
      center: ['50%', '44%'],
      avoidLabelOverlap: true,
      // Un anillo de 2px del color de la superficie separa los segmentos.
      itemStyle: { borderColor: tokens.value.tooltipBg, borderWidth: 2, borderRadius: 4 },
      label: {
        show: true,
        position: 'center',
        formatter: () => `{total|${total.value}}\n{caption|${props.centerLabel}}`,
        rich: {
          total: { fontSize: 24, fontWeight: 600, color: tokens.value.text, lineHeight: 30 },
          caption: { fontSize: 12, color: tokens.value.subtleText },
        },
      },
      emphasis: { label: { show: true }, scaleSize: 4 },
      labelLine: { show: false },
      data: props.data.map((item, index) => ({
        name: item.label,
        value: item.value,
        itemStyle: { color: palette.value[index % palette.value.length] },
      })),
    },
  ],
}))
</script>

<template>
  <BaseChart :option="option" :height="height" :aria-label="ariaLabel" />
</template>
