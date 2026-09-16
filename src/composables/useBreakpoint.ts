import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

/** Puntos de corte alineados con el sistema de rejilla de Ant Design. */
export function useBreakpoint() {
  const { width } = useWindowSize()

  const isMobile = computed(() => width.value < 768)
  const isTablet = computed(() => width.value >= 768 && width.value < 1200)
  const isDesktop = computed(() => width.value >= 1200)

  return { width, isMobile, isTablet, isDesktop }
}
