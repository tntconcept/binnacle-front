import { mock } from 'jest-mock-extended'
import { initialSettings, SettingsState, STORAGE_KEY } from 'shared/data-access/state/settings-state'
import type { SettingsValues } from 'shared/data-access/state/SettingsValues.interface'

describe('SettingsState', () => {
  it('should default to initial settings', function() {
    const { settingsState } = setup()

    expect(settingsState.settings).toEqual(initialSettings)
  })

  it('should load from storage', function() {
    const storageSettings = { ...initialSettings, autofillHours: false }

    const { settingsState, storage } = setup(storageSettings)

    expect(settingsState.settings).toEqual(storageSettings)
    expect(storage.getItem).toHaveBeenCalledWith(STORAGE_KEY)
  })

  it('should save settings', function() {
    const { settingsState, storage } = setup()

    settingsState.saveSettings({ foo: true } as any)

    expect(settingsState.settings).toEqual({ foo: true } as any)
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '{"foo":true}')
  })
})

function setup(storageSettings?: SettingsValues) {
  const storage = mock<Storage>()
  storage.getItem.mockReturnValue(
    storageSettings ? JSON.stringify(storageSettings) : null
  )

  return {
    settingsState: new SettingsState(storage),
    storage
  }
}
