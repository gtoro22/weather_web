/** Tipos transversales compartidos por todos los módulos de dominio. */

/** Rango temporal soportado por los filtros de las gráficas. */
export type TimeRange = 'day' | 'week' | 'month' | 'year'

/** Estado de una operación asíncrona, usado por stores y composables. */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

/** Punto genérico de una serie temporal: `t` en ISO 8601, `v` numérico. */
export interface TimeSeriesPoint {
  t: string
  v: number
}

/** Serie temporal con nombre, lista para alimentar ECharts. */
export interface TimeSeries {
  id: string
  name: string
  points: TimeSeriesPoint[]
  unit?: string
}

/** Respuesta paginada estándar de cualquier repositorio. */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/** Parámetros de consulta comunes a los listados. */
export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

/**
 * Error normalizado de la capa de datos. Los adaptadores (mock o reales)
 * traducen sus errores nativos a esta forma para que la UI no dependa de
 * Axios, Firebase ni de ningún SDK concreto.
 */
export class DataSourceError extends Error {
  readonly code: string
  readonly status?: number
  readonly cause?: unknown

  constructor(message: string, options: { code?: string; status?: number; cause?: unknown } = {}) {
    super(message)
    this.name = 'DataSourceError'
    this.code = options.code ?? 'UNKNOWN'
    this.status = options.status
    this.cause = options.cause
  }
}

/** Convierte cualquier valor lanzado en un `DataSourceError` legible. */
export function toDataSourceError(error: unknown): DataSourceError {
  if (error instanceof DataSourceError) return error
  if (error instanceof Error) {
    return new DataSourceError(error.message, { cause: error })
  }
  return new DataSourceError('Ocurrió un error inesperado', { cause: error })
}
