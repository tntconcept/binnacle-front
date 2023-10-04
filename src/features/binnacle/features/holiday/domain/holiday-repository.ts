import { DateInterval } from '../../../../../shared/types/date-interval'
import { Holiday } from './holiday'

export interface HolidayRepository {
  getAll(interval: DateInterval): Promise<Holiday[]>

  getHolidaysByYear(year: number): Promise<Holiday[]>
}
