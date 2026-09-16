import { ref } from 'vue'
import type { TimeRange } from '@/types'
import { TIME_RANGE_OPTIONS } from '@/constants'

/** Estado compartido del filtro día/semana/mes/año que usan las gráficas. */
export function useTimeRange(initial: TimeRange = 'week') {
  const range = ref<TimeRange>(initial)

  function setRange(value: TimeRange): void {
    range.value = value
  }

  return { range, setRange, options: TIME_RANGE_OPTIONS }
}
