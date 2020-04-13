import React, {useContext, useState} from "react"
import {addMonths, format, subMonths} from "date-fns"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import getErrorMessage from "api/HttpClient/HttpErrorMapper"
import {ReactComponent as ChevronRight} from "assets/icons/chevron-right.svg"
import {ReactComponent as ChevronLeft} from "assets/icons/chevron-left.svg"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {fetchBinnacleData} from "services/BinnacleService"
import styles from "pages/binnacle/desktop/CalendarControls/CalendarControls.module.css"
import Button from "core/components/Button"
import {formatMonth} from "utils/DateUtils"

const CalendarControls: React.FC = () => {
  const { state, dispatch } = useContext(BinnacleDataContext);
  const showNotification = useContext(NotificationsContext);

  const [isLoadingPrevMonth, setLoadingPrevMonth] = useState(false);
  const [isLoadingNextMonth, setLoadingNextMonth] = useState(false);

  const handleNextMonthClick = () => {
    const nextMonth = addMonths(state.month, 1);

    setLoadingNextMonth(true)
    fetchBinnacleData(nextMonth, state.isTimeCalculatedByYear, dispatch)
      .then(_ => setLoadingNextMonth(false))
      .catch(error => {
        setLoadingNextMonth(false);
        showNotification(getErrorMessage(error));
      });
  };

  const handlePrevMonthClick = async () => {
    const prevMonth = subMonths(state.month, 1);

    setLoadingPrevMonth(true)
    fetchBinnacleData(
      prevMonth,
      state.isTimeCalculatedByYear,
      dispatch
    )
      .then(_ => setLoadingPrevMonth(false))
      .catch(error => {
        setLoadingPrevMonth(false)
        showNotification(getErrorMessage(error))
      });
  };

  return (
    <div className={styles.container}>
      <p className={styles.date} data-testid="selected_date">
        <span className={styles.month}>{formatMonth(state.month)}</span>{" "}
        <span className={styles.year}>{format(state.month, "yyyy")}</span>
      </p>
      <Button
        isTransparent
        isCircular
        onClick={handlePrevMonthClick}
        data-testid="prev_month_button"
        isLoading={isLoadingPrevMonth}
      >
        <ChevronLeft />
      </Button>
      <Button
        isTransparent
        isCircular
        onClick={handleNextMonthClick}
        data-testid="next_month_button"
        isLoading={isLoadingNextMonth}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default CalendarControls;
