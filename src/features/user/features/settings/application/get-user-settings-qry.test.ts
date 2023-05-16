import { GetUserSettingsQry } from './get-user-settings-qry'
import { mock } from 'jest-mock-extended'
import type { UserSettingsRepository } from '../domain/user-settings-repository'
import { UserSettingsMother } from '../../../../../test-utils/mothers/user-settings-mother'

describe('GetUserSettingsQry', () => {
  it('should get the user settings from the repository', async () => {
    const { getUserSettingsQry, mockLocalStorageUserSettingsRepository } = setup()

    mockLocalStorageUserSettingsRepository.get.mockReturnValue(UserSettingsMother.userSettings())
    const result = await getUserSettingsQry.internalExecute()

    expect(result).toEqual(UserSettingsMother.userSettings())
  })
})

const setup = () => {
  const mockLocalStorageUserSettingsRepository = mock<UserSettingsRepository>()

  return {
    mockLocalStorageUserSettingsRepository,
    getUserSettingsQry: new GetUserSettingsQry(mockLocalStorageUserSettingsRepository)
  }
}
