<script setup lang="ts">
/**
 * Raíz de la aplicación. Aplica el algoritmo de tema de Ant Design Vue en
 * función del store de UI, de modo que un único interruptor cambia a la vez
 * los componentes de Ant, los estilos propios y las gráficas.
 */
import { computed } from 'vue'
import { theme as antdTheme } from 'ant-design-vue'
import esES from 'ant-design-vue/es/locale/es_ES'
import { storeToRefs } from 'pinia'
import { useSettingsStore, useUiStore } from '@/stores'

const { isDark } = storeToRefs(useUiStore())

// Instanciar el store de configuración al arrancar restaura las preferencias
// persistidas (modo de datos y simulación de errores) también tras recargar,
// sin esperar a que el usuario visite /settings.
useSettingsStore()

const themeConfig = computed(() => ({
  algorithm: isDark.value ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
    fontSize: 14,
  },
}))
</script>

<template>
  <a-config-provider :locale="esES" :theme="themeConfig">
    <a-app>
      <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
      <div id="main-content">
        <RouterView />
      </div>
    </a-app>
  </a-config-provider>
</template>
