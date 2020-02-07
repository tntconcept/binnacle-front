import React, {useContext, useState} from "react"
import {isSameDay} from "date-fns"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import CalendarWeek from "mobile/layouts/calendar/CalendarWeek"
import {ActivitiesList} from "mobile/layouts/calendar/ActivitiesList"
import {TimeStats} from "mobile/layouts/calendar/TimeStats"
import BinnacleNavbarMobile from "mobile/layouts/calendar/BinnacleNavbarMobile"
import {Link} from "react-router-dom"
import styles from "mobile/layouts/calendar/FloatingActionButton.module.css"

const MobileBinnacleLayout = () => {
  const { state } = useContext(BinnacleDataContext);
  const [selectedDate, setSelectedDate] = useState(state.month);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const activities =
    state.activities.find(activityDay =>
      isSameDay(activityDay.date, selectedDate)
    )?.activities ?? [];

  return (
    <div>
      <BinnacleNavbarMobile selectedDate={selectedDate} />
      <CalendarWeek
        initialDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
      <TimeStats timeBalance={state.timeBalance} />
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
