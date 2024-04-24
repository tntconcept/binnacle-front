import { Button } from '@chakra-ui/react'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '../../../../../../../shared/components/table/table'
import { ColumnsProps } from '../../../../../../../shared/components/table/table.types'
import { SubcontractedActivity } from '../../../domain/subcontracted-activity'
import { RemoveSubcontractedActivityButton } from '../subcontracted-activity-form/components/remove-subcontracted-activity-button'
import { subcontractedActivitiesListAdapter } from './subcontracted-activities-list-adapter'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'

interface Props {
  onDeleteSubcontractedActivity: () => void
  onOpenSubcontractedActivity: (subcontractedActivity: SubcontractedActivity) => void
  subcontractedActivities: SubcontractedActivity[]
}

export const SubcontractedActivitiesListTable = ({
  onOpenSubcontractedActivity,
  onDeleteSubcontractedActivity,
  subcontractedActivities = []
}: Props) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  const tableSubcontractedActivities = useMemo(() => {
    if (!subcontractedActivities) return []

    return subcontractedActivitiesListAdapter(subcontractedActivities)
  }, [subcontractedActivities])

  const subcontractedActivitiesListColumns: ColumnsProps[] = [
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
    // {
    //   title: 'subcontracted_activity.dates',
    //   dataIndex: 'dates',
    //   key: 'dates'
    // },
    {
      title: 'subcontracted_activity.dates',
      dataIndex: 'month',
      key: 'month'
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
      render: (subcontractedActivity: SubcontractedActivity) => (
        <Fragment key={subcontractedActivity.id}>
          <Button
            colorScheme="blue"
            variant="ghost"
            size="sm"
            marginLeft={isMobile ? 'auto' : ''}
            display={isMobile ? 'block' : ''}
            onClick={() => {
              onOpenSubcontractedActivity(subcontractedActivity)
            }}
          >
            {t('actions.edit')}
          </Button>
          <RemoveSubcontractedActivityButton
            subcontractedActivity={subcontractedActivity}
            onDeleted={onDeleteSubcontractedActivity}
            redNoIcon={true}
          />
        </Fragment>
      )
    }
  ]

  return (
    <Table
      columns={subcontractedActivitiesListColumns}
      dataSource={tableSubcontractedActivities}
      emptyTableKey={'subcontracted_activity.empty'}
    />
  )
}
