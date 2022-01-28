import chrono from 'shared/utils/chrono'

export const firstDayOfFirstWeekOfMonth = (date: Date) => {
  return chrono(date)
    .startOf('month')
    .startOf('week')
    .getDate()
}
