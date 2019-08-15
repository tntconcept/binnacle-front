import React, { useEffect, useRef, useState } from "react";
import MessageHub from "core/contexts/NotificationsContext/MessageHub";

export const NotificationsContext = React.createContext((message: string) =>
  console.log("addNotification not implemented")
);

let id = 0;

export interface Message {
  id: number;
  content: string;
}

export const NotificationsProvider: React.FC = props => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addNotification = (message: string) => {
    console.log(id);
    setMessages(prevState => [
      ...prevState,
      {
        id: id++,
        content: message
      }
    ]);
  };

  const removeMessage = (id: number) => {
    setMessages(message => message.filter(element => element.id !== id));
  };

  return (
    <NotificationsContext.Provider value={addNotification}>
      <MessageHub
        messages={messages}
        removeMessage={removeMessage} />
      {props.children}
    </NotificationsContext.Provider>
  );
};
