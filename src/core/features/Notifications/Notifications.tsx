import React, { useCallback, useContext, useState } from 'react'
import NotificationList from 'core/features/Notifications/NotificationList'
import getMessageByHttpStatusCode from 'core/features/Notifications/HttpStatusCodeMessage'

type MessageFn = (message: Omit<Message, 'id'>) => void

export const NotificationsContext = React.createContext<MessageFn>(undefined!)

let id = 0

export interface Message {
  id: number
  title: string
  description: string
}

export const Notifications: React.FC = (props) => {
  const [messages, setMessages] = useState<Message[]>([])

  const showNotification = useCallback((message: Omit<Message, 'id'>) => {
    setMessages((prevState) => [
      ...prevState,
      {
        id: id++,
        title: message.title,
        description: message.description
      }
    ])
  }, [])

  const removeMessage = useCallback((id: number) => {
    setMessages((message) => message.filter((element) => element.id !== id))
  }, [])

  return (
    <NotificationsContext.Provider value={showNotification}>
      <NotificationList
        messages={messages}
        removeMessage={removeMessage} />
      {props.children}
    </NotificationsContext.Provider>
  )
}

export function useShowNotification() {
  return useContext(NotificationsContext)
}

export function useShowErrorNotification() {
  const showNotification = useShowNotification()

  const handleShowErrorNotification = useCallback(
    (error: Error) => {
      showNotification(getMessageByHttpStatusCode(error))
    },
    [showNotification]
  )

  return handleShowErrorNotification
}
