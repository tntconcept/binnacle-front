import React, {
  Suspense,
  // @ts-ignore
  unstable_useTransition as useTransition,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { isSameMonth } from 'date-fns'
import CalendarWeek from 'pages/binnacle/mobile/BinnacleScreen/CalendarWeek'
import TimeStats from 'features/TimeBalance/TimeStats'
import { useLocation } from 'react-router-dom'
import styles from 'pages/binnacle/mobile/BinnacleScreen/FloatingActionButton.module.css'
import { usePrevious } from 'common/hooks'
import { customRelativeFormat } from 'utils/DateUtils'
import MobileNavbar from 'features/Navbar/MobileNavbar'
import { useBinnacleResources } from 'features/BinnacleResourcesProvider'
import ActivitiesPlaceholder from 'pages/binnacle/mobile/BinnacleScreen/ActivitiesPlaceholder'
import ActivitiesContainer from 'pages/binnacle/mobile/BinnacleScreen/ActivitiesContainer'
import { SUSPENSE_CONFIG } from 'utils/constants'
import WeekPlaceholder from 'pages/binnacle/mobile/BinnacleScreen/WeekPlaceholder'
import TimeStatsPlaceholder from 'features/TimeBalance/TimeStatsPlaceholder'

const BinnacleScreen = () => {
  const { selectedMonth, changeMonth } = useBinnacleResources()
  const [startTransition] = useTransition(SUSPENSE_CONFIG)
  // TODO Review why the history state persist through page reloads
  const location = useLocation<Date>()
  const initialDate = useRef(location.state || selectedMonth).current

  const [selectedDate, setSelectedDate] = useState(initialDate)
  const prevSelectedDate = usePrevious<Date>(selectedDate)

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  useEffect(() => {
    if (prevSelectedDate && !isSameMonth(prevSelectedDate, selectedDate)) {
      startTransition(() => {
        changeMonth(selectedDate)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, prevSelectedDate, changeMonth])

  return (
    <div>
      <MobileNavbar>
        <span className={styles.date}>{customRelativeFormat(selectedDate)}</span>
      </MobileNavbar>
      <Suspense fallback={<WeekPlaceholder />}>
        <CalendarWeek
          initialDate={selectedDate}
          onDateSelect={handleDateSelect} />
      </Suspense>
      <Suspense
        fallback={<TimeStatsPlaceholder />}
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
  )
}

export default BinnacleScreen
