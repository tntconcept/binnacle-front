import { useEffect, useState } from 'react'
import chrono from '../../../../../../shared/utils/chrono'

export const useGetSelectedCalendarDate = (selectedDate: Date) => {
  const [date, setDate] = useState<Date>()

  useEffect(() => {
    const currentDate: Date = chrono.now()
    const selectedYear = selectedDate.getFullYear()

    if (selectedDate.getFullYear() < currentDate.getFullYear()) {
      setDate(new Date(`${selectedYear}-12-01`))
    } else if (selectedDate.getFullYear() > currentDate.getFullYear()) {
      setDate(new Date(`${selectedYear}-01-01`))
    } else {
      setDate(currentDate)
    }
  }, [selectedDate])

  return date
}
