import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'
import { TrashIcon } from '@heroicons/react/outline'
import { DeleteActivityAction } from 'modules/binnacle/data-access/actions/delete-activity-action'
import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import type { FC } from 'react'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'

interface IRemoveActivityButton {
  activity: Activity
  onDeleted: () => void
}

const RemoveActivityButton: FC<IRemoveActivityButton> = (props) => {
  const { t } = useTranslation()
  const cancelRef = useRef<HTMLButtonElement>(null!)

  const [modalIsOpen, setIsOpen] = useState(false)

  const [deleteActivity, isDeleting] = useActionLoadable(DeleteActivityAction)

  const handleDeleteActivity = async () => {
    try {
      await deleteActivity(props.activity.id)
      setIsOpen(false)
      props.onDeleted()
    } catch (e) {}
  }

  return (
    <Fragment>
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
                isLoading={isDeleting}
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
          leftIcon={<TrashIcon style={{ width: '15px' }} />}
          data-testid="remove_activity"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
          variant="ghost"
          size="sm"
        >
          {t('actions.remove')}
        </Button>
      )}
    </Fragment>
  )
}

export default RemoveActivityButton
