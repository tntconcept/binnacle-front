import { Button } from '@chakra-ui/react'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '../../../../../../../shared/components/table/table'
import { ColumnsProps } from '../../../../../../../shared/components/table/table.types'
import { Activity } from '../../../domain/activity'
import { RemoveActivityButton } from '../activity-form/components/remove-activity-button'
import { activitiesListAdapter } from './subcontracted-activities-list-adapter'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'

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

  const tableSubcontractedActivities = useMemo(() => {
    if (!activities) return []

    return activitiesListAdapter(activities)
  }, [activities])

  const activitiesListColumns: ColumnsProps[] = [
    {
      title: 'subcontracted_activity.organization',
      dataIndex: 'organization',
      key: 'organization'
    },
    {
      title: 'subcontracted_activity.project',
      dataIndex: 'project',
      key: 'project'
    },
    {
      title: 'subcontracted_activity.rol',
      dataIndex: 'role',
      key: 'role',
      showInMobile: true
    },
    {
      title: 'subcontracted_activity.dates',
      dataIndex: 'dates',
      key: 'dates'
    },
    {
      title: 'subcontracted_activity.duration',
      dataIndex: 'duration',
      key: 'duration',
      showInMobile: true
    },
    {
      title: 'subcontracted_activity.actions',
      dataIndex: 'action',
      key: 'action',
      render: (activity: Activity) => (
        <Fragment key={activity.id}>
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
        </Fragment>
      )
    }
  ]

  return (
    <Table
      columns={activitiesListColumns}
      dataSource={tableSubcontractedActivities}
      emptyTableKey={'activity.empty'}
    />
  )
}
