import { singleton } from 'tsyringe'
import { UserSettings } from '../domain/user-settings'
import type { UserSettingsRepository } from '../domain/user-settings-repository'

@singleton()
export class FakeUserSettingsRepository implements UserSettingsRepository {
  private defaultSettings: UserSettings = {
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

  get(): UserSettings {
    return this.defaultSettings
  }

  async save(settings: UserSettings): Promise<void> {
    this.defaultSettings = settings
  }
}
