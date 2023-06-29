import { Button, SkeletonText } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from 'shared/arch/hooks/use-subscribe-to-use-case'
import SubmitButton from 'shared/components/form-fields/submit-button'
import chrono from 'shared/utils/chrono'
import { ApproveActivityCmd } from '../../../application/approve-activity-cmd'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { DeleteActivityCmd } from '../../../application/delete-activity-cmd'
import { GetActivitiesQry } from '../../../application/get-activities-qry'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { Activity } from '../../../domain/activity'
import { useCalendarContext } from '../../contexts/calendar-context'
import { ACTIVITY_FORM_ID } from '../activity-form/activity-form'
import RemoveActivityButton from '../activity-form/components/remove-activity-button'
import { ActivityModal } from '../activity-modal/activity-modal'
import { ActivitiesListTable } from './activities-list-table'

interface Props {
  onCloseActivity: () => void
  showNewActivityModal: boolean
}

const ActivitiesList = ({ onCloseActivity, showNewActivityModal }: Props) => {
  const { t } = useTranslation()
  const { selectedDate } = useCalendarContext()
  const [selectedActivity, setSelectedActivity] = useState<Activity>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [lastEndTime, setLastEndTime] = useState<Date | undefined>()

  const selectedDateInterval = useMemo(() => {
    const start = chrono(selectedDate).startOf('month').getDate()
    const end = chrono(selectedDate).endOf('month').getDate()

    return { start, end }
  }, [selectedDate])

  const {
    isLoading: isLoadingActivities,
    result: activities = [],
    executeUseCase: getActivitiesDataQry
  } = useExecuteUseCaseOnMount(GetActivitiesQry, selectedDateInterval)

  useSubscribeToUseCase(
    CreateActivityCmd,
    () => {
      getActivitiesDataQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    UpdateActivityCmd,
    () => {
      getActivitiesDataQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    DeleteActivityCmd,
    () => {
      getActivitiesDataQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    ApproveActivityCmd,
    () => {
      getActivitiesDataQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  const onActivityClicked = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowActivityModal(true)
  }

  const onCloseActivityModal = () => {
    setShowActivityModal(false)
    onCloseActivity()
  }

  const onCreateActivity = () => {
    const searchActivity = activities
      .filter((activity) => chrono(activity.interval.start).isSameDay(selectedDate))
      .reverse()
      .find((element) => element.projectRole.timeUnit === 'MINUTES')
    const lastEndTime = searchActivity ? searchActivity.interval.end : undefined
    setSelectedActivity(undefined)
    setLastEndTime(lastEndTime)
    setShowActivityModal(true)
  }

  const canEditActivity = useMemo(() => {
    return selectedActivity?.approvalState !== 'ACCEPTED'
  }, [selectedActivity])

  useEffect(() => {
    if (!showNewActivityModal) return
    onCreateActivity()
  }, [showNewActivityModal])

  if (isLoadingActivities) {
    return <SkeletonText noOfLines={4} spacing="4" />
  }

  return (
    <>
      <ActivitiesListTable
        onOpenActivity={onActivityClicked}
        onDeleteActivity={onCloseActivity}
        activities={activities}
      />
      {showActivityModal && (
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivityModal}
          onSave={onCloseActivityModal}
          onLoading={setIsLoadingForm}
          activityDate={selectedActivity?.interval.start || new Date()}
          activity={selectedActivity}
          lastEndTime={lastEndTime}
          isReadOnly={!canEditActivity}
          actions={
            canEditActivity ? (
              <>
                {selectedActivity && (
                  <RemoveActivityButton
                    activity={selectedActivity}
                    onDeleted={onCloseActivityModal}
                  />
                )}

                <SubmitButton isLoading={isLoadingForm} formId={ACTIVITY_FORM_ID}>
                  {t('actions.save')}
                </SubmitButton>
              </>
            ) : (
              <Button onClick={onCloseActivityModal}>{t('actions.close')}</Button>
            )
          }
        />
      )}
    </>
  )
}

export default ActivitiesList
