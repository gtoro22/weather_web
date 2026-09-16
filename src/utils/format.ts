import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('es')

export { dayjs }

export function formatDate(value: string | number | Date, pattern = 'DD MMM YYYY'): string {
  return dayjs(value).format(pattern)
}

export function formatDateTime(value: string | number | Date): string {
  return dayjs(value).format('DD MMM YYYY · HH:mm')
}

export function formatTime(value: string | number | Date): string {
  return dayjs(value).format('HH:mm')
}

export function formatRelative(value: string | number | Date): string {
  return dayjs(value).fromNow()
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Abrevia magnitudes grandes (volúmenes, capitalización) a K/M/B. */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('es-ES', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  )
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${formatNumber(value, decimals)}%`
}

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°C`
}
