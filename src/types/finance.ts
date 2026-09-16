import type { TimeSeriesPoint } from './common'

export type AssetSector = 'tecnologia' | 'energia' | 'salud' | 'financiero' | 'consumo' | 'indices'

export interface Asset {
  id: string
  symbol: string
  name: string
  sector: AssetSector
  price: number
  currency: string
  changePercent: number
  changeAbsolute: number
  volume: number
  marketCap: number
}

export interface AssetSeries {
  assetId: string
  points: TimeSeriesPoint[]
}

export interface SectorPerformance {
  sector: AssetSector
  label: string
  performance: number
  weight: number
}

export interface MarketSummary {
  indexValue: number
  indexChangePercent: number
  totalVolume: number
  advancers: number
  decliners: number
  volatility: number
}
