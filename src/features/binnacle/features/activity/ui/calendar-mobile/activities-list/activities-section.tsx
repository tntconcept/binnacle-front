import { Flex } from '@chakra-ui/react'
import { GetHolidaysQry } from 'features/binnacle/features/holiday/application/get-holidays-qry'
import { Holiday } from 'features/binnacle/features/holiday/domain/holiday'
import { GetAllVacationsForDateIntervalQry } from 'features/binnacle/features/vacation/application/get-all-vacations-for-date-interval-qry'
import { Vacation } from 'features/binnacle/features/vacation/domain/vacation'
import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from 'shared/arch/hooks/use-subscribe-to-use-case'
import chrono, { getHumanizedDuration } from 'shared/utils/chrono'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { DeleteActivityCmd } from '../../../application/delete-activity-cmd'
import { GetActivitiesQry } from '../../../application/get-activities-qry'
import { GetActivitySummaryQry } from '../../../application/get-activity-summary-qry'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { Activity } from '../../../domain/activity'
import { firstDayOfFirstWeekOfMonth } from '../../../utils/firstDayOfFirstWeekOfMonth'
import { getHoliday } from '../../../utils/getHoliday'
import { getVacation } from '../../../utils/getVacation'
import { lastDayOfLastWeekOfMonth } from '../../../utils/lastDayOfLastWeekOfMonth'
import { ActivityModal } from '../../components/activity-modal/activity-modal'
import { useCalendarContext } from '../../contexts/calendar-context'
import { ActivitiesList } from './activities-list'
import { FloatingActionButton } from './floating-action-button'

const ActivitiesSection: FC = () => {
  const { t } = useTranslation()
  const { selectedDate } = useCalendarContext()
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activityDate, setActivityDate] = useState(new Date())
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const [lastEndTime, setLastEndTime] = useState<Date | undefined>()

  const selectedDateInterval = useMemo(() => {
    const start = firstDayOfFirstWeekOfMonth(selectedDate)
    const end = lastDayOfLastWeekOfMonth(selectedDate)

    return { start, end }
  }, [selectedDate])

  const {
    isLoading: isLoadingDaySummary,
    result: activitiesDaySummary = [],
    executeUseCase: getActivitySummaryQry
  } = useExecuteUseCaseOnMount(GetActivitySummaryQry, selectedDateInterval)

  const {
    isLoading: isLoadingActivities,
    result: activities,
    executeUseCase: getActivitiesQry
  } = useExecuteUseCaseOnMount(GetActivitiesQry, selectedDateInterval)

  const { isLoading: isLoadingHolidays, result: holidays = [] } = useExecuteUseCaseOnMount(
    GetHolidaysQry,
    selectedDateInterval
  )
  const { isLoading: isLoadingVacations, result: vacations = [] } = useExecuteUseCaseOnMount(
    GetAllVacationsForDateIntervalQry,
    selectedDateInterval
  )

  useSubscribeToUseCase(
    CreateActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
      getActivitySummaryQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    UpdateActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
      getActivitySummaryQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    DeleteActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
      getActivitySummaryQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  const isLoading = useMemo(() => {
    return isLoadingDaySummary && isLoadingActivities && isLoadingVacations && isLoadingHolidays
  }, [isLoadingActivities, isLoadingDaySummary, isLoadingHolidays, isLoadingVacations])

  const day = useMemo(() => {
    return activitiesDaySummary.find((activityDaySummary) =>
      chrono(activityDaySummary.date).isSame(selectedDate, 'day')
    )
  }, [activitiesDaySummary, selectedDate])

  const dayActivities = useMemo(() => {
    if (!activities) return []

    return activities.filter((activity) => {
      return chrono(selectedDate).isBetween(activity.interval.start, activity.interval.end)
    })
  }, [activities, selectedDate])

  const isHolidayOrVacation = (holidays: Holiday[], vacations: Vacation[], date: Date) => {
    const holiday = getHoliday(holidays, date)
    const vacation = getVacation(vacations, date)

    if (holiday) {
      return holiday.description
    }

    if (vacation) {
      return t('vacations')
    }

    return undefined
  }

  const onCloseActivity = () => {
    setShowActivityModal(false)
  }

  const addActivity = () => {
    const lastEndTime = dayActivities.at(-1)?.interval.end
    setSelectedActivity(undefined)
    setActivityDate(selectedDate)
    setShowActivityModal(true)
    setLastEndTime(lastEndTime)
  }

  const editActivity = (activity: Activity) => {
    setActivityDate(activity.interval.start)
    setSelectedActivity(activity)
    setShowActivityModal(true)
    setLastEndTime(undefined)
  }

  return !isLoading ? (
    <>
      <Flex width="100%" p="10px 16px" justify="flex-end" data-testid="activities_time">
        {isHolidayOrVacation(holidays, vacations, selectedDate) && (
          <span
            style={{
              marginRight: 'auto'
            }}
          >
            {isHolidayOrVacation(holidays, vacations, selectedDate)}
          </span>
        )}
        {day && getHumanizedDuration({ duration: day.worked })}
      </Flex>

      <ActivitiesList activities={dayActivities} onClick={editActivity} />
      <FloatingActionButton onClick={addActivity} />
      <ActivityModal
        isOpen={showActivityModal}
        onClose={onCloseActivity}
        onSave={onCloseActivity}
        activityDate={activityDate}
        activity={selectedActivity}
        lastEndTime={lastEndTime}
      />
    </>
  ) : null
}

export default ActivitiesSection
