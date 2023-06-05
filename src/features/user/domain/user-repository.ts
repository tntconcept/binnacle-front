import { User } from './user'
import { UserInfo } from './user-info'

export interface UserRepository {
  getUser(): Promise<User>
  logout(): Promise<void>
  getUsers(): Promise<UserInfo[]>
}
