import {initialSettingsState, settingsReducer} from "core/contexts/SettingsContext/SettingsReducer"
import {SettingsActions} from "core/contexts/SettingsContext/SettingsActions"

describe("settingsReducer", () => {
  test.each`
    initialState    | action    | expectedState
    ${initialSettingsState} | ${SettingsActions.changeTheme("dark")} | ${{...initialSettingsState, theme: "dark"}}
    ${initialSettingsState} | ${SettingsActions.toggleSaturdayVisibility()} | ${{...initialSettingsState, hideSaturday: true}}
    ${initialSettingsState} | ${SettingsActions.toggleSundayVisibility()} | ${{...initialSettingsState, hideSunday: true}}
    ${initialSettingsState} | ${SettingsActions.toggleDurationInput()} | ${{...initialSettingsState, showDurationInput: true}}
    ${initialSettingsState} | ${SettingsActions.toggleDecimalTimeFormat()} | ${{...initialSettingsState, useDecimalTimeFormat: true}}
    ${initialSettingsState} | ${SettingsActions.toggleAutofillHours()} | ${{...initialSettingsState, autofillHours: false}}
  `("returns expected state when $action.type is performed", ({initialState, action, expectedState}) => {
  expect(settingsReducer(initialState, action)).toEqual(expectedState)
})
})
