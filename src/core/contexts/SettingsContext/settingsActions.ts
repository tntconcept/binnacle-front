import {Theme} from "core/contexts/SettingsContext/settingsReducer"
import {ActionType} from "interfaces/ActionType"

export type TSettingsActions = ActionType<typeof SettingsActions>;

export const SettingsActions = {
  changeTheme: (theme: Theme) => {
    return {
      type: "CHANGE_THEME",
      theme
    } as const;
  },
  toggleSundayVisibility: () => {
    return {
      type: "TOGGLE_SUNDAY_VISIBILITY",
    } as const;
  },
  toggleSaturdayVisibility: () => {
    return {
      type: "TOGGLE_SATURDAY_VISIBILITY",
    } as const;
  },
  toggleDurationInput: () => {
    return {
      type: "TOGGLE_DURATION_INPUT",
    } as const;
  },
  toggleDecimalTimeFormat: () => {
    return {
      type: "TOGGLE_DECIMAL_TYPE_FORMAT",
    } as const;
  },
}