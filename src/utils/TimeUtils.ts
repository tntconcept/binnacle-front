import { roundToTwoDecimals } from 'utils/helpers'
import { addMinutes, format, getMinutes, setMinutes } from 'date-fns'
import DateTime from 'services/DateTime'

export const getDuration = (minutes: number, decimalFormat: boolean = false) => {
  if (decimalFormat) {
    return roundToTwoDecimals(Math.abs(minutes) / 60)
  }

  return Math.abs(minutes) > 0 ? DateTime.getHumanizedDuration(minutes) : '0h'
}

export const getTimeInterval = (startTime: Date, amount: number) => {
  const finalTime = addMinutes(startTime, amount)
  return format(startTime, 'HH:mm') + ' - ' + format(finalTime, 'HH:mm')
}
export const roundHourToQuarters = (date: Date): Date => {
  const roundMinutes = Math.round(getMinutes(date) / 15) * 15
  return setMinutes(date, roundMinutes)
}
