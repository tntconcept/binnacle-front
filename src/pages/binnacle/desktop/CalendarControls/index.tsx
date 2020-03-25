import React, {useContext, useState} from "react"
import {addMonths, format, subMonths} from "date-fns"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import getErrorMessage from "api/HttpClient/HttpErrorMapper"
import {ReactComponent as ChevronRight} from "assets/icons/chevron-right.svg"
import {ReactComponent as ChevronLeft} from "assets/icons/chevron-left.svg"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {fetchBinnacleData} from "core/contexts/BinnacleContext/binnacleService"
import styles from "pages/binnacle/desktop/CalendarControls/CalendarControls.module.css"
import Button from "core/components/Button"
import {formatMonth} from "utils/DateUtils"

const CalendarControls: React.FC = () => {
  const { state, dispatch } = useContext(BinnacleDataContext);
  const addNotification = useContext(NotificationsContext);

  const [loadingPrevDate, setLoadingPrevDate] = useState(false);
  const [loadingNextDate, setLoadingNextDate] = useState(false);

  const handleNextMonthClick = () => {
    const nextMonth = addMonths(state.month, 1);

    fetchBinnacleData(
      nextMonth,
      state.isTimeCalculatedByYear,
      dispatch
    ).catch(error => addNotification(getErrorMessage(error)));
  };

  const handlePrevMonthClick = async () => {
    const prevMonth = subMonths(state.month, 1);

    fetchBinnacleData(
      prevMonth,
      state.isTimeCalculatedByYear,
      dispatch
    ).catch(error => addNotification(getErrorMessage(error)));
  };

  return (
    <div className={styles.container}>
      <p className={styles.date} data-testid="selected_date">
        <span className={styles.month}>{formatMonth(state.month)}</span>{" "}
        <span className={styles.year}>{format(state.month, "yyyy")}</span>
      </p>
      <Button isTransparent isCircular onClick={handlePrevMonthClick} data-testid="prev_month_button">
        <ChevronLeft />
      </Button>
      <Button isTransparent isCircular onClick={handleNextMonthClick} data-testid="next_month_button">
        <ChevronRight />
      </Button>
    </div>
  );
};

export default CalendarControls;
