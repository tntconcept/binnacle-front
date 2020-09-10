import { useCallback } from 'react'
import getMessageByHttpStatusCode, {
  ICustomStatusMessages
} from 'core/features/Notifications/HttpStatusCodeMessage'
import { useToast } from '@chakra-ui/core'

export function useShowErrorNotification() {
  const toast = useToast()

  const handleShowErrorNotification = useCallback(
    (error: Error, overrideMessage?: ICustomStatusMessages) => {
      const message = getMessageByHttpStatusCode(error, overrideMessage)

      toast({
        title: message.title,
        description: message.description,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    },
    [toast]
  )

  return handleShowErrorNotification
}
