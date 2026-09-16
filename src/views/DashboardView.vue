<script setup lang="ts">
/**
 * Vista agregada. Demuestra la composición por slots: `BasePageLayout` aporta
 * el marco, `ChartCard` cada gráfica con sus filtros y leyenda, y
 * `DashboardWidget` los bloques no gráficos.
 */
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { BasePageLayout, ChartCard, DashboardWidget } from '@/components/common'
import { AsyncSection, KpiCard, TrendTag } from '@/components/ui'
import { BarSeriesChart, DonutChart, LineSeriesChart, RadarChart } from '@/components/charts'
import { useDashboard } from '@/modules/dashboard/composables/useDashboard'
import { useWeather } from '@/modules/weather/composables/useWeather'
import { useUiStore } from '@/stores'
import { TIME_RANGE_OPTIONS, WEATHER_CONDITION_LABELS } from '@/constants'
import {
  formatCompact,
  formatDateTime,
  formatNumber,
  formatRelative,
  formatTemperature,
} from '@/utils'
import type { TimeRange } from '@/types'

const { cityId, cities, cityOptions } = useWeather()
const range = ref<TimeRange>('week')

const dashboard = useDashboard(
  () => cityId.value,
  () => range.value,
)

const ui = useUiStore()
const { lastUpdatedAt } = storeToRefs(ui)

const radarIndicators = [
  { name: 'Temperatura', max: 100 },
  { name: 'Humedad', max: 100 },
  { name: 'Viento', max: 100 },
  { name: 'Volatilidad', max: 100 },
  { name: 'Alcistas', max: 100 },
]

const radarSeries = computed(() =>
  dashboard.radarValues.value.length
    ? [{ name: 'Índice compuesto', values: dashboard.radarValues.value }]
    : [],
)
</script>

