import React, { useState } from 'react'
import { PageWithTitle } from 'shared/components/page-with-title/page-with-title'
import ActivitiesList from './components/activities-list/activities-list'
import { useTranslation } from 'react-i18next'

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
    <PageWithTitle title={t('pages.activities')} onClickAction={onOpenActivity}>
      <ActivitiesList
        onCloseActivity={onCloseActivity}
        showActivityModal={showActivityModal}
        setShowActivityModal={setShowActivityModal}
      />
    </PageWithTitle>
  )
}

export default ActivitiesPage
