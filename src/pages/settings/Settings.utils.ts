import { useTranslation } from 'react-i18next'
import { useColorMode } from '@chakra-ui/core'

export interface SettingsValues {
  language: 'es' | 'en'
  darkMode: boolean
  autofillHours: boolean
  hoursInterval: string[]
  showDurationInput: boolean
  useDecimalTimeFormat: boolean
  showDescription: boolean
}

export function useSettings(): SettingsValues {
  const { i18n } = useTranslation()
  const { colorMode } = useColorMode()

  const defaultSettingsState = {
    darkMode: colorMode === 'dark',
    language: i18n.language.includes('es') ? 'es' : 'en',
    autofillHours: true,
    hoursInterval: ['09:00', '13:00', '14:00', '18:00'],
    showDurationInput: false,
    useDecimalTimeFormat: false,
    showDescription: true
  }

  return getFromLocalStorageOrDefault(defaultSettingsState as any)
}

export const STORAGE_KEY = 'binnacle_settings'

const getFromLocalStorageOrDefault = (initialState: SettingsValues) => {
  const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
  return persisted !== null ? persisted : initialState
}

export const saveSettings = (values: SettingsValues) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
