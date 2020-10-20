import { roundToTwoDecimals } from 'utils/helpers'
import chrono, { getHumanizedDuration } from 'services/Chrono'

export const getDuration = (minutes: number, decimalFormat: boolean = false) => {
  if (decimalFormat) {
    return roundToTwoDecimals(Math.abs(minutes) / 60)
  }

  return Math.abs(minutes) > 0 ? getHumanizedDuration(minutes) : '0h'
}

export const getTimeInterval = (startTime: Date, amount: number) => {
  return (
    chrono(startTime).format(chrono.TIME_FORMAT) +
    ' - ' +
    chrono(startTime)
      .plus(amount, 'minute')
      .format(chrono.TIME_FORMAT)
  )
}

export const roundHourToQuarters = (date: Date): Date => {
  const roundMinutes = Math.round(chrono(date).get('minute') / 15) * 15
  return chrono(date)
    .set(roundMinutes, 'minute')
    .getDate()
}
