import { Button, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageTitle } from 'shared/components/PageTitle'
import { ActivityModal } from './components/activity-modal/activity-modal'
import { Activity } from '../domain/activity'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { ApproveActivityCmd } from '../application/approve-activity-cmd'
import { useResolve } from '../../../../../shared/di/use-resolve'
import { ActivityErrorMessage } from '../domain/services/activity-error-message'
import Table from '../../../../../shared/components/table/table'

const PendingActivitiesPage = () => {
  const { t } = useTranslation()
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activityDate] = useState(new Date())
  const [selectedActivity] = useState<Activity | undefined>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const { useCase: approveActivityCmd } = useGetUseCase(ApproveActivityCmd)
  const activityErrorMessage = useResolve(ActivityErrorMessage)

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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: () => (
        <a data-testid="action" onClick={() => {}}>
          click me
        </a>
      )
    }
  ]

  return (
    <PageTitle title={t('pages.awaiting_requests')}>
      <Stack mx={[5, 24]} my={[6, 10]} spacing={4}>
        <Table columns={columns} dataSource={[]} emptyTableKey={'Empty'}></Table>
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivity}
          onSave={onCloseActivity}
          activityDate={activityDate}
          activity={selectedActivity}
          isReadOnly={true}
          setIsLoadingForm={(isLoading) => setIsLoadingForm(isLoading)}
          employee={'John Doe'}
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
