import { FC, useMemo } from 'react'
import { firstDayOfFirstWeekOfMonth } from '../../../utils/first-day-of-first-week-of-month'
import { lastDayOfLastWeekOfMonth } from '../../../utils/last-day-of-last-week-of-month'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetHolidaysQry } from '../../../../holiday/application/get-holidays-qry'
import { GetAllVacationsForDateIntervalQry } from '../../../../vacation/application/get-all-vacations-for-date-interval-qry'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { getHoliday } from '../../../utils/get-holiday'
import { getVacation } from '../../../utils/get-vacation'
import { cls } from '../../../../../../../shared/utils/helpers'

interface Props {
  days: Date[]
  selectedDate: Date
  handleSelectDate: (date: Date) => void
}

export const Days: FC<Props> = ({ days, selectedDate, handleSelectDate }) => {
  const selectedDateInterval = useMemo(() => {
    const start = firstDayOfFirstWeekOfMonth(selectedDate)
    const end = lastDayOfLastWeekOfMonth(selectedDate)

    return { start, end }
  }, [selectedDate])

  const { isLoading: isLoadingHolidays, result: holidays = [] } = useExecuteUseCaseOnMount(
    GetHolidaysQry,
    selectedDateInterval
  )

  const { isLoading: isLoadingVacations, result: vacations = [] } = useExecuteUseCaseOnMount(
    GetAllVacationsForDateIntervalQry,
    selectedDateInterval
  )

  const isLoading = useMemo(
    () => isLoadingHolidays && isLoadingVacations,
    [isLoadingVacations, isLoadingHolidays]
  )

  const getClassName = (date: Date) => {
    const isSelected = chrono(date).isSame(selectedDate, 'day')
    const isCurrentDate = chrono(date).isToday()
    const holiday = getHoliday(holidays, date)
    const vacation = getVacation(vacations, date)

    return cls(
      isSelected && isCurrentDate && 'is-today',
      holiday && 'is-holiday',
      holiday && isSelected && 'is-holiday-selected',
      vacation && 'is-vacation',
      vacation && isSelected && 'is-vacation-selected',
      isSelected && 'is-selected-date'
    )
  }

  return (
    <>
      {!isLoading &&
        days.map((date) => (
          <div
            key={date.getDate()}
            className={getClassName(date)}
            onClick={() => handleSelectDate(date)}
            data-testid={chrono(date).isSame(selectedDate, 'day') ? 'selected_date' : undefined}
          >
            {date.getDate()}
          </div>
        ))}
    </>
  )
}
