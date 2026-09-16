<script setup lang="ts">
/**
 * Layout de las pantallas públicas de autenticación. Divide la pantalla en
 * un panel de marca y un panel de formulario, ambos abiertos por slots
 * (`brand`, `default`, `footer`) para poder reutilizarlo en futuras pantallas
 * de registro o recuperación de contraseña.
 */
defineProps<{ title?: string; subtitle?: string }>()
</script>

<template>
  <div class="auth">
    <aside class="auth__brand">
      <!-- Slot `brand`: panel lateral con el mensaje de producto. -->
      <slot name="brand" />
    </aside>

    <main class="auth__panel">
      <div class="auth__card">
        <header v-if="title" class="auth__header">
          <h1 class="auth__title">{{ title }}</h1>
          <p v-if="subtitle" class="auth__subtitle">{{ subtitle }}</p>
        </header>

        <slot />

        <footer v-if="$slots.footer" class="auth__footer">
          <slot name="footer" />
        </footer>
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  min-height: 100vh;
}

.auth__brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
  background: linear-gradient(145deg, #0b2a5b 0%, #1677ff 100%);
  color: #fff;
}

.auth__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  background: var(--app-bg);
}

.auth__card {
  width: 100%;
  max-width: 380px;
}

.auth__header {
  margin-bottom: 24px;
}

.auth__title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.auth__subtitle {
  margin: 6px 0 0;
  color: var(--app-text-secondary);
  font-size: 13px;
}

.auth__footer {
  margin-top: 24px;
  color: var(--app-text-secondary);
  font-size: 12px;
  text-align: center;
}

@media (max-width: 991px) {
  .auth {
    grid-template-columns: 1fr;
  }

  .auth__brand {
    padding: 28px 20px;
  }
}
</style>
