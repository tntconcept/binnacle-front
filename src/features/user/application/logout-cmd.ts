import { Command, UseCaseKey } from '@archimedes/arch'
import { USER_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { UserRepository } from '../domain/user-repository'

@UseCaseKey('LogoutCmd')
@singleton()
export class LogoutCmd extends Command {
  constructor(@inject(USER_REPOSITORY) private userRepository: UserRepository) {
    super()
  }

  async internalExecute(): Promise<void> {
    await this.userRepository.logout()
  }
}
