import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VisuallyHidden
} from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import chrono from 'shared/utils/chrono'
import { Activity } from '../../../domain/activity'
import { ActivityForm, ACTIVITY_FORM_ID } from '../activity-form/activity-form'
import { ActivityFormProvider } from '../activity-form/activity-form-provider'
import RemoveActivityButton from '../activity-form/components/remove-activity-button'

type ActivityModalProps = {
  activity?: Activity
  isOpen: boolean
  onClose(): void
  onSave(): void
  selectedDate: Date
}
export const ActivityModal: FC<ActivityModalProps> = (props) => {
  const { onClose, onSave, isOpen = false, selectedDate, activity } = props
  const { t } = useTranslation()

  return (
    <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" isCentered={true} size="2xl">
      <ModalOverlay
        // Prevent focus fighting because of CellBody component
        // https://github.com/theKashey/focus-lock/#focus-fighting
        data-no-focus-lock="true"
      >
        <ModalContent>
          <ModalHeader>
            <VisuallyHidden id="modal-title">
              {activity
                ? t('accessibility.edit_activity') + ':'
                : t('accessibility.new_activity') + ':'}
              {chrono(selectedDate).format('dd MMMM')}
            </VisuallyHidden>
            <b style={{ fontSize: 18 }}>{selectedDate.getDate()}</b>
            {chrono(selectedDate).format(' MMMM')}
          </ModalHeader>
          <ModalCloseButton />
          {/* TODO: review lastEndTime={lastEndTime} */}
          <ActivityFormProvider date={selectedDate} activity={activity} onAfterSubmit={onSave}>
            <ModalBody>
              <ActivityForm />
            </ModalBody>
            <ModalFooter justifyContent={activity ? 'space-between' : 'flex-end'}>
              {activity && <RemoveActivityButton activity={activity} onDeleted={onClose} />}
              <SubmitButton formId={ACTIVITY_FORM_ID}>{t('actions.save')}</SubmitButton>
            </ModalFooter>
          </ActivityFormProvider>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
