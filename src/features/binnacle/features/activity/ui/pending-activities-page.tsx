import { Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageTitle } from 'shared/components/PageTitle'
import { ActivityModal } from './components/activity-modal/activity-modal'
import { Activity } from '../domain/activity'

const PendingActivitiesPage = () => {
  const { t } = useTranslation()
  const [showActivityModal, setShowActivityModal] = useState(true)
  const [activityDate] = useState(new Date())
  const [selectedActivity] = useState<Activity | undefined>()

  const onCloseActivity = () => {
    setShowActivityModal(false)
  }

  return (
    <PageTitle title={t('pages.awaiting_requests')}>
      <Stack mx={[5, 24]} my={[6, 10]} spacing={4}>
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivity}
          onSave={onCloseActivity}
          activityDate={activityDate}
          activity={selectedActivity}
          isReadOnly={true}
        />
      </Stack>
    </PageTitle>
  )
}

export default PendingActivitiesPage
