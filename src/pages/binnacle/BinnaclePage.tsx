import React, { lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsMobile, useTitle } from 'core/hooks'
import { BinnacleResourcesProvider } from 'core/providers/BinnacleResourcesProvider'

const LazyBinnacleMobile = lazy(() =>
  import(/* webpackChunkName: "binnacle-mobile" */ './BinnacleMobile/BinnacleMobile')
)
const LazyBinnacleDesktop = lazy(() =>
  import(/* webpackChunkName: "binnacle-desktop" */ './BinnacleDesktop/BinnacleDesktop')
)

const BinnaclePage: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('pages.binnacle'))

  const isMobile = useIsMobile()

  return (
    <BinnacleResourcesProvider>
      {isMobile ? <LazyBinnacleMobile /> : <LazyBinnacleDesktop />}
    </BinnacleResourcesProvider>
  )
}

export default BinnaclePage
