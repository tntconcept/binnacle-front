import { useEffect, useReducer } from 'react'
import {
  initialSettingsState,
  ISettingsState,
  reducer
} from 'features/Settings/reducer'
import { useDarkMode } from 'features/Settings/useDarkMode'

export const STORAGE_KEY = 'binnacle_settings'

const lazyInitFromStorage = (initialState: ISettingsState) => {
  const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
  return persisted !== null ? persisted : initialState
}

export function useSettings() {
  const [state, dispatch] = useReducer(
    reducer,
    initialSettingsState,
    lazyInitFromStorage
  )
  useDarkMode(state.theme)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return { state, dispatch }
}
