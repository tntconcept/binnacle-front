import { Query, UseCaseKey } from '@archimedes/arch'
import { USER_REPOSITORY } from '../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { UserRepository } from '../domain/user-repository'
import { UserInfo } from '../domain/user-info'
import { Id } from '../../../../shared/types/id'

interface GetUsersParams {
  ids?: Id[]
  active?: boolean
}

@UseCaseKey('GetUsersListQry')
@singleton()
export class GetUsersListQry extends Query<UserInfo[], GetUsersParams> {
  constructor(@inject(USER_REPOSITORY) private userRepository: UserRepository) {
    super()
  }

  internalExecute(params: GetUsersParams): Promise<UserInfo[]> {
    return this.userRepository.getUsers(params?.ids, params?.active)
  }
}
