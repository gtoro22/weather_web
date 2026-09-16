import type { NewsArticle } from '@/types'

/**
 * Imagen placeholder generada en SVG y embebida como data URI: evita
 * dependencias de red en modo mock y mantiene el repositorio sin binarios.
 */
export function placeholderImage(seed: string, label: string): string {
  const palette = ['#1677ff', '#13c2c2', '#722ed1', '#fa8c16', '#52c41a', '#eb2f96']
  const color = palette[seed.charCodeAt(0) % palette.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#0b1b33"/>
    </linearGradient></defs>
    <rect width="640" height="360" fill="url(#g)"/>
    <text x="32" y="320" font-family="Segoe UI, Arial, sans-serif" font-size="30"
          fill="#ffffff" opacity="0.92">${label}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString()
}

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'n01',
    title: 'Los modelos de predicción climática reducen su margen de error a 48 horas',
    summary:
      'Un consorcio de centros meteorológicos publicó resultados que recortan a la mitad el error de pronóstico a dos días vista en zonas tropicales.',
    source: 'Meteo Global',
    publishedAt: hoursAgo(2),
    category: 'clima',
    imageUrl: placeholderImage('n01', 'Clima'),
    url: 'https://example.com/noticias/prediccion-climatica',
  },
  {
    id: 'n02',
    title: 'Novatek Systems presenta su nueva arquitectura de cómputo distribuido',
    summary:
      'La compañía anunció una plataforma que promete triplicar el rendimiento por vatio en cargas de inferencia.',
    source: 'Tech Ledger',
    publishedAt: hoursAgo(4),
    category: 'tecnologia',
    imageUrl: placeholderImage('n02', 'Tecnología'),
    url: 'https://example.com/noticias/novatek-arquitectura',
  },
  {
    id: 'n03',
    title: 'El índice Insight 50 encadena su tercera semana en positivo',
    summary:
      'El repunte se apoya en los sectores de consumo y tecnología, mientras energía sigue arrastrando pérdidas.',
    source: 'Mercado Diario',
    publishedAt: hoursAgo(6),
    category: 'economia',
    imageUrl: placeholderImage('n03', 'Economía'),
  },
  {
    id: 'n04',
    title: 'Aprobado el paquete de inversión en infraestructura de red',
    summary:
      'El plan destina fondos a ampliar la cobertura de banda ancha en zonas rurales durante los próximos cinco años.',
    source: 'Agenda Pública',
    publishedAt: hoursAgo(9),
    category: 'politica',
    imageUrl: placeholderImage('n04', 'Política'),
  },
  {
    id: 'n05',
    title: 'Un estudio vincula la calidad del aire urbano con el rendimiento cognitivo',
    summary:
      'La investigación siguió a 12.000 participantes durante cuatro años en catorce ciudades de tamaño medio.',
    source: 'Revista Ciencia Abierta',
    publishedAt: hoursAgo(12),
    category: 'ciencia',
    imageUrl: placeholderImage('n05', 'Ciencia'),
  },
  {
    id: 'n06',
    title: 'Helix Energy revisa a la baja su previsión anual de producción',
    summary:
      'La empresa atribuye el ajuste al retraso de dos proyectos offshore y a los costes logísticos.',
    source: 'Mercado Diario',
    publishedAt: hoursAgo(14),
    category: 'economia',
    imageUrl: placeholderImage('n06', 'Economía'),
  },
  {
    id: 'n07',
    title: 'La ola de calor adelanta la temporada de riego en el sur peninsular',
    summary:
      'Las temperaturas máximas superan en seis grados la media histórica para estas fechas.',
    source: 'Meteo Global',
    publishedAt: hoursAgo(18),
    category: 'clima',
    imageUrl: placeholderImage('n07', 'Clima'),
  },
  {
    id: 'n08',
    title: 'Nueva normativa de interoperabilidad para plataformas de mensajería',
    summary:
      'El texto obliga a los servicios de mayor tamaño a ofrecer interfaces abiertas antes de fin de año.',
    source: 'Agenda Pública',
    publishedAt: hoursAgo(22),
    category: 'politica',
    imageUrl: placeholderImage('n08', 'Política'),
  },
  {
    id: 'n09',
    title: 'El torneo continental cierra con récord de asistencia',
    summary:
      'La organización confirmó más de 1,2 millones de espectadores presenciales a lo largo de tres semanas.',
    source: 'Deporte Total',
    publishedAt: hoursAgo(26),
    category: 'deportes',
    imageUrl: placeholderImage('n09', 'Deportes'),
  },
  {
    id: 'n10',
    title: 'Vitalis Health obtiene autorización para su terapia de segunda línea',
    summary:
      'El visto bueno regulatorio abre la puerta a la comercialización en once mercados adicionales.',
    source: 'Salud Hoy',
    publishedAt: hoursAgo(30),
    category: 'ciencia',
    imageUrl: placeholderImage('n10', 'Ciencia'),
  },
  {
    id: 'n11',
    title: 'Las herramientas de observabilidad se consolidan como prioridad de inversión',
    summary:
      'Siete de cada diez equipos de plataforma declaran haber aumentado su presupuesto en esta categoría.',
    source: 'Tech Ledger',
    publishedAt: hoursAgo(34),
    category: 'tecnologia',
    imageUrl: placeholderImage('n11', 'Tecnología'),
  },
  {
    id: 'n12',
    title: 'Meridian Bank ajusta su previsión de márgenes para el próximo trimestre',
    summary:
      'La entidad anticipa una compresión moderada si el escenario de tipos se mantiene estable.',
    source: 'Mercado Diario',
    publishedAt: hoursAgo(38),
    category: 'economia',
    imageUrl: placeholderImage('n12', 'Economía'),
  },
  {
    id: 'n13',
    title: 'Un sistema de alerta temprana reduce los daños por inundación en cuencas urbanas',
    summary:
      'El piloto combina sensores de caudal con modelos de precipitación de alta resolución.',
    source: 'Meteo Global',
    publishedAt: hoursAgo(44),
    category: 'clima',
    imageUrl: placeholderImage('n13', 'Clima'),
  },
  {
    id: 'n14',
    title: 'Casa Retail abre su primer centro logístico automatizado',
    summary:
      'La instalación procesará hasta 40.000 pedidos diarios y dará servicio a toda la región norte.',
    source: 'Mercado Diario',
    publishedAt: hoursAgo(50),
    category: 'economia',
    imageUrl: placeholderImage('n14', 'Economía'),
  },
  {
    id: 'n15',
    title: 'La liga anuncia cambios en el calendario para la próxima temporada',
    summary:
      'El nuevo formato reduce los desplazamientos largos y concentra los partidos en bloques regionales.',
    source: 'Deporte Total',
    publishedAt: hoursAgo(56),
    category: 'deportes',
    imageUrl: placeholderImage('n15', 'Deportes'),
  },
  {
    id: 'n16',
    title: 'Avance en materiales superconductores a temperatura moderada',
    summary: 'El equipo reporta resultados reproducibles en tres laboratorios independientes.',
    source: 'Revista Ciencia Abierta',
    publishedAt: hoursAgo(62),
    category: 'ciencia',
    imageUrl: placeholderImage('n16', 'Ciencia'),
  },
  {
    id: 'n17',
    title: 'Adopción creciente de TypeScript en equipos de producto',
    summary:
      'El informe anual sitúa el tipado estático como el factor que más reduce los errores en producción.',
    source: 'Tech Ledger',
    publishedAt: hoursAgo(70),
    category: 'tecnologia',
    imageUrl: placeholderImage('n17', 'Tecnología'),
  },
  {
    id: 'n18',
    title: 'Acuerdo marco para la gestión compartida de recursos hídricos',
    summary:
      'Cinco administraciones firman un protocolo conjunto de medición y reparto en periodos de sequía.',
    source: 'Agenda Pública',
    publishedAt: hoursAgo(78),
    category: 'politica',
    imageUrl: placeholderImage('n18', 'Política'),
  },
]
