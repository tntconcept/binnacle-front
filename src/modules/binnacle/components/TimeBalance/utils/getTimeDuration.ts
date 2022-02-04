import { getDurationByMinutes } from 'modules/binnacle/data-access/utils/getDuration'

export const getTimeDuration = (minutes: number, decimalFormat: boolean) => {
  const duration = getDurationByMinutes(minutes, decimalFormat)

  if (minutes === 0) {
    return duration
  }

  if (minutes > 0) {
    return `+${duration}`
  } else {
    return `-${duration}`
  }
}
