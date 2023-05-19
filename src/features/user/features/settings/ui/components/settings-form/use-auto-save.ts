import { useEffect, useRef } from 'react'
import { UserSettings } from '../../../domain/user-settings'

export function useAutoSave(
  values: UserSettings,
  changeSettings: (settings: UserSettings) => void,
  hasHoursIntervalError: boolean
) {
  const oldStringifiedValue = useRef<string>('')

  useEffect(() => {
    const newStringifiedValue = JSON.stringify(values)

    if (!hasHoursIntervalError) {
      if (oldStringifiedValue.current !== newStringifiedValue) {
        oldStringifiedValue.current = newStringifiedValue
        changeSettings(values)
      }
    }
  }, [changeSettings, values, hasHoursIntervalError])
}
