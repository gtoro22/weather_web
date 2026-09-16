import type { WeatherRepository } from '@/services/repositories'
import type { City, CurrentWeather, TimeRange, WeatherForecast, WeatherHistory } from '@/types'
import { httpClient } from '@/services/api'

/**
 * Implementación REST de referencia del dominio clima.
 *
 * Es código funcional: basta con apuntar `VITE_API_BASE_URL` a un backend que
 * exponga estos endpoints y cambiar el modo de datos a `rest` en /settings o
 * en el `.env`. Ningún componente necesita cambios, porque la vista depende
 * de `WeatherRepository` y no de esta clase.
 *
 * Endpoints esperados:
 *   GET /cities
 *   GET /weather/current?cityId=
 *   GET /weather/forecast?cityId=
 *   GET /weather/history?cityId=&range=
 *
 * Si el backend devuelve otra forma de datos, el mapeo (DTO → modelo de
 * dominio) va aquí y sólo aquí.
 */
export class RestWeatherAdapter implements WeatherRepository {
  async listCities(): Promise<City[]> {
    const { data } = await httpClient.get<City[]>('/cities')
    return data
  }

  async getCurrent(cityId: string): Promise<CurrentWeather> {
    const { data } = await httpClient.get<CurrentWeather>('/weather/current', {
      params: { cityId },
    })
    return data
  }

  async getForecast(cityId: string): Promise<WeatherForecast> {
    const { data } = await httpClient.get<WeatherForecast>('/weather/forecast', {
      params: { cityId },
    })
    return data
  }

  async getHistory(cityId: string, range: TimeRange): Promise<WeatherHistory> {
    const { data } = await httpClient.get<WeatherHistory>('/weather/history', {
      params: { cityId, range },
    })
    return data
  }
}
