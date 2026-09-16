import { computed, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useAsyncData } from '@/composables'
import { UserService } from '@/services'
import { appConfig } from '@/config'
import { toDataSourceError, type AppUser, type UserDraft, type UserFilters } from '@/types'

export type UserModalMode = 'create' | 'edit' | 'view'

function emptyDraft(): UserDraft {
  return { name: '', email: '', role: 'lector', status: 'pendiente' }
}

/** Estado completo de la pantalla de usuarios: filtros, paginación y modal. */
export function useUsers() {
  const filters = reactive<UserFilters>({
    search: '',
    role: null,
    status: null,
    page: 1,
    pageSize: appConfig.pagination.defaultPageSize,
  })

  const result = useAsyncData(() => UserService.list({ ...filters }), {
    watchSources: [() => ({ ...filters })],
  })

  // Cambiar un filtro debe devolver el listado a la primera página.
  watch(
    () => [filters.search, filters.role, filters.status],
    () => {
      filters.page = 1
    },
  )

  const items = computed<AppUser[]>(() => result.data.value?.items ?? [])
  const total = computed(() => result.data.value?.total ?? 0)

  const modalOpen = ref(false)
  const modalMode = ref<UserModalMode>('create')
  const editingId = ref<string | null>(null)
  const draft = reactive<UserDraft>(emptyDraft())
  const saving = ref(false)

  function openCreate(): void {
    modalMode.value = 'create'
    editingId.value = null
    Object.assign(draft, emptyDraft())
    modalOpen.value = true
  }

  function openEdit(user: AppUser): void {
    modalMode.value = 'edit'
    editingId.value = user.id
    Object.assign(draft, {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    modalOpen.value = true
  }

  function openView(user: AppUser): void {
    modalMode.value = 'view'
    editingId.value = user.id
    Object.assign(draft, {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    modalOpen.value = true
  }

  async function save(): Promise<void> {
    saving.value = true
    try {
      if (modalMode.value === 'edit' && editingId.value) {
        await UserService.update(editingId.value, { ...draft })
        message.success('Usuario actualizado')
      } else {
        await UserService.create({ ...draft })
        message.success('Usuario creado')
      }
      modalOpen.value = false
      await result.refresh()
    } catch (raw) {
      message.error(toDataSourceError(raw).message)
    } finally {
      saving.value = false
    }
  }

  async function remove(user: AppUser): Promise<void> {
    try {
      await UserService.remove(user.id)
      message.success(`Se eliminó a ${user.name}`)
      await result.refresh()
    } catch (raw) {
      message.error(toDataSourceError(raw).message)
    }
  }

  function changePage(page: number, pageSize: number): void {
    filters.page = page
    filters.pageSize = pageSize
  }

  return {
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
  }
}
