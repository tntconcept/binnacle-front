import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  leastDestructiveRef: React.MutableRefObject<HTMLButtonElement>
  onClose: () => void
  onClick: () => Promise<void>
  deleting: boolean
}

export const RemoveVacationAlert: FC<Props> = (props) => {
  const { t } = useTranslation()
  return (
    <AlertDialog
      isOpen={props.open}
      leastDestructiveRef={props.leastDestructiveRef}
      onClose={props.onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t('remove_vacation_modal.title')}
          </AlertDialogHeader>
          <AlertDialogBody>{t('remove_vacation_modal.confirm_question')}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={props.leastDestructiveRef} onClick={props.onClose}>
              {t('actions.cancel')}
            </Button>
            <Button
              colorScheme="red"
              onClick={props.onClick}
              isLoading={props.deleting}
              ml={3}
            >
              {t('actions.remove')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
