import { computed } from 'vue'
import { useAsyncData } from '@/composables'
import { FinanceService, NewsService, WeatherService } from '@/services'
import { useUiStore } from '@/stores'
import type { TimeRange } from '@/types'
import { roundTo } from '@/utils'

/**
 * Agrega los tres dominios en una sola vista. Cada bloque mantiene su propio
 * estado de carga para que un fallo en finanzas no oculte el clima.
 */
export function useDashboard(cityId: () => string, range: () => TimeRange) {
  const ui = useUiStore()

  const weather = useAsyncData(() => WeatherService.getCurrent(cityId()), {
    watchSources: [cityId],
  })
  const weatherHistory = useAsyncData(() => WeatherService.getHistory(cityId(), range()), {
    watchSources: [cityId, range],
  })
  const market = useAsyncData(() => FinanceService.getMarketSummary())
  const indexSeries = useAsyncData(() => FinanceService.getAssetSeries('idx', range()), {
    watchSources: [range],
  })
  const sectors = useAsyncData(() => FinanceService.getSectorPerformance())
  const news = useAsyncData(() => NewsService.getArticles({ limit: 5 }))
  const newsDistribution = useAsyncData(() => NewsService.getCategoryDistribution())

  const temperatureSeries = computed(() => {
    const points = weatherHistory.data.value?.temperature ?? []
    return points.length ? [{ id: 'temp', name: 'Temperatura', points, unit: '°C' }] : []
  })

  const indexPriceSeries = computed(() => {
    const points = indexSeries.data.value?.points ?? []
    return points.length ? [{ id: 'idx', name: 'Insight Index 50', points, unit: '' }] : []
  })

  const sectorBars = computed(() =>
    (sectors.data.value ?? []).map((sector) => ({
      label: sector.label,
      value: sector.performance,
    })),
  )

  const newsDonut = computed(() =>
    (newsDistribution.data.value ?? []).map((item) => ({ label: item.label, value: item.count })),
  )

  /**
   * Métricas resumidas normalizadas a 0-100 para el radar. La normalización se
   * hace aquí, no en la gráfica: el radar no debe conocer las unidades.
   */
  const radarValues = computed(() => {
    const current = weather.data.value
    const summary = market.data.value
    if (!current || !summary) return []
    return [
      roundTo(Math.min(100, Math.max(0, ((current.temperature + 10) / 50) * 100)), 1),
      current.humidity,
      roundTo(Math.min(100, (current.windSpeed / 40) * 100), 1),
      roundTo(Math.min(100, (summary.volatility / 5) * 100), 1),
      roundTo(
        summary.advancers + summary.decliners > 0
          ? (summary.advancers / (summary.advancers + summary.decliners)) * 100
          : 0,
        1,
      ),
    ]
  })

  function refreshAll(): void {
    void weather.refresh()
    void weatherHistory.refresh()
    void market.refresh()
    void indexSeries.refresh()
    void sectors.refresh()
    void news.refresh()
    void newsDistribution.refresh()
    ui.markUpdated()
  }

  return {
    weather,
    weatherHistory,
    market,
    indexSeries,
    sectors,
    news,
    newsDistribution,
    temperatureSeries,
    indexPriceSeries,
    sectorBars,
    newsDonut,
    radarValues,
    refreshAll,
  }
}
