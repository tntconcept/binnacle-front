import { Query, UseCaseKey } from '@archimedes/arch'
import { USER_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { User } from '../domain/user'
import type { UserRepository } from '../domain/user-repository'

@UseCaseKey('GetUserLoggedQry')
@singleton()
export class GetUserLoggedQry extends Query<User> {
  constructor(@inject(USER_REPOSITORY) private userRepository: UserRepository) {
    super()
  }

  internalExecute(): Promise<User> {
    return this.userRepository.getUser()
  }
}
