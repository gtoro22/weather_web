import type { NewsCategory, TimeRange, UserRole, UserStatus, WeatherCondition } from '@/types'

export const TIME_RANGE_OPTIONS: ReadonlyArray<{ value: TimeRange; label: string }> = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
]

/** Cuántos puntos genera cada rango y con qué granularidad. */
export const TIME_RANGE_RESOLUTION: Record<TimeRange, { points: number; stepHours: number }> = {
  day: { points: 24, stepHours: 1 },
  week: { points: 28, stepHours: 6 },
  month: { points: 30, stepHours: 24 },
  year: { points: 52, stepHours: 24 * 7 },
}

export const WEATHER_CONDITION_LABELS: Record<WeatherCondition, string> = {
  sunny: 'Despejado',
  'partly-cloudy': 'Parcialmente nublado',
  cloudy: 'Nublado',
  rain: 'Lluvia',
  storm: 'Tormenta',
  snow: 'Nieve',
  fog: 'Niebla',
}

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  tecnologia: 'Tecnología',
  economia: 'Economía',
  clima: 'Clima',
  politica: 'Política',
  ciencia: 'Ciencia',
  deportes: 'Deportes',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  administrador: 'Administrador',
  analista: 'Analista',
  lector: 'Lector',
}

export const USER_ROLE_COLORS: Record<UserRole, string> = {
  administrador: 'geekblue',
  analista: 'purple',
  lector: 'default',
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  pendiente: 'Pendiente',
}

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  activo: 'success',
  inactivo: 'default',
  pendiente: 'warning',
}

/**
 * Paletas categóricas de las gráficas, en orden fijo: la serie N siempre usa
 * el color N, nunca se cicla ni se reasigna al filtrar. Ambas variantes están
 * validadas para daltonismo (protanopía/deuteranopía/tritanopía) y contraste
 * mínimo 3:1 contra su superficie; la versión oscura es una selección propia,
 * no una inversión automática de la clara.
 */
export const CHART_PALETTE_LIGHT = [
  '#1677ff',
  '#d46b08',
  '#08979c',
  '#722ed1',
  '#389e0d',
  '#c41d7f',
  '#ad6800',
  '#1d39c4',
] as const

export const CHART_PALETTE_DARK = [
  '#3384ff',
  '#d16800',
  '#089ca1',
  '#9860fe',
  '#3da317',
  '#e13f97',
  '#bd771e',
  '#527eff',
] as const

/** Colores de estado: reservados, nunca se reutilizan como color de serie. */
export const SEMANTIC_COLORS = {
  positive: '#389e0d',
  negative: '#cf1322',
  neutral: '#8c8c8c',
} as const

export const SEMANTIC_COLORS_DARK = {
  positive: '#5bbf2d',
  negative: '#ff6b6b',
  neutral: '#a6a6a6',
} as const
