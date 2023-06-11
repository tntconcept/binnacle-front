import { UserSettings } from '../../features/shared/user/features/settings/domain/user-settings'

export class UserSettingsMother {
  static userSettings(override?: Partial<UserSettings>): UserSettings {
    return {
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
      showDescription: true,
      ...override
    }
  }
}
