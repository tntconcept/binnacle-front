import {
  initialSettingsState,
  SettingsActions,
  reducer
} from './SettingsContext.reducer'

describe('Settings context reducer', () => {
  test.each`
    initialState            | action                                       | expectedState
    ${initialSettingsState} | ${SettingsActions.changeTheme('dark')}       | ${{ ...initialSettingsState, theme: 'dark' }}
    ${initialSettingsState} | ${SettingsActions.toggleDurationInput()}     | ${{ ...initialSettingsState, showDurationInput: true }}
    ${initialSettingsState} | ${SettingsActions.toggleDecimalTimeFormat()} | ${{ ...initialSettingsState, useDecimalTimeFormat: true }}
    ${initialSettingsState} | ${SettingsActions.toggleAutofillHours()}     | ${{ ...initialSettingsState, autofillHours: false }}
    ${initialSettingsState} | ${SettingsActions.toggleShowDescription()}   | ${{ ...initialSettingsState, showDescription: false }}
  `(
  'returns expected state when $action.type is performed',
  ({ initialState, action, expectedState }) => {
    expect(reducer(initialState, action)).toEqual(expectedState)
  }
)
})
