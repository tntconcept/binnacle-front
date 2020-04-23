import React, {useContext, useState} from "react"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import getErrorMessage from "api/HttpClient/HttpErrorMapper"
import {ReactComponent as ChevronRight} from "assets/icons/chevron-right.svg"
import {ReactComponent as ChevronLeft} from "assets/icons/chevron-left.svg"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {fetchBinnacleData} from "services/BinnacleService"
import styles from "pages/binnacle/desktop/CalendarControls/CalendarControls.module.css"
import Button from "core/components/Button"
import {useTranslation} from "react-i18next"
import DateTime from "services/DateTime"

const CalendarControls: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(BinnacleDataContext);
  const showNotification = useContext(NotificationsContext);

  const [isLoadingPrevMonth, setLoadingPrevMonth] = useState(false);
  const [isLoadingNextMonth, setLoadingNextMonth] = useState(false);

  const handleNextMonthClick = () => {
    const nextMonth = DateTime.addMonths(state.month, 1);

    setLoadingNextMonth(true);
    fetchBinnacleData(nextMonth, state.isTimeCalculatedByYear, dispatch)
      .then(_ => setLoadingNextMonth(false))
      .catch(error => {
        setLoadingNextMonth(false);
        showNotification(getErrorMessage(error));
      });
  };

  const handlePrevMonthClick = async () => {
    const prevMonth = DateTime.subMonths(state.month, 1);

    setLoadingPrevMonth(true);
    fetchBinnacleData(prevMonth, state.isTimeCalculatedByYear, dispatch)
      .then(_ => setLoadingPrevMonth(false))
      .catch(error => {
        setLoadingPrevMonth(false);
        showNotification(getErrorMessage(error));
      });
  };

  return (
    <div className={styles.container}>
      <p className={styles.date} data-testid="selected_date">
        <span className={styles.month}>{DateTime.format(state.month, "MMMM")}</span>{" "}
        <span className={styles.year}>{DateTime.format(state.month, "yyyy")}</span>
      </p>
      <Button
        isTransparent
        isCircular
        onClick={handlePrevMonthClick}
        data-testid="prev_month_button"
        isLoading={isLoadingPrevMonth}
        aria-label={t("accessibility.prev_month", {
          monthStr: DateTime.format(DateTime.subMonths(state.month, 1), "LLLL yyyy")
        })}
      >
        <ChevronLeft />
      </Button>
      <Button
        isTransparent
        isCircular
        onClick={handleNextMonthClick}
        data-testid="next_month_button"
        isLoading={isLoadingNextMonth}
        aria-label={t("accessibility.next_month", {
          monthStr: DateTime.format(DateTime.addMonths(state.month, 1), "LLLL yyyy")
        })}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default CalendarControls;
