<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="not-found">
    <a-result status="404" title="404" sub-title="La página que buscas no existe o fue movida.">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="router.push({ name: 'dashboard' })">
            Volver al dashboard
          </a-button>
          <a-button @click="router.back()">Página anterior</a-button>
        </a-space>
      </template>
    </a-result>
  </main>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: var(--app-bg);
}
</style>
