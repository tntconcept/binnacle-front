import { ExecutionOptions } from '@archimedes/arch'
import { Button, Flex, SkeletonText, Text } from '@chakra-ui/react'
import React, { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { useSubscribeToUseCase } from '../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { Table } from '../../../../../shared/components/table/table'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'
import { useResolve } from '../../../../../shared/di/use-resolve'
import { ApproveActivityCmd } from '../application/approve-activity-cmd'
import { GetPendingActivitiesQry } from '../application/get-pending-activities-qry'
import { Activity } from '../domain/activity'
import { ActivityErrorMessage } from '../domain/services/activity-error-message'
import { ActivityModal } from './components/activity-modal/activity-modal'
import { adaptActivitiesToTable } from './pending-activities-page-utils'
import { useIsMobile } from '../../../../../shared/hooks/use-is-mobile'
import { ActivityApproval } from '../domain/activity-approval'
import { ActivityApprovalState } from '../domain/activity-approval-state'

export const PendingActivitiesPage: FC = () => {
  const { t } = useTranslation()

  const approvedStateTranslationMap: Record<ActivityApprovalState, string> = {
    PENDING: 'activity_pending.state.pending',
    ACCEPTED: 'activity_pending.state.accepted',
    NA: ''
  }

  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const isMobile = useIsMobile()
  const [enableApprove, setEnableApprove] = useState(false)

  const { executeUseCase: approveActivityCmd, isLoading: isApproving } =
    useGetUseCase(ApproveActivityCmd)
  const {
    isLoading: isLoadingActivities,
    result: activities,
    executeUseCase: getPendingActivitiesQry
  } = useExecuteUseCaseOnMount(GetPendingActivitiesQry)
  const activityErrorMessage = useResolve(ActivityErrorMessage)

  useSubscribeToUseCase(
    ApproveActivityCmd,
    () => getPendingActivitiesQry(new Date().getFullYear()),
    []
  )

  const tableActivities = useMemo(() => {
    if (!activities) return []

    return adaptActivitiesToTable(activities)
  }, [activities])

  const onCloseActivity = () => {
    setShowActivityModal(false)
  }

  const onApprove = async () => {
    if (selectedActivity) {
      await approveActivityCmd(selectedActivity.id, {
        successMessage: t('activity_form.approve_activity_notification'),
        showToastError: true,
        errorMessage: activityErrorMessage.get
      } as ExecutionOptions)
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
      title: 'activity_pending.state_header',
      dataIndex: 'approval',
      key: 'approval',
      render: (approval: ActivityApproval) => {
        return (
          <Flex direction={'column'}>
            <Text fontSize={'xs'} color={approval.state === 'ACCEPTED' ? 'green' : 'inherit'}>
              {t(approvedStateTranslationMap[approval.state])}
            </Text>
            <Text fontSize={'xs'}>{approval.approvalDate}</Text>
            <Text fontSize={'xs'}>{approval.approvedByUserName}</Text>
          </Flex>
        )
      }
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
      title: 'activity_pending.evidences',
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
            setEnableApprove(!activity.hasEvidences)
          }}
        >
          {t('actions.show')}
        </Button>
      )
    }
  ]

  return (
    <PageWithTitle title={t('pages.pending_activities')}>
      {isLoadingActivities && !activities && <SkeletonText noOfLines={4} spacing="4" />}
      {!isLoadingActivities && (
        <Table
          columns={columns}
          dataSource={tableActivities}
          emptyTableKey={'activity_pending.empty'}
        ></Table>
      )}
      {selectedActivity && showActivityModal && (
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivity}
          onSave={onCloseActivity}
          activityDate={selectedActivity!.interval.start}
          activity={selectedActivity}
          isReadOnly={true}
          actions={
            <Button
              type="button"
              colorScheme="brand"
              variant="solid"
              isLoading={isApproving}
              disabled={enableApprove}
              onClick={() => onApprove()}
            >
              {t('actions.approve')}
            </Button>
          }
        />
      )}
    </PageWithTitle>
  )
}
