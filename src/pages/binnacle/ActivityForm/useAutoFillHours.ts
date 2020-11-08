import { useMemo } from 'react'
import chrono from 'core/services/Chrono'
import { timeToDate } from 'core/utils/helpers'

export const roundHourToQuarters = (date: Date): Date => {
  const roundMinutes = Math.round(chrono(date).get('minute') / 15) * 15
  return chrono(date)
    .set(roundMinutes, 'minute')
    .getDate()
}

export const useAutoFillHours = (
  autoFillHours: boolean,
  hoursInterval: string[],
  previousEndTime: Date | undefined = undefined
) => {
  const startWorkingTime = timeToDate(hoursInterval[0], previousEndTime)
  const startLunchBreak = timeToDate(hoursInterval[1], previousEndTime)
  const endLunchBreak = timeToDate(hoursInterval[2], previousEndTime)
  const endWorkingTime = timeToDate(hoursInterval[3], previousEndTime)

  const getNextStartTime = (): string => {
    if (previousEndTime === undefined || chrono(previousEndTime).isBefore(startWorkingTime)) {
      return chrono(startWorkingTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(startLunchBreak).isSame(previousEndTime, 'hour')) {
      return chrono(endLunchBreak).format(chrono.TIME_FORMAT)
    }

    if (chrono(previousEndTime).isBefore(endLunchBreak)) {
      return chrono(previousEndTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(previousEndTime).isAfter(endLunchBreak)) {
      return chrono(previousEndTime).format(chrono.TIME_FORMAT)
    }

    return chrono(previousEndTime).format(chrono.TIME_FORMAT)
  }

  const getNextEndTime = () => {
    if (previousEndTime === undefined) {
      return chrono(startLunchBreak).format(chrono.TIME_FORMAT)
    }

    if (chrono(startLunchBreak).isSame(previousEndTime, 'hour')) {
      return chrono(endWorkingTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(previousEndTime).isBefore(startLunchBreak)) {
      return chrono(startLunchBreak).format(chrono.TIME_FORMAT)
    }

    if (chrono(previousEndTime).isBefore(endWorkingTime)) {
      return chrono(endWorkingTime).format(chrono.TIME_FORMAT)
    }

    const isAfterOrSameHour =
      chrono(previousEndTime).isAfter(endWorkingTime) ||
      chrono(previousEndTime).isSame(endWorkingTime, 'hour')

    if (isAfterOrSameHour) {
      return chrono(previousEndTime)
        .plus(1, 'hour')
        .format(chrono.TIME_FORMAT)
    }
  }

  const result = useMemo(() => {
    if (!autoFillHours) {
      const date = roundHourToQuarters(previousEndTime || chrono.now())
      return {
        startTime: chrono(date).format(chrono.TIME_FORMAT),
        endTime: chrono(endWorkingTime)
          .plus(1, 'hour')
          .format(chrono.TIME_FORMAT)
      }
    }

    return {
      startTime: getNextStartTime()!,
      endTime: getNextEndTime()!
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFillHours, previousEndTime, hoursInterval])

  return result
}
