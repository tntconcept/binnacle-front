import React, {useContext} from "react"
import styles from "pages/binnacle/desktop/TimeStats/TimeStats.module.css"
import {getDuration} from "utils/TimeUtils"
import CustomSelect from "core/components/CustomSelect"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import useTimeBalance from "core/hooks/useTimeBalance"
import {useTranslation} from "react-i18next"
import {isAfter} from "date-fns"
import DateTime from "services/DateTime"
import {useCalendarResources} from "core/contexts/CalendarResourcesContext"
import Spinner from "../CalendarControls/ArrowButton"

const TimeStats: React.FC = () => {
  const {selectedMonth, timeReader} = useCalendarResources();
  const timeData = timeReader()
  const { t } = useTranslation();

  const { state: settingsState } = useContext(SettingsContext);
  const { selectedBalance, handleSelect, isPending } = useTimeBalance();

  const renderBalanceTime = () => {
    const duration = getDuration(
      timeData.timeDifference,
      settingsState.useDecimalTimeFormat
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

  const renderBalanceTimeBlock = () => {
    if (!isAfter(selectedMonth, new Date())) {
      return (
        <React.Fragment>
          <div className={styles.divider} />
          <div className={styles.timeBlock}>
            <div className={styles.selectContainer}>
              <CustomSelect
                onChange={handleSelect}
                value={selectedBalance}>
                <option
                  data-testid="balance_by_month_button"
                  value="by_month">
                  {t("time_tracking.month_balance")}
                </option>
                <option
                  data-testid="balance_by_year_button"
                  value="by_year">
                  {t("time_tracking.year_balance")}
                </option>
              </CustomSelect>
              {isPending && <Spinner className={styles.spinner} />}
            </div>
            <p
              className={styles.time}
              style={{
                color: calculateColor(timeData.timeDifference)
              }}
              data-testid="time_balance_value"
            >
              {renderBalanceTime()}
            </p>
          </div>
        </React.Fragment>
      );
    }
  };

  return (
    <fieldset className={styles.container}>
      <legend className={styles.title}>{t("time_tracking.description")}</legend>
      <div className={styles.stats}>
        <div className={styles.timeBlock}>
          {t("time_tracking.imputed_hours")}
          <p
            data-testid="time_worked_value"
            className={styles.time}>
            {getDuration(
              timeData.timeWorked,
              settingsState.useDecimalTimeFormat
            )}
          </p>
        </div>
        <div className={styles.divider} />
        <div className={styles.timeBlock}>
          {false
            ? t("time_tracking.business_hours")
            : DateTime.format(selectedMonth, "MMMM")}
          <p
            data-testid="time_to_work_value"
            className={styles.time}>
            {getDuration(
              timeData.timeToWork,
              settingsState.useDecimalTimeFormat
            )}
          </p>
        </div>
        {renderBalanceTimeBlock()}
      </div>
    </fieldset>
  );
};

const calculateColor = (time: number) => {
  if (time === 0) {
    return "black";
  } else if (time > 0) {
    return "green";
  }
  return "var(--error-color)";
};

export default TimeStats;
