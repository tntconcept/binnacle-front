import { FC } from 'react'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { useTranslation } from 'react-i18next'
import { AvailabilityTable } from './components/availability-table'
import { CalendarProvider } from '../../activity/ui/contexts/calendar-context'

const AvailabilityPage: FC = () => {
  const { t } = useTranslation()

  return (
    <PageWithTitle title={t('pages.availability')}>
      <CalendarProvider>
        <AvailabilityTable />
      </CalendarProvider>
    </PageWithTitle>
  )
}

export default AvailabilityPage
