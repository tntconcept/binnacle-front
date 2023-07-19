import type { PanInfo } from 'framer-motion'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { CalendarWeekHeader } from './calendar-week-header'
import { getDaysOfWeek, getNextWeek, getPreviousWeek } from './calendar-week.utils'
import './calendar-week.css'
import { Days } from './days'

interface Props {
  initialDate: Date
  onDateSelect: (date: Date) => void
}

type WeekToUpdate = 'left_week' | 'center_week' | 'right_week'

const initialValues = {
  leftWeek: '-100%',
  centerWeek: '-0%',
  rightWeek: '100%',
  xAxis: 0,
  lastXAxis: 0,
  nextWeekToMoveOnSwipeRight: 'right_week',
  nextWeekToMoveOnSwipeLeft: 'left_week'
}

export const CalendarWeek = memo<Props>((props) => {
  const deviceWidth = useDeviceWidth()
  const leftWeekPosition = useMotionValue(initialValues.leftWeek)
  const centerWeekPosition = useMotionValue(initialValues.centerWeek)
  const rightWeekPosition = useMotionValue(initialValues.rightWeek)

  const xAxis = useSpring(initialValues.xAxis, { mass: 0.3 })

  const [selectedDate, setSelectedDate] = useState(props.initialDate)

  const [leftWeekDays, setLeftWeekDays] = useState(getDaysOfWeek(getPreviousWeek(selectedDate)))
  const [centerWeekDays, setCenterWeekDays] = useState(getDaysOfWeek(selectedDate))
  const [rightWeekDays, setRightWeekDays] = useState(getDaysOfWeek(getNextWeek(selectedDate)))

  const lastXAxis = useRef(initialValues.lastXAxis)
  const nextWeekToMoveOnSwipeRight = useRef<WeekToUpdate>(
    // @ts-ignore
    initialValues.nextWeekToMoveOnSwipeRight
  )
  // @ts-ignore
  const nextWeekToMoveOnSwipeLeft = useRef<WeekToUpdate>(
    // @ts-ignore
    initialValues.nextWeekToMoveOnSwipeLeft
  )

  const handleSelectDate = useCallback(
    (newDate: Date) => {
      setSelectedDate(newDate)
      props.onDateSelect(newDate)
    },
    [props]
  )

  const handlePan = (event: Event, info: PanInfo) => {
    const maxSwipeLeft = info.offset.x > deviceWidth
    const maxSwipeRight = info.offset.x < -Math.abs(deviceWidth)

    if (!maxSwipeLeft && !maxSwipeRight) {
      xAxis.set(info.offset.x + lastXAxis.current)
    }
  }

  const changeWeeksPosition = (swipeDirection: 'left' | 'right') => {
    const leftWeekAux = parseFloat(leftWeekPosition.get())
    const centerWeekAux = parseFloat(centerWeekPosition.get())
    const rightWeekAux = parseFloat(rightWeekPosition.get())

    if (swipeDirection === 'left') {
      leftWeekPosition.set(`${centerWeekAux - 100}%`)
      centerWeekPosition.set(`${rightWeekAux - 100}%`)
      rightWeekPosition.set(`${leftWeekAux - 100}%`)
    } else {
      leftWeekPosition.set(`${rightWeekAux + 100}%`)
      centerWeekPosition.set(`${leftWeekAux + 100}%`)
      rightWeekPosition.set(`${centerWeekAux + 100}%`)
    }
  }

  const handlePanEnd = (event: Event, info: PanInfo) => {
    // swipe left to see previous weeks
    if (info.offset.x > deviceWidth / 3) {
      xAxis.set(deviceWidth + lastXAxis.current)
      lastXAxis.current += deviceWidth

      // get previous week
      const previousWeek = getPreviousWeek(selectedDate)
      // get week days of 2 weeks ago
      const weekdays = getDaysOfWeek(getPreviousWeek(previousWeek))

      // get the previous week monday
      const prevMonday = chrono(previousWeek).startOf('week').getDate()

      switch (nextWeekToMoveOnSwipeRight.current) {
        case 'right_week': {
          setRightWeekDays(weekdays)
          changeWeeksPosition('left')

          nextWeekToMoveOnSwipeRight.current = 'center_week'
          nextWeekToMoveOnSwipeLeft.current = 'right_week'
          break
        }
        case 'center_week': {
          setCenterWeekDays(weekdays)
          changeWeeksPosition('left')

          nextWeekToMoveOnSwipeRight.current = 'left_week'
          nextWeekToMoveOnSwipeLeft.current = 'center_week'
          break
        }
        case 'left_week': {
          setLeftWeekDays(weekdays)
          changeWeeksPosition('left')

          nextWeekToMoveOnSwipeRight.current = 'right_week'
          nextWeekToMoveOnSwipeLeft.current = 'left_week'
          break
        }
      }

      handleSelectDate(chrono(previousWeek).isThisWeek() ? chrono.now() : prevMonday)

      // swipe right to see next weeks
    } else if (info.offset.x < -Math.abs(deviceWidth / 3)) {
      xAxis.set(lastXAxis.current - deviceWidth)
      lastXAxis.current -= deviceWidth

      // get next week
      const nextSelectedDate = getNextWeek(selectedDate)

      // get week days of the following in two weeks
      const weekdays = getDaysOfWeek(getNextWeek(nextSelectedDate))

      switch (nextWeekToMoveOnSwipeLeft.current) {
        case 'left_week': {
          setLeftWeekDays(weekdays)
          changeWeeksPosition('right')

          nextWeekToMoveOnSwipeLeft.current = 'center_week'
          nextWeekToMoveOnSwipeRight.current = 'left_week'
          break
        }
        case 'center_week': {
          setCenterWeekDays(weekdays)
          changeWeeksPosition('right')

          nextWeekToMoveOnSwipeLeft.current = 'right_week'
          nextWeekToMoveOnSwipeRight.current = 'center_week'
          break
        }
        case 'right_week': {
          setRightWeekDays(weekdays)
          changeWeeksPosition('right')

          nextWeekToMoveOnSwipeLeft.current = 'left_week'
          nextWeekToMoveOnSwipeRight.current = 'right_week'
        }
      }

      const nextMonday = chrono(nextSelectedDate).startOf('week').getDate()
      handleSelectDate(chrono(nextSelectedDate).isThisWeek() ? chrono.now() : nextMonday)
    } else {
      xAxis.set(lastXAxis.current)
    }
  }

  return (
    <section className="calendar-container">
      <CalendarWeekHeader selectedDate={selectedDate} />
      <div className="calendar-section">
        <motion.div
          className="calendar-scroll"
          data-testid="calendar_swipe"
          style={{
            width: deviceWidth,
            touchAction: 'none',
            x: xAxis
          }}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        >
          <motion.div
            className="calendar-slide"
            style={{
              x: leftWeekPosition
            }}
          >
            <Days
              days={leftWeekDays}
              selectedDate={selectedDate}
              handleSelectDate={handleSelectDate}
            />
          </motion.div>
          <motion.div
            className="calendar-slide"
            style={{
              x: centerWeekPosition
            }}
          >
            <Days
              days={centerWeekDays}
              selectedDate={selectedDate}
              handleSelectDate={handleSelectDate}
            />
          </motion.div>
          <motion.div
            className="calendar-slide"
            style={{
              x: rightWeekPosition
            }}
          >
            <Days
              days={rightWeekDays}
              selectedDate={selectedDate}
              handleSelectDate={handleSelectDate}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})

CalendarWeek.displayName = 'CalendarWeek'

function useDeviceWidth() {
  const [width, setWitdh] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWitdh(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}
