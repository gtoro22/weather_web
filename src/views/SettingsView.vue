<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { BasePageLayout, DashboardWidget } from '@/components/common'
import { useSettingsStore, useUiStore } from '@/stores'
import { DATA_SOURCE_MODES } from '@/config'
import type { DataSourceMode, ThemeMode } from '@/types'

const settings = useSettingsStore()
const ui = useUiStore()
const { theme } = storeToRefs(ui)

const profile = reactive({ ...settings.state.profile })
const notifications = reactive({ ...settings.state.notifications })
const dataSource = reactive({ ...settings.state.dataSource })
const activeTab = ref('profile')

// El store es la fuente de verdad; los formularios son copias editables.
watch(
  () => settings.state.dataSource.mode,
  (mode) => {
    dataSource.mode = mode
  },
)

const selectedMode = computed(() =>
  DATA_SOURCE_MODES.find((item) => item.value === dataSource.mode),
)

const themeOptions: Array<{ value: ThemeMode; label: string }> = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
]

const digestOptions = [
  { value: 'realtime', label: 'En tiempo real' },
  { value: 'daily', label: 'Resumen diario' },
  { value: 'weekly', label: 'Resumen semanal' },
]

async function saveProfile(): Promise<void> {
  await settings.saveProfile({ ...profile })
  message.success('Perfil actualizado')
}

async function saveNotifications(): Promise<void> {
  await settings.saveNotifications({ ...notifications })
  message.success('Preferencias de notificación guardadas')
}

async function saveDataSource(): Promise<void> {
  await settings.saveDataSource({ ...dataSource })
  message.success(`Fuente de datos cambiada a ${selectedMode.value?.label ?? dataSource.mode}`)
}

function handleModeChange(mode: DataSourceMode): void {
  dataSource.mode = mode
}
</script>

<template>
  <BasePageLayout
    title="Configuración"
    subtitle="Perfil, apariencia, notificaciones y fuente de datos"
    :breadcrumbs="[{ label: 'Inicio', to: '/dashboard' }, { label: 'Configuración' }]"
  >
    <a-tabs v-model:active-key="activeTab">
      <a-tab-pane key="profile" tab="Perfil">
        <DashboardWidget title="Datos de la cuenta">
          <a-form layout="vertical" :model="profile" @finish="saveProfile">
            <a-row :gutter="16">
              <a-col :xs="24" :md="12">
                <a-form-item label="Nombre visible">
                  <a-input v-model:value="profile.displayName" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item label="Correo electrónico">
                  <a-input v-model:value="profile.email" type="email" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item label="Cargo">
                  <a-input v-model:value="profile.jobTitle" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item label="Idioma">
                  <a-select
                    v-model:value="profile.language"
                    :options="[
                      { value: 'es', label: 'Español' },
                      { value: 'en', label: 'English' },
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-button type="primary" html-type="submit" :loading="settings.saving">
              Guardar perfil
            </a-button>
          </a-form>
        </DashboardWidget>
      </a-tab-pane>

      <a-tab-pane key="appearance" tab="Apariencia">
        <DashboardWidget title="Tema de la interfaz">
          <a-form layout="vertical">
            <a-form-item label="Modo de color">
              <a-segmented
                :value="theme"
                :options="themeOptions"
                @change="(value: string | number) => ui.setTheme(value as ThemeMode)"
              />
            </a-form-item>
            <p class="hint">
              El tema se guarda en el navegador y se aplica a los componentes de Ant Design Vue, a
              los estilos propios y a la paleta de las gráficas.
            </p>
          </a-form>
        </DashboardWidget>
      </a-tab-pane>

      <a-tab-pane key="notifications" tab="Notificaciones">
        <DashboardWidget title="Preferencias de aviso">
          <a-form layout="vertical" :model="notifications" @finish="saveNotifications">
            <a-form-item>
              <a-space direction="vertical" size="middle">
                <a-checkbox v-model:checked="notifications.email">
                  Recibir notificaciones por correo
                </a-checkbox>
                <a-checkbox v-model:checked="notifications.push">
                  Recibir notificaciones push
                </a-checkbox>
                <a-checkbox v-model:checked="notifications.weatherAlerts">
                  Alertas meteorológicas de la ciudad seleccionada
                </a-checkbox>
                <a-checkbox v-model:checked="notifications.financeAlerts">
                  Alertas de variación de activos
                </a-checkbox>
              </a-space>
            </a-form-item>

            <a-form-item label="Frecuencia del resumen">
              <a-select
                v-model:value="notifications.digestFrequency"
                :options="digestOptions"
                style="max-width: 260px"
              />
            </a-form-item>

            <a-button type="primary" html-type="submit" :loading="settings.saving">
              Guardar preferencias
            </a-button>
          </a-form>
        </DashboardWidget>
      </a-tab-pane>

      <a-tab-pane key="data" tab="Fuente de datos">
        <DashboardWidget title="Modo de integración">
          <template #actions>
            <a-tag :color="selectedMode?.ready ? 'green' : 'orange'">
              {{ selectedMode?.ready ? 'Operativo' : 'Punto de integración' }}
            </a-tag>
          </template>

          <a-alert
            v-if="selectedMode && !selectedMode.ready"
            class="alert"
            type="info"
            show-icon
            message="Modo preparado, todavía sin implementar"
            description="La arquitectura ya expone el contrato necesario. Mientras no exista el adaptador concreto, la aplicación sigue sirviendo los datos simulados."
          />

          <a-radio-group
            :value="dataSource.mode"
            class="modes"
            @change="
              (event: { target: { value: DataSourceMode } }) => handleModeChange(event.target.value)
            "
          >
            <a-radio
              v-for="mode in DATA_SOURCE_MODES"
              :key="mode.value"
              :value="mode.value"
              class="mode"
            >
              <span class="mode__label">{{ mode.label }}</span>
              <span class="mode__description">{{ mode.description }}</span>
            </a-radio>
          </a-radio-group>

          <a-divider />

          <a-form layout="vertical" :model="dataSource" @finish="saveDataSource">
            <a-row :gutter="16">
              <a-col :xs="24" :md="14">
                <a-form-item label="URL base del backend">
                  <a-input
                    v-model:value="dataSource.baseUrl"
                    placeholder="https://api.example.com/v1"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="10">
                <a-form-item label="Intervalo de refresco (segundos)">
                  <a-input-number
                    v-model:value="dataSource.refreshIntervalSeconds"
                    :min="15"
                    :max="3600"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item>
              <a-switch v-model:checked="dataSource.simulateErrors" />
              <span class="switch-label">
                Simular errores de red (útil para probar los estados de error)
              </span>
            </a-form-item>

            <a-button type="primary" html-type="submit" :loading="settings.saving">
              Aplicar configuración
            </a-button>
          </a-form>

          <template #footer>
            <span class="hint">
              Las credenciales y secretos nunca se guardan en el frontend: viven en el backend o en
              el gestor de secretos del proveedor.
            </span>
          </template>
        </DashboardWidget>
      </a-tab-pane>
    </a-tabs>
  </BasePageLayout>
</template>

<style scoped>
.modes {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mode {
  display: flex;
  align-items: flex-start;
  white-space: normal;
}

.mode__label {
  display: block;
  font-weight: 600;
}

.mode__description {
  display: block;
  color: var(--app-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.alert {
  margin-bottom: 16px;
}

.switch-label {
  margin-left: 10px;
  color: var(--app-text-secondary);
  font-size: 13px;
}

.hint {
  color: var(--app-text-secondary);
  font-size: 12px;
}
</style>
