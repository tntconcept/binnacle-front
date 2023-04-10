import { Days } from 'shared/types/days'
import { Vacation } from './vacation'

export type VacationGenerated = Pick<Vacation, 'startDate' | 'endDate' | 'chargeYear'> & {
  days: Days
}
