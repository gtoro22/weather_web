import type { AppUser, Paginated, UserDraft, UserFilters } from '@/types'
import { toDataSourceError } from '@/types'
import { getRepositories } from './data-source.factory'

class UserServiceImpl {
  async list(filters: UserFilters): Promise<Paginated<AppUser>> {
    try {
      return await getRepositories().users.list(filters)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async create(draft: UserDraft): Promise<AppUser> {
    try {
      return await getRepositories().users.create(draft)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async update(id: string, draft: UserDraft): Promise<AppUser> {
    try {
      return await getRepositories().users.update(id, draft)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await getRepositories().users.remove(id)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }
}

export const UserService = new UserServiceImpl()
