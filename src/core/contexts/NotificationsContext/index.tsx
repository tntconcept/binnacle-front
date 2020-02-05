import React, {useCallback, useState} from "react"
import Notification from "core/contexts/NotificationsContext/Notification"

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

// const NotificationsDispatch = React.createContext(null);
//
// function TodosApp() {
//   // Note: `dispatch` won't change between re-renders
//   const [todos, dispatch] = useReducer(todosReducer);
//
//   return (
//     <TodosDispatch.Provider value={dispatch}>
//       <DeepTree todos={todos} />
//     </TodosDispatch.Provider>
//   );
// }

export const NotificationsProvider: React.FC = props => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addNotification = useCallback((message: Omit<Message, "id">) => {
    setMessages(prevState => [
      ...prevState,
      {
        id: id++,
        title: message.title,
        description: message.description
      }
    ]);
  }, []);

  const removeMessage = useCallback((id: number) => {
    setMessages(message => message.filter(element => element.id !== id));
  }, []);

  return (
    <NotificationsContext.Provider value={addNotification}>
      <Notification
        messages={messages}
        removeMessage={removeMessage} />
      {props.children}
    </NotificationsContext.Provider>
  );
};
