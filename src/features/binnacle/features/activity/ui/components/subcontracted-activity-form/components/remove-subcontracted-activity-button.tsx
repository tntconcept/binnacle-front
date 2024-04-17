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
import { DeleteSubcontractedActivityCmd } from '../../../../application/delete-subcontracted-activity-cmd'
import type { FC } from 'react'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import { useResolve } from '../../../../../../../../shared/di/use-resolve'
import { ActivityErrorMessage } from '../../../../domain/services/activity-error-message'
import { SubcontractedActivity } from '../../../../domain/subcontracted-activity'

interface Props {
  subcontractedActivity: SubcontractedActivity
  onDeleted: () => void
  redNoIcon?: boolean
}

export const RemoveSubcontractedActivityButton: FC<Props> = (props) => {
  const activityErrorMessage = useResolve(ActivityErrorMessage)
  const { t } = useTranslation()
  const cancelRef = useRef<HTMLButtonElement>(null!)

  const [modalIsOpen, setIsOpen] = useState(false)

  const { isLoading: isDeleting, useCase: deleteSubcontractedActivityCmd } = useGetUseCase(
    DeleteSubcontractedActivityCmd
  )

  const handleDeleteActivity = async () => {
    try {
      await deleteSubcontractedActivityCmd.execute(props.subcontractedActivity.id, {
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

      {props.subcontractedActivity && (
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
