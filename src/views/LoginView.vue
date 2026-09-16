<script setup lang="ts">
/** Pantalla de acceso. Usa `AuthLayout` y sus slots `brand`, por defecto y `footer`. */
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { Rule } from 'ant-design-vue/es/form'
import { GithubOutlined, GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores'
import { DEMO_PASSWORD } from '@/modules/auth/mocks/auth.mock'
import type { OAuthProvider } from '@/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { loading, error } = storeToRefs(auth)

const form = reactive({ email: 'admin@insight.io', password: DEMO_PASSWORD, remember: true })
const providerLoading = ref<OAuthProvider | null>(null)

const rules: Record<string, Rule[]> = {
  email: [
    { required: true, message: 'El correo es obligatorio', trigger: 'blur' },
    { type: 'email', message: 'Introduce un correo válido', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'La contraseña es obligatoria', trigger: 'blur' },
    { min: 6, message: 'Debe tener al menos 6 caracteres', trigger: 'blur' },
  ],
}

async function goToTarget(): Promise<void> {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
  await router.replace(redirect ?? { name: 'dashboard' })
}

async function handleSubmit(): Promise<void> {
  try {
    await auth.login({ email: form.email, password: form.password })
    await goToTarget()
  } catch {
    // El mensaje ya está en `auth.error`; la alerta del formulario lo muestra.
  }
}

async function handleProvider(provider: OAuthProvider): Promise<void> {
  providerLoading.value = provider
  try {
    await auth.loginWithProvider(provider)
    await goToTarget()
  } catch {
    /* error mostrado por la alerta */
  } finally {
    providerLoading.value = null
  }
}
</script>

<template>
  <AuthLayout title="Inicia sesión" subtitle="Accede a tu panel de clima, finanzas y noticias.">
    <template #brand>
      <p class="brand__eyebrow">Insight Dashboard</p>
      <h2 class="brand__title">Toda tu información operativa en un solo panel</h2>
      <p class="brand__copy">
        Clima por ciudad, indicadores financieros y titulares relevantes, con gráficas interactivas
        y tema claro u oscuro.
      </p>
      <ul class="brand__list">
        <li>Series temporales por día, semana, mes y año</li>
        <li>Indicadores comparables por sector</li>
        <li>Gestión de usuarios y roles</li>
      </ul>
    </template>

    <a-alert
      v-if="error"
      class="login__alert"
      type="error"
      show-icon
      :message="error"
      closable
      @close="auth.clearError()"
    />

    <a-form
      layout="vertical"
      :model="form"
      :rules="rules"
      :disabled="loading || providerLoading !== null"
      @finish="handleSubmit"
    >
      <a-form-item label="Correo electrónico" name="email">
        <a-input
          v-model:value="form.email"
          size="large"
          autocomplete="email"
          placeholder="tu@empresa.com"
        >
          <template #prefix><MailOutlined /></template>
        </a-input>
      </a-form-item>

      <a-form-item label="Contraseña" name="password">
        <a-input-password
          v-model:value="form.password"
          size="large"
          autocomplete="current-password"
          placeholder="Tu contraseña"
        >
          <template #prefix><LockOutlined /></template>
        </a-input-password>
      </a-form-item>

      <div class="login__row">
        <a-checkbox v-model:checked="form.remember">Recordarme</a-checkbox>
        <a-typography-link>¿Olvidaste tu contraseña?</a-typography-link>
      </div>

      <a-button type="primary" size="large" block html-type="submit" :loading="loading">
        Iniciar sesión
      </a-button>
    </a-form>

    <a-divider plain>o continúa con</a-divider>

    <div class="login__providers">
      <a-button
        size="large"
        block
        :loading="providerLoading === 'google'"
        @click="handleProvider('google')"
      >
        <template #icon><GoogleOutlined /></template>
        Continuar con Google
      </a-button>
      <a-button
        size="large"
        block
        :loading="providerLoading === 'github'"
        @click="handleProvider('github')"
      >
        <template #icon><GithubOutlined /></template>
        Continuar con GitHub
      </a-button>
    </div>

    <template #footer>
      Demo sin backend · usuarios <code>admin@insight.io</code>, <code>analista@insight.io</code> o
      <code>lector@insight.io</code> con la contraseña <code>{{ DEMO_PASSWORD }}</code
      >.
    </template>
  </AuthLayout>
</template>

<style scoped>
.brand__eyebrow {
  margin: 0 0 12px;
  font-size: 13px;
  letter-spacing: 0.08em;
  opacity: 0.8;
  text-transform: uppercase;
}

.brand__title {
  margin: 0 0 12px;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.25;
  max-width: 460px;
}

.brand__copy {
  margin: 0 0 20px;
  max-width: 440px;
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.9;
}

.brand__list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 2;
  opacity: 0.88;
}

.login__alert {
  margin-bottom: 16px;
}

.login__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.login__providers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 991px) {
  .brand__title {
    font-size: 22px;
  }

  .brand__list {
    display: none;
  }
}
</style>
