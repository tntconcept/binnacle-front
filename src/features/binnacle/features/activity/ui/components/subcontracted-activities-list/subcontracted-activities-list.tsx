import { Button, SkeletonText } from '@chakra-ui/react'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from '../../../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { SubmitSubcontractedActivityButton } from '../../../../../../../shared/components/form-fields/submit-subcontracted-activity-button'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { GetSubcontractedActivitiesQry } from '../../../application/get-subcontracted-activities-qry'
import { useCalendarContext } from '../../contexts/calendar-context'
import { SubcontractedActivitiesListTable } from './subcontracted-activities-list-table'
import { SubcontractedActivityFilterForm } from './components/activity-filter/subcontracted-activity-filter-form'
import { CreateSubcontractedActivityCmd } from '../../../application/create-subcontracted-activity-cmd'
import { UpdateSubcontractedActivityCmd } from '../../../application/update-subcontracted-activity-cmd'
import { DeleteSubcontractedActivityCmd } from '../../../application/delete-subcontracted-activity-cmd'
import { TimeUnits } from '../../../../../../../shared/types/time-unit'
import { SubcontractedActivityModal } from '../subcontracted-activity-modal/subcontracted-activity-modal'
import { SubcontractedActivity } from '../../../domain/subcontracted-activity'
import { RemoveSubcontractedActivityButton } from '../subcontracted-activity-form/components/remove-subcontracted-activity-button'
import { SUBCONTRACTED_ACTIVITY_FORM_ID } from '../subcontracted-activity-form/subcontracted-activity-form'
import { GetSubcontractedActivitiesQueryParams } from '../../../domain/get-subcontracted-activities-query-params'

interface Props {
  onCloseSubcontractedActivity: () => void
  showNewSubcontractedActivityModal: boolean
}

export const SubcontractedActivitiesList: FC<Props> = ({
  onCloseSubcontractedActivity,
  showNewSubcontractedActivityModal
}) => {
  const { t } = useTranslation()
  const { selectedDate } = useCalendarContext()
  const [selectedActivity, setSelectedActivity] = useState<SubcontractedActivity>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [showSubcontractedActivityModal, setShowSubcontractedActivityModal] = useState(false)
  const [lastEndTime, setLastEndTime] = useState<Date | undefined>()

  const [queryParams, setQueryParams] = useState<GetSubcontractedActivitiesQueryParams>({
    startDate: chrono(new Date()).startOf('year').format(chrono.DATE_FORMAT),
    endDate: chrono(new Date()).format(chrono.DATE_FORMAT)
  })

  const {
    isLoading: isLoadingActivities,
    result: subcontractedActivities = [],
    executeUseCase: getSubcontractedActivitiesQry
  } = useExecuteUseCaseOnMount(GetSubcontractedActivitiesQry, queryParams)

  useSubscribeToUseCase(
    CreateSubcontractedActivityCmd,
    () => {
      getSubcontractedActivitiesQry(queryParams)
    },
    [queryParams]
  )

  useSubscribeToUseCase(
    UpdateSubcontractedActivityCmd,
    () => {
      getSubcontractedActivitiesQry(queryParams)
    },
    [queryParams]
  )

  useSubscribeToUseCase(
    DeleteSubcontractedActivityCmd,
    () => {
      getSubcontractedActivitiesQry(queryParams)
    },
    [queryParams]
  )

  const applyFilters = async (newParams: GetSubcontractedActivitiesQueryParams): Promise<void> => {
    setQueryParams(newParams)
    getSubcontractedActivitiesQry(newParams)
  }

  const onActivityClicked = (activity: SubcontractedActivity) => {
    setSelectedActivity(activity)
    setShowSubcontractedActivityModal(true)
  }

  const onCloseActivityModal = () => {
    setShowSubcontractedActivityModal(false)
    onCloseSubcontractedActivity()
  }

  const onCreateActivity = useCallback(() => {
    const searchActivity = subcontractedActivities
      .filter((activity) => chrono(new Date(activity.month)).isSameDay(selectedDate))
      .reverse()
      .find((element) => element.projectRole.timeInfo.timeUnit === TimeUnits.MINUTES)
    const lastEndTime = searchActivity ? new Date(searchActivity.month) : undefined
    setSelectedActivity(undefined)
    setLastEndTime(lastEndTime)
    setShowSubcontractedActivityModal(true)
  }, [subcontractedActivities, selectedDate])

  const canEditActivity = useMemo(() => {
    return true
  }, [])

  useEffect(() => {
    if (!showNewSubcontractedActivityModal) return
    onCreateActivity()
  }, [onCreateActivity, showNewSubcontractedActivityModal])

  return (
    <>
      <SubcontractedActivityFilterForm
        filters={queryParams}
        onFiltersChange={applyFilters}
      ></SubcontractedActivityFilterForm>

      {isLoadingActivities ? (
        <SkeletonText noOfLines={4} spacing="4" />
      ) : (
        <SubcontractedActivitiesListTable
          onOpenSubcontractedActivity={onActivityClicked}
          onDeleteSubcontractedActivity={onCloseSubcontractedActivity}
          subcontractedActivities={subcontractedActivities}
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
