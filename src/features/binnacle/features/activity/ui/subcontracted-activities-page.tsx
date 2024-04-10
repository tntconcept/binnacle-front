import { Button } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { SubcontractedActivitiesList } from './components/subcontracted-activities-list/subcontracted-activities-list'

const SubcontractedActivitiesPage: FC = () => {
  const { t } = useTranslation()
  const [showNewSubcontractedActivityModal, setShowNewSubcontractedActivityModal] = useState(false)

  const onNewSubcontractedActivity = () => {
    setShowNewSubcontractedActivityModal(true)
  }
  const onCloseActivity = () => {
    setShowNewSubcontractedActivityModal(false)
  }

  return (
    <PageWithTitle
      title={t('pages.subcontracted_activities')}
      actions={
        <Button
          data-testid="show_activity_modal"
          onClick={onNewSubcontractedActivity}
          type="button"
          colorScheme="grey"
          variant="outline"
          size="sm"
        >
          {t('subcontracted_activity.create')}
        </Button>
      }
    >
      <SubcontractedActivitiesList
        onCloseActivity={onCloseActivity}
        showNewActivityModal={showNewSubcontractedActivityModal}
      />
    </PageWithTitle>
  )
}

export default SubcontractedActivitiesPage
