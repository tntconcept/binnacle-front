import { Button, SkeletonText } from '@chakra-ui/react'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from 'shared/arch/hooks/use-subscribe-to-use-case'
import { SubmitButton } from 'shared/components/form-fields/submit-button'
import { chrono } from 'shared/utils/chrono'
import { GetActivitiesQry } from '../../../application/get-activities-qry'
import { Activity } from '../../../domain/activity'
import { useCalendarContext } from '../../contexts/calendar-context'
import { ACTIVITY_FORM_ID } from '../activity-form/activity-form'
import { RemoveActivityButton } from '../activity-form/components/remove-activity-button'
import { ActivityModal } from '../activity-modal/activity-modal'
import { ActivitiesListTable } from './activities-list-table'
import { ActivityFilterForm } from './components/activity-filter/activity-filter-form'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { DeleteActivityCmd } from '../../../application/delete-activity-cmd'
import { ApproveActivityCmd } from '../../../application/approve-activity-cmd'
import { DateInterval } from '../../../../../../../shared/types/date-interval'
import { useFilters } from '../../../../../../../shared/router/use-filters'

interface Props {
  onCloseActivity: () => void
  showNewActivityModal: boolean
}

export const ActivitiesList: FC<Props> = ({ onCloseActivity, showNewActivityModal }) => {
  const { t } = useTranslation()
  const { selectedDate } = useCalendarContext()
  const [selectedActivity, setSelectedActivity] = useState<Activity>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [lastEndTime, setLastEndTime] = useState<Date | undefined>()

  const initialValue: DateInterval = {
    start: chrono(selectedDate).startOf('month').getDate(),
    end: chrono(selectedDate).endOf('month').getDate()
  }

  const { filters, onFilterChange } = useFilters({
    start: chrono(initialValue.start).format(chrono.DATE_FORMAT),
    end: chrono(initialValue.end).format(chrono.DATE_FORMAT)
  })

  const selectedDateInterval = useMemo(() => {
    if (filters === undefined) {
      return initialValue
    }

    return {
      start: chrono(filters.start).getDate(),
      end: chrono(filters.end).getDate()
    }
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

  const applyFilters = async (startDate: Date, endDate: Date): Promise<void> => {
    onFilterChange({
      start: chrono(startDate).format(chrono.DATE_FORMAT),
      end: chrono(endDate).format(chrono.DATE_FORMAT)
    })
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
    return selectedActivity?.approvalState !== 'ACCEPTED'
  }, [selectedActivity])

  useEffect(() => {
    if (!showNewActivityModal) return
    onCreateActivity()
  }, [showNewActivityModal])

  return (
    <>
      <ActivityFilterForm
        filters={selectedDateInterval}
        onFiltersChange={applyFilters}
      ></ActivityFilterForm>

      {isLoadingActivities ? (
        <SkeletonText noOfLines={4} spacing="4" />
      ) : (
        <ActivitiesListTable
          onOpenActivity={onActivityClicked}
          onDeleteActivity={onCloseActivity}
          activities={activities}
        />
      )}
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
