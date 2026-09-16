import type { Asset, SectorPerformance } from '@/types'

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'nvx',
    symbol: 'NVX',
    name: 'Novatek Systems',
    sector: 'tecnologia',
    price: 284.32,
    currency: 'USD',
    changePercent: 2.41,
    changeAbsolute: 6.69,
    volume: 18_420_000,
    marketCap: 412_000_000_000,
  },
  {
    id: 'hlx',
    symbol: 'HLX',
    name: 'Helix Energy Group',
    sector: 'energia',
    price: 76.18,
    currency: 'USD',
    changePercent: -1.12,
    changeAbsolute: -0.86,
    volume: 9_310_000,
    marketCap: 88_400_000_000,
  },
  {
    id: 'vtl',
    symbol: 'VTL',
    name: 'Vitalis Health',
    sector: 'salud',
    price: 132.9,
    currency: 'USD',
    changePercent: 0.74,
    changeAbsolute: 0.98,
    volume: 5_120_000,
    marketCap: 146_900_000_000,
  },
  {
    id: 'mrd',
    symbol: 'MRD',
    name: 'Meridian Bank',
    sector: 'financiero',
    price: 48.55,
    currency: 'USD',
    changePercent: -0.38,
    changeAbsolute: -0.19,
    volume: 12_770_000,
    marketCap: 61_200_000_000,
  },
  {
    id: 'cst',
    symbol: 'CST',
    name: 'Casa Retail',
    sector: 'consumo',
    price: 21.07,
    currency: 'USD',
    changePercent: 1.86,
    changeAbsolute: 0.38,
    volume: 22_050_000,
    marketCap: 24_800_000_000,
  },
  {
    id: 'idx',
    symbol: 'IDX50',
    name: 'Insight Index 50',
    sector: 'indices',
    price: 4_318.62,
    currency: 'USD',
    changePercent: 0.92,
    changeAbsolute: 39.42,
    volume: 41_900_000,
    marketCap: 0,
  },
]

/** Parámetros de simulación por activo: base y volatilidad de la serie. */
export const ASSET_SERIES_PARAMS: Record<
  string,
  { base: number; volatility: number; trend: number }
> = {
  nvx: { base: 284.32, volatility: 6.4, trend: 0.35 },
  hlx: { base: 76.18, volatility: 2.1, trend: -0.08 },
  vtl: { base: 132.9, volatility: 2.8, trend: 0.11 },
  mrd: { base: 48.55, volatility: 1.2, trend: -0.02 },
  cst: { base: 21.07, volatility: 0.8, trend: 0.06 },
  idx: { base: 4318.62, volatility: 42, trend: 2.4 },
}

export const MOCK_SECTOR_PERFORMANCE: SectorPerformance[] = [
  { sector: 'tecnologia', label: 'Tecnología', performance: 12.4, weight: 31 },
  { sector: 'energia', label: 'Energía', performance: -3.8, weight: 14 },
  { sector: 'salud', label: 'Salud', performance: 5.1, weight: 18 },
  { sector: 'financiero', label: 'Financiero', performance: 2.2, weight: 21 },
  { sector: 'consumo', label: 'Consumo', performance: 7.6, weight: 16 },
]
