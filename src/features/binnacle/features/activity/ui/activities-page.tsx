import { Box, Button, Flex } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import Table from 'shared/components/table/table'
import { ColumnsProps } from 'shared/components/table/table.types'
import { useIsMobile } from 'shared/hooks'
import { ApproveActivityCmd } from '../application/approve-activity-cmd'
import { Activity } from '../domain/activity'
import { ActivityModal } from './components/activity-modal/activity-modal'
import { adaptActivitiesToTable, AdaptedActivity } from './activities-page-utils'
import { useCalendarContext } from './contexts/calendar-context'
import { useSubscribeToUseCase } from 'shared/arch/hooks/use-subscribe-to-use-case'
import { CreateActivityCmd } from '../application/create-activity-cmd'
import { UpdateActivityCmd } from '../application/update-activity-cmd'
import { DeleteActivityCmd } from '../application/delete-activity-cmd'
import RemoveActivityButton from './components/activity-form/components/remove-activity-button'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import { ACTIVITY_FORM_ID } from './components/activity-form/activity-form'
import { GetActivitiesQry } from '../application/get-activities-qry'
import chrono from 'shared/utils/chrono'
import { PageWithTitle } from 'shared/components/page-with-title/page-with-title'

const ActivitiesPage = () => {
  const { t } = useTranslation()
  const activityDate = new Date()
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [tableActivities, setTableActivities] = useState<AdaptedActivity[]>([])
  const isMobile = useIsMobile()
  const [lastEndTime] = useState<Date | undefined>()

  const { selectedDate } = useCalendarContext()
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
  useEffect(() => {
    if (!isLoadingActivities && activities) {
      const activitiesAdapted = adaptActivitiesToTable(activities)

      const sortedActivities = activitiesAdapted.sort((a, b) => {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      })

      setTableActivities(sortedActivities)
    }
  }, [isLoadingActivities, activities])

  const onCloseActivity = () => {
    setShowActivityModal(false)
  }

  const columns: ColumnsProps[] = [
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
      title: 'activity.dates',
      dataIndex: 'dates',
      key: 'dates'
    },
    {
      title: 'activity.duration',
      dataIndex: 'duration',
      key: 'duration',
      showInMobile: true
    },
    {
      title: 'activity.status',
      dataIndex: 'approvalState',
      key: 'approvalState',
      showInMobile: true
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
      <Box position="relative">
        <Flex
          justifyContent="flex-end"
          alignItems="flex-end"
          right="0"
          top={isMobile ? '0' : '-64px'}
          pb="10px"
        >
          <Button
            data-testid="show_activity_modal"
            onClick={() => setShowActivityModal(true)}
            type="button"
            colorScheme="grey"
            variant="outline"
            size="sm"
            px="29px"
            py="6px"
          >
            {t('activity.create')}
          </Button>
        </Flex>
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
