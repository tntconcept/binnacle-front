import { Button } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from 'shared/components/table/table'
import { ColumnsProps } from 'shared/components/table/table.types'
import { useIsMobile } from '../../../../../../../shared/hooks'
import { Activity } from '../../../domain/activity'
import { RemoveActivityButton } from '../activity-form/components/remove-activity-button'
import { activitiesListAdapter } from './activities-list-adapter'

interface Props {
  onDeleteActivity: () => void
  onOpenActivity: (activity: Activity) => void
  activities: Activity[]
}

export const ActivitiesListTable = ({
  onOpenActivity,
  onDeleteActivity,
  activities = []
}: Props) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  const tableActivities = useMemo(() => {
    if (!activities) return []

    return activitiesListAdapter(activities)
  }, [activities])

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
