import { inject, singleton } from 'tsyringe'
import { AUTH_REPOSITORY, USER_REPOSITORY } from '../../../shared/di/container-tokens'
import { Query, UseCaseKey } from '@archimedes/arch'
import { UserCredentials } from '../domain/user-credentials'
import { User } from '../../shared/user/domain/user'
import type { AuthRepository } from '../domain/auth-repository'
import type { UserRepository } from '../../shared/user/domain/user-repository'

@UseCaseKey('LoginAndCheckUser')
@singleton()
export class LoginAndCheckUser extends Query<User, UserCredentials> {
  constructor(
    @inject(AUTH_REPOSITORY) private authRepository: AuthRepository,
    @inject(USER_REPOSITORY) private userRepository: UserRepository
  ) {
    super()
  }

  async internalExecute(userCredentials: UserCredentials): Promise<User> {
    await this.authRepository.login(userCredentials)
    return this.userRepository.getUser()
  }
}
