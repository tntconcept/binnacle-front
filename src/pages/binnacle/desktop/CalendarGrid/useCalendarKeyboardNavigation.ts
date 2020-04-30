import {useEffect, useRef} from "react"
import {differenceInDays} from "date-fns"
import {firstDayOfFirstWeekOfMonth} from "utils/DateUtils"
import DateTime from "services/DateTime"

const useCalendarKeysNavigation = (month: Date, setSelectedCell: (a: number) => any) => {
  const calendarRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<HTMLDivElement[] | null>([]);
  const activeRef = useRef<number>(differenceInDays(month, firstDayOfFirstWeekOfMonth(month)))

  useEffect(() => {
    // Cells ref contains all the cells that are rendered on the calendar, we need to focus today or the first day of month.
    // Because we don't know which index has the date that we want to focus,
    // A workaround is to use the difference between the first day rendered and the date that we want to select.
    if (DateTime.isThisMonth(month)) {
      activeRef.current = differenceInDays(month, firstDayOfFirstWeekOfMonth(month))
    } else {
      activeRef.current =  differenceInDays(DateTime.startOfMonth(month), firstDayOfFirstWeekOfMonth(month))
    }
  }, [month])

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight': {
        const nextRef = activeRef.current + 1
        const cells = cellsRef.current!.filter(cell => cell !== null)
        if (nextRef < cells.length) {
          cellsRef.current && cellsRef.current[nextRef].focus()
          activeRef.current = nextRef
        }

        break
      }
      case 'ArrowLeft': {
        const prevRef = activeRef.current - 1

        if (prevRef >= 0) {
          cellsRef.current && cellsRef.current[prevRef].focus()
          activeRef.current = prevRef
        }

        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const currentRow = Math.trunc(activeRef.current / 7)
        const prevRow = currentRow - 1
        if (prevRow >= 0) {
          activeRef.current -= 7
          cellsRef.current && cellsRef.current[activeRef.current].focus()
        }
        break
      }
      case 'ArrowDown': {
        event.preventDefault()
        const currentRow = Math.trunc(activeRef.current / 7)
        const cells = cellsRef.current!.filter(cell => cell !== null)
        const nextRow = currentRow + 1
        if (nextRow < Math.trunc(cells.length / 7)) {
          activeRef.current += 7
          cellsRef.current && cellsRef.current[activeRef.current].focus()
        }
        break
      }
      case 'Enter': {
        event.preventDefault()
        setSelectedCell(activeRef.current)
        break
      }
    }
  }

  useEffect(() => {
    const node = calendarRef.current
    node && node.addEventListener('keydown', handleKeyDown)

    return () => {
      node && node.removeEventListener('keydown', handleKeyDown)
    }
  }, [calendarRef])

  return { calendarRef, cellsRef }
}

export default useCalendarKeysNavigation