import type { User } from 'shared/api/users/User'

export interface UserRepository {
  getUser(): Promise<User>
  logout(): Promise<void>
}
