import React, {useContext, useEffect, useState} from "react"
import {addMinutes, isSameDay, isSameMonth} from "date-fns"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import CalendarWeek from "pages/binnacle/mobile/BinnacleScreen/CalendarWeek"
import {ActivitiesList} from "pages/binnacle/mobile/BinnacleScreen/ActivitiesList"
import TimeStats from "pages/binnacle/mobile/BinnacleScreen/TimeStats"
import BinnacleNavbar from "pages/binnacle/mobile/BinnacleScreen/BinnacleNavbar"
import {Link, useLocation} from "react-router-dom"
import styles from "pages/binnacle/mobile/BinnacleScreen/FloatingActionButton.module.css"
import {fetchTimeBalanceByMonth} from "services/BinnacleService"
import usePrevious from "core/hooks/usePrevious"
import {IActivity} from "api/interfaces/IActivity"

const BinnacleScreen = () => {
  const { state, dispatch } = useContext(BinnacleDataContext);
  // TODO Review why the history state persist through page reloads
  const location = useLocation<Date>();
  const [selectedDate, setSelectedDate] = useState(location.state || state.month);
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

  const getLastEndTime = (activity?: IActivity) => {
    if (activity) {
      return addMinutes(activity.startDate, activity.duration)
    }

    return undefined
  }

  return (
    <div>
      <BinnacleNavbar selectedDate={selectedDate} />
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
          state: {
            date: selectedDate,
            lastEndTime: getLastEndTime(activities[activities.length - 1])
          }
        }}
        className={styles.button}
      >
        +
      </Link>
    </div>
  );
};

export default BinnacleScreen;
