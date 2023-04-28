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
import { GetUserSettingsQry } from 'features/user/features/settings/application/get-user-settings-qry'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import { useIsMobile } from 'shared/hooks'
import chrono from 'shared/utils/chrono'
import { Activity } from '../../../domain/activity'
import { ActivityForm, ACTIVITY_FORM_ID } from '../activity-form/activity-form'
import RemoveActivityButton from '../activity-form/components/remove-activity-button'

type ActivityModalProps = {
  activity?: Activity
  isOpen: boolean
  onClose(): void
  onSave(): void
  activityDate: Date
  lastEndTime?: Date
}
export const ActivityModal: FC<ActivityModalProps> = (props) => {
  const { onClose, onSave, isOpen = false, activityDate, activity, lastEndTime } = props
  const { result: settings, isLoading } = useExecuteUseCaseOnMount(GetUserSettingsQry)
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior="inside"
      isCentered={true}
      size={isMobile ? 'full' : '2xl'}
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
              {chrono(activityDate).format('dd MMMM')}
            </VisuallyHidden>
            <b style={{ fontSize: 18 }}>{activityDate.getDate()}</b>
            {chrono(activityDate).format(' MMMM')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isLoading && (
              <ActivityForm
                date={activityDate}
                activity={activity}
                onAfterSubmit={onSave}
                settings={settings!}
                lastEndTime={lastEndTime}
              />
            )}
          </ModalBody>
          <ModalFooter justifyContent={activity ? 'space-between' : 'flex-end'}>
            {activity && <RemoveActivityButton activity={activity} onDeleted={onClose} />}
            <SubmitButton formId={ACTIVITY_FORM_ID}>{t('actions.save')}</SubmitButton>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
