import { Box, Button, Flex } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import Table from '../../../../../shared/components/table/table'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'
import { useIsMobile } from '../../../../../shared/hooks'
import { ApproveActivityCmd } from '../application/approve-activity-cmd'
import { Activity } from '../domain/activity'
import { ActivityModal } from './components/activity-modal/activity-modal'
import { adaptActivitiesToTable, AdaptedActivity } from './activities-page-utils'
import { useCalendarContext } from './contexts/calendar-context'
import { firstDayOfFirstWeekOfMonth } from '../utils/firstDayOfFirstWeekOfMonth'
import { lastDayOfLastWeekOfMonth } from '../utils/lastDayOfLastWeekOfMonth'
import { useSubscribeToUseCase } from '../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { CreateActivityCmd } from '../application/create-activity-cmd'
import { UpdateActivityCmd } from '../application/update-activity-cmd'
import { DeleteActivityCmd } from '../application/delete-activity-cmd'
import RemoveActivityButton from './components/activity-form/components/remove-activity-button'
import SubmitButton from '../../../../../shared/components/FormFields/SubmitButton'
import { ACTIVITY_FORM_ID } from './components/activity-form/activity-form'
import { GetActivitiesQry } from '../application/get-activities-qry'
import FilterCombos from './filter-combos'

const ActivitiesPage = () => {
  const { t } = useTranslation()
  const activityDate = new Date()
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [tableActivities, setTableActivities] = useState<AdaptedActivity[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useIsMobile()
  const [lastEndTime] = useState<Date | undefined>()

  const { selectedDate } = useCalendarContext()
  const selectedDateInterval = useMemo(() => {
    const start = firstDayOfFirstWeekOfMonth(selectedDate)
    const end = lastDayOfLastWeekOfMonth(selectedDate)

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
  useEffect(() => {
    if (!isLoadingActivities && activities) {
      const activitiesAdapted = adaptActivitiesToTable(activities.reverse())
      setTableActivities(activitiesAdapted)
    }
  }, [isLoadingActivities, activities])

  const onCloseActivity = () => {
    setShowActivityModal(false)
  }

  const columns: ColumnsProps[] = [
    {
      title: 'activity.start_date',
      dataIndex: 'start_date',
      key: 'start_date',
      showInMobile: true
    },
    {
      title: 'activity.end_date',
      dataIndex: 'end_date',
      key: 'end_date',
      showInMobile: true
    },
    {
      title: 'activity.duration',
      dataIndex: 'duration',
      key: 'duration',
      showInMobile: true
    },
    {
      title: 'activity.organization',
      dataIndex: 'organization',
      key: 'organization'
    },
    {
      title: 'activity.project',
      dataIndex: 'project',
      key: 'project'
    },
    {
      title: 'activity.rol',
      dataIndex: 'role',
      key: 'role',
      showInMobile: true
    },
    {
      title: 'activity.status',
      dataIndex: 'approvalState',
      key: 'approvalState'
    },
    {
      title: 'activity.evidences',
      dataIndex: 'attachment',
      key: 'attachment'
    },
    {
      title: 'activity.actions',
      dataIndex: 'action',
      key: 'action',
      render: (activity: Activity) => (
        <>
          <Button
            key={'action' + activity.id}
            colorScheme="blue"
            variant="ghost"
            size="sm"
            marginLeft={isMobile ? 'auto' : ''}
            display={isMobile ? 'block' : ''}
            onClick={() => {
              setSelectedActivity(activity)
              setShowActivityModal(true)
            }}
          >
            {t('actions.edit')}
          </Button>
          <RemoveActivityButton
            activity={activity}
            onDeleted={onCloseActivity}
            tableVariant={true}
          />
        </>
      )
    }
  ]

  return (
    <PageWithTitle title={t('pages.activities')}>
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Button
            data-testid="show_filter_activity"
            onClick={() => setShowFilters((showFilters) => !showFilters)}
            type="button"
            colorScheme="grey"
            variant="outline"
            size="sm"
            px="29px"
            py="6px"
          >
            {!showFilters ? t('activity.filter') : 'X'}
          </Button>
          <Button
            data-testid="show_activity_modal"
            onClick={() => setShowActivityModal(true)}
            type="button"
            colorScheme="grey"
            variant="outline"
            size="sm"
            px="8px"
            py="6px"
          >
            {t('activity.create')}
          </Button>
        </Flex>
        {showFilters && <FilterCombos />}
      </Box>
      <Table
        columns={columns}
        dataSource={tableActivities}
        emptyTableKey={'activity.empty'}
      ></Table>
      {showActivityModal && (
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivity}
          onSave={onCloseActivity}
          onLoading={setIsLoadingForm}
          activityDate={activityDate}
          activity={selectedActivity}
          lastEndTime={lastEndTime}
          actions={
            <>
              {selectedActivity && (
                <RemoveActivityButton activity={selectedActivity} onDeleted={onCloseActivity} />
              )}
              <SubmitButton isLoading={isLoadingForm} formId={ACTIVITY_FORM_ID}>
                {t('actions.save')}
              </SubmitButton>
            </>
          }
        />
      )}
    </PageWithTitle>
  )
}

export default ActivitiesPage
