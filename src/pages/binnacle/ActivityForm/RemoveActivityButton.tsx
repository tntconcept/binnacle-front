// @ts-ignore
import React, { unstable_useTransition as useTransition, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, ErrorModal } from 'common/components'
import { IActivity } from 'api/interfaces/IActivity'
import { useShowErrorNotification } from 'features/Notifications'
import { useBinnacleResources } from 'features/BinnacleResourcesProvider'
import { SUSPENSE_CONFIG } from 'utils/constants'
import { deleteActivityById } from 'api/ActivitiesAPI'

interface IRemoveActivityButton {
  activity: IActivity
  onDeleted: () => void
}

const RemoveActivityButton: React.FC<IRemoveActivityButton> = (props) => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const showErrorNotification = useShowErrorNotification()
  const { updateCalendarResources } = useBinnacleResources()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteActivity = async () => {
    try {
      setIsDeleting(true)
      await deleteActivityById(props.activity.id)
      startTransition(() => {
        setIsOpen(false)
        props.onDeleted()
        updateCalendarResources()
      })
    } catch (e) {
      setIsDeleting(false)
      showErrorNotification(e)
    }
  }

  return (
    <React.Fragment>
      {modalIsOpen && (
        <ErrorModal
          message={{
            title: t('remove_modal.title'),
            description: t('remove_modal.description')
          }}
          onClose={() => setIsOpen(false)}
          onConfirm={handleDeleteActivity}
          confirmIsLoading={isDeleting || isPending}
          confirmText={t('activity_form.remove_activity')}
        />
      )}
      {props.activity && (
        <Button
          data-testid="remove_activity"
          isTransparent
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {t('actions.remove')}
        </Button>
      )}
    </React.Fragment>
  )
}

export default RemoveActivityButton
