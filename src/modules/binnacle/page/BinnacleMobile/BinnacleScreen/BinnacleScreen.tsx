import { observer } from 'mobx-react'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import ActivitiesSection from 'modules/binnacle/page/BinnacleMobile/BinnacleScreen/ActivitiesList/ActivitiesSection'
import CalendarWeek from 'modules/binnacle/page/BinnacleMobile/BinnacleScreen/CalendarWeek/CalendarWeek'
import { useEffect } from 'react'
import { useAction } from 'shared/arch/hooks/use-action'
import { useActionOnMount } from 'shared/arch/hooks/use-action-on-mount'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import MobileNavbar from 'shared/components/Navbar/MobileNavbar'
import { usePrevious } from 'shared/hooks'
import chrono from 'shared/utils/chrono'
import { TimeSummary } from '../../../components/TimeSummary/TimeSummary'

function BinnacleScreen() {
  const { selectedActivityDate, changeSelectedActivityDate } = useGlobalState(ActivityFormState)
  useActionOnMount(GetCalendarDataAction)

  const prevSelectedDate = usePrevious<Date>(selectedActivityDate)

  const getCalendarData = useAction(GetCalendarDataAction)

  useEffect(() => {
    if (prevSelectedDate && !chrono(selectedActivityDate).isSame(prevSelectedDate, 'month')) {
      getCalendarData(selectedActivityDate)
    }
  }, [selectedActivityDate, prevSelectedDate, getCalendarData])

  return (
    <div>
      <MobileNavbar>
        <span>{chrono(selectedActivityDate).formatRelative()}</span>
      </MobileNavbar>
      <CalendarWeek initialDate={selectedActivityDate} onDateSelect={changeSelectedActivityDate} />
      <TimeSummary />
      <ActivitiesSection selectedDate={selectedActivityDate} />
    </div>
  )
}

export default observer(BinnacleScreen)
