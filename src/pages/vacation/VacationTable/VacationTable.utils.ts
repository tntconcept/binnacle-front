import { lightFormat } from 'date-fns'
import { last } from 'utils/helpers'

export function formatVacationPeriod(days: Date[]) {
  const startDateFormat = lightFormat(days[0], 'dd/MM/yyyy')
  const endDateFormat = lightFormat(last(days)!, 'dd/MM/yyyy')

  return `${startDateFormat} - ${endDateFormat}`
}
