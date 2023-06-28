import { Button, SkeletonText } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import chrono from 'shared/utils/chrono'
import { GetActivitiesQry } from '../../../application/get-activities-qry'
import { Activity } from '../../../domain/activity'
import { useCalendarContext } from '../../contexts/calendar-context'
import { ACTIVITY_FORM_ID } from '../activity-form/activity-form'
import RemoveActivityButton from '../activity-form/components/remove-activity-button'
import { ActivityModal } from '../activity-modal/activity-modal'
import { ActivitiesListTable } from './activities-list-table'
import { ActivityFilterForm } from './components/activity-filter/activity-filter-form'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { useSubscribeToUseCase } from '../../../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { DeleteActivityCmd } from '../../../application/delete-activity-cmd'
import { ApproveActivityCmd } from '../../../application/approve-activity-cmd'

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

  // const [startDate, setStartDate] = useState(chrono(selectedDate).startOf('month').getDate())
  // const [endDate, setEndDate] = useState(chrono(selectedDate).endOf('month').getDate())
  const [filters, setFilters] = useState({
    start: chrono(selectedDate).startOf('month').getDate(),
    end: chrono(selectedDate).endOf('month').getDate()
  })

  const selectedDateInterval = useMemo(() => {
    return filters
  }, [filters])

  const {
    isLoading: isLoadingActivities,
    result: activities = [],
    executeUseCase: getActivitiesQry
  } = useExecuteUseCaseOnMount(GetActivitiesQry, selectedDateInterval)

  useSubscribeToUseCase(
    CreateActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    UpdateActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    DeleteActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    ApproveActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  const applyFilters = async (startDate: string, endDate: string): Promise<void> => {
    const start = chrono(startDate).getDate()
    const end = chrono(endDate).getDate()

    setFilters({ start, end })
  }

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
    if (selectedActivity?.approvalState === 'ACCEPTED') return false

    return true
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
      <ActivityFilterForm onFiltersChange={applyFilters}></ActivityFilterForm>

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
