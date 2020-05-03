import React, { lazy } from "react";
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

  return isMobile ? <MobilePage /> : <DesktopPage />;
};

export default BinnaclePage
