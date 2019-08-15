import React, { useEffect } from "react";
import NotificationStyles from "core/contexts/NotificationsContext/notificationStyles";
import { AnimatePresence } from "framer-motion";
import { Message } from "core/contexts/NotificationsContext/index";

interface MessageHubProps {
  messages: Message[];
  removeMessage: (id: number) => void;
}

const spring = {
  type: "spring",
  damping: 10,
  stiffness: 100,
  velocity: 4
};

const MessageComponent: React.FC<{
  message: Message;
  removeMessage: (id: number) => void;
}> = ({ removeMessage, message }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeMessage(message.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, removeMessage]);

  return (
    <NotificationStyles.Content
      key={message.id}
      positionTransition={spring}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <NotificationStyles.Message>{message.content}</NotificationStyles.Message>
    </NotificationStyles.Content>
  );
};

const MessageHub: React.FC<MessageHubProps> = props => {
  return (
    <NotificationStyles.Container>
      <AnimatePresence>
        {props.messages.map(message => (
          <MessageComponent
            key={message.id}
            message={message}
            removeMessage={props.removeMessage}
          />
        ))}
      </AnimatePresence>
    </NotificationStyles.Container>
  );
};

export default MessageHub;
