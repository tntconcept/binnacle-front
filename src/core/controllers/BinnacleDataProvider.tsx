import React from "react"
import useBinnacleReducer, {initialBinnacleState} from "core/controllers/useBinnacleReducer"
import {TBinnacleActions} from "core/controllers/binnacleActions"

type BinnacleData = {
  state: typeof initialBinnacleState;
  dispatch: React.Dispatch<TBinnacleActions>;
};

export const BinnacleDataContext = React.createContext<BinnacleData>(
  undefined!
);

const BinnacleDataProvider: React.FC = props => {
  const [state, dispatch] = useBinnacleReducer();

  return (
    <BinnacleDataContext.Provider
      value={{
        state,
        dispatch
      }}
    >
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
