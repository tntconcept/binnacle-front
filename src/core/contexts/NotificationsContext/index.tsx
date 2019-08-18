import React, { useEffect, useRef, useState } from "react";
import MessageHub from "core/contexts/NotificationsContext/MessageHub";

export const NotificationsContext = React.createContext(
  (message: Omit<Message, "id">) =>
    console.log("addNotification not implemented")
);

let id = 0;

export interface Message {
  id: number;
  title: string;
  description: string;
}

export const NotificationsProvider: React.FC = props => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addNotification = (message: Omit<Message, "id">) => {
    setMessages(prevState => [
      ...prevState,
      {
        id: id++,
        title: message.title,
        description: message.description
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
