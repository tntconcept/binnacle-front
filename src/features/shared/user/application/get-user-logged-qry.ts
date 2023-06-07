import { Query, UseCaseKey } from '@archimedes/arch'
import { SHARED_USER_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { User } from '../domain/user'
import type { SharedUserRepository } from '../domain/shared-user-repository'

@UseCaseKey('GetUserLoggedQry')
@singleton()
export class GetUserLoggedQry extends Query<User> {
  constructor(@inject(SHARED_USER_REPOSITORY) private userRepository: SharedUserRepository) {
    super()
  }

  internalExecute(): Promise<User> {
    return this.userRepository.getUser()
  }
}
