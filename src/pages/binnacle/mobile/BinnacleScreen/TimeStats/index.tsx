import React, {useContext} from "react"
import styles from "pages/binnacle/mobile/BinnacleScreen/TimeStats/TimeStats.module.css"
import {ITimeBalance} from "api/interfaces/ITimeBalance"
import {getDuration} from "utils/TimeUtils"
import CustomSelect from "core/components/CustomSelect"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import useTimeBalance from "core/hooks/useTimeBalance"
import {useTranslation} from "react-i18next"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {formatMonth} from "utils/DateUtils"

interface ITimeStats {
  timeBalance: ITimeBalance;
}

const TimeStats: React.FC<ITimeStats> = React.memo(props => {
  const { t } = useTranslation();
  const { state: binnacleState } = useContext(BinnacleDataContext);
  const { state } = useContext(SettingsContext);
  const { selectedBalance, handleSelect } = useTimeBalance();

  const renderTimeBalance = () => {
    const duration = getDuration(
      props.timeBalance.timeDifference,
      state.useDecimalTimeFormat
    );

    if (props.timeBalance.timeDifference === 0) {
      return duration;
    }

    if (props.timeBalance.timeDifference > 0) {
      return `+${duration}`;
    } else {
      return `-${duration}`;
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <span className={styles.description}>
          {t("time_tracking.imputed_hours")}
        </span>
        <span className={styles.value}>
          {getDuration(
            props.timeBalance.timeWorked,
            state.useDecimalTimeFormat
          )}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <span className={styles.description}>
          {binnacleState.isTimeCalculatedByYear
            ? t("time_tracking.business_hours")
            : formatMonth(binnacleState.month)
          }
        </span>
        <span className={styles.value}>
          {getDuration(
            props.timeBalance.timeToWork,
            state.useDecimalTimeFormat
          )}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <CustomSelect onChange={handleSelect} value={selectedBalance} style={{marginBottom: "4px"}}>
          <option data-testid="balance_by_month_button" value="by_month">
            {t("time_tracking.month_balance")}
          </option>
          <option data-testid="balance_by_year_button" value="by_year">
            {t("time_tracking.year_balance")}
          </option>
        </CustomSelect>
        <span
          className={styles.value}
          style={{
            color: calculateColor(props.timeBalance.timeDifference)
          }}
        >
          {renderTimeBalance()}
        </span>
      </div>
    </div>
  );
});

export default TimeStats

const calculateColor = (time: number) => {
  if (time === 0) {
    return "black";
  } else if (time > 0) {
    return "green";
  }
  return "var(--error-color)";
};
