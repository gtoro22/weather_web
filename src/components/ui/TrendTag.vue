<script setup lang="ts">
/** Etiqueta de variación porcentual con signo, color e icono. */
import { computed } from 'vue'
import { CaretDownOutlined, CaretUpOutlined, MinusOutlined } from '@ant-design/icons-vue'
import { formatPercent } from '@/utils'

const props = defineProps<{ value: number }>()

const direction = computed<'up' | 'down' | 'flat'>(() => {
  if (props.value === 0) return 'flat'
  return props.value > 0 ? 'up' : 'down'
})

// El texto acompaña siempre al color: la identidad nunca depende sólo del tono.
const label = computed(() => formatPercent(props.value))
</script>

<template>
  <span class="trend" :class="`trend--${direction}`">
    <CaretUpOutlined v-if="direction === 'up'" aria-hidden="true" />
    <CaretDownOutlined v-else-if="direction === 'down'" aria-hidden="true" />
    <MinusOutlined v-else aria-hidden="true" />
    {{ label }}
  </span>
</template>

<style scoped>
.trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.trend--up {
  color: var(--app-positive);
}

.trend--down {
  color: var(--app-negative);
}

.trend--flat {
  color: var(--app-text-secondary);
}
</style>
