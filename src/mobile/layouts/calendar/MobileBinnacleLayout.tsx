import React, {useContext, useState} from "react"
import {getDate, isSameDay} from "date-fns"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import CalendarWeek from "mobile/layouts/calendar/CalendarWeek"
import {ActivitiesList} from "mobile/layouts/calendar/ActivitiesList"
import {TimeStats} from "mobile/layouts/calendar/TimeStats"

const MobileBinnacleLayout = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2019, 10, 15));
  const { state } = useContext(BinnacleDataContext);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const activities =
    state.activities.find(activityDay =>
      isSameDay(activityDay.date, selectedDate)
    )?.activities ?? [];

  return (
    <div>
      <nav>
        <span>{getDate(selectedDate)}</span>
      </nav>
      <CalendarWeek
        initialDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
      <TimeStats timeBalance={state.timeBalance} />
      <ActivitiesList activities={activities} />
    </div>
  );
};

export default MobileBinnacleLayout;
