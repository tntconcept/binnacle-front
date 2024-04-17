import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay
} from '@chakra-ui/react'
import { GetUserSettingsQry } from '../../../../../../shared/user/features/settings/application/get-user-settings-qry'
import { FC, ReactNode, useMemo } from 'react'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { SubcontractedActivity } from '../../../domain/subcontracted-activity'
import { SubcontractedActivityForm } from '../subcontracted-activity-form/subcontracted-activity-form'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'

interface SubcontractedActivityModalProps {
  subcontractedActivity?: SubcontractedActivity
  isOpen: boolean

  onClose(): void

  onSave(): void

  activityDate: string
  onLoading?: (isLoading: boolean) => void
  lastEndTime?: Date
  isReadOnly?: boolean
  actions?: ReactNode
}

export const SubcontractedActivityModal: FC<SubcontractedActivityModalProps> = (props) => {
  const {
    onClose,
    onSave,
    isOpen = false,
    activityDate,
    subcontractedActivity,
    lastEndTime,
    isReadOnly,
    onLoading = () => {},
    actions
  } = props
  const isMobile = useIsMobile()

  /* const { result: recentRoles = [], isLoading: isLoadingRecentRoles } = useExecuteUseCaseOnMount(
    GetRecentProjectRolesQry,
    selectedDate.getFullYear()
  ) */
  const { result: settings, isLoading: isLoadingUserSettings } =
    useExecuteUseCaseOnMount(GetUserSettingsQry)

  const isLoading = useMemo(() => {
    return isLoadingUserSettings
  }, [isLoadingUserSettings])

  const hasMoreThanOneAction = subcontractedActivity !== undefined
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
        //ACTIVITY DATE SERIA SUBCONTRACTED? - Adriana
        data-no-focus-lock="true"
      >
        <ModalContent>
          {/* <ModalHeader>
            <VisuallyHidden id="modal-title">
              {subcontractedActivity
                ? t('accessibility.edit_activity') + ':'
                : t('accessibility.new_activity') + ':'}
              {chrono(activityDate).format('dd MMMM')}
            </VisuallyHidden>
            <b style={{ fontSize: 18 }}>{activityDate.getDate()}</b>
            {chrono(activityDate).format(' MMMM')}
          </ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            {!isLoading && (
              <SubcontractedActivityForm
                date={activityDate}
                subcontractedActivity={subcontractedActivity}
                settings={settings!}
                lastEndTime={lastEndTime}
                // recentRoles={recentRoles}
                onSubmit={() => onLoading(true)}
                onSubmitError={() => onLoading(false)}
                onAfterSubmit={() => {
                  onLoading(false)
                  onSave()
                }}
                isReadOnly={isReadOnly}
              />
            )}
          </ModalBody>
          <ModalFooter
            aria-roledescription={''}
            justifyContent={hasMoreThanOneAction ? 'space-between' : 'flex-end'}
          >
            {actions}
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

/*
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
                settings={settings!}
                lastEndTime={lastEndTime}
                recentRoles={recentRoles}
                onSubmit={() => onLoading(true)}
                onSubmitError={() => onLoading(false)}
                onAfterSubmit={() => {
                  onLoading(false)
                  onSave()
                }}
                isReadOnly={isReadOnly}
              />
            )}
          </ModalBody>
          <ModalFooter
            aria-roledescription={''}
            justifyContent={hasMoreThanOneAction ? 'space-between' : 'flex-end'}
          >
            {actions}
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

*/
