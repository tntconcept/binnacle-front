import React, {Dispatch, useContext} from "react"
import styles from "./TimeStats.module.css"
import {ITimeTracker} from "interfaces/ITimeTracker"
import {getDuration} from "utils/TimeUtils"
import CustomSelect from "core/components/CustomSelect/CustomSelect"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import useTimeBalance from "core/hooks/useTimeBalance"
import {TBinnacleActions} from "core/contexts/BinnacleContext/binnacleActions"
import {useTranslation} from "react-i18next"

interface ITimeStats {
  timeBalance: ITimeTracker
  month: Date
  dispatch: Dispatch<TBinnacleActions>
}

export const TimeStats: React.FC<ITimeStats> = React.memo(props => {
  const { t } = useTranslation()
  const {state} = useContext(SettingsContext)
  const { selectedBalance, handleSelect } = useTimeBalance(props.month, props.dispatch)

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <span className={styles.description}>{t('time_tracking.imputed_hours')}</span>
        <span className={styles.value}>
          {getDuration(props.timeBalance.minutesWorked, state.useDecimalTimeFormat)}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <span className={styles.description}>{t('time_tracking.business_hours')}</span>
        <span className={styles.value}>
          {getDuration(props.timeBalance.minutesToWork, state.useDecimalTimeFormat)}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
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
        <span className={styles.value}>
          {getDuration(props.timeBalance.differenceInMinutes, state.useDecimalTimeFormat)}
        </span>
      </div>
    </div>
  );
});
