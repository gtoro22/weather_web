<script setup lang="ts">
/**
 * Contenedor estándar de página. Define el esqueleto (título, barra de
 * herramientas, filtros, contenido y pie) y deja cada zona abierta mediante
 * slots nombrados, de modo que las siete vistas compartan estructura,
 * espaciados y breadcrumbs sin duplicar marcado.
 */
import { RouterLink } from 'vue-router'

interface Crumb {
  label: string
  to?: string
}

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    breadcrumbs?: Crumb[]
  }>(),
  { subtitle: '', breadcrumbs: () => [] },
)
</script>

<template>
  <section class="page" :aria-label="title">
    <a-breadcrumb v-if="breadcrumbs.length" class="page__crumbs">
      <a-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.label">
        <RouterLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</RouterLink>
        <span v-else>{{ crumb.label }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>

    <header class="page__header">
      <!-- Slot `header`: sustituye por completo el encabezado por defecto. -->
      <slot name="header">
        <div class="page__heading">
          <h1 class="page__title">{{ title }}</h1>
          <p v-if="subtitle" class="page__subtitle">{{ subtitle }}</p>
        </div>
      </slot>

      <div v-if="$slots.toolbar" class="page__toolbar">
        <slot name="toolbar" />
      </div>
    </header>

    <div v-if="$slots.filters" class="page__filters">
      <slot name="filters" />
    </div>

    <div class="page__content">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="page__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page__crumbs {
  margin-bottom: -4px;
}

.page__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.page__title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.3;
}

.page__subtitle {
  margin: 4px 0 0;
  color: var(--app-text-secondary);
  font-size: 13px;
}

.page__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.page__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.page__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 767px) {
  .page__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page__toolbar {
    width: 100%;
  }
}
</style>
