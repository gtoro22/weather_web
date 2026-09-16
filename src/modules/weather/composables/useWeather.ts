import { computed, ref } from 'vue'
import { useAsyncData, useTimeRange } from '@/composables'
import { WeatherService } from '@/services'
import { appConfig } from '@/config'
import type { TimeSeries } from '@/types'

/**
 * Estado del módulo clima: ciudad seleccionada, rango temporal y las tres
 * consultas (actual, pronóstico, histórico) que la vista necesita.
 */
export function useWeather() {
  const cityId = ref<string>(appConfig.defaultCityId)
  const { range, options: rangeOptions } = useTimeRange('week')

  const cities = useAsyncData(() => WeatherService.getCities())
  const current = useAsyncData(() => WeatherService.getCurrent(cityId.value), {
    watchSources: [cityId],
  })
  const forecast = useAsyncData(() => WeatherService.getForecast(cityId.value), {
    watchSources: [cityId],
  })
  const history = useAsyncData(() => WeatherService.getHistory(cityId.value, range.value), {
    watchSources: [cityId, range],
  })

  const cityOptions = computed(() =>
    (cities.data.value ?? []).map((city) => ({
      value: city.id,
      label: `${city.name}, ${city.country}`,
    })),
  )

  const selectedCity = computed(
    () => (cities.data.value ?? []).find((city) => city.id === cityId.value) ?? null,
  )

  const temperatureSeries = computed<TimeSeries[]>(() => {
    const points = history.data.value?.temperature ?? []
    return points.length ? [{ id: 'temp', name: 'Temperatura', points, unit: '°C' }] : []
  })

  const humiditySeries = computed<TimeSeries[]>(() => {
    const points = history.data.value?.humidity ?? []
    return points.length ? [{ id: 'hum', name: 'Humedad', points, unit: '%' }] : []
  })

  const hourlySeries = computed<TimeSeries[]>(() => {
    const hourly = forecast.data.value?.hourly ?? []
    return hourly.length
      ? [
          {
            id: 'hourly',
            name: 'Temperatura prevista',
            unit: '°C',
            points: hourly.map((item) => ({ t: item.time, v: item.temperature })),
          },
        ]
      : []
  })

  function refreshAll(): void {
    void current.refresh()
    void forecast.refresh()
    void history.refresh()
  }

  return {
    cityId,
    range,
    rangeOptions,
    cities,
    cityOptions,
    selectedCity,
    current,
    forecast,
    history,
    temperatureSeries,
    humiditySeries,
    hourlySeries,
    refreshAll,
  }
}
