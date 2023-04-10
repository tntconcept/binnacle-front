import { Query, UseCaseKey } from '@archimedes/arch'
import { USER_SETTINGS_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { UserSettings } from '../domain/user-settings'
import type { UserSettingsRepository } from '../domain/user-settings-repository'

@UseCaseKey('GetUserSettingsQry')
@singleton()
export class GetUserSettingsQry extends Query<UserSettings> {
  constructor(
    @inject(USER_SETTINGS_REPOSITORY) private userSettingsRepository: UserSettingsRepository
  ) {
    super()
  }

  internalExecute(): Promise<UserSettings> {
    return this.userSettingsRepository.get()
  }
}
