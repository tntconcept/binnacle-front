import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import type { ICustomStatusMessages } from 'shared/components/Notifications/HttpStatusCodeMessage'
import getMessageByHttpStatusCode from 'shared/components/Notifications/HttpStatusCodeMessage'
import { ToastErrorNotification } from './toast-error-notification'

export function useShowErrorNotification() {
  const toast = useToast()

  return useCallback(
    (error: any, overrideMessage?: ICustomStatusMessages) => {
      const message = getMessageByHttpStatusCode(error, overrideMessage)

      toast({
        duration: process.env.NODE_ENV === 'test' ? 50 : 5000,
        isClosable: true,
        position: 'top-right',
        render: (props) => (
          <ToastErrorNotification
            title={message.title}
            description={message.description}
            {...props}
          />
        )
      })
    },
    [toast]
  )
}
