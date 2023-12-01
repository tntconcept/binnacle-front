import { User } from './user'
import { UserInfo } from './user-info'
import { UserFilters } from './user-filters'

export interface UserRepository {
  getUser(): Promise<User>

  getUsers(filters?: UserFilters): Promise<UserInfo[]>
}
