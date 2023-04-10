import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { PageTitle } from 'shared/components/PageTitle'
import { CalendarProvider } from './contexts/calendar-context'

const CalendarPage: FC = () => {
  const { t } = useTranslation()

  return (
    <PageTitle title={`${t('pages.binnacle')} · tnt`}>
      <CalendarProvider>{<Outlet />}</CalendarProvider>
    </PageTitle>
  )
}

export default CalendarPage
