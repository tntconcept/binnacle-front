import React, {
  Dispatch,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer
} from 'react'
import {
  initialSettingsState,
  reducer,
  TSettingsActions
} from 'core/components/SettingsContext.reducer'

type SettingsValue = [typeof initialSettingsState, Dispatch<TSettingsActions>]

export const SettingsContext = React.createContext<SettingsValue | undefined>(
  undefined
)

export const STORAGE_KEY = 'binnacle_settings'

const lazyInitFromStorage = (initialState: typeof initialSettingsState) => {
  const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
  return persisted !== null ? persisted : initialState
}

export function SettingsContextProvider(props: PropsWithChildren<any>) {
  const value = useReducer(reducer, initialSettingsState, lazyInitFromStorage)
  const settings = value[0]

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <SettingsContext.Provider value={value}>
      {props.children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error('The component must be wrapped in a SettingsContextProvider')
  }

  return context
}
