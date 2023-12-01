import { FC } from 'react'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { useTranslation } from 'react-i18next'
import { CalendarProvider } from '../../activity/ui/contexts/calendar-context'
import { AvailabilityTable } from './components/availability-table/availability-table'

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
