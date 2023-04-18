import { STORAGE } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { UserSettings } from '../domain/user-settings'
import type { UserSettingsRepository } from '../domain/user-settings-repository'

const defaultSettings: UserSettings = {
  isSystemTheme: true,
  autofillHours: true,
  hoursInterval: {
    startWorkingTime: '09:00',
    startLunchBreak: '13:00',
    endLunchBreak: '14:00',
    endWorkingTime: '18:00'
  },
  showDurationInput: false,
  useDecimalTimeFormat: false,
  showDescription: true
}

@singleton()
export class LocalStorageUserSettingsRepository implements UserSettingsRepository {
  protected static STORAGE_KEY = '_binnacle_settings_'

  constructor(@inject(STORAGE) private storage: Storage) {}

  get(): UserSettings {
    const savedSettings =
      this.storage.getItem(LocalStorageUserSettingsRepository.STORAGE_KEY) || 'null'

    if (savedSettings === null) return defaultSettings

    return JSON.parse(savedSettings)
  }

  async save(settings: UserSettings): Promise<void> {
    this.storage.setItem(LocalStorageUserSettingsRepository.STORAGE_KEY, JSON.stringify(settings))
  }
}