<template>
  <BasePageLayout
    title="Dashboard"
    subtitle="Resumen operativo de clima, mercados y actualidad"
    :breadcrumbs="[{ label: 'Inicio', to: '/dashboard' }, { label: 'Dashboard' }]"
  >
    <template #toolbar>
      <span class="updated">Última actualización: {{ formatRelative(lastUpdatedAt) }}</span>
      <a-button :loading="dashboard.weather.isLoading.value" @click="dashboard.refreshAll()">
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
        style="min-width: 220px"
        aria-label="Seleccionar ciudad"
        show-search
        option-filter-prop="label"
      />
      <a-button v-if="cities.error.value" danger @click="cities.refresh()">
        Recargar ciudades
      </a-button>
      <a-segmented
        v-model:value="range"
        :options="[...TIME_RANGE_OPTIONS]"
        aria-label="Rango temporal"
      />
    </template>

    <!-- KPIs. El scoped slot `value` deja el formato en manos de cada tarjeta. -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :xl="6">
        <KpiCard
          label="Temperatura actual"
          :value="dashboard.weather.data.value?.temperature ?? 0"
          :loading="dashboard.weather.isLoading.value"
          :precision="1"
        >
          <template #value="{ value }">{{ formatTemperature(value) }}</template>
          <template #caption>
            {{
              dashboard.weather.data.value
                ? WEATHER_CONDITION_LABELS[dashboard.weather.data.value.condition]
                : ''
            }}
          </template>
        </KpiCard>
      </a-col>

      <a-col :xs="24" :sm="12" :xl="6">
        <KpiCard
          label="Insight Index 50"
          :value="dashboard.market.data.value?.indexValue ?? 0"
          :delta="dashboard.market.data.value?.indexChangePercent ?? null"
          :loading="dashboard.market.isLoading.value"
        />
      </a-col>

      <a-col :xs="24" :sm="12" :xl="6">
        <KpiCard
          label="Volumen negociado"
          :value="dashboard.market.data.value?.totalVolume ?? 0"
          :loading="dashboard.market.isLoading.value"
        >
          <template #value="{ value }">{{ formatCompact(value) }}</template>
          <template #caption>acciones en la sesión</template>
        </KpiCard>
      </a-col>

      <a-col :xs="24" :sm="12" :xl="6">
        <KpiCard
          label="Noticias recientes"
          :value="
            dashboard.newsDistribution.data.value?.reduce((sum, item) => sum + item.count, 0) ?? 0
          "
          :loading="dashboard.newsDistribution.isLoading.value"
          :precision="0"
        >
          <template #caption>titulares en las últimas 72 h</template>
        </KpiCard>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :xl="14">
        <ChartCard
          title="Evolución de la temperatura"
          :description="`Histórico para la ciudad seleccionada`"
          :loading="dashboard.weatherHistory.isLoading.value"
          :error="dashboard.weatherHistory.error.value"
          :empty="dashboard.temperatureSeries.value.length === 0"
          :height="300"
          @retry="dashboard.weatherHistory.refresh()"
        >
          <LineSeriesChart
            :series="dashboard.temperatureSeries.value"
            :range="range"
            unit="°C"
            area
            aria-label="Gráfica de línea con la evolución de la temperatura"
          />
          <template #footer>Fuente: proveedor de clima simulado.</template>
        </ChartCard>
      </a-col>

      <a-col :xs="24" :xl="10">
        <ChartCard
          title="Índice financiero"
          description="Insight Index 50"
          :loading="dashboard.indexSeries.isLoading.value"
          :error="dashboard.indexSeries.error.value"
          :empty="dashboard.indexPriceSeries.value.length === 0"
          :height="300"
          @retry="dashboard.indexSeries.refresh()"
        >
          <template #header>
            <div class="chart-head">
              <span class="chart-head__title">Índice financiero</span>
              <TrendTag :value="dashboard.market.data.value?.indexChangePercent ?? 0" />
            </div>
          </template>
          <LineSeriesChart
            :series="dashboard.indexPriceSeries.value"
            :range="range"
            area
            aria-label="Gráfica de área con la evolución del índice financiero"
          />
        </ChartCard>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="8">
        <ChartCard
          title="Rendimiento por sector"
          description="Variación acumulada del año"
          :loading="dashboard.sectors.isLoading.value"
          :error="dashboard.sectors.error.value"
          :empty="dashboard.sectorBars.value.length === 0"
          :height="280"
          @retry="dashboard.sectors.refresh()"
        >
          <BarSeriesChart
            :data="dashboard.sectorBars.value"
            unit="%"
            diverging
            horizontal
            :height="280"
            aria-label="Gráfica de barras del rendimiento por sector"
          />
          <template #legend>
            <span class="legend">Verde: rendimiento positivo · Rojo: negativo</span>
          </template>
        </ChartCard>
      </a-col>

      <a-col :xs="24" :lg="8">
        <ChartCard
          title="Noticias por categoría"
          description="Distribución de los titulares"
          :loading="dashboard.newsDistribution.isLoading.value"
          :error="dashboard.newsDistribution.error.value"
          :empty="dashboard.newsDonut.value.length === 0"
          :height="280"
          @retry="dashboard.newsDistribution.refresh()"
        >
          <DonutChart
            :data="dashboard.newsDonut.value"
            center-label="noticias"
            :height="280"
            aria-label="Gráfica de dona con la distribución de noticias por categoría"
          />
        </ChartCard>
      </a-col>

      <a-col :xs="24" :lg="8">
        <ChartCard
          title="Métricas resumidas"
          description="Valores normalizados de 0 a 100"
          :loading="dashboard.weather.isLoading.value || dashboard.market.isLoading.value"
          :error="dashboard.market.error.value"
          :empty="radarSeries.length === 0"
          :height="280"
          @retry="dashboard.refreshAll()"
        >
          <RadarChart
            :indicators="radarIndicators"
            :series="radarSeries"
            :height="280"
            aria-label="Gráfica de radar con las métricas resumidas"
          />
        </ChartCard>
      </a-col>
    </a-row>

    <DashboardWidget title="Noticias recientes">
      <template #actions>
        <RouterLink to="/news">Ver todas</RouterLink>
      </template>

      <AsyncSection
        :data="dashboard.news.data.value"
        :status="dashboard.news.status.value"
        :error="dashboard.news.error.value"
        :empty="dashboard.news.isEmpty.value"
        empty-text="No hay titulares disponibles"
        @retry="dashboard.news.refresh()"
      >
        <!-- Scoped slot: `articles` llega ya cargado y sin nulos. -->
        <template #default="{ data: articles }">
          <a-list :data-source="articles" item-layout="horizontal">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="item.summary">
                  <template #title>{{ item.title }}</template>
                  <template #avatar>
                    <a-avatar shape="square" :size="48" :src="item.imageUrl" :alt="item.title" />
                  </template>
                </a-list-item-meta>
                <template #extra>
                  <div class="news-meta">
                    <a-tag>{{ item.source }}</a-tag>
                    <span>{{ formatDateTime(item.publishedAt) }}</span>
                  </div>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </template>
      </AsyncSection>

      <template #footer>
        <span class="legend">
          Volatilidad media del mercado:
          {{ formatNumber(dashboard.market.data.value?.volatility ?? 0, 2) }}%
        </span>
      </template>
    </DashboardWidget>
  </BasePageLayout>
</template>

<style scoped>
.updated {
  color: var(--app-text-secondary);
  font-size: 12px;
}

.chart-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-head__title {
  font-size: 15px;
  font-weight: 600;
}

.legend {
  color: var(--app-text-secondary);
  font-size: 12px;
}

.news-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  color: var(--app-text-secondary);
  font-size: 12px;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .news-meta {
    display: none;
  }
}
</style>
