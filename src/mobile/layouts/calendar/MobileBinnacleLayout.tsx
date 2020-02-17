import React, {useContext, useEffect, useState} from "react"
import {isSameDay, isSameMonth} from "date-fns"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import CalendarWeek from "mobile/layouts/calendar/CalendarWeek"
import {ActivitiesList} from "mobile/layouts/calendar/ActivitiesList"
import {TimeStats} from "mobile/layouts/calendar/TimeStats"
import BinnacleNavbarMobile from "mobile/layouts/calendar/BinnacleNavbarMobile"
import {Link} from "react-router-dom"
import styles from "mobile/layouts/calendar/FloatingActionButton.module.css"
import {fetchTimeBalanceByMonth} from "core/contexts/BinnacleContext/binnacleService"
import usePrevious from "core/hooks/usePrevious"

const MobileBinnacleLayout = () => {
  const { state, dispatch } = useContext(BinnacleDataContext);
  const [selectedDate, setSelectedDate] = useState(state.month);
  const prevSelectedDate = usePrevious<Date>(selectedDate)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const activities =
    state.activities.find(activityDay =>
      isSameDay(activityDay.date, selectedDate)
    )?.activities ?? [];

  useEffect(() => {
    // Fetch time balance if selected date is from another month
    if (!isSameMonth(prevSelectedDate!, selectedDate)) {
      fetchTimeBalanceByMonth(selectedDate, dispatch).catch(error =>
        console.log(
          "Should open a modal with the error to retry this request because is important",
          error
        )
      );
    }
  }, [selectedDate, prevSelectedDate, dispatch]);

  return (
    <div>
      <BinnacleNavbarMobile selectedDate={selectedDate} />
      <CalendarWeek
        initialDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
      <TimeStats
        timeBalance={state.timeBalance}
        month={state.month}
        dispatch={dispatch}
      />
      <ActivitiesList activities={activities} />
      <Link
        to={{
          pathname: "/binnacle/activity",
          state: selectedDate
        }}
        className={styles.button}
      >
        +
      </Link>
    </div>
  );
};

export default MobileBinnacleLayout;
