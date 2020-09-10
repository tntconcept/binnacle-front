import dayjs, { DATE_FORMAT } from 'services/dayjs'

export function formatVacationPeriod(startDate: Date, endDate: Date) {
  const start = dayjs(startDate)
    .local()
    .format(DATE_FORMAT)
  const end = dayjs(endDate)
    .local()
    .format(DATE_FORMAT)

  return `${start} - ${end}`
}
