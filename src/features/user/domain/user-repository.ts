import { UserInfo } from './user-info'

export interface UserRepository {
  logout(): Promise<void>
  getUsers(): Promise<UserInfo[]>
}
