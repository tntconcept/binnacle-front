import React, { useEffect } from "react";
import NotificationStyles from "core/contexts/NotificationsContext/notificationStyles";
import { AnimatePresence, motion } from "framer-motion";
import { Message } from "core/contexts/NotificationsContext/index";

interface MessageHubProps {
  messages: Message[];
  removeMessage: (id: number) => void;
}

export const CloseButton: React.FC<{ close: any }> = ({ close }) => (
  <NotificationStyles.CloseButton onClick={close}>
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9">
      <path
        d="M5.795 4.644a.2.2 0 0 1 0-.288l3.082-3.082A.444.444 0 0 0 9 .986.444.444 0 0 0 8.877.7L8.3.123A.444.444 0 0 0 8.014 0a.373.373 0 0 0-.288.123L4.644 3.205a.2.2 0 0 1-.288 0L1.274.123A.444.444 0 0 0 .986 0 .444.444 0 0 0 .7.123L.123.7A.444.444 0 0 0 0 .986a.444.444 0 0 0 .123.288l3.082 3.082a.2.2 0 0 1 0 .288L.123 7.726a.4.4 0 0 0 0 .575l.577.576A.444.444 0 0 0 .986 9a.444.444 0 0 0 .288-.123l3.082-3.082a.2.2 0 0 1 .288 0l3.082 3.082a.4.4 0 0 0 .575 0l.576-.577a.4.4 0 0 0 0-.575z"
        fill="white"
      />
    </svg>
  </NotificationStyles.CloseButton>
);

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
      positionTransition
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    >
      <NotificationStyles.Error>
        <svg
          width="4.179"
          height="19.468"
          viewBox="0 0 4.179 19.468">
          <path
            fill="#e03737"
            d="M206.4,84.4l-.443-6.159q-.125-1.8-.124-2.584a2.243,2.243,0,0,1,.6-1.665,2.148,2.148,0,0,1,1.584-.6,1.626,1.626,0,0,1,1.592.765,4.863,4.863,0,0,1,.4,2.2,15.807,15.807,0,0,1-.1,1.723l-.6,6.339a4.661,4.661,0,0,1-.416,1.737,1.1,1.1,0,0,1-1.051.6,1.055,1.055,0,0,1-1.038-.585A5.452,5.452,0,0,1,206.4,84.4Zm1.536,8.461a2.273,2.273,0,0,1-1.474-.507,1.72,1.72,0,0,1-.629-1.421,1.787,1.787,0,0,1,.6-1.357,2.086,2.086,0,0,1,1.474-.559,2.134,2.134,0,0,1,1.488.559,1.767,1.767,0,0,1,.616,1.357,1.735,1.735,0,0,1-.623,1.414A2.212,2.212,0,0,1,207.933,92.859Z"
            transform="translate(-205.83 -73.391)"
          />
        </svg>
      </NotificationStyles.Error>
      <NotificationStyles.Message>
        <NotificationStyles.Title>
          Acceso no autorizado
        </NotificationStyles.Title>
        <NotificationStyles.Description>
          Verifica tu usuario y contraseña.
        </NotificationStyles.Description>
      </NotificationStyles.Message>
      <CloseButton
        close={() => {
          console.log(message.id + " clicked");
          removeMessage(message.id);
        }}
      />
    </NotificationStyles.Content>
  );
};

const MessageHub: React.FC<MessageHubProps> = props => {
  return (
    <NotificationStyles.Container>
      <AnimatePresence initial={false}>
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
