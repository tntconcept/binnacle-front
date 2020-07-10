import { renderHook, act } from '@testing-library/react-hooks'
import { useDarkMode } from 'features/Settings/useDarkMode'

var callback: (foo: any) => void

// used to detect if the user prefers the dark theme
function createMatchMedia(matches: boolean): (query: any) => MediaQueryList {
  const matchMedia = (query: any) => {
    return ({
      matches,
      addEventListener: (type: any, listener: any) => {
        callback = listener
      },
      removeEventListener: () => {}
    } as unknown) as MediaQueryList
  }

  return matchMedia
}

describe('useDarkMode', () => {
  it('should be dark when the theme is dark', function() {
    window.matchMedia = createMatchMedia(false)
    const { result } = renderHook(() => useDarkMode('dark'))

    expect(result.current).toBeTruthy()
  })

  it('should be dark when the user OS or Browser prefers the dark mode', function() {
    window.matchMedia = createMatchMedia(true)
    const { result } = renderHook(() => useDarkMode('light'))

    expect(result.current).toBeTruthy()
  })

  it('should be light', function() {
    window.matchMedia = createMatchMedia(false)
    const { result } = renderHook(() => useDarkMode('light'))

    expect(result.current).toBeFalsy()
  })

  it('should update dark value when the OS or Browser dark theme preference change', function() {
    window.matchMedia = createMatchMedia(false)
    const { result } = renderHook(() => useDarkMode('auto'))
    expect(result.current).toBeFalsy()

    act(() => {
      callback({ matches: true })
    })

    expect(result.current).toBeTruthy()
  })
})
