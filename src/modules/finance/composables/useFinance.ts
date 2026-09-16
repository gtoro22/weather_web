import { computed, ref } from 'vue'
import { useAsyncData, useTimeRange } from '@/composables'
import { FinanceService } from '@/services'
import type { TimeSeries } from '@/types'

export function useFinance(initialAssetId = 'idx') {
  const assetId = ref(initialAssetId)
  const { range, options: rangeOptions } = useTimeRange('month')

  const assets = useAsyncData(() => FinanceService.getAssets())
  const summary = useAsyncData(() => FinanceService.getMarketSummary())
  const sectors = useAsyncData(() => FinanceService.getSectorPerformance())
  const series = useAsyncData(() => FinanceService.getAssetSeries(assetId.value, range.value), {
    watchSources: [assetId, range],
  })

  const assetOptions = computed(() =>
    (assets.data.value ?? []).map((asset) => ({
      value: asset.id,
      label: `${asset.symbol} · ${asset.name}`,
    })),
  )

  const selectedAsset = computed(
    () => (assets.data.value ?? []).find((asset) => asset.id === assetId.value) ?? null,
  )

  const priceSeries = computed<TimeSeries[]>(() => {
    const points = series.data.value?.points ?? []
    if (!points.length) return []
    return [
      {
        id: assetId.value,
        name: selectedAsset.value?.symbol ?? 'Precio',
        points,
        unit: ' USD',
      },
    ]
  })

  /** Variación porcentual de cada activo, para la gráfica de barras. */
  const changeComparison = computed(() =>
    (assets.data.value ?? [])
      .filter((asset) => asset.sector !== 'indices')
      .map((asset) => ({ label: asset.symbol, value: asset.changePercent })),
  )

  const sectorDistribution = computed(() =>
    (sectors.data.value ?? []).map((sector) => ({ label: sector.label, value: sector.weight })),
  )

  function refreshAll(): void {
    void assets.refresh()
    void summary.refresh()
    void sectors.refresh()
    void series.refresh()
  }

  return {
    assetId,
    range,
    rangeOptions,
    assets,
    assetOptions,
    selectedAsset,
    summary,
    sectors,
    series,
    priceSeries,
    changeComparison,
    sectorDistribution,
    refreshAll,
  }
}
