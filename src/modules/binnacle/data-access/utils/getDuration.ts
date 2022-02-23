import { getHumanizedDuration } from 'shared/utils/chrono'

export const roundToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const getDurationByMinutes = (minutes: number, decimalFormat = false) => {
  if (decimalFormat) {
    return roundToTwoDecimals(Math.abs(minutes) / 60)
  }

  return Math.abs(minutes) > 0 ? getHumanizedDuration(minutes) : '0h'
}

export const getDurationByHours = (hours: number, decimalFormat = false) => {
  if (decimalFormat) {
    return hours
  }

  return Math.abs(hours) > 0 ? getHumanizedDuration(Math.round(hours * 60)) : '0h'
}
