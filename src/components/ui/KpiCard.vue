<script setup lang="ts">
/**
 * Tarjeta KPI. El valor se expone por un **scoped slot** (`value`) que recibe
 * el número crudo, de modo que cada módulo lo formatee como necesite
 * (moneda, temperatura, porcentaje) sin que la tarjeta conozca el dominio.
 */
import { computed } from 'vue'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons-vue'
import { formatNumber, formatPercent } from '@/utils'

const props = withDefaults(
  defineProps<{
    label: string
    value: number
    delta?: number | null
    suffix?: string
    loading?: boolean
    precision?: number
  }>(),
  { delta: null, suffix: '', loading: false, precision: 2 },
)

const trend = computed<'up' | 'down' | 'flat'>(() => {
  if (props.delta === null || props.delta === 0) return 'flat'
  return props.delta > 0 ? 'up' : 'down'
})
</script>

<template>
  <a-card class="kpi" :body-style="{ padding: '16px' }">
    <a-skeleton v-if="loading" active :title="false" :paragraph="{ rows: 2 }" />
    <template v-else>
      <div class="kpi__label">
        <slot name="label">{{ label }}</slot>
      </div>

      <div class="kpi__value">
        <!-- Scoped slot: el consumidor decide el formato del número. -->
        <slot name="value" :value="value" :suffix="suffix">
          {{ formatNumber(value, precision) }}<span class="kpi__suffix">{{ suffix }}</span>
        </slot>
      </div>

      <div v-if="delta !== null" class="kpi__delta" :class="`kpi__delta--${trend}`">
        <ArrowUpOutlined v-if="trend === 'up'" aria-hidden="true" />
        <ArrowDownOutlined v-else-if="trend === 'down'" aria-hidden="true" />
        <span>{{ formatPercent(delta) }}</span>
        <span class="kpi__delta-caption"><slot name="caption">vs. periodo anterior</slot></span>
      </div>

      <div v-if="$slots.footer" class="kpi__footer"><slot name="footer" /></div>
    </template>
  </a-card>
</template>

<style scoped>
.kpi {
  height: 100%;
}

.kpi__label {
  color: var(--app-text-secondary);
  font-size: 13px;
}

.kpi__value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
}

.kpi__suffix {
  margin-left: 3px;
  color: var(--app-text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.kpi__delta {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
}

.kpi__delta--up {
  color: var(--app-positive);
}

.kpi__delta--down {
  color: var(--app-negative);
}

.kpi__delta--flat {
  color: var(--app-text-secondary);
}

.kpi__delta-caption {
  color: var(--app-text-secondary);
  font-weight: 400;
}

.kpi__footer {
  margin-top: 10px;
}
</style>
