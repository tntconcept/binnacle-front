import chrono from 'shared/utils/chrono'

export const getTimeInterval = (startTime: Date, amount: number) => {
  return (
    chrono(startTime).format('HH:mm') +
    ' - ' +
    chrono(startTime)
      .plus(amount, 'minute')
      .format('HH:mm')
  )
}
