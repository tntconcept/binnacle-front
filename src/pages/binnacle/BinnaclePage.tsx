import React, { lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsMobile, useTitle } from 'common/hooks'
import { BinnacleResourcesProvider } from 'features/BinnacleResourcesProvider'

const LazyBinnacleMobile = lazy(() =>
  import(/* webpackChunkName: "binnacle-mobile" */ './BinnacleMobile')
)
const LazyBinnacleDesktop = lazy(() =>
  import(/* webpackChunkName: "binnacle-desktop" */ './BinnacleDesktop')
)

export const BinnaclePage: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('pages.binnacle'))

  const isMobile = useIsMobile()

  return (
    <BinnacleResourcesProvider>
      {isMobile ? <LazyBinnacleMobile /> : <LazyBinnacleDesktop />}
    </BinnacleResourcesProvider>
  )
}
