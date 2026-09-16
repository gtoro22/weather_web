import type { AppUser, Paginated, UserDraft, UserFilters } from '@/types'

export interface UserRepository {
  list(filters: UserFilters): Promise<Paginated<AppUser>>
  getById(id: string): Promise<AppUser>
  create(draft: UserDraft): Promise<AppUser>
  update(id: string, draft: UserDraft): Promise<AppUser>
  remove(id: string): Promise<void>
}
