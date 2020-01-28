import produce from "immer"
import {TSettingsActions} from "core/contexts/SettingsContext/settingsActions"

export type Theme = "light" | "dark";

interface ISettingsState {
  theme: Theme;
  hoursInterval: string[];
  hideSaturday: boolean;
  hideSunday: boolean;
  showDurationInput: boolean;
  useDecimalTimeFormat: boolean;
}

export const initialSettingsState: ISettingsState = {
  theme: "light",
  hoursInterval: [],
  hideSaturday: false,
  hideSunday: false,
  showDurationInput: false,
  useDecimalTimeFormat: false
};

export const settingsReducer = (
  state: ISettingsState,
  action: TSettingsActions
): ISettingsState => {
  return produce(state, draft => {
    switch (action.type) {
      case "CHANGE_THEME": {
        draft.theme = action.theme
        break;
      }
      case "TOGGLE_SATURDAY_VISIBILITY": {
        draft.hideSaturday = !draft.hideSaturday
        break
      }
      case "TOGGLE_SUNDAY_VISIBILITY": {
        draft.hideSunday = !draft.hideSunday
        break
      }
      case "TOGGLE_DURATION_INPUT": {
        draft.showDurationInput = !draft.showDurationInput
        break
      }
      case "TOGGLE_DECIMAL_TYPE_FORMAT": {
        draft.useDecimalTimeFormat = !draft.useDecimalTimeFormat
        break
      }
      default:
        return draft;
    }
  });
};
