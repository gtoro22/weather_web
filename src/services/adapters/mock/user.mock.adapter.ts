import type { UserRepository } from '@/services/repositories'
import type { AppUser, Paginated, UserDraft, UserFilters } from '@/types'
import { DataSourceError } from '@/types'
import { simulateNetwork } from '@/utils'
import { initialsAvatar, MOCK_USERS } from '@/modules/users/mocks/users.mock'

export class MockUserAdapter implements UserRepository {
  /** Copia mutable: las altas y ediciones viven en memoria durante la sesión. */
  private users: AppUser[] = [...MOCK_USERS]

  async list(filters: UserFilters): Promise<Paginated<AppUser>> {
    await simulateNetwork('los usuarios')
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 8
    const term = filters.search?.trim().toLowerCase() ?? ''

    const filtered = this.users.filter((user) => {
      const matchesTerm =
        !term || user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
      const matchesRole = !filters.role || user.role === filters.role
      const matchesStatus = !filters.status || user.status === filters.status
      return matchesTerm && matchesRole && matchesStatus
    })

    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
    }
  }

  async getById(id: string): Promise<AppUser> {
    await simulateNetwork('el usuario')
    return this.findOrThrow(id)
  }

  async create(draft: UserDraft): Promise<AppUser> {
    await simulateNetwork('la creación del usuario')
    this.assertEmailAvailable(draft.email)
    const user: AppUser = {
      ...draft,
      id: `u${String(Date.now()).slice(-8)}`,
      createdAt: new Date().toISOString(),
      avatarUrl: initialsAvatar(draft.name),
    }
    this.users = [user, ...this.users]
    return user
  }

  async update(id: string, draft: UserDraft): Promise<AppUser> {
    await simulateNetwork('la actualización del usuario')
    const current = this.findOrThrow(id)
    this.assertEmailAvailable(draft.email, id)
    const updated: AppUser = { ...current, ...draft, avatarUrl: initialsAvatar(draft.name) }
    this.users = this.users.map((user) => (user.id === id ? updated : user))
    return updated
  }

  async remove(id: string): Promise<void> {
    await simulateNetwork('la eliminación del usuario')
    this.findOrThrow(id)
    this.users = this.users.filter((user) => user.id !== id)
  }

  private findOrThrow(id: string): AppUser {
    const user = this.users.find((item) => item.id === id)
    if (!user) {
      throw new DataSourceError('El usuario solicitado no existe', {
        code: 'NOT_FOUND',
        status: 404,
      })
    }
    return user
  }

  private assertEmailAvailable(email: string, exceptId?: string): void {
    const taken = this.users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.id !== exceptId,
    )
    if (taken) {
      throw new DataSourceError('Ya existe un usuario con ese correo', {
        code: 'EMAIL_TAKEN',
        status: 409,
      })
    }
  }
}
