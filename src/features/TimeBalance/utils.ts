import { getDuration } from 'utils/TimeUtils'

export const getTimeColor = (time: number) => {
  if (time === 0) {
    return 'var(--color-black)'
  } else if (time > 0) {
    return 'green'
  }
  return 'var(--error-color)'
}

export const getTimeDuration = (minutes: number, decimalFormat: boolean) => {
  const duration = getDuration(minutes, decimalFormat)

  if (minutes === 0) {
    return duration
  }

  if (minutes > 0) {
    return `+${duration}`
  } else {
    return `-${duration}`
  }
}
