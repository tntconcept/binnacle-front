import { mock } from 'jest-mock-extended'
import { UserSettingsMother } from '../../../../../../test-utils/mothers/user-settings-mother'
import type { UserSettingsRepository } from '../domain/user-settings-repository'
import { GetUserSettingsQry } from './get-user-settings-qry'

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
