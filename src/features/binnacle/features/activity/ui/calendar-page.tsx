import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { PageTitle } from '../../../../../shared/components/page-title'
import { CalendarProvider } from './contexts/calendar-context'

export const CalendarPage: FC = () => {
  const { t } = useTranslation()

  return (
    <PageTitle title={`${t('pages.binnacle')} · tnt`}>
      <CalendarProvider>{<Outlet />}</CalendarProvider>
    </PageTitle>
  )
}
