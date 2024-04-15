import { Button, SkeletonText } from '@chakra-ui/react'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from '../../../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { SubmitSubcontractedActivityButton } from '../../../../../../../shared/components/form-fields/submit-subcontracted-activity-button'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { GetActivitiesQry } from '../../../application/get-activities-qry' //va a haber que crear o modificar para que sean los del rol subcontracted ahora todas se filtran con esa qry --> salen todas las actividades
import { useCalendarContext } from '../../contexts/calendar-context'
import { ActivitiesListTable } from './subcontracted-activities-list-table'
import { ActivityFilterForm } from '../activities-list/components/activity-filter/activity-filter-form' //
import { CreateActivityCmd } from '../../../application/create-activity-cmd' //
import { UpdateActivityCmd } from '../../../application/update-activity-cmd' //
import { DeleteActivityCmd } from '../../../application/delete-activity-cmd' //
import { ApproveActivityCmd } from '../../../application/approve-activity-cmd' //No deberia ser necesario
import { DateInterval } from '../../../../../../../shared/types/date-interval'
import { useQueryParams } from '../../../../../../../shared/router/use-query-params'
import { TimeUnits } from '../../../../../../../shared/types/time-unit'
import { SubcontractedActivityModal } from '../subcontracted-activity-modal/subcontracted-activity-modal'
import { SubcontractedActivity } from '../../../domain/subcontracted-activity'
import { RemoveSubcontractedActivityButton } from '../subcontracted-activity-form/components/remove-subcontracted-activity-button'
import { SUBCONTRACTED_ACTIVITY_FORM_ID } from '../subcontracted-activity-form/subcontracted-activity-form'

interface Props {
  onCloseActivity: () => void
  showNewSubcontractedActivityModal: boolean
}

