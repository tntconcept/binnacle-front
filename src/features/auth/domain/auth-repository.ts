import { UserCredentials } from './user-credentials'

export interface AuthRepository {
  logout(): Promise<void>

  login(credentials: UserCredentials): Promise<void>
}
