import { Button, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
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
import chrono, { getHumanizedDuration } from '../../../../../shared/utils/chrono'
import { TimeUnits } from '../../../../../shared/types/time-unit'
import { getDurationByMinutes } from '../utils/getDuration'
import { PaperClipIcon } from '@heroicons/react/outline'
import { VacationBadge } from '../../vacation/ui/components/vacation-table/vacation-badge'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'

const PendingActivitiesPage = () => {
  const { t } = useTranslation()
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activityDate] = useState(new Date())
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [tableActivities, setTableActivities] = useState<any>([])

  const { useCase: approveActivityCmd } = useGetUseCase(ApproveActivityCmd)
  const { isLoading: isLoadingActivities, result: activities } =
    useExecuteUseCaseOnMount(GetPendingActivitiesQry)
  const activityErrorMessage = useResolve(ActivityErrorMessage)

  useEffect(() => {
    if (!isLoadingActivities) {
      const activitiesAdapted = activities?.map((activity, key) => {
        return {
          key,
          id: activity.id,
          employee: activity.userName,
          dates:
            activity.interval.timeUnit === TimeUnits.MINUTES
              ? `${chrono(activity.interval.start).format('yyyy-MM-dd')} | ${chrono(
                  activity.interval.start
                ).format('HH:mm')} - ${chrono(activity.interval.end).format('HH:mm')}`
              : `${chrono(activity.interval.start).format('yyyy-MM-dd')} - ${chrono(
                  activity.interval.end
                ).format('yyyy-MM-dd')}`,
          duration:
            activity.interval.timeUnit === TimeUnits.MINUTES
              ? getDurationByMinutes(activity.interval.duration)
              : getHumanizedDuration({
                  duration: activity.interval.duration,
                  abbreviation: true,
                  timeUnit: activity.interval.timeUnit
                }),
          organization: activity.organization.name,
          project: activity.project.name,
          role: activity.projectRole.name,
          status: activity,
          attachment: activity.hasEvidences && <PaperClipIcon width={'20px'} />,
          action: activity
        }
      })
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
      title: 'Empleado',
      dataIndex: 'employee',
      key: 'employee',
      showInMobile: true
    },
    {
      title: 'Fechas',
      dataIndex: 'dates',
      key: 'dates'
    },
    {
      title: 'Duración',
      dataIndex: 'duration',
      key: 'duration',
      showInMobile: true
    },
    {
      title: 'Organización',
      dataIndex: 'organization',
      key: 'organization'
    },
    {
      title: 'Proyecto',
      dataIndex: 'project',
      key: 'project'
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (activity: any) => <VacationBadge status={activity.approvalState} />
    },
    {
      title: 'Adjuntos',
      dataIndex: 'attachment',
      key: 'attachment'
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (activity: any) => (
        <Button
          colorScheme="blue"
          variant="ghost"
          size="sm"
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
      <Stack mx={[5, 24]} my={[6, 10]} spacing={4}>
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
      </Stack>
    </PageTitle>
  )
}

export default PendingActivitiesPage
