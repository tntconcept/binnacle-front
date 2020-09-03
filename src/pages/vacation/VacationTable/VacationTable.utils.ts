import dayjs, { DATE_FORMAT } from 'services/dayjs'
import { last } from 'utils/helpers'

export function formatVacationPeriod(days: Date[]) {
  return `${dayjs(days[0]).format(DATE_FORMAT)} - ${dayjs(last(days)).format(
    DATE_FORMAT
  )}`
}
