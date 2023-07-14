import { Command, UseCaseKey } from '@archimedes/arch'
import { USER_SETTINGS_REPOSITORY } from '../../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { UserSettings } from '../domain/user-settings'
import type { UserSettingsRepository } from '../domain/user-settings-repository'

@UseCaseKey('SaveUserSettingsCmd')
@singleton()
export class SaveUserSettingsCmd extends Command<UserSettings> {
  constructor(
    @inject(USER_SETTINGS_REPOSITORY) private userSettingsRepository: UserSettingsRepository
  ) {
    super()
  }
  async internalExecute(settings: UserSettings): Promise<void> {
    this.userSettingsRepository.save(settings)
  }
}
