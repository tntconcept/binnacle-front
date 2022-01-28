import chrono from 'shared/utils/chrono'

export const getDaysOfWeek = (date: Date) => {
  return chrono(date)
    .startOf('week')
    .eachDayUntil(
      chrono(date)
        .endOf('week')
        .getDate()
    )
}

export const getPreviousWeek = (week: Date) => {
  return chrono(week)
    .minus(1, 'week')
    .getDate()
}

export const getNextWeek = (week: Date) => {
  return chrono(week)
    .plus(1, 'week')
    .getDate()
}
