import { mock } from 'jest-mock-extended'
import { UserSettingsMother } from '../../../../../../test-utils/mothers/user-settings-mother'
import { UserSettingsRepository } from '../domain/user-settings-repository'
import { SaveUserSettingsCmd } from './save-user-settings.cmd'

describe('SaveUserSettingsCmd', () => {
  it('should save the user settings to the repository', async () => {
    const { saveUserSettingsRepository, mockLocalStorageUserSettingsRepository } = setup()
    await saveUserSettingsRepository.internalExecute(
      UserSettingsMother.userSettings({ isSystemTheme: true })
    )

    expect(mockLocalStorageUserSettingsRepository.save).toHaveBeenCalledWith(
      UserSettingsMother.userSettings({ isSystemTheme: true })
    )
  })
})

const setup = () => {
  const mockLocalStorageUserSettingsRepository = mock<UserSettingsRepository>()

  return {
    mockLocalStorageUserSettingsRepository,
    saveUserSettingsRepository: new SaveUserSettingsCmd(mockLocalStorageUserSettingsRepository)
  }
}
