import React, {lazy, useContext, useEffect} from "react"
import {fetchBinnacleData} from "services/BinnacleService"
import {BinnacleDataContext, withBinnacleDataProvider} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {useTranslation} from "react-i18next"
import useTitle from "core/hooks/useTitle"
import {useMediaQuery} from 'react-responsive'

const MobilePage = lazy(() => import(/* webpackChunkName: "binnacle-mobile" */'./BinnacleMobile'));
const DesktopPage = lazy(() => import(/* webpackChunkName: "binnacle-desktop" */'./BinnacleDesktop'));

const BinnaclePage: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('pages.binnacle'))

  const isMobile = useMediaQuery({
    query: '(max-width: 480px)'
  })

  const { state, dispatch } = useContext(BinnacleDataContext);

  useEffect(() => {
    fetchBinnacleData(state.month, state.isTimeCalculatedByYear, dispatch);
  }, [/* Ignore dependency, we really want to run only once*/]);

  return !state.loadingData ? (isMobile ? <MobilePage /> : <DesktopPage />) : null
};

export default withBinnacleDataProvider(BinnaclePage);
