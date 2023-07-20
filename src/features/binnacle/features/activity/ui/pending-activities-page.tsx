import { ExecutionOptions } from '@archimedes/arch'
import { Button, SkeletonText, Text } from '@chakra-ui/react'
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
import { GetActivitiesByStateQry } from '../application/get-activities-by-state-qry'
import { Activity } from '../domain/activity'
import { ActivityErrorMessage } from '../domain/services/activity-error-message'
import { ActivityModal } from './components/activity-modal/activity-modal'
import { adaptActivitiesToTable } from './pending-activities-page-utils'
import { useIsMobile } from '../../../../../shared/hooks/use-is-mobile'
import { ActivityStateFilter } from './components/activity-state-filter/activity-state-filter'
import { ActivityApprovalStateFilter } from '../domain/activity-approval-state-filter'
import { RemoveActivityButton } from './components/activity-form/components/remove-activity-button'
import { DeleteActivityCmd } from '../application/delete-activity-cmd'
import { ActivityApprovalState } from '../domain/activity-approval-state'

export const PendingActivitiesPage: FC = () => {
  const { t } = useTranslation()

  const approvedStateTranslationMap: Record<ActivityApprovalState, string> = {
    PENDING: 'activity_pending.state.pending',
    ACCEPTED: 'activity_pending.state.approved',
    NA: ''
  }

  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const isMobile = useIsMobile()
  const [enableApprove, setEnableApprove] = useState(false)
  const [approvalStateFilter, setApprovalStateFilter] =
    useState<ActivityApprovalStateFilter>('PENDING')

  const { executeUseCase: approveActivityCmd, isLoading: isApproving } =
    useGetUseCase(ApproveActivityCmd)

  const state = useMemo(
    () => ({ year: new Date().getFullYear(), state: approvalStateFilter }),
    [approvalStateFilter]
  )

  const {
    isLoading: isLoadingActivities,
    result: activities,
    executeUseCase: getActivitiesByStateQry
  } = useExecuteUseCaseOnMount(GetActivitiesByStateQry, state)

  const activityErrorMessage = useResolve(ActivityErrorMessage)
  const activitiesByStateQry = () => getActivitiesByStateQry(state)

  useSubscribeToUseCase(ApproveActivityCmd, activitiesByStateQry, [])
  useSubscribeToUseCase(DeleteActivityCmd, activitiesByStateQry, [])

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

  const onFilterChange = (approvalState: ActivityApprovalStateFilter) =>
    setApprovalStateFilter(approvalState)

  const columns: ColumnsProps[] = [
    {
      title: 'activity_pending.employee_name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      showInMobile: true
    },
    {
      title: 'activity_pending.state_header',
      dataIndex: 'approvalState',
      key: 'approvalState',
      render: (state: ActivityApprovalState) => <Text>{t(approvedStateTranslationMap[state])}</Text>
    },
    {
      title: 'activity_pending.approval_date',
      dataIndex: 'approvalDate',
      key: 'approvalDate'
    },
    {
      title: 'activity_pending.approved_by',
      dataIndex: 'approvedByUserName',
      key: 'approvedByUserName'
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
      <ActivityStateFilter
        defaultValue={approvalStateFilter}
        onChange={onFilterChange}
      ></ActivityStateFilter>
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
            <>
              <RemoveActivityButton activity={selectedActivity} onDeleted={onCloseActivity} />
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
            </>
          }
        />
      )}
    </PageWithTitle>
  )
}
