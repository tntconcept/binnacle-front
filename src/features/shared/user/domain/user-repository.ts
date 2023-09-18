import { User } from './user'
import { UserInfo } from './user-info'
import { Id } from '../../../../shared/types/id'

export interface UserRepository {
  getUser(): Promise<User>

  getUsers(ids?: Id[], active?: boolean): Promise<UserInfo[]>
}
