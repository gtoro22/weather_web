<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { AppModal, BasePageLayout, DataTableContainer } from '@/components/common'
import { useUsers } from '@/modules/users/composables/useUsers'
import {
  USER_ROLE_COLORS,
  USER_ROLE_LABELS,
  USER_STATUS_COLORS,
  USER_STATUS_LABELS,
} from '@/constants'
import { appConfig } from '@/config'
import { formatDate } from '@/utils'
import type { AppUser, UserRole, UserStatus } from '@/types'

const {
  filters,
  result,
  items,
  total,
  modalOpen,
  modalMode,
  draft,
  saving,
  openCreate,
  openEdit,
  openView,
  save,
  remove,
  changePage,
} = useUsers()

const formRef = ref<FormInstance>()

const roleOptions = (Object.keys(USER_ROLE_LABELS) as UserRole[]).map((value) => ({
  value,
  label: USER_ROLE_LABELS[value],
}))

const statusOptions = (Object.keys(USER_STATUS_LABELS) as UserStatus[]).map((value) => ({
  value,
  label: USER_STATUS_LABELS[value],
}))

const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: 'El nombre es obligatorio', trigger: 'blur' },
    { min: 3, message: 'Debe tener al menos 3 caracteres', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'El correo es obligatorio', trigger: 'blur' },
    { type: 'email', message: 'Introduce un correo válido', trigger: 'blur' },
  ],
  role: [{ required: true, message: 'Selecciona un rol', trigger: 'change' }],
  status: [{ required: true, message: 'Selecciona un estado', trigger: 'change' }],
}

const isReadOnly = computed(() => modalMode.value === 'view')

const modalTitle = computed(() => {
  if (modalMode.value === 'create') return 'Nuevo usuario'
  return modalMode.value === 'edit' ? 'Editar usuario' : 'Detalle del usuario'
})

const columns = [
  { title: 'Usuario', key: 'user' },
  { title: 'Rol', key: 'role', width: 150 },
  { title: 'Estado', key: 'status', width: 130 },
  { title: 'Alta', key: 'createdAt', width: 140 },
  { title: 'Acciones', key: 'actions', width: 190, align: 'right' as const },
]

// La validación se reinicia al abrir el modal para no arrastrar errores previos.
watch(modalOpen, (open) => {
  if (open) formRef.value?.clearValidate()
})

async function handleConfirm(): Promise<void> {
  if (isReadOnly.value) {
    modalOpen.value = false
    return
  }
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  await save()
}
</script>

<template>
  <BasePageLayout
    title="Usuarios"
    subtitle="Gestión de cuentas, roles y estados"
    :breadcrumbs="[{ label: 'Inicio', to: '/dashboard' }, { label: 'Usuarios' }]"
  >
    <template #toolbar>
      <a-button type="primary" @click="openCreate()">
        <template #icon><PlusOutlined /></template>
        Nuevo usuario
      </a-button>
    </template>

    <DataTableContainer
      :loading="result.isLoading.value"
      :error="result.error.value"
      :empty="items.length === 0"
      @retry="result.refresh()"
    >
      <template #filters>
        <a-input
          v-model:value="filters.search"
          placeholder="Buscar por nombre o correo"
          allow-clear
          style="max-width: 280px"
          aria-label="Buscar usuarios"
        >
          <template #prefix><SearchOutlined /></template>
        </a-input>

        <a-select
          v-model:value="filters.role"
          :options="roleOptions"
          placeholder="Todos los roles"
          allow-clear
          style="min-width: 180px"
          aria-label="Filtrar por rol"
        />

        <a-select
          v-model:value="filters.status"
          :options="statusOptions"
          placeholder="Todos los estados"
          allow-clear
          style="min-width: 180px"
          aria-label="Filtrar por estado"
        />
      </template>

      <a-table
        :columns="columns"
        :data-source="items"
        row-key="id"
        size="middle"
        :pagination="false"
        :scroll="{ x: 780 }"
      >
        <!-- Scoped slot de la tabla: cada celda decide su propia presentación. -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <div class="cell-user">
              <a-avatar :src="(record as AppUser).avatarUrl" :size="34" />
              <div>
                <div class="cell-user__name">{{ (record as AppUser).name }}</div>
                <div class="cell-user__email">{{ (record as AppUser).email }}</div>
              </div>
            </div>
          </template>

          <template v-else-if="column.key === 'role'">
            <a-tag :color="USER_ROLE_COLORS[(record as AppUser).role]">
              {{ USER_ROLE_LABELS[(record as AppUser).role] }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-badge
              :status="USER_STATUS_COLORS[(record as AppUser).status] as never"
              :text="USER_STATUS_LABELS[(record as AppUser).status]"
            />
          </template>

          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate((record as AppUser).createdAt) }}
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space size="small">
              <a-button size="small" @click="openView(record as AppUser)">Ver</a-button>
              <a-button size="small" type="primary" ghost @click="openEdit(record as AppUser)">
                Editar
              </a-button>
              <a-popconfirm
                title="¿Eliminar este usuario?"
                ok-text="Eliminar"
                cancel-text="Cancelar"
                @confirm="remove(record as AppUser)"
              >
                <a-button size="small" danger>Eliminar</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <template #footer>
        <span class="legend">{{ total }} usuarios en total</span>
        <a-pagination
          :current="filters.page"
          :page-size="filters.pageSize"
          :total="total"
          :page-size-options="appConfig.pagination.pageSizeOptions"
          show-size-changer
          @change="changePage"
        />
      </template>
    </DataTableContainer>

    <AppModal
      v-model:open="modalOpen"
      :title="modalTitle"
      :confirm-text="isReadOnly ? 'Cerrar' : 'Guardar'"
      :confirm-loading="saving"
      @confirm="handleConfirm"
    >
      <a-form
        ref="formRef"
        layout="vertical"
        :model="draft"
        :rules="rules"
        :disabled="isReadOnly || saving"
      >
        <a-form-item label="Nombre completo" name="name">
          <a-input v-model:value="draft.name" placeholder="Nombre y apellidos" />
        </a-form-item>

        <a-form-item label="Correo electrónico" name="email">
          <a-input v-model:value="draft.email" placeholder="usuario@insight.io" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Rol" name="role">
              <a-select v-model:value="draft.role" :options="roleOptions" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Estado" name="status">
              <a-select v-model:value="draft.status" :options="statusOptions" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template v-if="isReadOnly" #footer>
        <a-button type="primary" @click="modalOpen = false">Cerrar</a-button>
      </template>
    </AppModal>
  </BasePageLayout>
</template>

<style scoped>
.cell-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cell-user__name {
  font-weight: 500;
}

.cell-user__email {
  color: var(--app-text-secondary);
  font-size: 12px;
}

.legend {
  color: var(--app-text-secondary);
  font-size: 12px;
}
</style>
