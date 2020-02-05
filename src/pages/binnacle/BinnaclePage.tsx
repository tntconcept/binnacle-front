import React, {useContext, useEffect} from "react"
import DesktopTimeStatsLayout from "desktop/layouts/calendar/DesktopTimeStatsLayout"
import DesktopCalendarControlsLayout from "desktop/layouts/calendar/DesktopCalendarControlsLayout"
import DesktopCalendarBodyLayout from "desktop/layouts/calendar/DesktopCalendarBodyLayout"
import MobileBinnacleLayout from "mobile/layouts/calendar/MobileBinnacleLayout"
import Media from "react-media"
import {fetchBinnacleData} from "core/contexts/BinnacleContext/binnacleService"
import {BinnacleDataContext, withBinnacleDataProvider} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import styles from './BinnaclePage.module.css'
import Navbar from "core/components/Navbar"


const DesktopBinnacleLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <section className={styles.header} aria-label="Calendar controls">
        <DesktopTimeStatsLayout/>
        <DesktopCalendarControlsLayout/>
      </section>
      <DesktopCalendarBodyLayout/>
    </>
  )
}

const BinnaclePage: React.FC = () => {
  const { state, dispatch } = useContext(BinnacleDataContext)

  useEffect(() => {
    fetchBinnacleData(state.month, state.isTimeCalculatedByYear, dispatch)
  }, [])

  return (
    <Media query="(max-width: 480px)">
      {matches => {
        return matches ?
          <MobileBinnacleLayout/> :
          <DesktopBinnacleLayout/>
      }}
    </Media>
  )
}

export default withBinnacleDataProvider(BinnaclePage)
