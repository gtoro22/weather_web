# Insight Dashboard

Panel analítico construido con **Vue 3 + TypeScript** que reúne en una sola interfaz
información de **clima**, **finanzas** y **noticias**. La aplicación funciona de
principio a fin **sin backend**: todos los datos provienen de adaptadores simulados
(mock) tipados, pero la arquitectura está preparada para sustituirlos por una API
real sin tocar ni un solo componente visual.

---

## 1. Funcionalidades principales

- **Login** con correo y contraseña, más acceso simulado con Google y GitHub,
  validación de formulario, manejo de errores de autenticación y redirección.
- **Dashboard** agregado con tarjetas KPI, cinco gráficas interactivas, selector de
  ciudad, filtro de rango temporal (día, semana, mes, año), indicador de última
  actualización y bloque de noticias recientes.
- **Clima**: temperatura, sensación térmica, humedad, viento, presión, visibilidad,
  índice UV, pronóstico horario y extendido, e histórico graficado por rango.
- **Finanzas**: resumen de mercado, evolución temporal por activo, comparación de
  variaciones, composición por sector y tabla de activos.
- **Noticias**: listado en tarjetas con imagen, búsqueda por texto, filtro por
  categoría y gráfica de distribución.
- **Usuarios**: tabla con búsqueda, filtros por rol y estado, paginación y modal
  para crear, editar y consultar, con validaciones.
- **Configuración**: perfil, tema, notificaciones y selección del modo de
  integración de datos (Mock, REST, GraphQL, Firebase/Firestore, Amazon API Gateway).
- **404** con vuelta al dashboard, además de tema claro/oscuro, sidebar colapsable,
  breadcrumbs y estados de carga, vacío y error en todas las vistas.

---

## 2. Tecnologías usadas

| Tecnología | Papel en el proyecto |
|---|---|
| Vue 3 (Composition API, `<script setup>`) | Framework de interfaz |
| TypeScript | Tipado estático en toda la base de código |
| Vite | Servidor de desarrollo y empaquetado de producción |
| Vue Router | Enrutamiento y guards de rutas privadas |
| Pinia | Estado global (sesión, tema, configuración) |
| Ant Design Vue | Sistema de componentes UI (única librería visual) |
| Apache ECharts + vue-echarts | Visualización de datos |
| Axios | Cliente HTTP centralizado |
| dayjs | Formato y manipulación de fechas |
| @vueuse/core | Utilidades reactivas (tamaño de ventana) |
| ESLint + Prettier | Calidad y formato de código |

---

## 3. Versiones exactas

Probado con **Node.js 22.22.2** y **npm 10.9.7**.

### Dependencias de producción

| Paquete | Versión |
|---|---|
| vue | 3.5.42 |
| vue-router | 5.3.1 |
| pinia | 4.0.3 |
| ant-design-vue | 4.2.6 |
| @ant-design/icons-vue | 7.0.1 |
| echarts | 6.1.0 |
| vue-echarts | 8.3.0 |
| axios | 1.20.0 |
| dayjs | 1.11.23 |
| @vueuse/core | 15.0.0 |

### Dependencias de desarrollo

| Paquete | Versión |
|---|---|
| vite | 8.3.0 |
| @vitejs/plugin-vue | 6.0.9 |
| typescript | 6.0.3 |
| vue-tsc | 3.3.11 |
| eslint | 10.10.0 |
| eslint-plugin-vue | 10.11.0 |
| @typescript-eslint/eslint-plugin | 8.70.0 |
| @typescript-eslint/parser | 8.70.0 |
| @vue/eslint-config-typescript | 14.9.0 |
| @vue/eslint-config-prettier | 10.2.0 |
| prettier | 3.9.7 |
| jiti | 2.7.0 |
| @types/node | 22.20.3 |

---

## 4. Requisitos previos

- **Node.js** ≥ 20.19 (recomendado 22.x).
- **npm** ≥ 10 (o `pnpm` ≥ 9, sustituyendo `npm run` por `pnpm`).

Comprueba tu versión con:

```bash
node -v
npm -v
```

---

## 5. Instalación

```bash
git clone <url-del-repositorio>
cd weather_web
npm install
cp .env.example .env
```

---

## 6. Variables de entorno

