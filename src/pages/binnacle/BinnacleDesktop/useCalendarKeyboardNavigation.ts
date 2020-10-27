import { useEffect, useRef } from 'react'
import chrono from 'core/services/Chrono'
import { firstDayOfFirstWeekOfMonth } from 'pages/binnacle/BinnaclePage.utils'

interface Element {
  element: any
  currentIndex: number
}

const nextElement = (current: number, array: any[], iterationCount = 0): Element | undefined => {
  if (iterationCount > 2) {
    return undefined
  }

  const elementFound = array[current]
  if (elementFound) {
    return {
      currentIndex: current,
      element: elementFound
    }
  }
  return nextElement(current + 1, array, iterationCount + 1)
}

const prevElement = (current: number, array: any[], iterationCount = 0): Element | undefined => {
  if (iterationCount > 2 || current < 0) {
    return undefined
  }

  const elementFound = array[current]
  if (elementFound) {
    return {
      currentIndex: current,
      element: elementFound
    }
  }
  return nextElement(current - 1, array, iterationCount - 1)
}

const useCalendarKeysNavigation = (month: Date, setSelectedCell: (a: number) => any) => {
  const calendarRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<HTMLDivElement[] | null>([])
  // Todo maybe throws an error when saturday or sunday is hidden
  const activeRef = useRef<number>(chrono(firstDayOfFirstWeekOfMonth(month)).diff(month, 'day'))

  useEffect(() => {
    // Cells ref contains all the cells that are rendered on the calendar, we need to focus today or the first day of month.
    // Because we don't know which index has the date that we want to focus,
    // A workaround is to use the difference between the first day rendered and the date that we want to select.
    if (chrono(month).isThisMonth()) {
      activeRef.current = chrono(firstDayOfFirstWeekOfMonth(month)).diff(month, 'day')
    } else {
      chrono(firstDayOfFirstWeekOfMonth(month)).diff(
        chrono(month)
          .startOf('month')
          .getDate(),
        'day'
      )
    }
  }, [month])

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight': {
        const nextRef = activeRef.current + 1
        if (nextRef < cellsRef.current!.length) {
          const next = nextElement(nextRef, cellsRef.current!)
          if (next) {
            next.element.focus()
            activeRef.current = next.currentIndex
          }
        }
        break
      }
      case 'ArrowLeft': {
        const prevRef = activeRef.current - 1
        if (prevRef >= 0) {
          const prev = prevElement(prevRef, cellsRef.current!)
          if (prev) {
            prev.element.focus()
            activeRef.current = prev.currentIndex
          }
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
        const cells = cellsRef.current!.filter((cell) => cell !== null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRef])

  return { calendarRef, cellsRef }
}

export default useCalendarKeysNavigation
