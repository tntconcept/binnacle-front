import React, { useContext, useEffect, useReducer, useState } from "react";
import { getLoggedUser, IUser } from "services/authService";
import {
  NotificationsContext,
  NotificationsProvider
} from "core/contexts/NotificationsContext";
import { bool, boolean } from "yup";
import { LoadingLayout } from "utils/HOCs/withSuspensePage";
import { Redirect } from "react-router-dom";
import { AuthContext } from "core/contexts/AuthContext";

interface UserContext {
  user?: IUser;
}

export const UserContext = React.createContext<UserContext>({
  user: undefined
});

interface IUserReducer {
  user?: IUser;
  loading: boolean;
  requestFailed: boolean;
}

const initialState: IUserReducer = {
  user: undefined,
  loading: false,
  requestFailed: false
};

const userReducer = (state: IUserReducer, action: any) => {
  switch (action.type) {
    case "request_starts": {
      return { ...state, loading: true };
    }
    case "save_user": {
      return { ...state, loading: false, user: action.user };
    }
    case "request_failed": {
      return { ...state, loading: false, requestFailed: true };
    }
    default: {
      throw Error;
    }
  }
};

export const UserProvider: React.FC = props => {
  const { handleLogout } = useContext(AuthContext);
  const addNotification = useContext(NotificationsContext);
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    dispatch({
      type: "request_starts"
    });

    getLoggedUser()
      .then(success =>
        dispatch({
          type: "save_user",
          user: success.data
        })
      )
      .catch(error => {
        addNotification(error!);
        handleLogout();
        dispatch({
          type: "request_failed"
        });
      });
  }, [addNotification, handleLogout]);

  if (state.loading) {
    return <LoadingLayout />;
  }

  if (state.requestFailed) {
    return <Redirect to="/login" />;
  }

  return (
    <UserContext.Provider
      value={{
        user: state.user
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