Vite sólo expone al navegador las variables con prefijo `VITE_`. **Todo lo que
lleve ese prefijo acaba incrustado en el bundle público**, así que nunca debe
contener secretos reales (client secrets, claves privadas, tokens de servicio).

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_APP_TITLE` | Título mostrado en el header y la pestaña | `Insight Dashboard` |
| `VITE_DATA_SOURCE_MODE` | `mock`, `rest`, `graphql`, `firebase` o `aws-api-gateway` | `mock` |
| `VITE_API_BASE_URL` | URL base de la API REST | — |
| `VITE_GRAPHQL_ENDPOINT` | Endpoint GraphQL | — |
| `VITE_AWS_API_GATEWAY_URL` | URL de la etapa de API Gateway | — |
| `VITE_FIREBASE_API_KEY` | Clave pública de cliente de Firebase | — |
| `VITE_FIREBASE_PROJECT_ID` | Identificador del proyecto de Firebase | — |
| `VITE_OAUTH_GOOGLE_CLIENT_ID` | Client ID público de Google OAuth | — |
| `VITE_OAUTH_GITHUB_CLIENT_ID` | Client ID público de GitHub OAuth | — |
| `VITE_MOCK_LATENCY_MS` | Latencia artificial de los mocks, en ms | `600` |
| `VITE_MOCK_ERROR_RATE` | Probabilidad de error simulado, de 0 a 1 | `0` |

### `.env.example`

El repositorio incluye [`.env.example`](./.env.example) con todas las claves
documentadas y sin ningún valor sensible. Cópialo a `.env` para empezar.

---

## 7. Ejecución en desarrollo

```bash
npm run dev
```

La aplicación queda en <http://localhost:5173>. Credenciales de la demo:

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@insight.io` | `insight123` | Administrador |
| `analista@insight.io` | `insight123` | Analista |
| `lector@insight.io` | `insight123` | Lector |

Los botones «Continuar con Google» y «Continuar con GitHub» crean una sesión
simulada sin salir de la aplicación.

---

## 8. Pruebas, lint y formato

```bash
npm run type-check     # comprobación de tipos con vue-tsc
npm run lint           # ESLint con corrección automática
npm run lint:check     # ESLint sin modificar archivos (para CI)
npm run format         # Prettier: reescribe los archivos
npm run format:check   # Prettier: sólo verifica (para CI)
```

El proyecto **no incluye tests unitarios**; la estructura por módulos está
preparada para añadirlos (ver «Limitaciones actuales»).

---

## 9. Build de producción

```bash
npm run build     # comprueba tipos y genera dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

`npm run build` falla si hay cualquier error de TypeScript, de modo que un build
correcto garantiza que el tipado está limpio.

---

## 10. Cómo probar la aplicación

1. `npm run dev` y entra con cualquiera de las cuentas de demostración.
2. En el **dashboard**, cambia la ciudad y el rango temporal: las gráficas y los
   KPIs se recargan mostrando primero sus *skeletons*.
3. Pulsa el icono de la bombilla en el header para alternar **tema claro/oscuro**;
   las gráficas cambian de paleta con él.
4. En **Usuarios**, crea un usuario dejando campos vacíos para ver las
   validaciones, y vuelve a usar un correo existente para ver el error del
   servidor simulado.
5. En **Noticias**, busca un texto inexistente para ver el **estado vacío**.
6. En **Configuración → Fuente de datos**, activa «Simular errores de red» y
   aplica: las vistas empezarán a mostrar el **estado de error** con su botón de
   reintento. Desactívalo para volver a la normalidad.
7. Visita una URL inexistente (por ejemplo `/foo`) para ver la página **404**.
8. Reduce la ventana o abre las DevTools en modo móvil para comprobar el
   comportamiento **responsive** y el colapso automático del sidebar.

---

## 11. Despliegue

La salida de `npm run build` es una SPA estática en `dist/`. Cualquier hosting
estático sirve, siempre que **redirija todas las rutas a `index.html`** (la
aplicación usa history mode).

### Vercel

El repositorio incluye `vercel.json` con el *rewrite* necesario.

```bash
npm i -g vercel
vercel          # despliegue de previsualización
vercel --prod   # despliegue de producción
```

También puedes importar el repositorio desde el panel de Vercel: detecta Vite
automáticamente (build `npm run build`, salida `dist`). Define las variables
`VITE_*` en *Project Settings → Environment Variables*.

### Netlify

El repositorio incluye `netlify.toml` con el comando de build y la regla de
redirección.

```bash
npm i -g netlify-cli
netlify deploy              # previsualización
netlify deploy --prod       # producción
```

Desde el panel: *Build command* `npm run build`, *Publish directory* `dist`.

### Docker con Nginx

`Dockerfile` usa un build multietapa (Node 22 para compilar, Nginx 1.27 para
servir) y `nginx.conf` incluye el `try_files` de la SPA, compresión gzip y
cabeceras de caché.

```bash
docker build -t insight-dashboard .
docker run --rm -p 8080:80 insight-dashboard
# aplicación disponible en http://localhost:8080
```

O con Docker Compose:

```bash
docker compose up --build
```

---

## 12. Arquitectura de la aplicación

```
src/
  app/            Raíz de la aplicación (App.vue, tema de Ant Design)
  assets/         Estilos globales y variables CSS de tema
  components/
    charts/       Envoltorios de Apache ECharts (BaseChart y tipos concretos)
    common/       Componentes reutilizables basados en slots
    layout/       Piezas de la shell: header, sidebar, logo
    ui/           Piezas pequeñas de presentación (KPI, tendencia, async)
  composables/    Lógica reutilizable (datos asíncronos, tema, breakpoints)
  config/         Lectura de entorno y configuración de la aplicación
  constants/      Etiquetas, paletas y opciones estables
  layouts/        Layouts de página (DashboardLayout, AuthLayout)
  modules/        Un paquete por dominio: composables, mocks y tipos propios
    auth/ dashboard/ weather/ finance/ news/ users/ settings/
  router/         Rutas, metadatos de navegación y guards
  services/
    api/          Cliente Axios central e interceptores
    repositories/ Interfaces (contratos) de cada dominio
    adapters/     Implementaciones: mock/ y rest/
    *.service.ts  Fachadas de dominio con caché y normalización de errores
  stores/         Pinia: sesión, interfaz y configuración
  types/          Tipos de dominio compartidos
  utils/          Formato, series, almacenamiento y utilidades asíncronas
  views/          Una vista por ruta
