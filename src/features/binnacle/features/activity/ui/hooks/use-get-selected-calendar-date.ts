import { useEffect, useState } from 'react'
import chrono from '../../../../../../shared/utils/chrono'

export const useGetSelectedCalendarDate = (selectedDate: Date) => {
  const [date, setDate] = useState<Date>(chrono.now())

  useEffect(() => {
    const currentDate: Date = chrono.now()
    const selectedYear = selectedDate.getFullYear()
    if (selectedDate.getFullYear() === currentDate.getFullYear()) {
      return
    }
    if (selectedDate.getFullYear() < currentDate.getFullYear()) {
      return setDate(new Date(`${selectedYear}-12-01`))
    }
    if (selectedDate.getFullYear() > currentDate.getFullYear()) {
      return setDate(new Date(`${selectedYear}-01-01`))
    }
    setDate(currentDate)
  }, [selectedDate])

  return date
}
