import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { DeleteActivityCmd } from '../../../../application/delete-activity-cmd'
import { Activity } from '../../../../domain/activity'
import type { FC } from 'react'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import { useResolve } from '../../../../../../../../shared/di/use-resolve'
import { ActivityErrorMessage } from '../../../../domain/services/activity-error-message'

interface Props {
  activity: Activity
  onDeleted: () => void
  redNoIcon?: boolean
}

export const RemoveActivityButton: FC<Props> = (props) => {
  const activityErrorMessage = useResolve(ActivityErrorMessage)
  const { t } = useTranslation()
  const cancelRef = useRef<HTMLButtonElement>(null!)

  const [modalIsOpen, setIsOpen] = useState(false)

  const { isLoading: isDeleting, useCase: deleteActivityCmd } = useGetUseCase(DeleteActivityCmd)

  const handleDeleteActivity = async () => {
    try {
      await deleteActivityCmd.execute(props.activity.id, {
        successMessage: t('activity_form.remove_activity_notification'),
        showToastError: true,
        errorMessage: activityErrorMessage.get
      })
      setIsOpen(false)
      props.onDeleted()
    } catch (e) {
      setIsOpen(false)
    }
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
          leftIcon={!props.redNoIcon ? <TrashIcon style={{ width: '15px' }} /> : undefined}
          data-testid="remove_activity"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
          colorScheme={!props.redNoIcon ? 'black' : 'red'}
          variant="ghost"
          size="sm"
        >
          {t('actions.remove')}
        </Button>
      )}
    </Fragment>
  )
}
