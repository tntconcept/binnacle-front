import { useEffect, useRef } from 'react'
import type { SettingsValues } from 'shared/data-access/state/SettingsValues.interface'

export function useAutoSave(
  values: SettingsValues,
  changeSettings: (settings: SettingsValues) => void
) {
  const oldStringifiedValue = useRef<string>('')

  useEffect(() => {
    const newStringifiedValue = JSON.stringify(values)

    if (oldStringifiedValue.current !== newStringifiedValue) {
      oldStringifiedValue.current = newStringifiedValue
      changeSettings(values)
    }
  }, [changeSettings, values])
}
