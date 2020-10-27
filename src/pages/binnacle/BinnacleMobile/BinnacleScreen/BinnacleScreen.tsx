// @ts-ignore
// prettier-ignore
import React, { Suspense, unstable_useTransition as useTransition,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import CalendarWeek from 'pages/binnacle/BinnacleMobile/BinnacleScreen/CalendarWeek'
import { useLocation } from 'react-router-dom'
import { usePrevious } from 'core/hooks'
import MobileNavbar from 'core/components/Navbar/MobileNavbar'
import { useBinnacleResources } from 'core/providers/BinnacleResourcesProvider'
import ActivitiesListSkeleton from 'pages/binnacle/BinnacleMobile/BinnacleScreen/ActivitiesListSkeleton'
import ActivitiesSection from 'pages/binnacle/BinnacleMobile/BinnacleScreen/ActivitiesSection'
import { SUSPENSE_CONFIG } from 'core/utils/constants'
import CalendarWeekSkeleton from 'pages/binnacle/BinnacleMobile/BinnacleScreen/CalendarWeekSkeleton'
import TimeBalanceSkeleton from 'pages/binnacle/TimeBalance/TimeBalanceSkeleton'
import { TimeBalance } from 'pages/binnacle/TimeBalance/TimeBalance'
import chrono from 'core/services/Chrono'

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
    if (prevSelectedDate && !chrono(selectedDate).isSame(prevSelectedDate, 'month')) {
      startTransition(() => {
        changeMonth(selectedDate)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, prevSelectedDate, changeMonth])

  return (
    <div>
      <MobileNavbar>
        <span>{chrono(selectedDate).formatRelative()}</span>
      </MobileNavbar>
      <Suspense fallback={<CalendarWeekSkeleton />}>
        <CalendarWeek initialDate={selectedDate} onDateSelect={handleDateSelect} />
      </Suspense>
      <Suspense fallback={<TimeBalanceSkeleton isMobile />} unstable_avoidThisFallback={true}>
        <TimeBalance />
      </Suspense>
      <Suspense fallback={<ActivitiesListSkeleton />} unstable_avoidThisFallback={true}>
        <ActivitiesSection selectedDate={selectedDate} />
      </Suspense>
    </div>
  )
}
