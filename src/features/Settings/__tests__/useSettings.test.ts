import { renderHook, act } from '@testing-library/react-hooks'
import { useSettings } from 'features/Settings/useSettings'
import { SettingsActions } from 'features/Settings/actions'
import { buildSettings, mockSettingsStorage } from 'utils/generateTestMocks'

describe('useSettings', () => {
  it('should initialize state from local storage', function() {
    const persistedSettings = buildSettings({ hideSaturday: true, theme: 'auto' })
    mockSettingsStorage(persistedSettings)

    const { result } = renderHook(() => useSettings())

    expect(result.current.state).toEqual(persistedSettings)
  })

  it('should persist the state on local storage after mount or a state change', function() {
    jest.spyOn(window.localStorage.__proto__, 'setItem')
    const { result } = renderHook(() => useSettings())

    expect(localStorage.setItem).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.dispatch(SettingsActions.toggleDecimalTimeFormat())
    })

    expect(localStorage.setItem).toHaveBeenCalledTimes(2)
  })
})
