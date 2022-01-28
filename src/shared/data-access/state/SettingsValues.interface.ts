export interface HoursInterval {
  startWorkingTime: string
  startLunchBreak: string
  endLunchBreak: string
  endWorkingTime: string
}

export interface SettingsValues {
  isSystemTheme: boolean
  autofillHours: boolean
  hoursInterval: HoursInterval
  showDurationInput: boolean
  useDecimalTimeFormat: boolean
  showDescription: boolean
}
