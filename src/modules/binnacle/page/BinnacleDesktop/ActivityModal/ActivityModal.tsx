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
import { observer } from 'mobx-react'
import {
  ACTIVITY_FORM_ID,
  ActivityForm
} from 'modules/binnacle/components/ActivityForm/ActivityForm'
import { ActivityFormProvider } from 'modules/binnacle/components/ActivityForm/ActivityFormProvider'
import RemoveActivityButton from 'modules/binnacle/components/ActivityForm/components/RemoveActivityButton'
import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import chrono from 'shared/utils/chrono'

export const ActivityModal = observer(() => {
  const { t } = useTranslation()

  const { activity, selectedActivityDate, closeModal, isModalOpen, lastEndTime } = useGlobalState(
    ActivityFormState
  )

  return (
    <Modal
      onClose={closeModal}
      isOpen={isModalOpen}
      scrollBehavior="inside"
      isCentered={true}
      size="2xl"
    >
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
              {chrono(selectedActivityDate).format('dd MMMM')}
            </VisuallyHidden>
            <b style={{ fontSize: 18 }}>{selectedActivityDate.getDate()}</b>
            {chrono(selectedActivityDate).format(' MMMM')}
          </ModalHeader>
          <ModalCloseButton />
          <ActivityFormProvider
            date={selectedActivityDate}
            lastEndTime={lastEndTime}
            activity={activity}
            onAfterSubmit={closeModal}
          >
            <ModalBody>
              <ActivityForm />
            </ModalBody>
            <ModalFooter justifyContent={activity ? 'space-between' : 'flex-end'}>
              {activity && <RemoveActivityButton activity={activity} onDeleted={closeModal} />}
              <SubmitButton formId={ACTIVITY_FORM_ID}>{t('actions.save')}</SubmitButton>
            </ModalFooter>
          </ActivityFormProvider>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
})
