<script setup lang="ts">
import { computed } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { BasePageLayout, ChartCard, DashboardWidget } from '@/components/common'
import { AsyncSection, KpiCard } from '@/components/ui'
import { LineSeriesChart, BarSeriesChart } from '@/components/charts'
import { useWeather } from '@/modules/weather/composables/useWeather'
import { WEATHER_CONDITION_LABELS } from '@/constants'
import { formatDate, formatDateTime, formatTemperature, formatTime } from '@/utils'

const {
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
} = useWeather()

/** Probabilidad de precipitación por día, para la gráfica de barras. */
const precipitationByDay = computed(() =>
  (forecast.data.value?.daily ?? []).map((day) => ({
    label: formatDate(day.date, 'ddd'),
    value: day.precipitationProbability,
  })),
)

const conditionLabel = computed(() =>
  current.data.value ? WEATHER_CONDITION_LABELS[current.data.value.condition] : '',
)
</script>

<template>
  <BasePageLayout
    title="Clima"
    :subtitle="
      selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : 'Selecciona una ciudad'
    "
    :breadcrumbs="[{ label: 'Inicio', to: '/dashboard' }, { label: 'Clima' }]"
  >
    <template #toolbar>
      <a-button :loading="current.isLoading.value" @click="refreshAll()">
        <template #icon><ReloadOutlined /></template>
        Actualizar
      </a-button>
    </template>

    <template #filters>
      <a-select
        v-model:value="cityId"
        :options="cityOptions"
        :loading="cities.isLoading.value"
        :status="cities.error.value ? 'error' : undefined"
        style="min-width: 240px"
        aria-label="Seleccionar ciudad"
        show-search
        option-filter-prop="label"
      />
      <a-button v-if="cities.error.value" danger @click="cities.refresh()">
        Recargar ciudades
      </a-button>
      <a-segmented v-model:value="range" :options="[...rangeOptions]" aria-label="Rango temporal" />
    </template>

    <a-alert
      v-if="current.error.value"
      type="error"
      show-icon
      :message="current.error.value"
      class="alert"
    >
      <template #action>
        <a-button size="small" @click="current.refresh()">Reintentar</a-button>
      </template>
    </a-alert>

    <a-row :gutter="[16, 16]">
      <a-col :xs="12" :md="6">
        <KpiCard
          label="Temperatura"
          :value="current.data.value?.temperature ?? 0"
          :loading="current.isLoading.value"
          :precision="1"
        >
          <template #value="{ value }">{{ formatTemperature(value) }}</template>
          <template #caption>{{ conditionLabel }}</template>
        </KpiCard>
      </a-col>
      <a-col :xs="12" :md="6">
        <KpiCard
          label="Sensación térmica"
          :value="current.data.value?.feelsLike ?? 0"
          :loading="current.isLoading.value"
          :precision="1"
        >
          <template #value="{ value }">{{ formatTemperature(value) }}</template>
        </KpiCard>
      </a-col>
      <a-col :xs="12" :md="6">
        <KpiCard
          label="Humedad"
          :value="current.data.value?.humidity ?? 0"
          suffix="%"
          :precision="0"
          :loading="current.isLoading.value"
        />
      </a-col>
      <a-col :xs="12" :md="6">
        <KpiCard
          label="Viento"
          :value="current.data.value?.windSpeed ?? 0"
          suffix=" km/h"
          :precision="1"
          :loading="current.isLoading.value"
        />
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :xl="16">
        <ChartCard
          title="Tendencia histórica de temperatura"
          description="Serie generada según el rango seleccionado"
          :loading="history.isLoading.value"
          :error="history.error.value"
          :empty="temperatureSeries.length === 0"
          @retry="history.refresh()"
        >
          <LineSeriesChart
            :series="temperatureSeries"
            :range="range"
            unit="°C"
            area
            aria-label="Gráfica de línea con el histórico de temperatura"
          />
        </ChartCard>
      </a-col>

      <a-col :xs="24" :xl="8">
        <DashboardWidget title="Condiciones actuales" :loading="current.isLoading.value">
          <a-descriptions :column="1" size="small" bordered>
            <a-descriptions-item label="Presión">
              {{ current.data.value?.pressure ?? '—' }} hPa
            </a-descriptions-item>
            <a-descriptions-item label="Visibilidad">
              {{ current.data.value?.visibility ?? '—' }} km
            </a-descriptions-item>
            <a-descriptions-item label="Índice UV">
              {{ current.data.value?.uvIndex ?? '—' }}
            </a-descriptions-item>
            <a-descriptions-item label="Dirección del viento">
              {{ current.data.value?.windDirection ?? '—' }}°
            </a-descriptions-item>
            <a-descriptions-item label="Observado">
              {{ current.data.value ? formatDateTime(current.data.value.observedAt) : '—' }}
            </a-descriptions-item>
          </a-descriptions>
        </DashboardWidget>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :xl="12">
        <ChartCard
          title="Pronóstico por hora"
          description="Próximas 24 horas"
          :loading="forecast.isLoading.value"
          :error="forecast.error.value"
          :empty="hourlySeries.length === 0"
          @retry="forecast.refresh()"
        >
          <LineSeriesChart
            :series="hourlySeries"
            range="day"
            unit="°C"
            aria-label="Gráfica de línea con el pronóstico horario"
          />
        </ChartCard>
      </a-col>

      <a-col :xs="24" :xl="12">
        <ChartCard
          title="Probabilidad de precipitación"
          description="Próximos 7 días"
          :loading="forecast.isLoading.value"
          :error="forecast.error.value"
          :empty="precipitationByDay.length === 0"
          @retry="forecast.refresh()"
        >
          <BarSeriesChart
            :data="precipitationByDay"
            unit="%"
            aria-label="Gráfica de barras con la probabilidad de precipitación diaria"
          />
        </ChartCard>
      </a-col>
    </a-row>

    <ChartCard
      title="Humedad relativa"
      description="Evolución en el rango seleccionado"
      :loading="history.isLoading.value"
      :error="history.error.value"
      :empty="humiditySeries.length === 0"
      :height="240"
      @retry="history.refresh()"
    >
      <LineSeriesChart
        :series="humiditySeries"
        :range="range"
        unit="%"
        :height="240"
        aria-label="Gráfica de línea con la evolución de la humedad"
      />
    </ChartCard>

    <DashboardWidget title="Pronóstico extendido">
      <AsyncSection
        :data="forecast.data.value"
        :status="forecast.status.value"
        :error="forecast.error.value"
        @retry="forecast.refresh()"
      >
        <!-- Scoped slot: el pronóstico llega resuelto y tipado. -->
        <template #default="{ data }">
          <a-row :gutter="[12, 12]">
            <a-col v-for="day in data.daily" :key="day.date" :xs="12" :sm="8" :lg="6" :xxl="3">
              <a-card size="small" class="day">
                <p class="day__name">{{ formatDate(day.date, 'ddd DD MMM') }}</p>
                <p class="day__condition">{{ WEATHER_CONDITION_LABELS[day.condition] }}</p>
                <p class="day__temps">
                  <strong>{{ formatTemperature(day.max) }}</strong>
                  <span>{{ formatTemperature(day.min) }}</span>
                </p>
                <a-progress
                  :percent="day.precipitationProbability"
                  size="small"
                  :show-info="false"
                  status="active"
                />
                <p class="day__rain">{{ day.precipitationProbability }}% de lluvia</p>
              </a-card>
            </a-col>
          </a-row>
        </template>
      </AsyncSection>
      <template #footer>
        <span class="legend">
          Primera hora del pronóstico:
          {{
            forecast.data.value?.hourly[0] ? formatTime(forecast.data.value.hourly[0].time) : '—'
          }}
        </span>
      </template>
    </DashboardWidget>
  </BasePageLayout>
</template>

<style scoped>
.alert {
  margin-bottom: 4px;
}

.day__name {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.day__condition {
  margin: 2px 0 8px;
  color: var(--app-text-secondary);
  font-size: 12px;
}

.day__temps {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 15px;
}

.day__temps span {
  color: var(--app-text-secondary);
  font-size: 13px;
}

.day__rain {
  margin: 4px 0 0;
  color: var(--app-text-secondary);
  font-size: 11px;
}

.legend {
  color: var(--app-text-secondary);
  font-size: 12px;
}
</style>
