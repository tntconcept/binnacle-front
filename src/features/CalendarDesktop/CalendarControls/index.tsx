import React from "react"
import {ReactComponent as ChevronRight} from "assets/icons/chevron-right.svg"
import {ReactComponent as ChevronLeft} from "assets/icons/chevron-left.svg"
import styles from "features/CalendarDesktop/CalendarControls/CalendarControls.module.css"
import {useTranslation} from "react-i18next"
import DateTime from "services/DateTime"
import {useBinnacleResources} from "features/BinnacleResourcesProvider"
import {ArrowButton} from "features/CalendarDesktop/CalendarControls/ArrowButton"

const CalendarControls: React.FC = () => {
  const { t } = useTranslation();
  const { changeMonth, selectedMonth } = useBinnacleResources();

  const handleNextMonthClick = () => {
    const nextMonth = DateTime.addMonths(selectedMonth, 1);
    changeMonth(nextMonth);
  };

  const handlePrevMonthClick = async () => {
    const prevMonth = DateTime.subMonths(selectedMonth, 1);
    changeMonth(prevMonth);
  };

  return (
    <div className={styles.container}>
      <p
        className={styles.date}
        data-testid="selected_date">
        <span className={styles.month}>
          {DateTime.format(selectedMonth, "MMMM")}
        </span>{" "}
        <span className={styles.year}>
          {DateTime.format(selectedMonth, "yyyy")}
        </span>
      </p>
      <ArrowButton
        onClick={handlePrevMonthClick}
        data-testid="prev_month_button"
        aria-label={t("accessibility.prev_month", {
          monthStr: DateTime.format(
            DateTime.subMonths(selectedMonth, 1),
            "LLLL yyyy"
          )
        })}
      >
        <ChevronLeft />
      </ArrowButton>
      <ArrowButton
        onClick={handleNextMonthClick}
        data-testid="next_month_button"
        aria-label={t("accessibility.next_month", {
          monthStr: DateTime.format(
            DateTime.addMonths(selectedMonth, 1),
            "LLLL yyyy"
          )
        })}
      >
        <ChevronRight />
      </ArrowButton>
    </div>
  );
};

export default CalendarControls;


