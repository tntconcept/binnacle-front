import { User } from './user'
import { UserInfo } from './user-info'

export interface SharedUserRepository {
  getUser(): Promise<User>
  getUsers(): Promise<UserInfo[]>
}
