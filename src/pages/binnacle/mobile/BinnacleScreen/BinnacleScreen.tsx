import React, {Suspense, useCallback, useRef, useState} from "react"
import {addMinutes, isSameDay} from "date-fns"
import CalendarWeek from "pages/binnacle/mobile/BinnacleScreen/CalendarWeek"
import {ActivitiesList} from "pages/binnacle/mobile/BinnacleScreen/ActivitiesList"
import TimeStats from "pages/binnacle/mobile/BinnacleScreen/TimeStats"
import {Link, useLocation} from "react-router-dom"
import styles from "pages/binnacle/mobile/BinnacleScreen/FloatingActionButton.module.css"
import usePrevious from "core/hooks/usePrevious"
import {IActivity} from "api/interfaces/IActivity"
import {customRelativeFormat} from "utils/DateUtils"
import MobileNavbar from "core/components/MobileNavbar"
import {useCalendarResources} from "pages/binnacle/desktop/CalendarResourcesContext"

const BinnacleScreen = () => {
  const {selectedMonth, updateCalendarResources} = useCalendarResources()

  // TODO Review why the history state persist through page reloads
  const location = useLocation<Date>();
  const initialDate = useRef(location.state || selectedMonth).current

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const prevSelectedDate = usePrevious<Date>(selectedDate);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);



  }, [])

  /*  useEffect(() => {
    if (!isSameMonth(prevSelectedDate!, selectedDate)) {
      // TODO FIX always fetches the same period, because the selected_month does not change
      updateCalendarResources()
      console.log("¿entras aqui?")
    }
  }, [updateCalendarResources,selectedDate, prevSelectedDate])*/

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

  const activities =
    activitiesData.find(activityDay =>
      isSameDay(activityDay.date, selectedDate)
    )?.activities ?? [];

  const getLastEndTime = (activity?: IActivity) => {
    if (activity) {
      return addMinutes(activity.startDate, activity.duration);
    }

    return undefined;
  };

  return (
    <>
      <ActivitiesList activities={activities}/>
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
    </>
  )
}

export default BinnacleScreen;
