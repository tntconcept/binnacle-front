import { singleton } from 'tsyringe'
import { AuthRepository } from '../domain/auth-repository'

@singleton()
export class FakeAuthRepository implements AuthRepository {
  async logout(): Promise<void> {}
}
