<script setup lang="ts">
/**
 * Tarjeta genérica del dashboard. Es deliberadamente agnóstica del contenido:
 * KPIs, listas y tablas la reutilizan aportando sólo sus slots.
 */
withDefaults(
  defineProps<{
    title?: string
    loading?: boolean
    bordered?: boolean
  }>(),
  { title: '', loading: false, bordered: true },
)
</script>

<template>
  <a-card class="widget" :bordered="bordered" :body-style="{ padding: '16px' }">
    <template #title>
      <!-- Slot `title`: permite títulos con iconos, tags o enlaces. -->
      <slot name="title">{{ title }}</slot>
    </template>

    <template v-if="$slots.actions" #extra>
      <slot name="actions" />
    </template>

    <a-skeleton v-if="loading" active :paragraph="{ rows: 3 }" />
    <slot v-else />

    <template v-if="$slots.footer" #actions>
      <div class="widget__footer"><slot name="footer" /></div>
    </template>
  </a-card>
</template>

<style scoped>
.widget {
  height: 100%;
}

.widget__footer {
  padding: 0 16px;
  text-align: left;
}
</style>
