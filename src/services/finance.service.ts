import type { Asset, AssetSeries, MarketSummary, SectorPerformance, TimeRange } from '@/types'
import { toDataSourceError } from '@/types'
import { getRepositories } from './data-source.factory'

class FinanceServiceImpl {
  async getAssets(): Promise<Asset[]> {
    try {
      return await getRepositories().finance.listAssets()
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async getAssetSeries(assetId: string, range: TimeRange): Promise<AssetSeries> {
    try {
      return await getRepositories().finance.getAssetSeries(assetId, range)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async getSectorPerformance(): Promise<SectorPerformance[]> {
    try {
      return await getRepositories().finance.getSectorPerformance()
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async getMarketSummary(): Promise<MarketSummary> {
    try {
      return await getRepositories().finance.getMarketSummary()
    } catch (error) {
      throw toDataSourceError(error)
    }
  }
}

export const FinanceService = new FinanceServiceImpl()
