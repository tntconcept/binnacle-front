import { User } from './user'
import { UserInfo } from './user-info'

export interface UserRepository {
  getUser(): Promise<User>
  getUsers(): Promise<UserInfo[]>
}
