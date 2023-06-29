import { Query, UseCaseKey } from '@archimedes/arch'
import { DateInterval } from 'shared/types/date-interval'
import { TimeUnits } from 'shared/types/time-unit'
import chrono from 'shared/utils/chrono'
import { injectable } from 'tsyringe'
import { GetHolidaysQry } from '../../holiday/application/get-holidays-qry'
import { GetAllVacationsForDateIntervalQry } from '../../vacation/application/get-all-vacations-for-date-interval-qry'
import { Activity } from '../domain/activity'
import { CalendarData } from '../domain/calendar-data'
import { ActivityWithRenderDays } from '../domain/activity-with-render-days'
import { getHoliday } from '../utils/get-holiday'
import { getVacation } from '../utils/get-vacation'
import { GetActivitiesQry } from './get-activities-qry'
import { GetActivitySummaryQry } from './get-activity-summary-qry'

@UseCaseKey('GetCalendarDataQry')
@injectable()
export class GetCalendarDataQry extends Query<CalendarData, DateInterval> {
  constructor(
    private getActivitySummary: GetActivitySummaryQry,
    private getActivitiesQry: GetActivitiesQry,
    private getHolidaysQry: GetHolidaysQry,
    private getAllVacationsForDateIntervalQry: GetAllVacationsForDateIntervalQry
  ) {
    super()
  }

  async internalExecute(dateInterval: DateInterval): Promise<CalendarData> {
    const [activitiesDaySummary, activities, holidays, vacations] = await Promise.all([
      this.getActivitySummary.execute(dateInterval),
      this.getActivitiesQry.execute(dateInterval),
      this.getHolidaysQry.execute(dateInterval),
      this.getAllVacationsForDateIntervalQry.execute(dateInterval)
    ])

    const calendarData: CalendarData = activitiesDaySummary.map((summary) => {
      const { date, worked } = summary
      return {
        date,
        worked,
        activities: this.getActivitiesByDate(activities, summary.date),
        holiday: getHoliday(holidays || [], summary.date),
        vacation: getVacation(vacations || [], summary.date)
      }
    })

    return calendarData
  }

  private getActivitiesByDate(activities: Activity[], date: Date): ActivityWithRenderDays[] {
    const activitiesWithRenderDays: ActivityWithRenderDays[] = []
    const chronoDate = chrono(date)
    let renderIndex = 0

    activities
      .filter((a) => a.interval.timeUnit === TimeUnits.DAYS)
      .forEach((activity) => {
        const { interval } = activity
        const dateIsWithinActivityInterval = chronoDate.isBetween(interval.start, interval.end)
        if (!dateIsWithinActivityInterval) return

        const isStartDay = chronoDate.isSameDay(activity.interval.start)
        const weekday = chronoDate.get('weekday')
        const isMonday = weekday === 1
        if (!isStartDay && !isMonday) {
          renderIndex++
          return
        }

        const daysToEndDate = chronoDate.diffCalendarDays(activity.interval.end) * -1 + 1
        const daysToPaint = 5 - weekday + 1
        const renderDays = daysToEndDate > daysToPaint ? daysToPaint : daysToEndDate

        activitiesWithRenderDays.push({
          ...activity,
          renderDays,
          renderIndex: renderIndex++
        })
      })

    activities
      .filter((a) => a.interval.timeUnit === TimeUnits.MINUTES)
      .forEach((activity) => {
        const isSameDay = chronoDate.isSameDay(activity.interval.start)
        if (isSameDay) {
          activitiesWithRenderDays.push({
            ...activity,
            renderDays: 1,
            renderIndex: renderIndex++
          })
        }
      })

    return activitiesWithRenderDays
  }
}
