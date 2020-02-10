import React, {useContext, useState} from "react"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {fetchTimeBalanceByMonth, fetchTimeBalanceByYear} from "core/contexts/BinnacleContext/binnacleService"
import styles from './DesktopTimeStatsLayout.module.css'
import {getHumanizedDuration} from "utils/timeUtils"

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
    <div className={styles.container}>
      seguimiento de horas
      <div className={styles.stats}>
        <div className={styles.timeBlock}>
          imputadas
          <p className={styles.time}>{getHumanizedDuration(state.timeBalance.minutesWorked)}</p>
        </div>
        <div className={styles.divider}/>
        <div className={styles.timeBlock}>
          laborables
          <p className={styles.time}>{getHumanizedDuration(state.timeBalance.minutesToWork)}</p>
        </div>
        <div className={styles.divider}/>
        <div className={styles.timeBlock}>
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
          <p
            className={styles.time}
            style={{
              color: calculateColor(state.timeBalance.differenceInMinutes)
            }}
            data-testid="time_balance_value"
          >
            {state.loadingTimeBalance ? (
              <span>Loading...</span>
            ) : (
              getHumanizedDuration(state.timeBalance.differenceInMinutes)
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DesktopTimeStatsLayout
