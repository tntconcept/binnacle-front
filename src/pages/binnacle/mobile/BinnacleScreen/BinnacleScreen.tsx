import React, {Suspense, useCallback, useEffect, useRef, useState} from "react"
import {addMinutes, isSameDay, isSameMonth} from "date-fns"
import CalendarWeek from "pages/binnacle/mobile/BinnacleScreen/CalendarWeek"
import {ActivitiesList} from "pages/binnacle/mobile/BinnacleScreen/ActivitiesList"
import TimeStats from "pages/binnacle/mobile/BinnacleScreen/TimeStats"
import {Link, useLocation} from "react-router-dom"
import styles from "pages/binnacle/mobile/BinnacleScreen/FloatingActionButton.module.css"
import usePrevious from "core/hooks/usePrevious"
import {customRelativeFormat} from "utils/DateUtils"
import MobileNavbar from "core/components/MobileNavbar"
import {useCalendarResources} from "pages/binnacle/desktop/CalendarResourcesContext"
import DateTime from "services/DateTime"

const BinnacleScreen = () => {
  const {selectedMonth, changeMonth} = useCalendarResources()

  // TODO Review why the history state persist through page reloads
  const location = useLocation<Date>();
  const initialDate = useRef(location.state || selectedMonth).current

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const prevSelectedDate = usePrevious<Date>(selectedDate);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, [])

  useEffect(() => {
    if (!isSameMonth(prevSelectedDate!, selectedDate)) {
      changeMonth(selectedDate)
    }
  }, [selectedDate, prevSelectedDate, changeMonth])

  return (
    <div>
      <MobileNavbar>
        <span className={styles.date}>
          {customRelativeFormat(selectedDate)}
        </span>
      </MobileNavbar>
      <CalendarWeek
        initialDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
      <Suspense
        fallback={<span>Loading time...</span>}
        unstable_avoidThisFallback={true}
      >
        <TimeStats />
      </Suspense>
      <Suspense
        fallback={<span>Loading activities...</span>}
        unstable_avoidThisFallback={true}
      >
        <ActivitiesContainer selectedDate={selectedDate} />
      </Suspense>
    </div>
  );
};

const ActivitiesContainer: React.FC<{selectedDate: Date}> = ({selectedDate}) => {

  const {calendarResources} = useCalendarResources()
  const {activities: activitiesData} = calendarResources.read()

  const day = activitiesData.find(activityDay => isSameDay(activityDay.date, selectedDate))!;

  const getLastEndTime = () => {
    const lastActivity = day.activities[day.activities.length - 1]

    if (lastActivity) {
      return addMinutes(lastActivity.startDate, lastActivity.duration);
    }

    return undefined;
  };

  return (
    <>
      <div data-testid="activities_time">
        {DateTime.getHumanizedDuration(day.workedMinutes)}
      </div>
      <ActivitiesList activities={day.activities || []}/>
      <Link
        to={{
          pathname: "/binnacle/activity",
          state: {
            date: selectedDate,
            lastEndTime: getLastEndTime()
          }
        }}
        className={styles.button}
        data-testid="add_activity"
      >
        +
      </Link>
    </>
  )
}

export default BinnacleScreen;
