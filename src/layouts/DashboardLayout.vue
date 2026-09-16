<script setup lang="ts">
/** Shell de las rutas privadas: sidebar colapsable, header y contenido. */
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { AppHeader, AppSidebar } from '@/components/layout'
import { useBreakpoint } from '@/composables'
import { useUiStore } from '@/stores'

const ui = useUiStore()
const { sidebarCollapsed } = storeToRefs(ui)
const { isMobile } = useBreakpoint()

// En móvil el sidebar arranca colapsado para dejar sitio al contenido.
watch(isMobile, (value) => ui.setSidebarCollapsed(value), { immediate: true })
</script>

<template>
  <a-layout class="shell">
    <AppSidebar :collapsed="sidebarCollapsed" />
    <a-layout>
      <AppHeader />
      <a-layout-content class="shell__content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}

.shell__content {
  padding: 20px;
  overflow-x: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .shell__content {
    padding: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
