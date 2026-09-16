<script setup lang="ts">
/** Cabecera: control del sidebar, buscador, tema, notificaciones y perfil. */
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  BellOutlined,
  BulbOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { useAuthStore, useUiStore } from '@/stores'
import { USER_ROLE_LABELS } from '@/constants'
import { formatRelative } from '@/utils'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const { sidebarCollapsed, isDark, lastUpdatedAt } = storeToRefs(ui)
const { user } = storeToRefs(auth)

const menuItems = computed(() => [
  { key: 'settings', label: 'Configuración', icon: () => h(SettingOutlined) },
  { type: 'divider' as const },
  { key: 'logout', label: 'Cerrar sesión', icon: () => h(LogoutOutlined), danger: true },
])

async function handleMenuClick({ key }: { key: string | number }): Promise<void> {
  if (key === 'settings') {
    await router.push({ name: 'settings' })
    return
  }
  await auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <a-layout-header class="header">
    <div class="header__left">
      <a-button
        type="text"
        class="header__toggle"
        :aria-label="sidebarCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'"
        :aria-expanded="!sidebarCollapsed"
        @click="ui.toggleSidebar()"
      >
        <MenuUnfoldOutlined v-if="sidebarCollapsed" />
        <MenuFoldOutlined v-else />
      </a-button>

      <span class="header__updated"> Actualizado {{ formatRelative(lastUpdatedAt) }} </span>
    </div>

    <div class="header__right">
      <a-tooltip :title="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'">
        <a-button
          type="text"
          :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
          :aria-pressed="isDark"
          @click="ui.toggleTheme()"
        >
          <BulbOutlined />
        </a-button>
      </a-tooltip>

      <a-badge :count="3" size="small">
        <a-button type="text" aria-label="Notificaciones">
          <BellOutlined />
        </a-button>
      </a-badge>

      <a-dropdown placement="bottomRight">
        <button class="header__profile" type="button" aria-label="Menú de usuario">
          <a-avatar :src="user?.avatarUrl" :size="30">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <span class="header__profile-info">
            <span class="header__profile-name">{{ user?.name }}</span>
            <span class="header__profile-role">
              {{ user ? USER_ROLE_LABELS[user.role] : '' }}
            </span>
          </span>
        </button>
        <template #overlay>
          <a-menu :items="menuItems" @click="handleMenuClick" />
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 56px;
  padding: 0 16px;
  background: var(--app-surface);
  border-bottom: 1px solid var(--app-border);
  line-height: normal;
}

.header__left,
.header__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__updated {
  color: var(--app-text-secondary);
  font-size: 12px;
}

.header__profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  color: inherit;
}

.header__profile:hover,
.header__profile:focus-visible {
  background: var(--app-hover);
}

.header__profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.header__profile-name {
  font-size: 13px;
  font-weight: 500;
}

.header__profile-role {
  color: var(--app-text-secondary);
  font-size: 11px;
}

@media (max-width: 767px) {
  .header__updated,
  .header__profile-info {
    display: none;
  }
}
</style>
