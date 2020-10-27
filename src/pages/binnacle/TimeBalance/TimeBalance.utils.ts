import { getDuration } from 'pages/binnacle/BinnaclePage.utils'

export const getTimeColor = (time: number) => {
  if (time === 0) {
    return 'black'
  } else if (time > 0) {
    return 'green.600'
  }
  return 'red.600'
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
