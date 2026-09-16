import type { TimeRange, TimeSeriesPoint } from '@/types'
import { TIME_RANGE_RESOLUTION } from '@/constants'
import { createSeededRandom, roundTo, seedFromString } from './random'

interface SeriesOptions {
  base: number
  volatility: number
  trend?: number
  min?: number
  max?: number
  decimals?: number
}

/**
 * Genera una serie temporal determinista terminada en "ahora". La misma
 * combinación de `seed` y `range` produce siempre los mismos puntos.
 */
export function generateSeries(
  seed: string,
  range: TimeRange,
  { base, volatility, trend = 0, min, max, decimals = 2 }: SeriesOptions,
): TimeSeriesPoint[] {
  const { points, stepHours } = TIME_RANGE_RESOLUTION[range]
  const random = createSeededRandom(seedFromString(`${seed}:${range}`))
  const now = Date.now()
  const stepMs = stepHours * 60 * 60 * 1000

  let value = base
  const series: TimeSeriesPoint[] = []

  for (let i = points - 1; i >= 0; i -= 1) {
    // Camino aleatorio con reversión a la media para que no se dispare.
    const shock = (random() - 0.5) * 2 * volatility
    const meanReversion = (base - value) * 0.08
    value = value + shock + meanReversion + trend
    if (min !== undefined) value = Math.max(min, value)
    if (max !== undefined) value = Math.min(max, value)
    series.push({
      t: new Date(now - i * stepMs).toISOString(),
      v: roundTo(value, decimals),
    })
  }

  return series
}

/** Etiqueta del eje X adecuada a la granularidad del rango. */
export function axisLabelPattern(range: TimeRange): string {
  switch (range) {
    case 'day':
      return 'HH:mm'
    case 'week':
      return 'ddd HH:mm'
    case 'month':
      return 'DD MMM'
    case 'year':
      return 'MMM YYYY'
  }
}
