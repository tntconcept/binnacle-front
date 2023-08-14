import { describe, expect, test } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { UserSettingsMother } from '../../../../../../test-utils/mothers/user-settings-mother'
import { LocalStorageUserSettingsRepository } from './local-storage-user-settings-repository'

describe('LocalStorageUserSettingsRepository', () => {
  test('should get the user settings from localhost', async () => {
    const { mockStorage, localStorageUserSettingsRepository } = setup()
    localStorageUserSettingsRepository.get()
    expect(mockStorage.getItem).toHaveBeenCalledWith('_binnacle_settings_')
  })

  test('should save user settings in localhost', async () => {
    const { mockStorage, localStorageUserSettingsRepository } = setup()
    const userSettings = UserSettingsMother.userSettings()
    await localStorageUserSettingsRepository.save(userSettings)

    expect(mockStorage.setItem).toHaveBeenCalledWith(
      '_binnacle_settings_',
      JSON.stringify(userSettings)
    )
  })
})

const setup = () => {
  const mockStorage = mock<Storage>()
  return {
    mockStorage,
    localStorageUserSettingsRepository: new LocalStorageUserSettingsRepository(mockStorage)
  }
}
