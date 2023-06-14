import { Button } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from 'shared/arch/hooks/use-subscribe-to-use-case'
import Table from 'shared/components/table/table'
import { ColumnsProps } from 'shared/components/table/table.types'
import chrono from 'shared/utils/chrono'
import { useIsMobile } from '../../../../../../../shared/hooks'
import { ApproveActivityCmd } from '../../../application/approve-activity-cmd'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { DeleteActivityCmd } from '../../../application/delete-activity-cmd'
import { GetActivitiesQry } from '../../../application/get-activities-qry'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { Activity } from '../../../domain/activity'
import { useCalendarContext } from '../../contexts/calendar-context'
import RemoveActivityButton from '../activity-form/components/remove-activity-button'
import { activitiesListAdapter, AdaptedActivity } from './activities-list-adapter'

interface Props {
  onDeleteActivity: () => void
  onOpenActivity: (activity: Activity) => void
}

export const ActivitiesListTable = ({ onOpenActivity, onDeleteActivity }: Props) => {
  const [tableActivities, setTableActivities] = useState<AdaptedActivity[]>([])
  const isMobile = useIsMobile()
  const { t } = useTranslation()
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
      const activitiesAdapted = activitiesListAdapter(activities)

      const sortedActivities = activitiesAdapted.sort((a, b) => {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      })

      setTableActivities(sortedActivities)
    }
  }, [isLoadingActivities, activities])

  const activitiesListColumns: ColumnsProps[] = [
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
            colorScheme="blue"
            variant="ghost"
            size="sm"
            marginLeft={isMobile ? 'auto' : ''}
            display={isMobile ? 'block' : ''}
            onClick={() => {
              onOpenActivity(activity)
            }}
          >
            {t('actions.edit')}
          </Button>
          <RemoveActivityButton activity={activity} onDeleted={onDeleteActivity} redNoIcon={true} />
        </>
      )
    }
  ]

  return (
    <Table
      columns={activitiesListColumns}
      dataSource={tableActivities}
      emptyTableKey={'activity.empty'}
    />
  )
}
