import { getHumanizedDuration } from '../../../../../shared/utils/chrono'

export const roundToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const getDurationByMinutes = (minutes: number, decimalFormat = false) => {
  if (decimalFormat) {
    return roundToTwoDecimals(Math.abs(minutes) / 60)
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
