import type { City, CurrentWeather, TimeRange, WeatherForecast, WeatherHistory } from '@/types'
import { toDataSourceError } from '@/types'
import { getRepositories } from './data-source.factory'

/**
 * Servicio de dominio: añade caché ligera y normalización de errores sobre el
 * repositorio activo. Los stores y composables hablan con el servicio, nunca
 * con el adaptador directamente.
 */
class WeatherServiceImpl {
  private citiesCache: City[] | null = null

  async getCities(): Promise<City[]> {
    if (this.citiesCache) return this.citiesCache
    try {
      this.citiesCache = await getRepositories().weather.listCities()
      return this.citiesCache
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async getCurrent(cityId: string): Promise<CurrentWeather> {
    try {
      return await getRepositories().weather.getCurrent(cityId)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async getForecast(cityId: string): Promise<WeatherForecast> {
    try {
      return await getRepositories().weather.getForecast(cityId)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async getHistory(cityId: string, range: TimeRange): Promise<WeatherHistory> {
    try {
      return await getRepositories().weather.getHistory(cityId, range)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  /** La caché depende del backend activo: cambiar de modo la invalida. */
  invalidate(): void {
    this.citiesCache = null
  }
}

export const WeatherService = new WeatherServiceImpl()
