import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageWithTitle } from 'shared/components/page-with-title/page-with-title'
import ActivitiesList from './components/activities-list/activities-list'

const ActivitiesPage = () => {
  const { t } = useTranslation()
  const [showActivityModal, setShowActivityModal] = useState(false)

  const onOpenActivity = () => {
    setShowActivityModal(true)
  }
  const onCloseActivity = () => {
    setShowActivityModal(false)
  }

  return (
    <PageWithTitle
      title={t('pages.activities')}
      actions={
        <Button
          data-testid="show_activity_modal"
          onClick={onOpenActivity}
          type="button"
          colorScheme="grey"
          variant="outline"
          size="sm"
        >
          {t('activity.create')}
        </Button>
      }
    >
      <ActivitiesList
        onCloseActivity={onCloseActivity}
        onOpenActivity={onOpenActivity}
        showActivityModal={showActivityModal}
      />
    </PageWithTitle>
  )
}

export default ActivitiesPage
