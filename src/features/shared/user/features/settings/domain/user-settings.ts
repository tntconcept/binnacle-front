import { HoursIntervalSetting } from './hours-interval-setting'

export interface UserSettings {
  isSystemTheme: boolean
  autofillHours: boolean
  hoursInterval: HoursIntervalSetting
  showDurationInput: boolean
  useDecimalTimeFormat: boolean
  showDescription: boolean
}
