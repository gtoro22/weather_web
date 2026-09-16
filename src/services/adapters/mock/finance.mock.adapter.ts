import type { FinanceRepository } from '@/services/repositories'
import type { Asset, AssetSeries, MarketSummary, SectorPerformance, TimeRange } from '@/types'
import { DataSourceError } from '@/types'
import { generateSeries, roundTo, simulateNetwork } from '@/utils'
import {
  ASSET_SERIES_PARAMS,
  MOCK_ASSETS,
  MOCK_SECTOR_PERFORMANCE,
} from '@/modules/finance/mocks/finance.mock'

export class MockFinanceAdapter implements FinanceRepository {
  async listAssets(): Promise<Asset[]> {
    await simulateNetwork('los activos financieros')
    return MOCK_ASSETS
  }

  async getAssetSeries(assetId: string, range: TimeRange): Promise<AssetSeries> {
    await simulateNetwork('la serie histórica del activo')
    const params = ASSET_SERIES_PARAMS[assetId]
    if (!params) {
      throw new DataSourceError(`El activo "${assetId}" no existe`, {
        code: 'NOT_FOUND',
        status: 404,
      })
    }
    return {
      assetId,
      points: generateSeries(`asset:${assetId}`, range, {
        base: params.base,
        volatility: params.volatility,
        trend: params.trend,
        min: 0,
      }),
    }
  }

  async getSectorPerformance(): Promise<SectorPerformance[]> {
    await simulateNetwork('el rendimiento por sector')
    return MOCK_SECTOR_PERFORMANCE
  }

  async getMarketSummary(): Promise<MarketSummary> {
    await simulateNetwork('el resumen de mercado')
    const index = MOCK_ASSETS.find((asset) => asset.id === 'idx')
    const tradable = MOCK_ASSETS.filter((asset) => asset.sector !== 'indices')
    return {
      indexValue: index?.price ?? 0,
      indexChangePercent: index?.changePercent ?? 0,
      totalVolume: MOCK_ASSETS.reduce((total, asset) => total + asset.volume, 0),
      advancers: tradable.filter((asset) => asset.changePercent > 0).length,
      decliners: tradable.filter((asset) => asset.changePercent <= 0).length,
      volatility: roundTo(
        tradable.reduce((total, asset) => total + Math.abs(asset.changePercent), 0) /
          tradable.length,
        2,
      ),
    }
  }
}
