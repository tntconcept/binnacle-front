import { WarningIcon } from '@chakra-ui/icons'
import { Box, CloseButton, RenderProps, Stack, Text } from '@chakra-ui/react'

type ToastErrorNotificationProps = RenderProps & {
  title: string
  description: string
}
export const ToastErrorNotification: React.FC<ToastErrorNotificationProps> = (props) => {
  const { title, description, onClose } = props

  return (
    <Box color="white" p={3} bg="red.500" borderRadius="lg">
      <Stack isInline>
        <WarningIcon mt="1" mr="1" color="white" />
        <Stack flex={1}>
          <Text fontWeight="bold">{title}</Text>
          <Text dangerouslySetInnerHTML={{ __html: description }} />
        </Stack>
        <CloseButton size="sm" onClick={onClose} tabIndex={0} />
      </Stack>
    </Box>
  )
}
