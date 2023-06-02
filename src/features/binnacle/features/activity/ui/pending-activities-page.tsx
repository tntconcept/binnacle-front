import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageTitle } from 'shared/components/PageTitle'
import { ActivityModal } from './components/activity-modal/activity-modal'
import { Activity } from '../domain/activity'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { ApproveActivityCmd } from '../application/approve-activity-cmd'
import { useResolve } from '../../../../../shared/di/use-resolve'
import { ActivityErrorMessage } from '../domain/services/activity-error-message'
import Table from '../../../../../shared/components/table/table'
import { GetPendingActivitiesQry } from '../application/get-pending-activities-qry'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'
import { adaptActivitiesToTable, AdaptedActivity } from './pending-activities-page-utils'
import { useSubscribeToUseCase } from '../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { useIsMobile } from '../../../../../shared/hooks'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'

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
      title: 'activity_pending.employee',
      dataIndex: 'employee',
      key: 'employee',
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
      render: (activity: any) => (
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
    <PageTitle title={t('pages.awaiting_requests')}>
      <PageWithTitle title={t('pages.awaiting_requests')}>
        <Table columns={columns} dataSource={tableActivities} emptyTableKey={'table.empty'}></Table>
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivity}
          onSave={onCloseActivity}
          activityDate={activityDate}
          activity={selectedActivity}
          isReadOnly={true}
          setIsLoadingForm={(isLoading) => setIsLoadingForm(isLoading)}
        >
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
        </ActivityModal>
      </PageWithTitle>
    </PageTitle>
  )
}

export default PendingActivitiesPage
