import React, { useRef } from "react";
import MessageHub from "core/contexts/NotificationsContext/MessageHub";

export const NotificationsContext = React.createContext((message: string) =>
  console.log("addNotification not implemented")
);

export const NotificationsProvider: React.FC = props => {
  const ref = useRef<String | null>(null);

  const addNotification = (message: string) => {
    // @ts-ignore
    ref.current(message);
  };

  return (
    <NotificationsContext.Provider value={addNotification}>
      <MessageHub children={(add: String | null) => (ref.current = add)} />
      {props.children}
    </NotificationsContext.Provider>
  );
};
