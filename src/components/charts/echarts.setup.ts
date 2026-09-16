import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, GaugeChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'

/**
 * Registro explícito de sólo los módulos que la aplicación usa. Importar
 * `echarts` completo añadiría cerca de un megabyte al bundle.
 */
export function registerECharts(): void {
  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    RadarChart,
    GaugeChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    DatasetComponent,
    MarkLineComponent,
  ])
}
