<script setup lang="ts">
import { appConfig } from '@/config'

defineProps<{ collapsed?: boolean }>()
</script>

<template>
  <div class="logo" :class="{ 'logo--collapsed': collapsed }">
    <span class="logo__mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="24" height="24">
        <rect width="32" height="32" rx="7" fill="currentColor" />
        <path
          d="M7 21.5 12.5 14l4.5 5 7.5-10"
          fill="none"
          stroke="#fff"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="24.5" cy="9" r="2.6" fill="#fff" />
      </svg>
    </span>
    <span v-if="!collapsed" class="logo__text">{{ appConfig.title }}</span>
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 16px;
  overflow: hidden;
}

.logo--collapsed {
  justify-content: center;
  padding: 0;
}

.logo__mark {
  display: flex;
  color: #1677ff;
}

.logo__text {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
