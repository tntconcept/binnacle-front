import { Command, UseCaseKey } from '@archimedes/arch'
import { AUTH_REPOSITORY } from '../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { AuthRepository } from '../domain/auth-repository'

@UseCaseKey('LogoutCmd')
@singleton()
export class LogoutCmd extends Command {
  constructor(@inject(AUTH_REPOSITORY) private userRepository: AuthRepository) {
    super()
  }

  async internalExecute(): Promise<void> {
    await this.userRepository.logout()
  }
}
