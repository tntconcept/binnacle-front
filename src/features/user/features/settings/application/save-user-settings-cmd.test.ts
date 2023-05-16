import { SaveUserSettingsCmd } from './save-user-settings-cmd'
import { UserSettings } from '../domain/user-settings'
import { mock } from 'jest-mock-extended'
import { UserSettingsRepository } from '../domain/user-settings-repository'

describe('SaveUserSettingsCmd', () => {
  it('should save the user settings to the repository', async () => {
    const { saveUserSettingsRepository, mockLocalStorageUserSettingsRepository } = setup()
    const expectedUserSettings: UserSettings = {
      autofillHours: true,
      hoursInterval: {
        endLunchBreak: '15:00',
        endWorkingTime: '20:00',
        startLunchBreak: '14:00',
        startWorkingTime: '08:00'
      },
      isSystemTheme: false,
      showDurationInput: true,
      useDecimalTimeFormat: false,
      showDescription: true
    }

    await saveUserSettingsRepository.internalExecute(expectedUserSettings)

    expect(mockLocalStorageUserSettingsRepository.save).toHaveBeenCalledWith(expectedUserSettings)
  })
})

const setup = () => {
  const mockLocalStorageUserSettingsRepository = mock<UserSettingsRepository>()

  return {
    mockLocalStorageUserSettingsRepository,
    saveUserSettingsRepository: new SaveUserSettingsCmd(mockLocalStorageUserSettingsRepository)
  }
}
