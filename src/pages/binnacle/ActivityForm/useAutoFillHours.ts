import { useMemo } from 'react'
import { timeToDate } from 'utils/DateUtils'
import { roundHourToQuarters } from 'utils/TimeUtils'
import chrono from 'services/Chrono'

export const useAutoFillHours = (
  autoFillHours: boolean,
  hoursInterval: string[],
  lastEndTime: Date | undefined = undefined
) => {
  const firstActivityStartTime = timeToDate(hoursInterval[0], lastEndTime)
  const firstActivityEndTime = timeToDate(hoursInterval[1], lastEndTime)
  const secondActivityFirstTime = timeToDate(hoursInterval[2], lastEndTime)
  const secondActivityEndTime = timeToDate(hoursInterval[3], lastEndTime)

  const getStartTime = (): string => {
    if (!lastEndTime) {
      return chrono(firstActivityStartTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(firstActivityEndTime).isSame(lastEndTime, 'hour')) {
      return chrono(secondActivityFirstTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(lastEndTime).isBefore(secondActivityFirstTime)) {
      return chrono(lastEndTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(lastEndTime).isAfter(secondActivityFirstTime)) {
      return chrono(lastEndTime).format(chrono.TIME_FORMAT)
    }

    return chrono(lastEndTime).format(chrono.TIME_FORMAT)
  }

  const getEndTime = () => {
    if (!lastEndTime) {
      return chrono(firstActivityEndTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(firstActivityEndTime).isSame(lastEndTime, 'hour')) {
      return chrono(secondActivityEndTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(lastEndTime).isBefore(firstActivityEndTime)) {
      return chrono(firstActivityEndTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(lastEndTime).isBefore(secondActivityEndTime)) {
      return chrono(secondActivityEndTime).format(chrono.TIME_FORMAT)
    }

    const isAfterOrSameHour =
      chrono(lastEndTime).isAfter(secondActivityEndTime) ||
      chrono(lastEndTime).isSame(secondActivityEndTime, 'hour')

    if (isAfterOrSameHour) {
      return chrono(lastEndTime)
        .plus(1, 'hour')
        .format(chrono.TIME_FORMAT)
    }
  }

  const result = useMemo(() => {
    if (!autoFillHours) {
      const date = roundHourToQuarters(lastEndTime || new Date())
      return {
        startTime: chrono(date).format(chrono.TIME_FORMAT),
        endTime: chrono(secondActivityEndTime)
          .plus(1, 'hour')
          .format(chrono.TIME_FORMAT)
      }
    }

    return {
      startTime: getStartTime()!,
      endTime: getEndTime()!
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFillHours, lastEndTime, hoursInterval])

  return result
}
