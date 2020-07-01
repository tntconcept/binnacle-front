import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Message } from 'features/Notifications/index'
import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg'
import { ReactComponent as CloseNotificationIcon } from 'assets/icons/close_notification.svg'
import styles from 'features/Notifications/Notification.module.css'

interface MessageHubProps {
  messages: Message[]
  removeMessage: (id: number) => void
}

const NotificationList: React.FC<MessageHubProps> = (props) => {
  return (
    <div className={styles.container}>
      <AnimatePresence initial={false}>
        {props.messages.map((message) => (
          <Notification
            key={message.id}
            message={message}
            removeMessage={props.removeMessage}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

const Notification: React.FC<{
  message: Message
  removeMessage: (id: number) => void
}> = ({ removeMessage, message }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeMessage(message.id)
    }, 3000)
    return () => clearTimeout(timer)
  }, [message, removeMessage])

  return (
    <motion.div
      className={styles.content}
      positionTransition
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    >
      <div className={styles.error}>
        <WarningIcon />
      </div>
      <div
        aria-live="polite"
        className={styles.message}>
        <p className={styles.title}>{message.title}</p>
        <p>{message.description}</p>
      </div>
      <CloseButton close={() => removeMessage(message.id)} />
    </motion.div>
  )
}

const CloseButton: React.FC<{ close: any }> = ({ close }) => (
  <button
    className={styles.closeButton}
    onClick={close}
    data-testid="close_notification"
  >
    <CloseNotificationIcon />
  </button>
)

export default NotificationList
