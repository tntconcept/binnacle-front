import React, {useContext, useEffect} from "react"
import DesktopTimeStatsLayout from "desktop/layouts/calendar/DesktopTimeStatsLayout"
import DesktopCalendarControlsLayout from "desktop/layouts/calendar/DesktopCalendarControlsLayout"
import {styled} from "styletron-react"
import cssToObject from "css-to-object"
import DesktopCalendarBodyLayout from "desktop/layouts/calendar/DesktopCalendarBodyLayout"
import MobileBinnacleLayout from "mobile/layouts/calendar/MobileBinnacleLayout"
import Media from "react-media"
import {fetchBinnacleData} from "core/controllers/binnacleService"
import {BinnacleDataContext, withBinnacleDataProvider} from "core/controllers/BinnacleDataProvider"

const Header = styled(
  "section",
  cssToObject(`
  display: flex;
  border: none;
  align-items: center;
  justify-content: space-between;
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 16px;
`)
)


const DesktopBinnacleLayout: React.FC = () => {
  return (
    <>
      <Header aria-label="Calendar controls">
        <DesktopTimeStatsLayout/>
        <DesktopCalendarControlsLayout/>
      </Header>
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
