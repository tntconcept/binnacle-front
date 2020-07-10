import { useEffect, useState } from 'react'
import { Theme } from './reducer'

const matchDark = '(prefers-color-scheme: dark)'

// By default should the light theme should be active
export function useDarkMode(theme: Theme) {
  const prefersDarkMode = usePrefersDarkMode(theme === 'auto')

  const isDark = theme === 'dark' || prefersDarkMode

  // add/removes dark theme class
  useEffect(() => {
    const className = 'dark-theme'
    if (isDark) {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }
  }, [isDark])

  return isDark
}

function usePrefersDarkMode(enabled: boolean) {
  const [prefersDark, setPrefersDark] = useState(
    window.matchMedia(matchDark).matches
  )

  // if the user has set a browser or OS preference for dark theme.
  // updates automatically to dark theme.
  useEffect(() => {
    const matcher = window.matchMedia(matchDark)

    function handleChange(event: MediaQueryListEvent) {
      enabled && setPrefersDark(event.matches)
    }

    matcher.addEventListener('change', handleChange)
    return () => {
      matcher.removeEventListener('change', handleChange)
    }
  }, [enabled])

  return prefersDark
}
