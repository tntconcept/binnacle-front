import { User } from './user'

export interface UserRepository {
  getUser(): Promise<User>
  logout(): Promise<void>
}
