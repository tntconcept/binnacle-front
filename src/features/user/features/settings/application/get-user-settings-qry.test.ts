import { GetUserSettingsQry } from './get-user-settings-qry'
import { UserSettings } from '../domain/user-settings'
import { mock } from 'jest-mock-extended'
import type { UserSettingsRepository } from '../domain/user-settings-repository'

describe('GetUserSettingsQry', () => {
  it('should get the user settings from the repository', async () => {
    const { getUserSettingsQry, mockLocalStorageUserSettingsRepository } = setup()
    const expectedUserSettings: UserSettings = {
      autofillHours: true,
      hoursInterval: {
        endLunchBreak: '14:00',
        endWorkingTime: '18:00',
        startLunchBreak: '13:00',
        startWorkingTime: '09:00'
      },
      isSystemTheme: false,
      showDurationInput: true,
      useDecimalTimeFormat: false,
      showDescription: true
    }

    mockLocalStorageUserSettingsRepository.get.mockReturnValue(expectedUserSettings)
    const result = await getUserSettingsQry.internalExecute()

    expect(result).toEqual(expectedUserSettings)
  })
})

const setup = () => {
  const mockLocalStorageUserSettingsRepository = mock<UserSettingsRepository>()

  return {
    mockLocalStorageUserSettingsRepository,
    getUserSettingsQry: new GetUserSettingsQry(mockLocalStorageUserSettingsRepository)
  }
}
