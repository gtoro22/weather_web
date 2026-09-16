export type UserRole = 'administrador' | 'analista' | 'lector'
export type UserStatus = 'activo' | 'inactivo' | 'pendiente'

export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
  avatarUrl?: string
}

/** Payload de creación/edición: el id y la fecha los asigna el backend. */
export type UserDraft = Omit<AppUser, 'id' | 'createdAt'>

export interface UserFilters {
  search?: string
  role?: UserRole | null
  status?: UserStatus | null
  page?: number
  pageSize?: number
}
