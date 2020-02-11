import React, {useEffect, useReducer} from "react"
import {initialSettingsState, settingsReducer} from "core/contexts/SettingsContext/settingsReducer"
import {TSettingsActions} from "core/contexts/SettingsContext/settingsActions"

interface ISettingsContext {
  state: typeof initialSettingsState;
  dispatch: React.Dispatch<TSettingsActions>;
}

export const SettingsContext = React.createContext<ISettingsContext>(undefined!);

export const SettingsProvider: React.FC = props => {
  const [state, dispatch] = useReducer(settingsReducer, initialSettingsState);

  useEffect(() => {
    if (state.theme === "light") {
      document.body.classList.remove('dark-theme')
      document.body.classList.add('light-theme')
    } else {
      document.body.classList.remove('light-theme')
      document.body.classList.add('dark-theme')
    }
  }, [state.theme])

  const value = { state, dispatch };
  return (
    <SettingsContext.Provider value={value}>
        {props.children}
    </SettingsContext.Provider>
  );
};

export const withSettingsProvider = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
): React.FunctionComponent<P> => {
  return (props: P) => {
    return (
      <SettingsProvider>
        <WrappedComponent {...props} />
      </SettingsProvider>
    );
  };
};
