import type { City, CurrentWeather, DailyForecast, HourlyForecast, WeatherCondition } from '@/types'
import { createSeededRandom, roundTo, seedFromString } from '@/utils'

export const MOCK_CITIES: City[] = [
  {
    id: 'bog',
    name: 'Bogotá',
    country: 'Colombia',
    lat: 4.711,
    lon: -74.072,
    timezone: 'America/Bogota',
  },
  {
    id: 'mex',
    name: 'Ciudad de México',
    country: 'México',
    lat: 19.433,
    lon: -99.133,
    timezone: 'America/Mexico_City',
  },
  {
    id: 'mad',
    name: 'Madrid',
    country: 'España',
    lat: 40.417,
    lon: -3.704,
    timezone: 'Europe/Madrid',
  },
  {
    id: 'bue',
    name: 'Buenos Aires',
    country: 'Argentina',
    lat: -34.604,
    lon: -58.382,
    timezone: 'America/Argentina/Buenos_Aires',
  },
  {
    id: 'lim',
    name: 'Lima',
    country: 'Perú',
    lat: -12.046,
    lon: -77.043,
    timezone: 'America/Lima',
  },
  {
    id: 'scl',
    name: 'Santiago',
    country: 'Chile',
    lat: -33.449,
    lon: -70.669,
    timezone: 'America/Santiago',
  },
  {
    id: 'nyc',
    name: 'Nueva York',
    country: 'Estados Unidos',
    lat: 40.713,
    lon: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: 'ber',
    name: 'Berlín',
    country: 'Alemania',
    lat: 52.52,
    lon: 13.405,
    timezone: 'Europe/Berlin',
  },
]

/** Perfil climático base de cada ciudad: temperatura media y amplitud diaria. */
const CITY_PROFILES: Record<
  string,
  { base: number; amplitude: number; humidity: number; conditions: WeatherCondition[] }
> = {
  bog: { base: 14, amplitude: 6, humidity: 76, conditions: ['cloudy', 'rain', 'partly-cloudy'] },
  mex: { base: 21, amplitude: 9, humidity: 54, conditions: ['sunny', 'partly-cloudy', 'rain'] },
  mad: { base: 18, amplitude: 11, humidity: 44, conditions: ['sunny', 'partly-cloudy', 'cloudy'] },
  bue: { base: 19, amplitude: 8, humidity: 66, conditions: ['partly-cloudy', 'sunny', 'storm'] },
  lim: { base: 20, amplitude: 5, humidity: 82, conditions: ['fog', 'cloudy', 'partly-cloudy'] },
  scl: { base: 17, amplitude: 12, humidity: 50, conditions: ['sunny', 'partly-cloudy', 'cloudy'] },
  nyc: { base: 12, amplitude: 9, humidity: 61, conditions: ['partly-cloudy', 'rain', 'snow'] },
  ber: { base: 9, amplitude: 7, humidity: 72, conditions: ['cloudy', 'rain', 'fog'] },
}

function profileOf(cityId: string) {
  return CITY_PROFILES[cityId] ?? CITY_PROFILES.bog
}

/** Curva diurna: mínimo hacia las 5:00 y máximo hacia las 15:00. */
function diurnalOffset(hour: number, amplitude: number): number {
  return -Math.cos(((hour - 5) / 24) * 2 * Math.PI) * (amplitude / 2)
}

export function buildCurrentWeather(cityId: string): CurrentWeather {
  const profile = profileOf(cityId)
  const random = createSeededRandom(seedFromString(`current:${cityId}`))
  const now = new Date()
  const temperature = roundTo(
    profile.base + diurnalOffset(now.getHours(), profile.amplitude) + (random() - 0.5) * 2,
    1,
  )
  const windSpeed = roundTo(4 + random() * 22, 1)

  return {
    cityId,
    observedAt: now.toISOString(),
    temperature,
    // La sensación térmica baja con el viento y sube con la humedad alta.
    feelsLike: roundTo(temperature - windSpeed * 0.08 + (profile.humidity - 60) * 0.02, 1),
    humidity: Math.round(profile.humidity + (random() - 0.5) * 12),
    pressure: Math.round(1006 + random() * 18),
    windSpeed,
    windDirection: Math.round(random() * 360),
    uvIndex: Math.round(random() * 11),
    visibility: roundTo(6 + random() * 4, 1),
    condition: profile.conditions[Math.floor(random() * profile.conditions.length)],
  }
}

export function buildHourlyForecast(cityId: string, hours = 24): HourlyForecast[] {
  const profile = profileOf(cityId)
  const random = createSeededRandom(seedFromString(`hourly:${cityId}`))
  const start = new Date()
  start.setMinutes(0, 0, 0)

  return Array.from({ length: hours }, (_, i) => {
    const time = new Date(start.getTime() + i * 3600_000)
    const precipitationProbability = Math.round(random() * 100)
    return {
      time: time.toISOString(),
      temperature: roundTo(
        profile.base + diurnalOffset(time.getHours(), profile.amplitude) + (random() - 0.5) * 1.5,
        1,
      ),
      precipitationProbability,
      condition:
        precipitationProbability > 70
          ? 'rain'
          : profile.conditions[Math.floor(random() * profile.conditions.length)],
    }
  })
}

export function buildDailyForecast(cityId: string, days = 7): DailyForecast[] {
  const profile = profileOf(cityId)
  const random = createSeededRandom(seedFromString(`daily:${cityId}`))
  const start = new Date()
  start.setHours(12, 0, 0, 0)

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(start.getTime() + i * 86_400_000)
    const mid = profile.base + (random() - 0.5) * 4
    return {
      date: date.toISOString(),
      min: roundTo(mid - profile.amplitude / 2, 1),
      max: roundTo(mid + profile.amplitude / 2, 1),
      precipitationProbability: Math.round(random() * 100),
      condition: profile.conditions[Math.floor(random() * profile.conditions.length)],
    }
  })
}

export const WEATHER_BASE_PROFILE = profileOf