```

### Capas y flujo de datos

```
Vista (.vue)
   ↓  usa
Composable del módulo (useWeather, useFinance, useUsers…)
   ↓  llama a
Servicio de dominio (WeatherService, FinanceService…)
   ↓  resuelve el repositorio activo mediante
Fábrica de datos (services/data-source.factory.ts)
   ↓  devuelve una implementación de
Interfaz de repositorio (WeatherRepository, AuthRepository…)
   ↓  implementada por
Adaptador (MockWeatherAdapter | RestWeatherAdapter | …)
```

La clave del diseño es que **las vistas dependen de interfaces, nunca de
implementaciones**. Cambiar de datos simulados a un backend real consiste en
registrar otro adaptador en la fábrica; ni las vistas, ni los composables, ni los
stores se enteran.

Los errores siguen el mismo principio: cada adaptador traduce su error nativo
(Axios, Firebase, lo que sea) a un `DataSourceError` común, de modo que la
interfaz muestra siempre un mensaje homogéneo.

---

## 13. El patrón Slots

Los componentes reutilizables del proyecto se construyen con **slots nombrados**,
para que cada página reutilice la estructura pero aporte su contenido:

| Componente | Slots | Usado en |
|---|---|---|
| `BasePageLayout` | `header`, `toolbar`, `filters`, por defecto, `footer` | Las seis vistas privadas |
| `DashboardWidget` | `title`, `actions`, por defecto, `footer` | Dashboard, Clima, Configuración |
| `ChartCard` | `header`, `filters`, por defecto, `legend`, `footer` | Todas las gráficas |
| `DataTableContainer` | `toolbar`, `filters`, por defecto, `empty`, `footer` | Usuarios, Finanzas, Noticias |
| `AppModal` | `title`, por defecto, `footer` | Modal de usuarios |
| `AuthLayout` | `brand`, por defecto, `footer` | Login |

En las vistas se usan con la sintaxis abreviada `#nombreDelSlot`:

```vue
<ChartCard title="Índice financiero" :loading="..." :error="...">
  <template #header>
    <span>Índice financiero</span>
    <TrendTag :value="cambio" />
  </template>

  <LineSeriesChart :series="serie" :range="range" area />

  <template #footer>Fuente: proveedor simulado.</template>
</ChartCard>
```

### Scoped slots

Hay dos ejemplos de **slot con ámbito**, donde el componente entrega datos al
consumidor:

- **`AsyncSection`** resuelve una vez el trío *cargando / error / vacío* y pasa al
  slot por defecto el dato ya garantizado y tipado:

  ```vue
  <AsyncSection :data="news.data.value" :status="news.status.value" @retry="news.refresh()">
    <template #default="{ data: articles }">
      <a-list :data-source="articles" />
    </template>
  </AsyncSection>
  ```

