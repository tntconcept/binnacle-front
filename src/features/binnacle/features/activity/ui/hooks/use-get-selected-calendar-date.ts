import { useMemo } from 'react'
import chrono from '../../../../../../shared/utils/chrono'

export const useGetSelectedCalendarDate = (selectedDate: Date) => {
  const date = useMemo(() => {
    const currentDate: Date = chrono.now()
    const selectedYear = selectedDate.getFullYear()

    if (selectedDate.getFullYear() === currentDate.getFullYear()) {
      return selectedDate
    }
    if (selectedDate.getFullYear() < currentDate.getFullYear()) {
      return new Date(`${selectedYear}-12-01`)
    }
    if (selectedDate.getFullYear() > currentDate.getFullYear()) {
      return new Date(`${selectedYear}-01-01`)
    }

    return currentDate
  }, [selectedDate])

  return date
}
