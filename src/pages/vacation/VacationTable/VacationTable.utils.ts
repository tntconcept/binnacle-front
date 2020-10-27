import chrono from 'core/services/Chrono'

export function formatVacationPeriod(startDate: Date, endDate: Date) {
  const start = chrono(startDate).format(chrono.DATE_FORMAT)
  const end = chrono(endDate).format(chrono.DATE_FORMAT)

  return `${start} - ${end}`
}
