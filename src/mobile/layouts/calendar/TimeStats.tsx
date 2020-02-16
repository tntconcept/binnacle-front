import React, {useContext} from "react"
import styles from "./TimeStats.module.css"
import {ITimeTracker} from "interfaces/ITimeTracker"
import {getDuration} from "utils/TimeUtils"
import CustomSelect from "core/components/CustomSelect/CustomSelect"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"

interface ITimeStats {
  timeBalance: ITimeTracker;
}

export const TimeStats: React.FC<ITimeStats> = React.memo(props => {
  const {state} = useContext(SettingsContext)

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <span className={styles.description}>Imputadas</span>
        <span className={styles.value}>
          {getDuration(props.timeBalance.minutesWorked, state.useDecimalTimeFormat)}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <span className={styles.description}>Laborables</span>
        <span className={styles.value}>
          {getDuration(props.timeBalance.minutesToWork, state.useDecimalTimeFormat)}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <CustomSelect>
          <option data-testid="balance_by_month_button">balance mensual</option>
          <option data-testid="balance_by_year_button">balance anual</option>
        </CustomSelect>
        <span className={styles.value}>
          {getDuration(props.timeBalance.differenceInMinutes, state.useDecimalTimeFormat)}
        </span>
      </div>
    </div>
  );
});
