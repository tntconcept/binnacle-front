import { renderHook } from '@testing-library/react-hooks'
import { useAutoSave } from './use-auto-save'

describe('useAutoSave', () => {
  it('should save only when value changes', function () {
    const valueMock = { foo: true } as any
    const changeSettingsMock = jest.fn()
    const hook = renderHook(() => useAutoSave(valueMock, changeSettingsMock, false))

    expect(changeSettingsMock).toHaveBeenCalledWith(valueMock)
    expect(changeSettingsMock).toHaveBeenCalledTimes(1)

    hook.rerender()

    expect(changeSettingsMock).not.toHaveBeenCalledTimes(2)
  })
})
