import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { PageTitle } from 'shared/components/PageTitle'

const BinnaclePage: FC = () => {
  const { t } = useTranslation()

  return (
    <PageTitle title={t('pages.binnacle')}>
      <Outlet />
    </PageTitle>
  )
}

export default BinnaclePage
