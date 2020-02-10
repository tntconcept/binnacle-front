import React, {useReducer} from "react"
import {initialSettingsState, settingsReducer} from "core/contexts/SettingsContext/settingsReducer"
import {TSettingsActions} from "core/contexts/SettingsContext/settingsActions"

interface ISettingsContext {
  state: typeof initialSettingsState;
  dispatch: React.Dispatch<TSettingsActions>;
}

export const SettingsContext = React.createContext<ISettingsContext>(undefined!);

export const SettingsProvider: React.FC = props => {
  const [state, dispatch] = useReducer(settingsReducer, initialSettingsState);

  const value = { state, dispatch };
  return (
    <SettingsContext.Provider value={value}>
      <div
        className={`light-theme`}
        style={{
          height: "100%"
        }}
      >
        {props.children}
      </div>
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
