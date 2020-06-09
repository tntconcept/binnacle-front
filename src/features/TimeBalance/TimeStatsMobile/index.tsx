import React, {useContext} from "react"
import styles from "features/TimeBalance/TimeStatsMobile/TimeStats.module.css"
import {getDuration} from "utils/TimeUtils"
import CustomSelect from "core/components/CustomSelect"
import {SettingsContext} from "features/SettingsContext/SettingsContext"
import useTimeBalance from "features/TimeBalance/useTimeBalance"
import {useTranslation} from "react-i18next"
import DateTime from "services/DateTime"
import {useBinnacleResources} from "features/BinnacleResourcesProvider"
import Spinner from "features/CalendarDesktop/CalendarControls/ArrowButton"

const TimeStats: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useContext(SettingsContext);
  const {selectedMonth, timeReader} = useBinnacleResources();
  const timeData = timeReader()
  const { selectedBalance, handleSelect, isPending } = useTimeBalance();

  const renderTimeBalance = () => {
    const duration = getDuration(
      timeData.timeDifference,
      state.useDecimalTimeFormat
    );

    if (timeData.timeDifference === 0) {
      return duration;
    }

    if (timeData.timeDifference > 0) {
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
            timeData.timeWorked,
            state.useDecimalTimeFormat
          )}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <span className={styles.description}>
          {false
            ? t("time_tracking.business_hours")
            : DateTime.format(selectedMonth, "MMMM")
          }
        </span>
        <span className={styles.value}>
          {getDuration(
            timeData.timeToWork,
            state.useDecimalTimeFormat
          )}
        </span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <div className={styles.selectContainer}>
          <CustomSelect onChange={handleSelect} value={selectedBalance} style={{marginBottom: "4px"}}>
            <option data-testid="balance_by_month_button" value="by_month">
              {t("time_tracking.month_balance")}
            </option>
            <option data-testid="balance_by_year_button" value="by_year">
              {t("time_tracking.year_balance")}
            </option>
          </CustomSelect>
          {isPending && <Spinner className={styles.spinner} />}
        </div>
        <span
          className={styles.value}
          style={{
            color: calculateColor(timeData.timeDifference)
          }}
        >
          {renderTimeBalance()}
        </span>
      </div>
    </div>
  );
};

export default TimeStats

const calculateColor = (time: number) => {
  if (time === 0) {
    return "black";
  } else if (time > 0) {
    return "green";
  }
  return "var(--error-color)";
};
