import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import type { ICustomStatusMessages } from 'shared/components/notifications/http-status-code-message'
import getMessageByHttpStatusCode from 'shared/components/notifications/http-status-code-message'
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
