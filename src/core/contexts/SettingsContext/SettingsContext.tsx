import React, {useEffect, useReducer} from "react"
import {initialSettingsState, ISettingsState, settingsReducer} from "core/contexts/SettingsContext/SettingsReducer"
import {TSettingsActions} from "core/contexts/SettingsContext/SettingsActions"

export const STORAGE_KEY = "binnacle_settings";

interface ISettingsContext {
  state: ISettingsState;
  dispatch: React.Dispatch<TSettingsActions>;
}

export const SettingsContext = React.createContext<ISettingsContext>(
  undefined!
);

const lazyInitFromStorage = (initialState: ISettingsState) => {
  const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
  return persisted !== null ? persisted : initialState;
};

export const SettingsProvider: React.FC = props => {
  const [state, dispatch] = useReducer(
    settingsReducer,
    initialSettingsState,
    lazyInitFromStorage
  );

  useEffect(() => {
    if (state.theme === "light") {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    }
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = { state, dispatch };
  return (
    <SettingsContext.Provider value={value}>
      {props.children}
    </SettingsContext.Provider>
  );
};
