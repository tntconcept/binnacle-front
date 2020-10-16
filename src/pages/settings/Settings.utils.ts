import { useTranslation } from 'react-i18next'

export interface SettingsValues {
  theme: 'light' | 'dark'
  language: 'es' | 'en'
  autofillHours: boolean
  hoursInterval: string[]
  showDurationInput: boolean
  useDecimalTimeFormat: boolean
  showDescription: boolean
}

export function useSettings(): SettingsValues {
  const { i18n } = useTranslation()

  const initialSettingsState = {
    theme: 'light',
    language: i18n.language.includes('es') ? 'es' : 'en',
    autofillHours: true,
    hoursInterval: ['09:00', '13:00', '14:00', '18:00'],
    showDurationInput: false,
    useDecimalTimeFormat: false,
    showDescription: true
  }

  return getFromLocalStorage(initialSettingsState as any)
}

export const STORAGE_KEY = 'binnacle_settings'

const getFromLocalStorage = (initialState: SettingsValues) => {
  const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
  return persisted !== null ? persisted : initialState
}

export const saveSettings = (values: SettingsValues) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
