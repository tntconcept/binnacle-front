import { ActivityModal } from '../activity-modal/activity-modal'
import RemoveActivityButton from '../activity-form/components/remove-activity-button'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import { ACTIVITY_FORM_ID } from '../activity-form/activity-form'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity } from '../../../domain/activity'
import { ActivitiesListTable } from './activities-list-table'

interface Props {
  onCloseActivity: () => void
  onOpenActivity: () => void
  showActivityModal: boolean
}

const ActivitiesList = ({ onCloseActivity, onOpenActivity, showActivityModal }: Props) => {
  const { t } = useTranslation()
  const activityDate = new Date()
  const [selectedActivity, setSelectedActivity] = useState<Activity>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [lastEndTime] = useState<Date | undefined>()

  return (
    <>
      <ActivitiesListTable
        onOpenActivity={onOpenActivity}
        onCloseActivity={onCloseActivity}
        setSelectedActivity={setSelectedActivity}
      />
      {showActivityModal && (
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivity}
          onSave={onCloseActivity}
          onLoading={setIsLoadingForm}
          activityDate={activityDate}
          activity={selectedActivity}
          lastEndTime={lastEndTime}
          actions={
            <>
              {selectedActivity && (
                <RemoveActivityButton activity={selectedActivity} onDeleted={onCloseActivity} />
              )}
              <SubmitButton isLoading={isLoadingForm} formId={ACTIVITY_FORM_ID}>
                {t('actions.save')}
              </SubmitButton>
            </>
          }
        />
      )}
    </>
  )
}

export default ActivitiesList
