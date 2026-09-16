import type { TimeSeriesPoint } from './common'

/** Condición atmosférica normalizada (independiente del proveedor). */
export type WeatherCondition =
  'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog'

export interface City {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  timezone: string
}

export interface CurrentWeather {
  cityId: string
  observedAt: string
  temperature: number
  feelsLike: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  uvIndex: number
  visibility: number
  condition: WeatherCondition
}

export interface HourlyForecast {
  time: string
  temperature: number
  precipitationProbability: number
  condition: WeatherCondition
}

export interface DailyForecast {
  date: string
  min: number
  max: number
  precipitationProbability: number
  condition: WeatherCondition
}

export interface WeatherForecast {
  cityId: string
  hourly: HourlyForecast[]
  daily: DailyForecast[]
}

export interface WeatherHistory {
  cityId: string
  temperature: TimeSeriesPoint[]
  humidity: TimeSeriesPoint[]
}
