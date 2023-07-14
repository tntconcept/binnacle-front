import { Query, UseCaseKey } from '@archimedes/arch'
import { SHARED_USER_REPOSITORY } from '../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { SharedUserRepository } from '../domain/shared-user-repository'
import { UserInfo } from '../domain/user-info'

@UseCaseKey('GetUsersListQry')
@singleton()
export class GetUsersListQry extends Query<UserInfo[]> {
  constructor(@inject(SHARED_USER_REPOSITORY) private userRepository: SharedUserRepository) {
    super()
  }

  internalExecute(): Promise<UserInfo[]> {
    return this.userRepository.getUsers()
  }
}
