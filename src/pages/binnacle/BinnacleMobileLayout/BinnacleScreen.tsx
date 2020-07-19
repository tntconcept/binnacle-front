// @ts-ignore
// prettier-ignore
import React, { Suspense, unstable_useTransition as useTransition,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { isSameMonth } from 'date-fns'
import CalendarWeek from 'pages/binnacle/BinnacleMobileLayout/CalendarWeek'
import { useLocation } from 'react-router-dom'
import { usePrevious } from 'core/hooks'
import MobileNavbar from 'core/features/Navbar/MobileNavbar'
import { useBinnacleResources } from 'core/features/BinnacleResourcesProvider'
import ActivitiesListPlaceholder from 'pages/binnacle/BinnacleMobileLayout/ActivitiesListPlaceholder'
import ActivitiesSection from 'pages/binnacle/BinnacleMobileLayout/ActivitiesSection'
import { SUSPENSE_CONFIG } from 'utils/constants'
import CalendarWeekPlaceholder from 'pages/binnacle/BinnacleMobileLayout/CalendarWeekPlaceholder'
import TimeStatsPlaceholder from 'pages/binnacle/TimeBalance/TimeBalancePlaceholder'
import DateTime from 'services/DateTime'
import { TimeBalance } from 'pages/binnacle/TimeBalance'

export const BinnacleScreen = () => {
  const { selectedMonth, changeMonth } = useBinnacleResources()
  const [startTransition] = useTransition(SUSPENSE_CONFIG)
  // TODO Review why the history state persist through page reloads
  // I think it is better use a query param
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
        <span>{DateTime.relativeFormat(selectedDate)}</span>
      </MobileNavbar>
      <Suspense fallback={<CalendarWeekPlaceholder />}>
        <CalendarWeek
          initialDate={selectedDate}
          onDateSelect={handleDateSelect} />
      </Suspense>
      <Suspense
        fallback={<TimeStatsPlaceholder />}
        unstable_avoidThisFallback={true}
      >
        <TimeBalance />
      </Suspense>
      <Suspense
        fallback={<ActivitiesListPlaceholder />}
        unstable_avoidThisFallback={true}
      >
        <ActivitiesSection selectedDate={selectedDate} />
      </Suspense>
    </div>
  )
}
