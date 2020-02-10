import React, {useContext, useEffect} from "react"
import DesktopTimeStatsLayout from "desktop/layouts/calendar/DesktopTimeStatsLayout"
import DesktopCalendarControlsLayout from "desktop/layouts/calendar/DesktopCalendarControlsLayout"
import DesktopCalendarBodyLayout from "desktop/layouts/calendar/DesktopCalendarBodyLayout"
import MobileBinnacleLayout from "mobile/layouts/calendar/MobileBinnacleLayout"
import Media from "react-media"
import {fetchBinnacleData} from "core/contexts/BinnacleContext/binnacleService"
import {BinnacleDataContext, withBinnacleDataProvider} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import styles from "./BinnaclePage.module.css"
import Navbar from "core/components/Navbar"
import ActivityPage from "pages/activity/ActivityPage"
import {Route, Switch, useRouteMatch} from "react-router-dom"
import {useTranslation} from "react-i18next"
import useTitle from "core/hooks/useTitle"

const DesktopBinnacleLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <section className={styles.header} aria-label="Calendar controls">
        <DesktopTimeStatsLayout />
        <DesktopCalendarControlsLayout />
      </section>
      <DesktopCalendarBodyLayout />
    </>
  );
};

const BinnaclePage: React.FC = () => {
  const { t } = useTranslation()
  useTitle(t('pages.binnacle'))

  const { state, dispatch } = useContext(BinnacleDataContext);
  const { path } = useRouteMatch();

  useEffect(() => {
    fetchBinnacleData(state.month, state.isTimeCalculatedByYear, dispatch);
  }, []);

  return (
    <Media query="(max-width: 480px)">
      {matches => {
        return matches ? (
          <Switch>
            <Route exact path={path}>
              <MobileBinnacleLayout />
            </Route>
            <Route path={`${path}/activity`}>
              <ActivityPage />
            </Route>
          </Switch>
        ) : (
          <DesktopBinnacleLayout />
        );
      }}
    </Media>
  );
};

export default withBinnacleDataProvider(BinnaclePage);
