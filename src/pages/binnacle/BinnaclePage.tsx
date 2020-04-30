import React, { lazy } from "react";
import { withBinnacleDataProvider } from "core/contexts/BinnacleContext/BinnacleDataProvider";
import { useTranslation } from "react-i18next";
import useTitle from "core/hooks/useTitle";
import { useMediaQuery } from "react-responsive";

const MobilePage = lazy(() =>
  import(/* webpackChunkName: "binnacle-mobile" */ "./BinnacleMobile")
);
const DesktopPage = lazy(() =>
  import(/* webpackChunkName: "binnacle-desktop" */ "./BinnacleDesktop")
);

const BinnaclePage: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t("pages.binnacle"));

  const isMobile = useMediaQuery({
    query: "(max-width: 480px)"
  });

  /*  useEffect(() => {
    fetchBinnacleData(state.month, state.isTimeCalculatedByYear, dispatch)
      .then(() => setIsLoading(false))
  }, [/!* Ignore dependency, we really want to run only once*!/]);*/

  return isMobile ? <MobilePage /> : <DesktopPage />;
};

export default withBinnacleDataProvider(BinnaclePage);
