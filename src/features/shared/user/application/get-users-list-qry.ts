import { Query, UseCaseKey } from '@archimedes/arch'
import { USER_REPOSITORY } from '../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { UserRepository } from '../domain/user-repository'
import { UserInfo } from '../domain/user-info'

@UseCaseKey('GetUsersListQry')
@singleton()
export class GetUsersListQry extends Query<UserInfo[]> {
  constructor(@inject(USER_REPOSITORY) private userRepository: UserRepository) {
    super()
  }

  internalExecute(): Promise<UserInfo[]> {
    return this.userRepository.getUsers()
  }
}
