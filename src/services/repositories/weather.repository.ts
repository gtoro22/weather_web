import type { City, CurrentWeather, TimeRange, WeatherForecast, WeatherHistory } from '@/types'

/**
 * Contrato del dominio clima. Cualquier backend (REST, GraphQL, Firestore,
 * API Gateway) sólo necesita implementar esta interfaz: los componentes y
 * stores nunca hablan con Axios ni con un SDK concreto.
 */
export interface WeatherRepository {
  listCities(): Promise<City[]>
  getCurrent(cityId: string): Promise<CurrentWeather>
  getForecast(cityId: string): Promise<WeatherForecast>
  getHistory(cityId: string, range: TimeRange): Promise<WeatherHistory>
}
