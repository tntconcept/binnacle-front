import { Command, UseCaseKey } from '@archimedes/arch'
import { inject, singleton } from 'tsyringe'
import { AUTH_REPOSITORY } from '../../../shared/di/container-tokens'
import type { AuthRepository } from '../domain/auth-repository'
import { UserCredentials } from '../domain/user-credentials'

@UseCaseKey('LoginCmd')
@singleton()
export class LoginCmd extends Command<UserCredentials> {
  constructor(@inject(AUTH_REPOSITORY) private userRepository: AuthRepository) {
    super()
  }

  async internalExecute(userCredentials: UserCredentials): Promise<void> {
    await this.userRepository.login(userCredentials)
  }
}
