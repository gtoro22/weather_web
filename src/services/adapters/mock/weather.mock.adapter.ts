import type { WeatherRepository } from '@/services/repositories'
import type { City, CurrentWeather, TimeRange, WeatherForecast, WeatherHistory } from '@/types'
import { DataSourceError } from '@/types'
import { generateSeries, simulateNetwork } from '@/utils'
import {
  buildCurrentWeather,
  buildDailyForecast,
  buildHourlyForecast,
  MOCK_CITIES,
  WEATHER_BASE_PROFILE,
} from '@/modules/weather/mocks/weather.mock'

export class MockWeatherAdapter implements WeatherRepository {
  async listCities(): Promise<City[]> {
    await simulateNetwork('el listado de ciudades')
    return MOCK_CITIES
  }

  async getCurrent(cityId: string): Promise<CurrentWeather> {
    await simulateNetwork('el clima actual')
    this.assertCity(cityId)
    return buildCurrentWeather(cityId)
  }

  async getForecast(cityId: string): Promise<WeatherForecast> {
    await simulateNetwork('el pronóstico')
    this.assertCity(cityId)
    return {
      cityId,
      hourly: buildHourlyForecast(cityId),
      daily: buildDailyForecast(cityId),
    }
  }

  async getHistory(cityId: string, range: TimeRange): Promise<WeatherHistory> {
    await simulateNetwork('el histórico de clima')
    this.assertCity(cityId)
    const profile = WEATHER_BASE_PROFILE(cityId)
    return {
      cityId,
      temperature: generateSeries(`temp:${cityId}`, range, {
        base: profile.base,
        volatility: profile.amplitude / 3,
        decimals: 1,
      }),
      humidity: generateSeries(`hum:${cityId}`, range, {
        base: profile.humidity,
        volatility: 6,
        min: 15,
        max: 100,
        decimals: 0,
      }),
    }
  }

  private assertCity(cityId: string): void {
    if (!MOCK_CITIES.some((city) => city.id === cityId)) {
      throw new DataSourceError(`La ciudad "${cityId}" no existe`, {
        code: 'NOT_FOUND',
        status: 404,
      })
    }
  }
}
