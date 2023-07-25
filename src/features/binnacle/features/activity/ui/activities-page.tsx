import { Button } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { ActivitiesList } from './components/activities-list/activities-list'

const ActivitiesPage: FC = () => {
  const { t } = useTranslation()
  const [showNewActivityModal, setShowNewActivityModal] = useState(false)

  const onNewActivity = () => {
    setShowNewActivityModal(true)
  }
  const onCloseActivity = () => {
    setShowNewActivityModal(false)
  }

  return (
    <PageWithTitle
      title={t('pages.activities')}
      actions={
        <Button
          data-testid="show_activity_modal"
          onClick={onNewActivity}
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
        showNewActivityModal={showNewActivityModal}
      />
    </PageWithTitle>
  )
}

export default ActivitiesPage
