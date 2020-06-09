import React, {lazy} from "react"
import {useTranslation} from "react-i18next"
import {useIsMobile, useTitle} from "common/hooks"
import {BinnacleResourcesProvider} from "features/BinnacleResourcesProvider"

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
