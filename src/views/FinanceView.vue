<script setup lang="ts">
import { computed } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { BasePageLayout, ChartCard, DataTableContainer } from '@/components/common'
import { KpiCard, TrendTag } from '@/components/ui'
import { BarSeriesChart, DonutChart, LineSeriesChart } from '@/components/charts'
import { useFinance } from '@/modules/finance/composables/useFinance'
import { formatCompact, formatCurrency, formatNumber } from '@/utils'
import type { Asset } from '@/types'

const {
  assetId,
  range,
  rangeOptions,
  assets,
  assetOptions,
  selectedAsset,
  summary,
  sectors,
  series,
  priceSeries,
  changeComparison,
  sectorDistribution,
  refreshAll,
} = useFinance()

const columns = [
  { title: 'Símbolo', dataIndex: 'symbol', key: 'symbol', width: 110 },
  { title: 'Nombre', dataIndex: 'name', key: 'name' },
  { title: 'Sector', dataIndex: 'sector', key: 'sector', width: 130 },
  { title: 'Precio', key: 'price', align: 'right' as const, width: 130 },
  { title: 'Variación', key: 'change', align: 'right' as const, width: 120 },
  { title: 'Volumen', key: 'volume', align: 'right' as const, width: 120 },
]

const assetRows = computed<Asset[]>(() => assets.data.value ?? [])
</script>

<template>
  <BasePageLayout
    title="Finanzas"
    subtitle="Indicadores simulados de mercado, sectores y activos"
    :breadcrumbs="[{ label: 'Inicio', to: '/dashboard' }, { label: 'Finanzas' }]"
  >
    <template #toolbar>
      <a-button :loading="assets.isLoading.value" @click="refreshAll()">
        <template #icon><ReloadOutlined /></template>
        Actualizar
      </a-button>
    </template>

    <template #filters>
      <a-select
        v-model:value="assetId"
        :options="assetOptions"
        :loading="assets.isLoading.value"
        style="min-width: 260px"
        aria-label="Seleccionar activo"
        show-search
        option-filter-prop="label"
      />
      <a-segmented v-model:value="range" :options="[...rangeOptions]" aria-label="Periodo" />
    </template>

    <a-row :gutter="[16, 16]">
      <a-col :xs="12" :md="6">
        <KpiCard
          label="Índice"
          :value="summary.data.value?.indexValue ?? 0"
          :delta="summary.data.value?.indexChangePercent ?? null"
          :loading="summary.isLoading.value"
        />
      </a-col>
      <a-col :xs="12" :md="6">
        <KpiCard
          label="Volumen total"
          :value="summary.data.value?.totalVolume ?? 0"
          :loading="summary.isLoading.value"
        >
          <template #value="{ value }">{{ formatCompact(value) }}</template>
          <template #caption>títulos negociados</template>
        </KpiCard>
      </a-col>
      <a-col :xs="12" :md="6">
        <KpiCard
          label="Alcistas / bajistas"
          :value="summary.data.value?.advancers ?? 0"
          :precision="0"
          :loading="summary.isLoading.value"
        >
          <template #value="{ value }">
            {{ value }} / {{ summary.data.value?.decliners ?? 0 }}
          </template>
          <template #caption>activos en la sesión</template>
        </KpiCard>
      </a-col>
      <a-col :xs="12" :md="6">
        <KpiCard
          label="Volatilidad media"
          :value="summary.data.value?.volatility ?? 0"
          suffix="%"
          :loading="summary.isLoading.value"
        />
      </a-col>
    </a-row>

    <ChartCard
      :title="selectedAsset ? `Evolución de ${selectedAsset.name}` : 'Evolución del activo'"
      :description="selectedAsset ? `${selectedAsset.symbol} · ${selectedAsset.currency}` : ''"
      :loading="series.isLoading.value"
      :error="series.error.value"
      :empty="priceSeries.length === 0"
      :height="320"
      @retry="series.refresh()"
    >
      <template #filters>
        <TrendTag v-if="selectedAsset" :value="selectedAsset.changePercent" />
      </template>

      <LineSeriesChart
        :series="priceSeries"
        :range="range"
        area
        unit=" USD"
        :height="320"
        aria-label="Gráfica de área con la evolución del precio del activo"
      />

      <template #footer>
        Precio actual:
        {{ selectedAsset ? formatCurrency(selectedAsset.price, selectedAsset.currency) : '—' }}
      </template>
    </ChartCard>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12">
        <ChartCard
          title="Variación por activo"
          description="Comparación de la sesión"
          :loading="assets.isLoading.value"
          :error="assets.error.value"
          :empty="changeComparison.length === 0"
          :height="280"
          @retry="assets.refresh()"
        >
          <BarSeriesChart
            :data="changeComparison"
            unit="%"
            diverging
            :height="280"
            aria-label="Gráfica de barras con la variación porcentual de cada activo"
          />
          <template #legend>
            <span class="legend">El color indica el signo de la variación, no el activo.</span>
          </template>
        </ChartCard>
      </a-col>

      <a-col :xs="24" :lg="12">
        <ChartCard
          title="Composición por sector"
          description="Peso en la cartera de referencia"
          :loading="sectors.isLoading.value"
          :error="sectors.error.value"
          :empty="sectorDistribution.length === 0"
          :height="280"
          @retry="sectors.refresh()"
        >
          <DonutChart
            :data="sectorDistribution"
            center-label="% cartera"
            :height="280"
            aria-label="Gráfica de dona con la composición por sector"
          />
        </ChartCard>
      </a-col>
    </a-row>

    <DataTableContainer
      title="Activos e indicadores"
      :loading="assets.isLoading.value"
      :error="assets.error.value"
      :empty="assetRows.length === 0"
      @retry="assets.refresh()"
    >
      <!-- La tabla de Ant expone sus celdas mediante scoped slots. -->
      <a-table
        :columns="columns"
        :data-source="assetRows"
        row-key="id"
        size="middle"
        :pagination="false"
        :scroll="{ x: 760 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'symbol'">
            <strong>{{ (record as Asset).symbol }}</strong>
          </template>
          <template v-else-if="column.key === 'sector'">
            <a-tag>{{ (record as Asset).sector }}</a-tag>
          </template>
          <template v-else-if="column.key === 'price'">
            {{ formatCurrency((record as Asset).price, (record as Asset).currency) }}
          </template>
          <template v-else-if="column.key === 'change'">
            <TrendTag :value="(record as Asset).changePercent" />
          </template>
          <template v-else-if="column.key === 'volume'">
            {{ formatCompact((record as Asset).volume) }}
          </template>
        </template>
      </a-table>

      <template #footer>
        <span class="legend">
          {{ assetRows.length }} activos · volatilidad media
          {{ formatNumber(summary.data.value?.volatility ?? 0, 2) }}%
        </span>
      </template>
    </DataTableContainer>
  </BasePageLayout>
</template>

<style scoped>
.legend {
  color: var(--app-text-secondary);
  font-size: 12px;
}
</style>
