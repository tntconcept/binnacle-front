import { ExecutionOptions } from '@archimedes/arch'
import { Button, SkeletonText, Text } from '@chakra-ui/react'
import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { useSubscribeToUseCase } from '../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { Table } from '../../../../../shared/components/table/table'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'
import { useResolve } from '../../../../../shared/di/use-resolve'
import { ApproveActivityCmd } from '../application/approve-activity-cmd'
import { GetActivitiesByFiltersQry } from '../application/get-activities-by-filters-qry'
import { Activity } from '../domain/activity'
import { ActivityErrorMessage } from '../domain/services/activity-error-message'
import { ActivityModal } from './components/activity-modal/activity-modal'
import { adaptActivitiesToTable } from './pending-activities-page-utils'
import { useIsMobile } from '../../../../../shared/hooks/use-is-mobile'
import { GetActivitiesQueryParams } from '../domain/get-activities-query-params'
import { ActivityFilters } from './components/activity-filters/activity-filters'
import { RemoveActivityButton } from './components/activity-form/components/remove-activity-button'
import { DeleteActivityCmd } from '../application/delete-activity-cmd'
import { ActivityApprovalState } from '../domain/activity-approval-state'
import { chrono } from '../../../../../shared/utils/chrono'

const PendingActivitiesPage: FC = () => {
  const { t } = useTranslation()

  const approvedStateTranslationMap: Record<ActivityApprovalState, string> = {
    PENDING: 'activity_pending.state.pending',
    ACCEPTED: 'activity_pending.state.approved',
    NA: ''
  }

  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const isMobile = useIsMobile()
  const [activityQueryParams, setActivityQueryParams] = useState<GetActivitiesQueryParams>({
    approvalState: 'PENDING',
    startDate: chrono(new Date()).startOf('year').format(chrono.DATE_FORMAT),
    endDate: chrono(new Date()).endOf('year').format(chrono.DATE_FORMAT)
  })

  const canApproveActivity = selectedActivity?.approval.canBeApproved

  const { executeUseCase: approveActivityCmd, isLoading: isApproving } =
    useGetUseCase(ApproveActivityCmd)

  const queryParams = useMemo(() => ({ queryParams: activityQueryParams }), [activityQueryParams])

  const {
    isLoading: isLoadingActivities,
    result: activities,
    executeUseCase: getActivitiesByFiltersQry
  } = useExecuteUseCaseOnMount(GetActivitiesByFiltersQry, {
    queryParams: activityQueryParams
  })
  const activityErrorMessage = useResolve(ActivityErrorMessage)
  const activitiesByFilterQry = () => getActivitiesByFiltersQry(queryParams)

  useSubscribeToUseCase(ApproveActivityCmd, activitiesByFilterQry, [])
  useSubscribeToUseCase(DeleteActivityCmd, activitiesByFilterQry, [])

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

  const onFilterChange = (newParams: Partial<GetActivitiesQueryParams>) => {
    setActivityQueryParams({ ...activityQueryParams, ...newParams })
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
          data-testid={'show_activity_' + activity.id}
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
    <PageWithTitle title={t('pages.pending_activities')}>
      <ActivityFilters
        defaultValues={activityQueryParams}
        onChange={onFilterChange}
      ></ActivityFilters>

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
                data-testid={'approve_activity_' + selectedActivity.id}
                isLoading={isApproving}
                isDisabled={!canApproveActivity}
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

export default PendingActivitiesPage
