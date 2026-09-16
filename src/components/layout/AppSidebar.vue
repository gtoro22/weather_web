<script setup lang="ts">
/** Navegación lateral. Se construye a partir del `meta` de las rutas, de modo
 * que añadir una página nueva sólo requiere declararla en el router. */
import { computed, h, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CloudOutlined,
  DashboardOutlined,
  ReadOutlined,
  SettingOutlined,
  StockOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'
import AppLogo from './AppLogo.vue'

defineProps<{ collapsed: boolean }>()

const route = useRoute()
const router = useRouter()

const ICONS: Record<string, Component> = {
  dashboard: DashboardOutlined,
  cloud: CloudOutlined,
  stock: StockOutlined,
  read: ReadOutlined,
  team: TeamOutlined,
  setting: SettingOutlined,
}

const items = computed(() =>
  router
    .getRoutes()
    .filter((item) => item.meta?.nav && item.name)
    .sort((a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99))
    .map((item) => ({
      key: String(item.name),
      label: item.meta.title,
      icon: () => h(ICONS[item.meta.icon ?? 'dashboard'] ?? DashboardOutlined),
    })),
)

const selectedKeys = computed(() => [String(route.name ?? '')])

function handleSelect({ key }: { key: string | number }): void {
  void router.push({ name: String(key) })
}
</script>

<template>
  <a-layout-sider
    :collapsed="collapsed"
    :trigger="null"
    collapsible
    breakpoint="lg"
    :width="228"
    :collapsed-width="72"
    class="sidebar"
    theme="light"
  >
    <AppLogo :collapsed="collapsed" />
    <a-menu
      :selected-keys="selectedKeys"
      mode="inline"
      :items="items"
      class="sidebar__menu"
      @select="handleSelect"
    />
  </a-layout-sider>
</template>

<style scoped>
.sidebar {
  border-right: 1px solid var(--app-border);
}

.sidebar__menu {
  border-inline-end: none;
}
</style>
