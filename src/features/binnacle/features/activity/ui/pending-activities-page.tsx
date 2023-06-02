import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { useSubscribeToUseCase } from '../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import Table from '../../../../../shared/components/table/table'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'
import { useResolve } from '../../../../../shared/di/use-resolve'
import { useIsMobile } from '../../../../../shared/hooks'
import { ApproveActivityCmd } from '../application/approve-activity-cmd'
import { GetPendingActivitiesQry } from '../application/get-pending-activities-qry'
import { Activity } from '../domain/activity'
import { ActivityErrorMessage } from '../domain/services/activity-error-message'
import { ActivityModal } from './components/activity-modal/activity-modal'
import { adaptActivitiesToTable, AdaptedActivity } from './pending-activities-page-utils'

const PendingActivitiesPage = () => {
  const { t } = useTranslation()
  const activityDate = new Date()
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [tableActivities, setTableActivities] = useState<AdaptedActivity[]>([])
  const isMobile = useIsMobile()

  const { useCase: approveActivityCmd } = useGetUseCase(ApproveActivityCmd)
  const {
    isLoading: isLoadingActivities,
    result: activities,
    executeUseCase: getPendingActivitiesQry
  } = useExecuteUseCaseOnMount(GetPendingActivitiesQry)
  const activityErrorMessage = useResolve(ActivityErrorMessage)

  useSubscribeToUseCase(ApproveActivityCmd, () => getPendingActivitiesQry(), [])

  useEffect(() => {
    if (!isLoadingActivities && activities) {
      const activitiesAdapted = adaptActivitiesToTable(activities)
      setTableActivities(activitiesAdapted)
    }
  }, [isLoadingActivities, activities])

  const onCloseActivity = () => {
    setShowActivityModal(false)
  }

  const onApprove = async () => {
    if (selectedActivity) {
      await approveActivityCmd.execute(selectedActivity.id, {
        successMessage: t('activity_form.approve_activity'),
        showToastError: true,
        errorMessage: activityErrorMessage.get
      })
    }
    setShowActivityModal(false)
  }

  const columns: ColumnsProps[] = [
    {
      title: 'activity_pending.employee_name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      showInMobile: true
    },
    {
      title: 'activity_pending.dates',
      dataIndex: 'dates',
      key: 'dates'
    },
    {
      title: 'activity_pending.duration',
      dataIndex: 'duration',
      key: 'duration',
      showInMobile: true
    },
    {
      title: 'activity_pending.organization',
      dataIndex: 'organization',
      key: 'organization'
    },
    {
      title: 'activity_pending.project',
      dataIndex: 'project',
      key: 'project'
    },
    {
      title: 'activity_pending.rol',
      dataIndex: 'role',
      key: 'role',
      showInMobile: true
    },
    {
      title: 'activity_pending.attachments',
      dataIndex: 'attachment',
      key: 'attachment'
    },
    {
      title: 'activity_pending.actions',
      dataIndex: 'action',
      key: 'action',
      render: (activity: Activity) => (
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
          {t('actions.show')}
        </Button>
      )
    }
  ]

  return (
    <PageWithTitle title={t('pages.pending_requests')}>
      <Table columns={columns} dataSource={tableActivities} emptyTableKey={'table.empty'}></Table>
      <ActivityModal
        isOpen={showActivityModal}
        onClose={onCloseActivity}
        onSave={onCloseActivity}
        activityDate={activityDate}
        activity={selectedActivity}
        isReadOnly={true}
        onLoading={setIsLoadingForm}
        actions={
          <Button
            type="button"
            colorScheme="brand"
            variant="solid"
            isLoading={isLoadingForm}
            disabled={false}
            onClick={() => onApprove()}
          >
            {t('actions.approve')}
          </Button>
        }
      />
    </PageWithTitle>
  )
}

export default PendingActivitiesPage