- **`KpiCard`** expone el valor numérico crudo por el slot `value`, de modo que
  cada módulo decide su formato sin que la tarjeta conozca el dominio:

  ```vue
  <KpiCard label="Temperatura actual" :value="temperatura">
    <template #value="{ value }">{{ formatTemperature(value) }}</template>
  </KpiCard>
  ```

Las tablas de Ant Design Vue se usan igualmente con su scoped slot `#bodyCell`
para renderizar avatares, etiquetas de rol y badges de estado.

---

## 14. Dependencias principales y su propósito

| Dependencia | Propósito |
|---|---|
| `vue` | Framework base, con Composition API y `<script setup>` |
| `vue-router` | Rutas, rutas anidadas, guards y metadatos de navegación |
| `pinia` | Stores de sesión, interfaz y configuración |
| `ant-design-vue` | Layout, menús, cards, formularios, tablas, modales, skeletons, mensajes |
| `@ant-design/icons-vue` | Iconografía coherente con el sistema de diseño |
| `echarts` | Motor de gráficas |
| `vue-echarts` | Integración declarativa de ECharts en Vue 3 |
| `axios` | Cliente HTTP con interceptores de autenticación y de error |
| `dayjs` | Formato de fechas y tiempos relativos en español |
| `@vueuse/core` | Reactividad del tamaño de ventana para los breakpoints |

---

## 15. Paquetes gráficos y licencias

El paquete de graficación principal es **Apache ECharts**, distribuido bajo la
**Apache License 2.0**, una licencia permisiva y de libre uso comercial.

| Paquete | Versión | Licencia |
|---|---|---|
| **echarts** (paquete principal de gráficas) | 6.1.0 | **Apache-2.0** |
| vue-echarts (integración con Vue) | 8.3.0 | MIT |
| ant-design-vue (componentes UI) | 4.2.6 | MIT |

El proyecto **no usa ApexCharts** ni ninguna otra librería de gráficas.

Sólo se cargan los módulos de ECharts realmente utilizados
(`src/components/charts/echarts.setup.ts`), lo que reduce notablemente el tamaño
del bundle frente a importar la librería completa.

### Criterios de las gráficas

- La paleta categórica es fija: la serie N siempre usa el color N y no se recicla
  al filtrar. Las variantes clara y oscura están **validadas** para contraste
  mínimo 3:1 contra su superficie y para separación perceptual bajo protanopía,
  deuteranopía y tritanopía.
- Los colores de estado (positivo/negativo) están reservados y nunca se usan como
  color de serie.
- Cuando hay dos o más series siempre hay leyenda; con una sola, el título la
  nombra. La identidad nunca depende únicamente del color.
- Los ejes de valor se ajustan al recorrido de los datos en lugar de forzar el
  cero, que aplastaría series de precio o temperatura.

---

## 16. Cambiar de mocks a un backend real

Todo ocurre en un único archivo: `src/services/data-source.factory.ts`.

```ts
export function createRepositories(mode: DataSourceMode): RepositoryBundle {
  switch (mode) {
    case 'rest':
      return {
        weather: new RestWeatherAdapter(),
        finance: new RestFinanceAdapter(),
        news: new RestNewsAdapter(),
        users: new RestUserAdapter(),
        auth: new RestAuthAdapter(),
      }
    case 'mock':
    default:
      return createMockBundle()
  }
}
```

Los pasos son los mismos para cualquier backend:

1. Crear el adaptador en `src/services/adapters/<modo>/` implementando la interfaz
   del dominio de `src/services/repositories/`.
2. Mapear ahí el DTO del backend al modelo de dominio (ese mapeo no debe salir del
   adaptador).
3. Registrar el adaptador en el `switch` de la fábrica.
4. Ajustar la variable de entorno correspondiente y seleccionar el modo en
   `/settings` o en `VITE_DATA_SOURCE_MODE`.

### API REST

`src/services/adapters/rest/weather.rest.adapter.ts` es un ejemplo completo y
funcional. Usa el cliente central de `src/services/api/http.ts`, que ya añade el
`Authorization: Bearer` y normaliza los errores. Basta con apuntar
`VITE_API_BASE_URL` a un backend que exponga `/cities`, `/weather/current`,
`/weather/forecast` y `/weather/history`.

Sirve igual para un backend propio en **.NET, Node.js, Go, Java o Python**: lo
único que importa es el contrato HTTP, no la tecnología del servidor.

### GraphQL

`src/services/api/http.ts` incluye el helper `graphqlRequest`, que reutiliza la
misma instancia de Axios (y por tanto sus interceptores):

