import { useEffect, useState } from 'react'
import chrono from '../../../../../../shared/utils/chrono'

export const useGetSelectedCalendarDate = (selectedDate: Date) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate)

  useEffect(() => {
    if (selectedDate.getFullYear() < chrono.now().getFullYear()) {
      return setCurrentDate(new Date(selectedDate.getFullYear(), 11, 1))
    }

    if (selectedDate.getFullYear() > chrono.now().getFullYear()) {
      return setCurrentDate(new Date(selectedDate.getFullYear(), 0, 1))
    }

    setCurrentDate(chrono.now())
  }, [selectedDate])

  return currentDate
}
