import React, {useReducer} from "react"
import {binnacleReducer, initialBinnacleState} from "core/contexts/BinnacleContext/binnacleReducer"
import {TBinnacleActions} from "core/contexts/BinnacleContext/binnacleActions"

type BinnacleData = {
  state: typeof initialBinnacleState;
  dispatch: React.Dispatch<TBinnacleActions>;
};

export const BinnacleDataContext = React.createContext<BinnacleData>(
  undefined!
);

export const BinnacleDataProvider: React.FC = props => {
  const [state, dispatch] = useReducer(binnacleReducer, initialBinnacleState);

  const value = { state, dispatch };
  return (
    <BinnacleDataContext.Provider value={value}>
      {props.children}
    </BinnacleDataContext.Provider>
  );
};

export const withBinnacleDataProvider = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
): React.FunctionComponent<P> => {
  return (props: P) => {
    return (
      <BinnacleDataProvider>
        <WrappedComponent {...props} />
      </BinnacleDataProvider>
    );
  };
};
