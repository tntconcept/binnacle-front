import React from "react"
import styles from "./TimeStats.module.css"
import {ITimeTracker} from "interfaces/ITimeTracker"
import {getHumanizedDuration} from "utils/timeUtils"
import CustomSelect from "core/components/CustomSelect/CustomSelect"

interface ITimeStats {
  timeBalance: ITimeTracker;
}

export const TimeStats: React.FC<ITimeStats> = React.memo(props => {
  console.log(props.timeBalance);

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <span className={styles.description}>Imputadas</span>
        <span className={styles.value}>
          {getHumanizedDuration(props.timeBalance.minutesWorked)}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <span className={styles.description}>Laborables</span>
        <span className={styles.value}>
          {getHumanizedDuration(props.timeBalance.minutesToWork)}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <CustomSelect>
          <option data-testid="balance_by_month_button">balance mensual</option>
          <option data-testid="balance_by_year_button">balance anual</option>
        </CustomSelect>
        <span className={styles.value}>
          {getHumanizedDuration(props.timeBalance.differenceInMinutes)}
        </span>
      </div>
    </div>
  );
});