```ts
const data = await graphqlRequest<{ cities: City[] }>(`
  query Cities { cities { id name country lat lon timezone } }
`)
return data.cities
```

### Firebase / Firestore

Añade el SDK (`npm i firebase`), inicializa la app con
`VITE_FIREBASE_API_KEY` / `VITE_FIREBASE_PROJECT_ID` y crea un
`FirestoreWeatherAdapter` que lea las colecciones y mapee los documentos a los
tipos de dominio. Las reglas de seguridad viven en Firebase, no en el frontend.

### Amazon API Gateway + Lambda

Crea un adaptador que apunte a `VITE_AWS_API_GATEWAY_URL`. Para endpoints
protegidos con Cognito, el token de identidad se adjunta en el interceptor de
petición; para autorización IAM, firma la petición con SigV4 antes de enviarla.
La forma de las respuestas se normaliza en el adaptador, igual que en REST.

---

## 17. Autenticación: flujo mock y puntos de integración

### Flujo actual (mock)

1. `LoginView` recoge las credenciales y llama a `useAuthStore().login()`.
2. El store delega en `AuthService`, que resuelve el `AuthRepository` activo.
3. `MockAuthAdapter` valida contra las cuentas de demostración, genera un token
   opaco (sin valor criptográfico) y lo guarda en `localStorage`.
4. El guard de `src/router/guards.ts` espera a `auth.restore()` antes de decidir,
   de modo que **recargar la página no expulsa al usuario**.
5. `logout()` borra la sesión persistida y devuelve al login.

Las rutas privadas cuelgan de `DashboardLayout` y sólo `/login` y `/not-found`
están marcadas como `public` en su `meta`.

### Puntos de integración real

`src/services/adapters/rest/auth.rest.adapter.ts` contiene una implementación de
referencia documentada para los tres escenarios:

- **Backend propio con JWT**: `POST /auth/login`, `POST /auth/refresh` y
  `POST /auth/logout`. El access token se adjunta automáticamente por el
  interceptor de Axios; el refresco de token se implementa en `restoreSession()`.
- **OAuth 2.0 con Google y GitHub** (Authorization Code + PKCE):
  `loginWithProvider` redirige al proveedor y la ruta de callback llama a
  `completeOAuth(provider, code)`. El **client secret nunca vive en el frontend**:
  el intercambio del código por tokens lo hace el backend.
- **Firebase Authentication**: sustituir el adaptador por uno que envuelva
  `signInWithEmailAndPassword` / `signInWithPopup` y mapee el `User` de Firebase
  al tipo `AuthUser` del dominio.

En el repositorio no hay secretos, tokens reales ni claves de API.

---

## 18. Limitaciones actuales

- **No hay backend**: los datos son simulados y deterministas; las series se
  generan con un PRNG con semilla para que no cambien en cada render.
- Las altas y ediciones de usuarios viven **en memoria**: se pierden al recargar.
- Los modos `rest`, `graphql`, `firebase` y `aws-api-gateway` son **puntos de
  integración**: el contrato existe y hay un adaptador REST de referencia, pero
  mientras no se registren en la fábrica la aplicación sigue sirviendo los mocks.
- **Sin tests automatizados**: no hay suite de unitarios ni de extremo a extremo.
- La sesión se guarda en `localStorage` sin cifrar, adecuado para una demo pero
  no para producción (en un backend real conviene una cookie `httpOnly`).
- El único idioma de la interfaz es el español; el selector de idioma en
  `/settings` guarda la preferencia pero todavía no hay i18n.
- La autorización por rol se limita a mostrar el rol: no hay permisos
  diferenciados por ruta ni por acción.

---

## 19. Posibles mejoras futuras

- Suite de tests con Vitest (unitarios y de composables) y Playwright (extremo a
  extremo), aprovechando que la capa de datos es sustituible por interfaz.
- Internacionalización con `vue-i18n`, conectada al selector de idioma existente.
- Permisos por rol en los guards del router y en las acciones de las vistas.
- Caché y revalidación de peticiones (por ejemplo con TanStack Query) en lugar de
  la caché manual de los servicios.
- Datos en tiempo real mediante WebSocket o SSE para el módulo de finanzas.
- Exportación de gráficas y tablas a PNG y CSV.
- Personalización del dashboard: widgets reordenables y guardados por usuario.
- Modo de alto contraste y verificación de accesibilidad automatizada en CI.

---

## 20. Licencia

Proyecto de demostración. Las dependencias conservan sus respectivas licencias;
la librería de gráficas principal, Apache ECharts, se distribuye bajo
**Apache License 2.0**.
