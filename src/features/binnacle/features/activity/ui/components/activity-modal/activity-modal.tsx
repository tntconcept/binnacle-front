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
import { GetRecentProjectRolesQry } from '../../../../project-role/application/get-recent-project-roles-qry'
import { GetUserSettingsQry } from '../../../../../../shared/user/features/settings/application/get-user-settings-qry'
import { FC, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { Activity } from '../../../domain/activity'
import { useCalendarContext } from '../../contexts/calendar-context'
import { ActivityForm } from '../activity-form/activity-form'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'

interface ActivityModalProps {
  activity?: Activity
  isOpen: boolean

  onClose(): void

  onSave(): void

  activityDate: Date
  onLoading?: (isLoading: boolean) => void
  lastEndTime?: Date
  isReadOnly?: boolean
  actions?: ReactNode
}

export const ActivityModal: FC<ActivityModalProps> = (props) => {
  const {
    onClose,
    onSave,
    isOpen = false,
    activityDate,
    activity,
    lastEndTime,
    isReadOnly,
    onLoading = () => {},
    actions
  } = props
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { selectedDate } = useCalendarContext()

  const { result: recentRoles = [], isLoading: isLoadingRecentRoles } = useExecuteUseCaseOnMount(
    GetRecentProjectRolesQry,
    selectedDate.getFullYear()
  )
  const { result: settings, isLoading: isLoadingUserSettings } =
    useExecuteUseCaseOnMount(GetUserSettingsQry)

  const isLoading = useMemo(() => {
    return isLoadingRecentRoles && isLoadingUserSettings
  }, [isLoadingUserSettings, isLoadingRecentRoles])

  const hasMoreThanOneAction = activity !== undefined

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior="inside"
      isCentered={true}
      size={isMobile ? 'full' : '2xl'}
      id={'activity'}
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
