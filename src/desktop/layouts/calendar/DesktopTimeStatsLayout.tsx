import React, {useContext} from "react"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import styles from './DesktopTimeStatsLayout.module.css'
import {getDuration} from "utils/TimeUtils"
import CustomSelect from "core/components/CustomSelect/CustomSelect"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import useTimeBalance from "core/hooks/useTimeBalance"
import {useTranslation} from "react-i18next"
import {format} from "date-fns"
import {es} from "date-fns/locale"

const calculateColor = (time: number) => {
  if (time === 0) {
    return "black"
  } else if (time > 0) {
    return "green"
  }
  return "var(--error-color)"
}

const DesktopTimeStatsLayout: React.FC = () => {
  const { t } = useTranslation()
  const {state, dispatch} = useContext(BinnacleDataContext)
  const {state: settingsState} = useContext(SettingsContext)
  const { selectedBalance, handleSelect } = useTimeBalance(state.month, dispatch)

  const renderBalanceTime = () => {
    if (state.loadingTimeBalance) {
      return <span>Loading...</span>
    }

    const duration = getDuration(state.timeBalance.differenceInMinutes, settingsState.useDecimalTimeFormat)

    if (state.timeBalance.differenceInMinutes === 0) {
      return duration
    }

    if (state.timeBalance.differenceInMinutes > 0) {
      return `+${duration}`
    } else {
      return `-${duration}`
    }
  }

  const locale = navigator.language === "es-Es" ? es : undefined

  return (
    <div className={styles.container}>
      <p className={styles.title}>{t('time_tracking.description')}</p>
      <div className={styles.stats}>
        <div className={styles.timeBlock}>
          {t('time_tracking.imputed_hours')}
          <p className={styles.time}>{getDuration(state.timeBalance.minutesWorked, settingsState.useDecimalTimeFormat)}</p>
        </div>
        <div className={styles.divider}/>
        <div className={styles.timeBlock}>
          {state.isTimeCalculatedByYear ? t('time_tracking.business_hours') : format(state.month, "MMMM", {locale}) }
          <p className={styles.time}>{getDuration(state.timeBalance.minutesToWork, settingsState.useDecimalTimeFormat)}</p>
        </div>
        <div className={styles.divider}/>
        <div className={styles.timeBlock}>
          <CustomSelect
            onChange={handleSelect}
            value={selectedBalance}
          >
            <option
              data-testid="balance_by_month_button"
              value="by_month"
            >
              {t('time_tracking.month_balance')}
            </option>
            <option
              data-testid="balance_by_year_button"
              value="by_year"
            >
              {t('time_tracking.year_balance')}
            </option>
          </CustomSelect>
          <p
            className={styles.time}
            style={{
              color: calculateColor(state.timeBalance.differenceInMinutes)
            }}
            data-testid="time_balance_value"
          >
            {renderBalanceTime()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DesktopTimeStatsLayout
