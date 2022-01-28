import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import type { ICustomStatusMessages } from 'shared/components/Notifications/HttpStatusCodeMessage'
import getMessageByHttpStatusCode from 'shared/components/Notifications/HttpStatusCodeMessage'

export function useShowErrorNotification() {
  const toast = useToast()

  const handleShowErrorNotification = useCallback(
    (error: any, overrideMessage?: ICustomStatusMessages) => {
      const message = getMessageByHttpStatusCode(error, overrideMessage)

      toast({
        title: message.title,
        description: message.description,
        status: 'error',
        duration: process.env.NODE_ENV === 'test' ? 50 : 5000,
        isClosable: true,
        position: 'top-right'
      })
    },
    [toast]
  )

  return handleShowErrorNotification
}
