import type { Asset, AssetSeries, MarketSummary, SectorPerformance, TimeRange } from '@/types'

export interface FinanceRepository {
  listAssets(): Promise<Asset[]>
  getAssetSeries(assetId: string, range: TimeRange): Promise<AssetSeries>
  getSectorPerformance(): Promise<SectorPerformance[]>
  getMarketSummary(): Promise<MarketSummary>
}
