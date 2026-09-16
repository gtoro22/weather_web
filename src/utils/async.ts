import { DataSourceError } from '@/types'
import { env } from '@/config'

/**
 * Tasa de error simulada en caliente. Arranca con el valor del `.env` pero la
 * pantalla de configuración puede cambiarla sin recargar, que es justo lo que
 * permite probar los estados de error desde la propia interfaz.
 */
let runtimeErrorRate = env.mockErrorRate

export function setMockErrorRate(rate: number): void {
  runtimeErrorRate = Math.min(1, Math.max(0, rate))
}

export function getMockErrorRate(): number {
  return runtimeErrorRate
}

/** Espera artificial usada por los adaptadores mock para ejercitar skeletons. */
export function delay(ms = env.mockLatencyMs): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Simula la latencia y, con probabilidad `errorRate`, un fallo de red.
 * Así el modo mock permite probar los estados de carga y de error sin backend.
 *
 * @param label Nombre del recurso, usado en el mensaje de error.
 */
export async function simulateNetwork(label: string, errorRate = runtimeErrorRate): Promise<void> {
  await delay()
  if (errorRate > 0 && Math.random() < errorRate) {
    throw new DataSourceError(
      `No se pudo obtener ${label}. Revisa tu conexión e inténtalo de nuevo.`,
      { code: 'NETWORK_ERROR', status: 503 },
    )
  }
}
