import React, {useContext, useState} from "react"
import {styled} from "styletron-react"
import cssToObject from "css-to-object"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import {BinnacleDataContext} from "core/controllers/BinnacleDataProvider"
import {fetchTimeBalanceByMonth, fetchTimeBalanceByYear} from "core/controllers/binnacleService"

const Container = styled(
  "div",
  cssToObject(`
    font-family: 'Nunito Sans';
    font-size: 10px;
    font-weight: 600;
    line-height: 1.4;
    text-align: left;
    color: var(--dark);
    text-transform: uppercase;
  `)
)

const Stats = styled(
  "div",
  cssToObject(`
  display: flex;
  align-items: center;
`)
)

const TimeBlock = styled(
  "div",
  cssToObject(`
  font-family: 'Nunito Sans';
  font-size: 8px;
  line-height: 1.4;
  text-align: left;
  text-transform: uppercase;
  color: var(--dark);
`)
)

const Time = styled(
  "p",
  cssToObject(`
  font-family: 'Nunito Sans';
  font-size: 14px;
  font-weight: bold;
  line-height: 1.4;
  text-align: left;
  color: var(--dark);
`)
)

const Divider = styled(
  "div",
  cssToObject(`
   border-left:1px solid var(--light-blue-grey); 
   height: 26px;
   margin-left: 16px;
   margin-right: 16px;
`)
)

const calculateColor = (time: number) => {
  if (time === 0) {
    return "black"
  } else if (time > 0) {
    return "green"
  }
  return "var(--error-color)"
}

const DesktopTimeStatsLayout: React.FC = () => {
  const {state, dispatch} = useContext(BinnacleDataContext)
  const addNotification = useContext(NotificationsContext)

  const [selectedBalance, setBalance] = useState("balance mensual")

  const handleBalanceByYear = () => {
    fetchTimeBalanceByYear(state.month, dispatch)
      .catch(error => addNotification(error))
  }

  const handleBalanceByMonth = () => {
    fetchTimeBalanceByMonth(state.month, dispatch)
      .catch(error => addNotification(error))
  }

  const handleSelect = (event: any) => {
    const optionSelected = event.target.value
    setBalance(optionSelected)

    if (optionSelected === "balance mensual") {
      handleBalanceByMonth()
    } else {
      handleBalanceByYear()
    }
  }

  return (
    <Container>
      seguimiento de horas
      <Stats>
        <TimeBlock>
          imputadas
          <Time>{state.timeBalance.minutesWorked}</Time>
        </TimeBlock>
        <Divider/>
        <TimeBlock>
          laborables
          <Time>{state.timeBalance.minutesToWork}</Time>
        </TimeBlock>
        <Divider/>
        <TimeBlock>
          <select
            onChange={handleSelect}
            value={selectedBalance}
            style={{
              textTransform: "uppercase",
              fontSize: "8px",
              fontFamily: "Nunito sans"
            }}
          >
            <option data-testid="balance_by_month_button">
              balance mensual
            </option>
            <option data-testid="balance_by_year_button">balance anual</option>
          </select>
          <Time
            style={{
              color: calculateColor(state.timeBalance.differenceInMinutes)
            }}
            data-testid="time_balance_value"
          >
            {state.loadingTimeBalance ? (
              <span>Loading...</span>
            ) : (
              state.timeBalance.differenceInMinutes
            )}
          </Time>
        </TimeBlock>
      </Stats>
    </Container>
  )
}

export default DesktopTimeStatsLayout
