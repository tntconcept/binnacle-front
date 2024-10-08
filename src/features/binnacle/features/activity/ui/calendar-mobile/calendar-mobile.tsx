import { MobileNavbar } from '../../../../../../shared/components/navbar/mobile-navbar'
import { chrono } from '../../../../../../shared/utils/chrono'
import { TimeSummary } from '../components/time-summary/time-summary'
import { useCalendarContext } from '../contexts/calendar-context'
import { ActivitiesSection } from './activities-list/activities-section'
import { CalendarWeek } from './calendar-week/calendar-week'
import { FC } from 'react'

export const CalendarMobile: FC = () => {
  const { selectedDate, setSelectedDate } = useCalendarContext()

  return (
    <div>
      <MobileNavbar>
        <span>{chrono(selectedDate).formatRelative()}</span>
      </MobileNavbar>
      <CalendarWeek initialDate={selectedDate} onDateSelect={setSelectedDate!} />
      <TimeSummary />
      <ActivitiesSection />
    </div>
  )
}

export default CalendarMobile
