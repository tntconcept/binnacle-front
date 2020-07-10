import { Theme } from 'features/Settings/reducer'
import { ActionType } from 'common/interfaces/ActionType'

export type TSettingsActions = ActionType<typeof SettingsActions>

export const SettingsActions = {
  changeTheme: (theme: Theme) => {
    return {
      type: 'CHANGE_THEME',
      theme
    } as const
  },
  saveHoursInterval: (hoursInterval: string[]) => {
    return {
      type: 'SAVE_HOURS_INTERVAL',
      hoursInterval
    } as const
  },
  toggleAutofillHours: () => {
    return {
      type: 'TOGGLE_AUTOFILL_HOURS'
    } as const
  },
  toggleSundayVisibility: () => {
    return {
      type: 'TOGGLE_SUNDAY_VISIBILITY'
    } as const
  },
  toggleSaturdayVisibility: () => {
    return {
      type: 'TOGGLE_SATURDAY_VISIBILITY'
    } as const
  },
  toggleDurationInput: () => {
    return {
      type: 'TOGGLE_DURATION_INPUT'
    } as const
  },
  toggleDecimalTimeFormat: () => {
    return {
      type: 'TOGGLE_DECIMAL_TYPE_FORMAT'
    } as const
  },
  toggleShowDescription: () => {
    return {
      type: 'TOGGLE_SHOW_DESCRIPTION'
    } as const
  }
}
