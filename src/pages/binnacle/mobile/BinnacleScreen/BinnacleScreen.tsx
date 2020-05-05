// @ts-ignore
import React, {Suspense, useCallback, useEffect, useRef, useState, useTransition} from "react"
import {isSameMonth} from "date-fns"
import CalendarWeek from "pages/binnacle/mobile/BinnacleScreen/CalendarWeek"
import TimeStats from "pages/binnacle/mobile/BinnacleScreen/TimeStats"
import {useLocation} from "react-router-dom"
import styles from "pages/binnacle/mobile/BinnacleScreen/FloatingActionButton.module.css"
import usePrevious from "core/hooks/usePrevious"
import {customRelativeFormat} from "utils/DateUtils"
import MobileNavbar from "core/components/MobileNavbar"
import {useCalendarResources} from "core/contexts/CalendarResourcesContext"
import ActivitiesPlaceholder from "pages/placeholders/ActivitiesPlaceholder"
import TimeStatsMobilePlaceholder from "pages/placeholders/TimeStatsMobilePlaceholder"
import ActivitiesContainer from "pages/binnacle/mobile/BinnacleScreen/ActivitiesContainer"
import {suspenseConfig} from "utils/config"
import WeekPlaceholder from "pages/placeholders/WeekPlaceholder"

const BinnacleScreen = () => {
  const {selectedMonth, changeMonth} = useCalendarResources()
  const [startTransition] = useTransition(suspenseConfig)
  // TODO Review why the history state persist through page reloads
  const location = useLocation<Date>();
  const initialDate = useRef(location.state || selectedMonth).current

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const prevSelectedDate = usePrevious<Date>(selectedDate);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, [])

  useEffect(() => {
    if (prevSelectedDate && !isSameMonth(prevSelectedDate, selectedDate)) {
      startTransition(() => {
        changeMonth(selectedDate)
      })
    }
  }, [selectedDate, prevSelectedDate, changeMonth])

  return (
    <div>
      <MobileNavbar>
        <span className={styles.date}>
          {customRelativeFormat(selectedDate)}
        </span>
      </MobileNavbar>
      <Suspense fallback={<WeekPlaceholder />}>
        <CalendarWeek
          initialDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </Suspense>
      <Suspense
        fallback={<TimeStatsMobilePlaceholder />}
        unstable_avoidThisFallback={true}
      >
        <TimeStats />
      </Suspense>
      <Suspense
        fallback={<ActivitiesPlaceholder />}
        unstable_avoidThisFallback={true}
      >
        <ActivitiesContainer selectedDate={selectedDate} />
      </Suspense>
    </div>
  );
};

export default BinnacleScreen;
