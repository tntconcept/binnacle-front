import { User } from './user'

export interface SharedUserRepository {
  getUser(): Promise<User>
}