export const SubcontractedActivitiesList: FC<Props> = ({
  onCloseActivity,
  showNewSubcontractedActivityModal
}) => {
  const { t } = useTranslation()
  const { selectedDate } = useCalendarContext()
  const [selectedActivity, setSelectedActivity] = useState<SubcontractedActivity>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [showSubcontractedActivityModal, setShowSubcontractedActivityModal] = useState(false)
  const [lastEndTime, setLastEndTime] = useState<Date | undefined>()

  const formatDate = (startDate: Date, endDate: Date) => {
    return {
      startDate: chrono(startDate).format(chrono.DATE_FORMAT),
      endDate: chrono(endDate).format(chrono.DATE_FORMAT)
    }
  }

  const initialValue: DateInterval = useMemo(
    () => ({
      start: chrono(selectedDate).startOf('month').getDate(),
      end: chrono(selectedDate).endOf('month').getDate()
    }),
    [selectedDate]
  )

  const { queryParams, onQueryParamsChange } = useQueryParams(
    formatDate(initialValue.start, initialValue.end)
  )

  const selectedDateInterval = useMemo(() => {
    if (queryParams === undefined || Object.keys(queryParams).length === 0) {
      onQueryParamsChange(formatDate(initialValue.start, initialValue.end))
      return initialValue
    }

    return {
      start: chrono(queryParams.startDate).getDate(),
      end: chrono(queryParams.endDate).getDate()
    }
  }, [initialValue, onQueryParamsChange, queryParams])

  const {
    isLoading: isLoadingActivities,
    result: activities = [],
    executeUseCase: getActivitiesQry
  } = useExecuteUseCaseOnMount(GetActivitiesQry, selectedDateInterval)

  //CAMBIAR TODOS ESTOS CMD A LOS DE SUBCONTRACTED

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
    onQueryParamsChange(formatDate(startDate, endDate))
  }

  const onActivityClicked = (activity: SubcontractedActivity) => {
    setSelectedActivity(activity)
    setShowSubcontractedActivityModal(true)
  }

  const onCloseActivityModal = () => {
    setShowSubcontractedActivityModal(false)
    onCloseActivity()
  }

  const onCreateActivity = useCallback(() => {
    const searchActivity = activities
      .filter((activity) => chrono(activity.interval.start).isSameDay(selectedDate))
      .reverse()
      .find((element) => element.projectRole.timeInfo.timeUnit === TimeUnits.MINUTES)
    const lastEndTime = searchActivity ? searchActivity.interval.end : undefined
    setSelectedActivity(undefined)
    setLastEndTime(lastEndTime)
    setShowSubcontractedActivityModal(true)
  }, [activities, selectedDate])

  const canEditActivity = useMemo(() => {
    return true //selectedActivity?.approval.state !== 'ACCEPTED'
    // }, [selectedActivity])
  }, [])

  useEffect(() => {
    if (!showNewSubcontractedActivityModal) return
    onCreateActivity()
  }, [onCreateActivity, showNewSubcontractedActivityModal])

  //Poner subcontractedActivityFilterForm

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
      {showSubcontractedActivityModal && (
        <SubcontractedActivityModal
          isOpen={showSubcontractedActivityModal}
          onClose={onCloseActivityModal}
          onSave={onCloseActivityModal}
          onLoading={setIsLoadingForm}
          activityDate={
            selectedActivity?.month || new Date().getFullYear + '-' + new Date().getMonth
          }
          //chrono(new Date()).format('yyyy-mm')
          subcontractedActivity={selectedActivity}
          lastEndTime={lastEndTime}
          isReadOnly={!canEditActivity}
          actions={
            canEditActivity ? (
              <>
                {selectedActivity && (
                  <RemoveSubcontractedActivityButton
                    subcontractedActivity={selectedActivity}
                    onDeleted={onCloseActivityModal}
                  />
                )}

                <SubmitSubcontractedActivityButton
                  isLoading={isLoadingForm}
                  formId={SUBCONTRACTED_ACTIVITY_FORM_ID}
                >
                  {t('actions.save')}
                </SubmitSubcontractedActivityButton>
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

/*
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

  const formatDate = (startDate: Date, endDate: Date) => {
    return {
      startDate: chrono(startDate).format(chrono.DATE_FORMAT),
      endDate: chrono(endDate).format(chrono.DATE_FORMAT)
    }
  }

  const initialValue: DateInterval = useMemo(
    () => ({
      start: chrono(selectedDate).startOf('month').getDate(),
      end: chrono(selectedDate).endOf('month').getDate()
    }),
    [selectedDate]
  )

  const { queryParams, onQueryParamsChange } = useQueryParams(
    formatDate(initialValue.start, initialValue.end)
  )

  const selectedDateInterval = useMemo(() => {
    if (queryParams === undefined || Object.keys(queryParams).length === 0) {
      onQueryParamsChange(formatDate(initialValue.start, initialValue.end))
      return initialValue
    }

    return {
      start: chrono(queryParams.startDate).getDate(),
      end: chrono(queryParams.endDate).getDate()
    }
  }, [initialValue, onQueryParamsChange, queryParams])

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
    onQueryParamsChange(formatDate(startDate, endDate))
  }

  const onActivityClicked = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowActivityModal(true)
  }

  const onCloseActivityModal = () => {
    setShowActivityModal(false)
    onCloseActivity()
  }

  const onCreateActivity = useCallback(() => {
    const searchActivity = activities
      .filter((activity) => chrono(activity.interval.start).isSameDay(selectedDate))
      .reverse()
      .find((element) => element.projectRole.timeInfo.timeUnit === TimeUnits.MINUTES)
    const lastEndTime = searchActivity ? searchActivity.interval.end : undefined
    setSelectedActivity(undefined)
    setLastEndTime(lastEndTime)
    setShowActivityModal(true)
  }, [activities, selectedDate])

  const canEditActivity = useMemo(() => {
    return selectedActivity?.approval.state !== 'ACCEPTED'
  }, [selectedActivity])

  useEffect(() => {
    if (!showNewActivityModal) return
    onCreateActivity()
  }, [onCreateActivity, showNewActivityModal])

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

*/
