import { getHumanizedDuration } from '../../../../../shared/utils/chrono'
import { TimeUnit } from '../../../../../shared/types/time-unit'

export const roundToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const getDurationByMinutes = (minutes: number, decimalFormat = false) => {
  if (decimalFormat) {
    return roundToTwoDecimals(Math.abs(minutes))
  }

  return minutes > 0 ? getHumanizedDuration({ duration: minutes }) : '0h'
}

export const getDurationByHours = (hours: number, decimalFormat = false, addSign = false) => {
  if (decimalFormat) {
    return Number.parseFloat(hours?.toFixed(2) ?? 0)
  }

  return Math.abs(hours) > 0
    ? getHumanizedDuration({ duration: Math.round(hours * 60), abbreviation: true, addSign })
    : '0h'
}

export const getDurationByTimeUnit = (time: number, timeUnit: TimeUnit) => {
  return Math.abs(time) > 0
    ? getHumanizedDuration({
        duration: time,
        timeUnit: timeUnit
      })
    : `0${timeUnit === 'MINUTES' ? 'h' : 'd'}`
}
