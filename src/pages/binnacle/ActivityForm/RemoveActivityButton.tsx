// @ts-ignore
import React, { unstable_useTransition as useTransition, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorModal } from 'core/components'
import { IActivity } from 'api/interfaces/IActivity'
import { useShowErrorNotification } from 'core/features/Notifications/useShowErrorNotification'
import { useBinnacleResources } from 'core/features/BinnacleResourcesProvider'
import { SUSPENSE_CONFIG } from 'utils/constants'
import { deleteActivityById } from 'api/ActivitiesAPI'
import { ReactComponent as ThrashIcon } from 'assets/icons/thrash.svg'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/core'

interface IRemoveActivityButton {
  activity: IActivity
  onDeleted: () => void
}

const RemoveActivityButton: React.FC<IRemoveActivityButton> = (props) => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const cancelRef = React.useRef<HTMLElement>(null!)
  const showErrorNotification = useShowErrorNotification()
  const { updateCalendarResources } = useBinnacleResources()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteActivity = async () => {
    try {
      setIsDeleting(true)
      await deleteActivityById(props.activity.id)
      startTransition(() => {
        setIsOpen(false)
        props.onDeleted()
        updateCalendarResources()
      })
    } catch (e) {
      setIsDeleting(false)
      showErrorNotification(e)
    }
  }

  return (
    <React.Fragment>
      <AlertDialog
        isCentered={true}
        isOpen={modalIsOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('remove_modal.title')}
            </AlertDialogHeader>
            <AlertDialogBody>{t('remove_modal.description')}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                {t('actions.cancel')}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteActivity}
                isLoading={isDeleting || isPending}
                ml={3}
              >
                {t('activity_form.remove_activity')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {props.activity && (
        <Button
          leftIcon={<ThrashIcon style={{ width: '15px' }} />}
          data-testid="remove_activity"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
          variant="ghost"
          size="sm"
        >
          {t('actions.remove')}
        </Button>
      )}
    </React.Fragment>
  )
}

export default RemoveActivityButton
