import produce from 'immer'
import { TSettingsActions } from 'features/Settings/actions'

export type Theme = 'light' | 'dark' | 'auto'

export interface ISettingsState {
  theme: Theme
  autofillHours: boolean
  hoursInterval: string[]
  showDurationInput: boolean
  useDecimalTimeFormat: boolean
  showDescription: boolean
}

export const initialSettingsState: ISettingsState = {
  theme: 'light',
  autofillHours: true,
  hoursInterval: ['09:00', '13:00', '14:00', '18:00'],
  showDurationInput: false,
  useDecimalTimeFormat: false,
  showDescription: true
}

export const reducer = (
  state: ISettingsState,
  action: TSettingsActions
): ISettingsState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'CHANGE_THEME': {
        draft.theme = action.theme
        break
      }
      case 'TOGGLE_AUTOFILL_HOURS': {
        draft.autofillHours = !draft.autofillHours
        if (draft.autofillHours) {
          draft.hoursInterval = []
        }
        break
      }
      case 'SAVE_HOURS_INTERVAL': {
        draft.hoursInterval = action.hoursInterval
        break
      }
      case 'TOGGLE_DURATION_INPUT': {
        draft.showDurationInput = !draft.showDurationInput
        break
      }
      case 'TOGGLE_DECIMAL_TYPE_FORMAT': {
        draft.useDecimalTimeFormat = !draft.useDecimalTimeFormat
        break
      }
      case 'TOGGLE_SHOW_DESCRIPTION': {
        draft.showDescription = !draft.showDescription
        break
      }
      default:
        return draft
    }
  })
}
