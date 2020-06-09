import React, {lazy} from "react"
import {useTranslation} from "react-i18next"
import useTitle from "commons/hooks/useTitle"
import {BinnacleResourcesProvider} from "features/BinnacleResourcesProvider"
import {useIsMobile} from "commons/hooks/useIsMobile"

const MobilePage = lazy(() =>
  import(/* webpackChunkName: "binnacle-mobile" */ "./BinnacleMobile")
);
const DesktopPage = lazy(() =>
  import(/* webpackChunkName: "binnacle-desktop" */ "./BinnacleDesktop")
);

const BinnaclePage: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t("pages.binnacle"));

  const isMobile = useIsMobile()

  return (
    <BinnacleResourcesProvider>
      {isMobile ? <MobilePage /> : <DesktopPage />}
    </BinnacleResourcesProvider>
  )
};

export default BinnaclePage
