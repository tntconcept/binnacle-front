import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import { Activity } from '../../../domain/activity'
import { ACTIVITY_FORM_ID } from '../activity-form/activity-form'
import RemoveActivityButton from '../activity-form/components/remove-activity-button'
import { ActivityModal } from '../activity-modal/activity-modal'
import { ActivitiesListTable } from './activities-list-table'

interface Props {
  onCloseActivity: () => void
  showNewActivityModal: boolean
}

const ActivitiesList = ({ onCloseActivity, showNewActivityModal }: Props) => {
  const { t } = useTranslation()
  const activityDate = new Date()
  const [selectedActivity, setSelectedActivity] = useState<Activity>()
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [lastEndTime] = useState<Date | undefined>()

  const onActivityClicked = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowActivityModal(true)
  }

  const onCloseActivityModal = () => {
    setShowActivityModal(false)
    onCloseActivity()
  }

  useEffect(() => {
    if (!showNewActivityModal) return

    setSelectedActivity(undefined)
    setShowActivityModal(true)
  }, [showNewActivityModal])

  return (
    <>
      <ActivitiesListTable onOpenActivity={onActivityClicked} onDeleteActivity={onCloseActivity} />
      {showActivityModal && (
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivityModal}
          onSave={onCloseActivityModal}
          onLoading={setIsLoadingForm}
          activityDate={selectedActivity?.interval.start || activityDate}
          activity={selectedActivity}
          lastEndTime={lastEndTime}
          actions={
            <>
              {selectedActivity && (
                <RemoveActivityButton
                  activity={selectedActivity}
                  onDeleted={onCloseActivityModal}
                />
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
