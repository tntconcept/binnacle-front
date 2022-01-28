import chrono from 'shared/utils/chrono'

export const lastDayOfLastWeekOfMonth = (date: Date) => {
  return chrono(date)
    .endOf('month')
    .endOf('week')
    .getDate()
}
