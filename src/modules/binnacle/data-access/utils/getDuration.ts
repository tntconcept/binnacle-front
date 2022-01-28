import { getHumanizedDuration } from 'shared/utils/chrono'

export const roundToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const getDuration = (minutes: number, decimalFormat: boolean = false) => {
  if (decimalFormat) {
    return roundToTwoDecimals(Math.abs(minutes) / 60)
  }

  return Math.abs(minutes) > 0 ? getHumanizedDuration(minutes) : '0h'
}
