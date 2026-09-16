<script setup lang="ts">
/**
 * Modal de la aplicación. Envuelve `a-modal` para imponer un pie coherente
 * (cancelar + acción principal) y permitir reemplazarlo cuando hace falta.
 */
const open = defineModel<boolean>('open', { required: true })

withDefaults(
  defineProps<{
    title: string
    confirmText?: string
    cancelText?: string
    confirmLoading?: boolean
    hideFooter?: boolean
    width?: number | string
  }>(),
  {
    confirmText: 'Guardar',
    cancelText: 'Cancelar',
    confirmLoading: false,
    hideFooter: false,
    width: 560,
  },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()

function handleCancel(): void {
  open.value = false
  emit('cancel')
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :width="width"
    :title="undefined"
    :mask-closable="false"
    destroy-on-close
    @cancel="handleCancel"
  >
    <template #title>
      <slot name="title">{{ title }}</slot>
    </template>

    <slot />

    <template #footer>
      <!-- Slot `footer`: sustituye los botones por defecto (p.ej. sólo cerrar). -->
      <slot name="footer">
        <template v-if="!hideFooter">
          <a-button @click="handleCancel">{{ cancelText }}</a-button>
          <a-button type="primary" :loading="confirmLoading" @click="emit('confirm')">
            {{ confirmText }}
          </a-button>
        </template>
      </slot>
    </template>
  </a-modal>
</template>
