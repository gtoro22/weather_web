import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores'
import {
  CHART_PALETTE_DARK,
  CHART_PALETTE_LIGHT,
  SEMANTIC_COLORS,
  SEMANTIC_COLORS_DARK,
} from '@/constants'

/**
 * Opciones base compartidas por todas las gráficas. Centralizar aquí la
 * tipografía, la rejilla y los colores mantiene coherencia visual entre
 * módulos y hace que el cambio de tema afecte a todas a la vez.
 */
export function useChartTheme() {
  const { isDark } = storeToRefs(useUiStore())

  const palette = computed(() => [...(isDark.value ? CHART_PALETTE_DARK : CHART_PALETTE_LIGHT)])

  const semantic = computed(() => (isDark.value ? SEMANTIC_COLORS_DARK : SEMANTIC_COLORS))

  const tokens = computed(() => ({
    text: isDark.value ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.72)',
    subtleText: isDark.value ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    axisLine: isDark.value ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)',
    splitLine: isDark.value ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    tooltipBg: isDark.value ? '#1f1f1f' : '#ffffff',
    tooltipBorder: isDark.value ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
  }))

  const baseOption = computed(() => ({
    color: palette.value,
    textStyle: {
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      color: tokens.value.text,
    },
    grid: { left: 12, right: 18, top: 28, bottom: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: tokens.value.tooltipBg,
      borderColor: tokens.value.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tokens.value.text, fontSize: 12 },
      axisPointer: { type: 'line', lineStyle: { color: tokens.value.axisLine } },
    },
    legend: {
      icon: 'roundRect',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: tokens.value.subtleText },
    },
  }))

  function categoryAxis(data: string[]) {
    return {
      type: 'category' as const,
      data,
      boundaryGap: false,
      axisLine: { lineStyle: { color: tokens.value.axisLine } },
      axisTick: { show: false },
      axisLabel: { color: tokens.value.subtleText, fontSize: 11, hideOverlap: true },
    }
  }

  /**
   * `scale` deja que el eje se ajuste al recorrido real de los datos. Forzar el
   * cero en series de precio o temperatura aplasta la curva y oculta la señal.
   */
  function valueAxis(name?: string, scale = false) {
    return {
      type: 'value' as const,
      name,
      scale,
      nameTextStyle: { color: tokens.value.subtleText, fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: tokens.value.subtleText, fontSize: 11 },
      splitLine: { lineStyle: { color: tokens.value.splitLine } },
    }
  }

  return { isDark, palette, semantic, tokens, baseOption, categoryAxis, valueAxis }
}
